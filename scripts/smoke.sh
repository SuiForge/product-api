#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${PRODUCT_API_PORT:-18088}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="${TMPDIR:-/tmp}/product-api-smoke.log"
COOKIE_JAR="${TMPDIR:-/tmp}/product-api-smoke.cookies"
RUN_SERVER="${PRODUCT_API_SMOKE_RUN_SERVER:-true}"

cleanup() {
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" >/dev/null 2>&1; then
    kill "$PID" >/dev/null 2>&1 || true
    wait "$PID" 2>/dev/null || true
  fi
  lsof -tiTCP:"$PORT" -sTCP:LISTEN -n -P | xargs -r kill >/dev/null 2>&1 || true
  rm -f "$COOKIE_JAR"
}
trap cleanup EXIT

if [[ "$RUN_SERVER" == "true" ]]; then
  lsof -tiTCP:"$PORT" -sTCP:LISTEN -n -P | xargs -r kill >/dev/null 2>&1 || true

  (
    cd "$ROOT_DIR"
    npm run build:wallet-auth >/dev/null 2>&1
    PRODUCT_API_PORT="$PORT" go run ./cmd/server >"$LOG_FILE" 2>&1
  ) &
  PID=$!

  for _ in $(seq 1 30); do
    if curl -fsS "$BASE_URL/health" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

curl -fsS "$BASE_URL/health" | sed -n '1,20p'
curl -fsS "$BASE_URL/v1/auth/providers" | sed -n '1,40p'
curl -fsS "$BASE_URL/v1/alert-ops/readiness" | sed -n '1,60p'

LOGIN_PAYLOAD='{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}'
curl -fsS -c "$COOKIE_JAR" -X POST "$BASE_URL/v1/auth/login" -H 'Content-Type: application/json' -d "$LOGIN_PAYLOAD" | sed -n '1,20p'

RISK_PAYLOAD='{"projectId":"proj_1","strategyId":"smoke-1","symbol":"SUI/USDC","side":"buy","price":"1.23","size":"100"}'
RISK_RESP="$(curl -fsS -b "$COOKIE_JAR" -X POST "$BASE_URL/v1/risk/check" -H 'Content-Type: application/json' -d "$RISK_PAYLOAD")"
echo "$RISK_RESP" | sed -n '1,20p'

EVIDENCE_ID="$(printf '%s' "$RISK_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin)["evidenceId"])')"
REPLAY_RESP="$(curl -fsS -b "$COOKIE_JAR" "$BASE_URL/v1/replays/${EVIDENCE_ID}")"
echo "$REPLAY_RESP" | sed -n '1,20p'

DESTINATION_PAYLOAD='{"projectId":"proj_1","type":"webhook","target":"https://example.com/hook"}'
DESTINATION_RESP="$(curl -fsS -b "$COOKIE_JAR" -X POST "$BASE_URL/v1/alert-ops/destinations" -H 'Content-Type: application/json' -d "$DESTINATION_PAYLOAD")"
echo "$DESTINATION_RESP" | sed -n '1,20p'

API_KEY_PAYLOAD='{"name":"smoke-agent"}'
API_KEY_RESP="$(curl -fsS -b "$COOKIE_JAR" -X POST "$BASE_URL/v1/projects/me/api-keys" -H 'Content-Type: application/json' -d "$API_KEY_PAYLOAD")"
echo "$API_KEY_RESP" | sed -n '1,20p'

API_KEY_TOKEN="$(printf '%s' "$API_KEY_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin)["token"])')"
curl -fsS -b "$COOKIE_JAR" "$BASE_URL/v1/projects/me/api-keys" | sed -n '1,20p'
curl -fsS -X POST "$BASE_URL/v1/auth/api-key/validate" -H 'Content-Type: application/json' -d "$(python3 - <<EOF
import json
print(json.dumps({"apiKey": "${API_KEY_TOKEN}"}))
EOF
)" | sed -n '1,20p'

DESTINATION_ID="$(printf '%s' "$DESTINATION_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')"
DESTINATION_SECRET="$(printf '%s' "$DESTINATION_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin)["webhookSecret"])')"
DELIVERY_PAYLOAD="$(python3 - <<EOF
import json
print(json.dumps({
  "destinationId": "${DESTINATION_ID}",
  "target": "https://example.com/hook",
  "secret": "${DESTINATION_SECRET}",
  "eventType": "risk_alert",
  "payload": {"mode": "smoke"}
}))
EOF
)"
curl -fsS -b "$COOKIE_JAR" -X POST "$BASE_URL/v1/alert-ops/destinations/test" -H 'Content-Type: application/json' -d "$DELIVERY_PAYLOAD" | sed -n '1,20p'
curl -fsS -b "$COOKIE_JAR" "$BASE_URL/v1/alert-ops/deliveries" | sed -n '1,20p'

WALLET_SMOKE="$(cd "$ROOT_DIR" && BASE_URL="$BASE_URL" node - <<'EOF'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const baseURL = process.env.BASE_URL;
const keypair = new Ed25519Keypair();
const walletAddress = keypair.getPublicKey().toSuiAddress();

const challengeRes = await fetch(`${baseURL}/v1/auth/wallet/nonce`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workspaceName: 'Alpha Desk',
    operatorName: 'Founding PM',
    walletAddress,
  }),
});
const challenge = await challengeRes.json();
if (!challengeRes.ok) {
  throw new Error(`wallet challenge failed: ${JSON.stringify(challenge)}`);
}

const signed = await keypair.signPersonalMessage(new TextEncoder().encode(challenge.message));
const verifyRes = await fetch(`${baseURL}/v1/auth/wallet/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nonce: challenge.nonce, signature: signed.signature }),
});
const verify = await verifyRes.json();
if (!verifyRes.ok) {
  throw new Error(`wallet verify failed: ${JSON.stringify(verify)}`);
}

process.stdout.write(JSON.stringify({
  challengeStatus: challengeRes.status,
  verifyStatus: verifyRes.status,
  authMethod: verify.authMethod,
  walletAddress: verify.walletAddress,
}));
EOF
)"
echo "$WALLET_SMOKE" | sed -n '1,20p'

echo "smoke ok"
