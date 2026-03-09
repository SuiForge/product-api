#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_FILE="$ROOT_DIR/.env.production.example"
OUTPUT_FILE="${PRODUCT_API_ENV_OUTPUT:-$ROOT_DIR/.env.production}"

DOMAIN="${1:-}"
GOOGLE_HOSTED_DOMAIN="${2:-}"

if [[ -z "${DOMAIN// }" ]]; then
  echo "usage: $0 <public-domain> [google-hosted-domain]" >&2
  echo "example: $0 alertops.example.com example.com" >&2
  exit 1
fi

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "template not found: $TEMPLATE_FILE" >&2
  exit 1
fi

PUBLIC_ORIGIN="https://${DOMAIN}"

cp "$TEMPLATE_FILE" "$OUTPUT_FILE"

python3 - "$OUTPUT_FILE" "$DOMAIN" "$PUBLIC_ORIGIN" "$GOOGLE_HOSTED_DOMAIN" <<'PY'
import pathlib
import sys

output = pathlib.Path(sys.argv[1])
domain = sys.argv[2].strip()
public_origin = sys.argv[3].strip()
google_hosted_domain = sys.argv[4].strip()

content = output.read_text()
content = content.replace("APP_DOMAIN=alertops.example.com", f"APP_DOMAIN={domain}")
content = content.replace("PRODUCT_API_PUBLIC_ORIGIN=https://alertops.example.com", f"PRODUCT_API_PUBLIC_ORIGIN={public_origin}")

if google_hosted_domain:
    content = content.replace("PRODUCT_API_GOOGLE_HOSTED_DOMAIN=", f"PRODUCT_API_GOOGLE_HOSTED_DOMAIN={google_hosted_domain}")

output.write_text(content)
PY

echo "created: $OUTPUT_FILE"
echo "domain:  $DOMAIN"
echo "origin:  $PUBLIC_ORIGIN"
if [[ -n "${GOOGLE_HOSTED_DOMAIN// }" ]]; then
  echo "google hosted domain: $GOOGLE_HOSTED_DOMAIN"
fi
echo
echo "next:"
echo "  1. fill PRODUCT_API_SESSION_SECRET"
echo "  2. fill PRODUCT_API_GOOGLE_CLIENT_ID if using Google login"
echo "  3. fill DEEPBOOK_API_BASE_URL / VERTICAL_INDEX_API_BASE_URL when ready"
echo "  4. run ./scripts/check-production-env.sh"
echo "  5. run ./scripts/deploy-public.sh"

