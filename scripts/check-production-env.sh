#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${PRODUCT_API_ENV_FILE:-$ROOT_DIR/.env.production}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "env file not found: $ENV_FILE" >&2
  echo "copy .env.production.example first:" >&2
  echo "  cp .env.production.example .env.production" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

missing=0

require_value() {
  local key="$1"
  local value="${!key:-}"
  if [[ -z "${value// }" ]]; then
    echo "missing: $key"
    missing=1
  fi
}

print_status() {
  local label="$1"
  local value="$2"
  printf '%-28s %s\n' "$label" "$value"
}

require_value APP_DOMAIN
require_value PRODUCT_API_SESSION_SECRET
require_value PRODUCT_API_PUBLIC_ORIGIN
require_value PRODUCT_API_DATA_FILE

echo "Sui Alert Ops production env check"
echo "---------------------------------"
print_status "Env file" "$ENV_FILE"
print_status "Domain" "${APP_DOMAIN:-<missing>}"
print_status "Public origin" "${PRODUCT_API_PUBLIC_ORIGIN:-<missing>}"
print_status "Persistent state" "${PRODUCT_API_DATA_FILE:-<missing>}"
print_status "Google client" "${PRODUCT_API_GOOGLE_CLIENT_ID:+configured}${PRODUCT_API_GOOGLE_CLIENT_ID:-not configured}"
print_status "Google domain" "${PRODUCT_API_GOOGLE_HOSTED_DOMAIN:-not configured}"
print_status "DeepBook upstream" "${DEEPBOOK_API_BASE_URL:+configured}${DEEPBOOK_API_BASE_URL:-demo mode}"
print_status "Vertical Index" "${VERTICAL_INDEX_API_BASE_URL:+configured}${VERTICAL_INDEX_API_BASE_URL:-demo mode}"

if [[ "${PRODUCT_API_SESSION_COOKIE_SECURE:-}" != "true" ]]; then
  echo "warning: PRODUCT_API_SESSION_COOKIE_SECURE should be true for public HTTPS deployments"
fi

if [[ "${PRODUCT_API_PUBLIC_ORIGIN:-}" != https://* ]]; then
  echo "warning: PRODUCT_API_PUBLIC_ORIGIN should use https:// for public demos"
fi

if [[ $missing -ne 0 ]]; then
  echo
  echo "status: not ready"
  exit 1
fi

echo
echo "status: base production config present"

