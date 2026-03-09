# Public Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a production-shaped deployment path for `Sui Alert Ops` so the service can be published as a public demo or pilot.

**Architecture:** Build the Go server in a multi-stage container image after bundling the wallet auth assets, run the service behind Caddy for HTTPS termination, and provide both Docker Compose and systemd entry points for fast operator rollout.

**Tech Stack:** Go 1.25, Node 22, Docker, Docker Compose, Caddy, systemd.

---

### Task 1: Add container build assets

**Files:**
- Create: `product-api/Dockerfile`
- Create: `product-api/.dockerignore`

**Step 1: Add a multi-stage Docker build**
- Use a Node stage to run `npm ci` and `npm run build:wallet-auth`.
- Use a Go stage to compile `./cmd/server` after the built assets exist.
- Use a lightweight runtime image that still includes `node` for wallet signature verification.

**Step 2: Add Docker ignore rules**
- Exclude `node_modules`, `test-results`, local env files, and transient data that should not go into the image build context.

### Task 2: Add public demo runtime assets

**Files:**
- Create: `product-api/deploy/docker-compose.public.yml`
- Create: `product-api/deploy/Caddyfile`
- Create: `product-api/deploy/sui-alert-ops.service`

**Step 1: Add compose stack**
- Define `product-api` and `caddy` services.
- Mount persistent product data under `/app/data`.
- Route HTTPS through Caddy.

**Step 2: Add reverse proxy config**
- Make the Caddyfile use environment substitution for domain and single-service runtime settings.
- Proxy all traffic to the app and set safe HTTP headers.

**Step 3: Add systemd example**
- Provide a service unit that manages the compose stack for a VM deployment.

### Task 3: Add operator-facing templates and docs

**Files:**
- Create: `product-api/.env.production.example`
- Modify: `product-api/docs/go-live.md`
- Modify: `product-api/README.md`

**Step 1: Add production env template**
- Include session, public origin, Google auth, and persistence placeholders.

**Step 2: Document deployment flow**
- Explain how to copy the env template, launch the compose stack, and verify readiness.
- Explain how to use the systemd unit on a Linux host.

### Task 4: Validate artifacts

**Files:**
- Validate: `product-api/Dockerfile`
- Validate: `product-api/deploy/docker-compose.public.yml`
- Validate: `product-api/deploy/Caddyfile`

**Step 1: Run local validation commands**
- Run `bash -n` for scripts touched.
- Run `node --check` and `go test ./... -count=1`.
- If `docker` is installed, run `docker compose -f deploy/docker-compose.public.yml --env-file .env.production.example config`.

