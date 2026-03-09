# product-api

Outward-facing product service for `Sui Alert Ops`.

## What it exposes

- `Sui Alert Ops`: real-time alerting and incident response for Sui teams
- `Overview`: unified workspace, usage, and alert summary
- `Alerts`: anomaly feed and alert list backed by vertical index upstream
- `Destinations`: webhook configuration and signed test delivery
- `Replay`: evidence replay for alert investigation
- `Auth + Access`: Google login, wallet login, session auth, API key validation

Internal supporting capabilities such as execution reads, risk checks, tenant plumbing, and indexer-backed data remain available behind this product service, but they are no longer the primary outward-facing product story.

## Run

```bash
bash scripts/run-local.sh
```

Default port:
- `PRODUCT_API_PORT=8088`

Wallet signature login uses a bundled Node verifier at runtime, so `node` must be available on the host.

Default local runtime state persists to `data/product-api-state.json`, so created monitors and webhook destinations survive restarts. Override it with `PRODUCT_API_DATA_FILE` if needed.

## Optional upstream wiring

Execution upstream:
- `DEEPBOOK_API_BASE_URL`
- `DEEPBOOK_API_TOKEN`
- `DEEPBOOK_API_TIMEOUT`

Alerts / tenant upstream:
- `VERTICAL_INDEX_API_BASE_URL`
- `VERTICAL_INDEX_API_KEY`
- `VERTICAL_INDEX_API_TIMEOUT`

Session auth:
- `PRODUCT_API_SESSION_SECRET`
- `PRODUCT_API_SESSION_TTL`
- `PRODUCT_API_SESSION_COOKIE_SECURE`
- `PRODUCT_API_WALLET_CHALLENGE_TTL`
- `PRODUCT_API_PUBLIC_ORIGIN`
- `PRODUCT_API_SUI_NETWORK`
- `PRODUCT_API_GOOGLE_CLIENT_ID`
- `PRODUCT_API_GOOGLE_HOSTED_DOMAIN`
- `PRODUCT_API_DATA_FILE`

Wallet login flow:
- `POST /v1/auth/wallet/nonce`
- `POST /v1/auth/wallet/verify`

Google login flow:
- `GET /v1/auth/providers`
- `POST /v1/auth/google/verify`

Legacy demo fallback login remains available at `POST /v1/auth/login` and still requires a valid Sui wallet address in addition to workspace and operator names.

If upstreams are not configured, product endpoints that depend on them return `501 not_implemented`.

## Key routes

Primary product namespace:

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

Auth namespace:

- `GET /v1/auth/providers`
- `POST /v1/auth/google/verify`
- `POST /v1/auth/wallet/nonce`
- `POST /v1/auth/wallet/verify`
- `POST /v1/auth/login`
- `POST /v1/auth/api-key/validate`
- `GET /v1/auth/session`
- `POST /v1/auth/logout`

Compatibility / internal capability routes:

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

## Demo flow

Open `/console` and complete:
- `Sign in with Google, wallet, or demo fallback`
- `Review go-live readiness`
- `Load alert ops overview`
- `Inspect live alerts`
- `Configure webhook delivery`
- `Review delivery history`
- `Open replay evidence`

The console now supports two real sign-in paths:
- Google popup login backed by a verified Google ID token
- Sui wallet signature login backed by a server-issued nonce and signature verification

Product endpoints under `/v1/*` require either an authenticated session or a validated `X-API-Key`, except for the auth routes above.

Notes:
- Google login needs a real `PRODUCT_API_GOOGLE_CLIENT_ID` from Google Identity Services.
- Sui wallet login remains the required path for wallet-bound actions such as API key generation and webhook provisioning against wallet-scoped upstream services.
- `GET /v1/alert-ops/readiness` summarizes whether the service is still demo-only, pilot-ready, or production-ready.
- If you only want a fast local product walkthrough, Demo Fallback also accepts a pasted valid Sui wallet address without a connected extension.

If you change the wallet UI bundle or verifier bundle, rebuild them with:

```bash
npm install
npm run build:wallet-auth
```

If you want to keep placeholders and wire real values later, copy the template first:

```bash
cp .env.example .env.local
PRODUCT_API_ENV_FILE=.env.local bash scripts/run-local.sh
```

For a deployment checklist and grant / pilot handoff notes, see `docs/go-live.md`.
For a Google sign-in launch checklist, see `docs/google-login-launch.md`.
For DNS and public domain alignment, see `docs/domain-dns-setup.md`.

For a public HTTPS demo deployment, the repo now includes:

- `Dockerfile`
- `deploy/docker-compose.public.yml`
- `deploy/Caddyfile`
- `deploy/sui-alert-ops.service`
- `.env.production.example`

Quick start:

```bash
./scripts/init-production-env.sh alertops.example.com example.com
./scripts/check-production-env.sh
./scripts/deploy-public.sh
./scripts/verify-public-demo.sh https://alertops.example.com
```

Manual alternative:

```bash
cp .env.production.example .env.production
cd deploy
docker compose --env-file ../.env.production -f docker-compose.public.yml up -d --build
```

## Verify

```bash
go test ./... -count=1
bash scripts/smoke.sh
npm run test:e2e
```

`bash scripts/smoke.sh` now checks:
- health
- auth providers exposure
- go-live readiness
- legacy fallback login
- API key create + list + validate
- destination create + delivery history path
- real Sui wallet nonce/sign/verify flow
- risk + replay happy path

`npm run test:e2e` runs a Playwright browser acceptance suite against a real local server on `http://127.0.0.1:19088` and verifies:
- console auth shell rendering
- Google-disabled fallback state
- demo fallback login
- workspace auto-load
- create monitor from a rule template
- create webhook destination and show configured routes
- send a test webhook and show delivery history
- alerts-to-replay flow
- logout relock flow

If Playwright browser downloads are blocked in your network, the suite is configured to use the locally installed Google Chrome channel.
