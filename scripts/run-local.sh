#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${PRODUCT_API_ENV_FILE:-$ROOT_DIR/.env.example}"
PORT="${PRODUCT_API_PORT:-8088}"
LOG_FILE="${PRODUCT_API_LOG_FILE:-${TMPDIR:-/tmp}/product-api-local.log}"
PID_FILE="${PRODUCT_API_PID_FILE:-${TMPDIR:-/tmp}/product-api-local.pid}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

cd "$ROOT_DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing frontend wallet auth dependencies..."
  npm install
fi

echo "Building wallet auth bundles..."
npm run build:wallet-auth >/dev/null

echo "Building product-api server..."
GOCACHE="${GOCACHE:-${TMPDIR:-/tmp}/go-build-product-api-local}" go build -o "${TMPDIR:-/tmp}/product-api-server" ./cmd/server

lsof -tiTCP:"$PORT" -sTCP:LISTEN -n -P | xargs -r kill >/dev/null 2>&1 || true

echo "Starting product-api on :$PORT"
nohup env \
  PRODUCT_API_PORT="$PORT" \
  PRODUCT_API_SESSION_SECRET="${PRODUCT_API_SESSION_SECRET:-change-me-for-local-dev}" \
  PRODUCT_API_SESSION_TTL="${PRODUCT_API_SESSION_TTL:-24h}" \
  PRODUCT_API_SESSION_COOKIE_SECURE="${PRODUCT_API_SESSION_COOKIE_SECURE:-false}" \
  PRODUCT_API_PUBLIC_ORIGIN="${PRODUCT_API_PUBLIC_ORIGIN:-http://127.0.0.1:$PORT}" \
  PRODUCT_API_SUI_NETWORK="${PRODUCT_API_SUI_NETWORK:-mainnet}" \
  PRODUCT_API_WALLET_CHALLENGE_TTL="${PRODUCT_API_WALLET_CHALLENGE_TTL:-5m}" \
  PRODUCT_API_DATA_FILE="${PRODUCT_API_DATA_FILE:-data/product-api-state.json}" \
  PRODUCT_API_GOOGLE_CLIENT_ID="${PRODUCT_API_GOOGLE_CLIENT_ID:-}" \
  PRODUCT_API_GOOGLE_HOSTED_DOMAIN="${PRODUCT_API_GOOGLE_HOSTED_DOMAIN:-}" \
  "${TMPDIR:-/tmp}/product-api-server" >"$LOG_FILE" 2>&1 &

PID=$!
echo "$PID" >"$PID_FILE"

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "product-api is up"
echo "- Console: http://127.0.0.1:${PORT}/console"
echo "- Health:  http://127.0.0.1:${PORT}/health"
echo "- Logs:    $LOG_FILE"
echo "- PID:     $PID_FILE"
