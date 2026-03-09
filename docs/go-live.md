# Sui Alert Ops Go-Live Guide

This guide turns the local demo into a buyer-facing pilot or a grant-ready public demo.

## Target states

- `demo_ready`: local console works with demo data and demo fallback auth.
- `pilot_ready`: wallet auth, API key validation, and persistent state are configured.
- `production_ready`: Google auth and live upstream providers are also configured.

You can inspect the live status at `GET /v1/alert-ops/readiness` or in the `Go-Live Readiness` panel on `/console`.

## Minimum pilot configuration

Set these environment variables before sharing the product externally:

```bash
PRODUCT_API_SESSION_SECRET=replace-with-a-long-random-secret
PRODUCT_API_SESSION_COOKIE_SECURE=true
PRODUCT_API_PUBLIC_ORIGIN=https://your-domain.example
PRODUCT_API_DATA_FILE=data/product-api-state.json
PRODUCT_API_SUI_NETWORK=mainnet
```

What this gives you:

- signed wallet login
- persistent monitors, webhook deliveries, and API keys
- stable public origin in wallet sign-in messages

## Google login configuration

To enable Google operator login, set:

```bash
PRODUCT_API_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
PRODUCT_API_GOOGLE_HOSTED_DOMAIN=example.com
```

Notes:

- `PRODUCT_API_GOOGLE_HOSTED_DOMAIN` is optional.
- If you set it, only users in that Google Workspace can sign in.
- Google login is useful for sales demos and grant reviewers who should not need a wallet just to inspect the console.

## Live upstream providers

The product works in demo mode without upstreams. To replace demo data with live feeds, configure:

```bash
DEEPBOOK_API_BASE_URL=https://your-deepbook-proxy.example
DEEPBOOK_API_TOKEN=replace-me

VERTICAL_INDEX_API_BASE_URL=https://your-vertical-index.example
VERTICAL_INDEX_API_KEY=replace-me
```

Recommended rollout order:

1. enable persistent state
2. enable wallet login
3. enable Google login
4. connect DeepBook execution telemetry
5. connect Vertical Index alerting / tenant upstreams

## Local runbook

```bash
cp .env.example .env.local
PRODUCT_API_ENV_FILE=.env.local bash scripts/run-local.sh
```

Useful URLs:

- console: `http://127.0.0.1:8088/console`
- health: `http://127.0.0.1:8088/health`
- readiness: `http://127.0.0.1:8088/v1/alert-ops/readiness`

## Public demo deployment with Docker

The fastest way to publish a buyer-facing or grant-facing demo is the provided Caddy + Docker Compose stack.

### 1. Prepare production env

```bash
./scripts/init-production-env.sh alertops.example.com example.com
./scripts/check-production-env.sh
```

Set at minimum:

```bash
APP_DOMAIN=alertops.example.com
PRODUCT_API_SESSION_SECRET=replace-with-a-long-random-secret
PRODUCT_API_PUBLIC_ORIGIN=https://alertops.example.com
PRODUCT_API_SESSION_COOKIE_SECURE=true
PRODUCT_API_DATA_FILE=/app/data/product-api-state.json
```

### 2. Start the public stack

```bash
./scripts/deploy-public.sh
```

This stack does the following:

- builds the `product-api` image
- stores product state in a persistent Docker volume
- terminates HTTPS with Caddy
- exposes ports `80` and `443`

If you prefer manual control, you can still run:

```bash
cd deploy
docker compose --env-file ../.env.production -f docker-compose.public.yml up -d --build
```

### 3. Verify the public demo

```bash
./scripts/verify-public-demo.sh https://alertops.example.com
```

This verifies health, readiness, auth provider exposure, and console shell rendering.

The readiness endpoint should return at least `pilot_ready` for a paid pilot.

## systemd example

If you deploy to a Linux VM, a sample unit file is available at `deploy/sui-alert-ops.service`.

Example install flow:

```bash
sudo cp deploy/sui-alert-ops.service /etc/systemd/system/sui-alert-ops.service
sudo systemctl daemon-reload
sudo systemctl enable --now sui-alert-ops.service
sudo systemctl status sui-alert-ops.service
```

Assumption:

- the repo is located at `/opt/sui-alert-ops/product-api`
- Docker and Docker Compose are already installed

## Google sign-in launch

For Google client creation, authorized origins, and browser verification, use `docs/google-login-launch.md`.

## Domain and DNS alignment

For DNS records, ports, and hostname alignment across Caddy, wallet login, and Google login, use `docs/domain-dns-setup.md`.

## Verification before sharing

Run all three before sending a demo link to buyers or a grant reviewer:

```bash
go test ./... -count=1
PRODUCT_API_SMOKE_RUN_SERVER=true bash scripts/smoke.sh
npm run test:e2e
```

## Buyer handoff checklist

- use a public HTTPS origin
- keep `PRODUCT_API_SESSION_COOKIE_SECURE=true`
- keep `GET /v1/alert-ops/readiness` at least `pilot_ready`
- create one wallet-bound API key in the console
- create one webhook destination
- send one test webhook so delivery history is visible
- keep one replayable alert ready in the feed

## Grant handoff checklist

- show `Go-Live Readiness` in the console
- show one real wallet login flow
- show one Google-enabled operator login flow if credentials are available
- demonstrate API key issuance and validation
- demonstrate webhook delivery history and retry
- explain which upstreams are still demo data vs live integrations
- link the public readiness endpoint in the application form or reviewer note
