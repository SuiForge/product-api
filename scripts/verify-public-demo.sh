#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${PRODUCT_API_ENV_FILE:-$ROOT_DIR/.env.production}"
BASE_URL="${1:-${PRODUCT_API_BASE_URL:-}}"
MIN_READINESS="${MIN_READINESS:-pilot_ready}"
REQUIRE_GOOGLE="${REQUIRE_GOOGLE:-false}"

if [[ -z "$BASE_URL" && -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
  BASE_URL="${PRODUCT_API_PUBLIC_ORIGIN:-}"
fi

if [[ -z "$BASE_URL" ]]; then
  echo "usage: $0 https://alertops.example.com" >&2
  echo "or set PRODUCT_API_BASE_URL / PRODUCT_API_ENV_FILE" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required" >&2
  exit 1
fi

health="$(curl -fsS "$BASE_URL/health")"
readiness="$(curl -fsS "$BASE_URL/v1/alert-ops/readiness")"
providers="$(curl -fsS "$BASE_URL/v1/auth/providers")"
console_html="$(curl -fsS "$BASE_URL/console")"

echo "Sui Alert Ops public demo verification"
echo "-------------------------------------"
printf '%-20s %s\n' "Base URL" "$BASE_URL"

python3 - "$health" "$readiness" "$providers" "$MIN_READINESS" "$REQUIRE_GOOGLE" <<'PY'
import json
import sys

health = json.loads(sys.argv[1])
readiness = json.loads(sys.argv[2])
providers = json.loads(sys.argv[3])
min_readiness = sys.argv[4].strip() or "pilot_ready"
require_google = sys.argv[5].strip().lower() == "true"

order = {"setup_required": 0, "pilot_ready": 1, "production_ready": 2}
status = str(readiness.get("status", "")).strip()
if health.get("status") != "ok":
    raise SystemExit("health check failed")
if status not in order:
    raise SystemExit(f"unknown readiness status: {status}")
if order[status] < order.get(min_readiness, 1):
    raise SystemExit(f"readiness too low: {status} < {min_readiness}")
if not providers.get("wallet", {}).get("enabled"):
    raise SystemExit("wallet auth is not enabled")
if require_google and not providers.get("google", {}).get("enabled"):
    raise SystemExit("google auth is required but not enabled")

print(f"{'Readiness':20s} {status}")
print(f"{'Wallet auth':20s} enabled")
print(f"{'Google auth':20s} {'enabled' if providers.get('google', {}).get('enabled') else 'disabled'}")
print(f"{'API key auth':20s} {'enabled' if readiness.get('auth', {}).get('apiKeyValidationReady') else 'disabled'}")
print(f"{'Public origin':20s} {readiness.get('infrastructure', {}).get('publicOrigin', '-')}")
PY

if [[ "$console_html" != *"Sui Alert Ops"* ]]; then
  echo "console shell check failed: missing Sui Alert Ops" >&2
  exit 1
fi

if [[ "$console_html" != *"Go-Live Readiness"* ]]; then
  echo "console shell check failed: missing Go-Live Readiness" >&2
  exit 1
fi

echo "Console shell         ok"
echo "status: verification passed"

