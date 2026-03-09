#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${PRODUCT_API_ENV_FILE:-$ROOT_DIR/.env.production}"
COMPOSE_FILE="$ROOT_DIR/deploy/docker-compose.public.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "env file not found: $ENV_FILE" >&2
  echo "copy .env.production.example first:" >&2
  echo "  cp .env.production.example .env.production" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required" >&2
  exit 1
fi

echo "Checking production env..."
PRODUCT_API_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/check-production-env.sh"

echo
echo "Rendering compose config..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" config >/dev/null

echo
echo "Starting Sui Alert Ops public stack..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build

echo
echo "Running public demo verification..."
PRODUCT_API_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/verify-public-demo.sh"

echo
echo "Deployment started. Useful checks:"
echo "  docker compose --env-file $ENV_FILE -f $COMPOSE_FILE ps"
echo "  curl -fsS \\"${PRODUCT_API_PUBLIC_ORIGIN:-}/health\\""
echo "  curl -fsS \\"${PRODUCT_API_PUBLIC_ORIGIN:-}/v1/alert-ops/readiness\\""
