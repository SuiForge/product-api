# Sui Alert Ops

[![CI](https://github.com/SuiForge/product-api/actions/workflows/ci.yml/badge.svg)](https://github.com/SuiForge/product-api/actions/workflows/ci.yml)

Outward-facing product API and operator console for wallet-native alerting on Sui.

`Sui Alert Ops` turns a bundle of lower-level platform capabilities into one product surface that a buyer, design partner, or grant reviewer can open today. From one console, teams can sign in with Google or a Sui wallet, inspect readiness, review alerts, issue API keys, configure webhooks, and replay incidents.

## Why this repo exists

- buyers want a product, not a list of backend services
- grant reviewers want proof that the product can be opened and verified quickly
- operators need one flow for auth, alert review, webhook setup, and incident replay
- platform capabilities still exist underneath, but this repo packages them into one sellable service

## What is already working

- Google-ready operator login surface and real Sui wallet signature login
- persistent monitors, webhook destinations, delivery history, and API keys
- `GET /v1/alert-ops/readiness` for demo / pilot / production status checks
- real webhook signing and test delivery flows
- replayable alert evidence and operator console walkthrough
- public deployment artifacts with Docker, Caddy, and systemd examples
- GitHub Actions CI for backend validation, smoke checks, and browser E2E

## Who this is for

- Sui protocol teams that need treasury, risk, or whale monitoring
- market-making or operations teams that need webhook-based alert routing
- ecosystem projects that want a buyer-facing or grant-facing demo quickly
- internal operators who need Google access first and wallet-native actions second

## Quick links

- Product go-live guide: `docs/go-live.md`
- Design partner pilot plan: `docs/design-partner-pilot.md`
- Grant package outline: `docs/grant-package.md`
- Google login launch: `docs/google-login-launch.md`
- Domain and DNS setup: `docs/domain-dns-setup.md`
- Public deployment plan: `docs/plans/2026-03-09-public-deployment.md`

## Fast local demo

```bash
bash scripts/run-local.sh
```

Default local URLs:

- console: `http://127.0.0.1:8088/console`
- health: `http://127.0.0.1:8088/health`
- readiness: `http://127.0.0.1:8088/v1/alert-ops/readiness`

Notes:

- default port is `PRODUCT_API_PORT=8088`
- wallet signature login uses a bundled Node verifier at runtime, so `node` must be available on the host
- local state persists to `data/product-api-state.json`, so created monitors, webhook destinations, deliveries, and API keys survive restarts

## Fast public demo deployment

The fastest way to get a shareable buyer-facing or grant-facing URL is the included Docker + Caddy stack.

```bash
./scripts/init-production-env.sh alertops.example.com example.com
./scripts/check-production-env.sh
./scripts/deploy-public.sh
./scripts/verify-public-demo.sh https://alertops.example.com
```

Deployment assets included in this repo:

- `Dockerfile`
- `deploy/docker-compose.public.yml`
- `deploy/Caddyfile`
- `deploy/sui-alert-ops.service`
- `.env.production.example`

Manual alternative:

```bash
cp .env.production.example .env.production
cd deploy
docker compose --env-file ../.env.production -f docker-compose.public.yml up -d --build
```

## Buyer and grant demo flow

Open `/console` and walk through:

1. sign in with Google, wallet, or demo fallback
2. show `Go-Live Readiness`
3. load overview and live alerts
4. create a monitor from a template
5. create a webhook destination
6. send a signed test webhook
7. open replay evidence for one alert
8. issue one API key and validate it

This gives reviewers a complete story: access, readiness, monitoring, delivery, and investigation.

## Product surfaces

- `Overview`: workspace, usage, and product summary
- `Alerts`: alert feed and investigation entry point
- `Monitor Builder`: rule-template-based monitor creation
- `Destinations`: webhook configuration and signed test delivery
- `Replay`: evidence replay for incident investigation
- `Auth + Access`: Google login, Sui wallet login, session auth, and API key validation

Internal supporting capabilities such as execution reads, risk checks, tenant plumbing, and indexer-backed data remain available behind this service, but they are no longer the primary outward-facing story.

## Auth model

Real sign-in paths:

- Google popup login backed by a verified Google ID token
- Sui wallet signature login backed by a server-issued nonce and signature verification

Compatibility path:

- `POST /v1/auth/login` remains available as a fast demo fallback and still requires a valid Sui wallet address

Access model:

- product endpoints under `/v1/*` require either an authenticated session or a validated `X-API-Key`, except for auth routes
- wallet login remains the required path for wallet-bound actions such as API key generation and webhook provisioning
- Google login is the best first step for buyers or grant reviewers who should inspect the product before connecting a wallet

## Built-in capability plane

`product-api` now ships its execution, alerting, tenant, replay, API key, and webhook capabilities in-process.

Session and identity configuration:

- `PRODUCT_API_SESSION_SECRET`
- `PRODUCT_API_SESSION_TTL`
- `PRODUCT_API_SESSION_COOKIE_SECURE`
- `PRODUCT_API_WALLET_CHALLENGE_TTL`
- `PRODUCT_API_PUBLIC_ORIGIN`
- `PRODUCT_API_SUI_NETWORK`
- `PRODUCT_API_GOOGLE_CLIENT_ID`
- `PRODUCT_API_GOOGLE_HOSTED_DOMAIN`
- `PRODUCT_API_DATA_FILE`

No other backend service is required for the current product surface. Public rollout now depends on auth, persistence, and deployment posture rather than separate backing services.

## Key routes

Primary product routes:

- `GET /health`
- `GET /console`
- `GET /v1/alert-ops/manifest`
- `GET /v1/alert-ops/readiness`
- `GET /v1/alert-ops/overview`
- `GET /v1/alert-ops/alerts`
- `GET /v1/alert-ops/destinations`
- `POST /v1/alert-ops/destinations`
- `POST /v1/alert-ops/destinations/test`
- `GET /v1/alert-ops/deliveries`
- `POST /v1/alert-ops/deliveries/:deliveryId/retry`
- `GET /v1/alert-ops/replays/:evidenceId`

Auth routes:

- `GET /v1/auth/providers`
- `POST /v1/auth/google/verify`
- `POST /v1/auth/wallet/nonce`
- `POST /v1/auth/wallet/verify`
- `POST /v1/auth/login`
- `POST /v1/auth/api-key/validate`
- `GET /v1/auth/session`
- `POST /v1/auth/logout`

Compatibility and internal capability routes:

- `POST /v1/risk/check`
- `GET /v1/replays/:evidenceId`
- `GET /v1/execution/summaries`
- `GET /v1/alerts`
- `POST /v1/alerts/destinations`
- `POST /v1/alerts/destinations/test`
- `GET /v1/projects/me`
- `GET /v1/projects/me/usage`
- `GET /v1/projects/me/api-keys`
- `POST /v1/projects/me/api-keys`

## Verify

```bash
go test ./... -count=1
PRODUCT_API_SMOKE_RUN_SERVER=true bash scripts/smoke.sh
npm run test:e2e
```

What verification covers:

- health and auth provider exposure
- readiness status
- demo fallback login
- real Sui wallet nonce, sign, and verify flow
- API key create, list, and validate
- destination create, signed test delivery, history, and retry path
- risk and replay happy path
- browser-based console walkthrough and logout relock flow

If Playwright browser downloads are blocked in your network, local E2E uses the installed Google Chrome channel by default. CI installs Playwright Chromium automatically.

## Rebuild wallet auth bundle

```bash
npm install
npm run build:wallet-auth
```

## Environment bootstrap

If you want to keep placeholders and wire real values later:

```bash
cp .env.example .env.local
PRODUCT_API_ENV_FILE=.env.local bash scripts/run-local.sh
```
