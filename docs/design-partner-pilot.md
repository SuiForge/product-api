# Sui Alert Ops Design Partner Pilot

This document packages `Sui Alert Ops` into a buyer-facing pilot offer.

## Best-fit design partners

- Sui protocol teams that need treasury and whale monitoring
- trading or risk teams that need actionable webhook alerts
- ecosystem teams that want a shareable operator console without building their own alert workflow first

## Pilot promise

The pilot should prove one thing quickly: your team can detect important wallet or market events on Sui and route them into an operator workflow that is easy to review, replay, and act on.

The product story is intentionally simple:

- sign in with Google or wallet
- inspect readiness and workspace health
- create one monitor
- connect one webhook destination
- send one signed test delivery
- inspect one replayable alert
- issue one API key for downstream automation

## Pilot shape

Recommended structure:

- one buyer-facing workspace
- one live or semi-live alert stream
- one operator login path with Google enabled
- one wallet login path for wallet-bound setup actions
- one webhook destination connected to the partner's endpoint, Slack bridge, or internal relay

This keeps onboarding tight while still demonstrating a real product loop.

## What the partner gets

- a shareable console at `/console`
- `Go-Live Readiness` that explains current deployment status
- live or demo-backed overview and alert feed
- signed webhook delivery flow with history and retry
- replay evidence view for explaining why an alert fired
- API key issuance for automation or internal integrations

## What you need before outreach

Minimum pilot-ready configuration:

- public HTTPS domain
- `PRODUCT_API_SESSION_SECRET`
- `PRODUCT_API_PUBLIC_ORIGIN`
- `PRODUCT_API_SESSION_COOKIE_SECURE=true`
- persistent `PRODUCT_API_DATA_FILE`
- wallet login verified on the public origin

Recommended before a serious buyer call:

- Google login enabled
- at least one real upstream source enabled
- one seeded monitor and one replayable alert already visible
- one working webhook endpoint for delivery proof

## Suggested commercial framing

Use a simple structure instead of custom scoping on the first call:

- one-time setup and onboarding
- short paid pilot period
- monthly continuation if the team wants live monitoring and webhook operations kept active

Keep pricing, SLA, and retention commitments outside the product repo unless you need them for a live deal.

## Success criteria

A pilot is successful if the partner can do all of the following in one session:

- log in without friction
- understand what is monitored
- trust that alerts are routed to a destination they control
- inspect replay evidence for one alert
- see that the product can move from pilot-ready to production-ready

## Recommended buyer demo script

1. open `/console`
2. sign in with Google
3. show `Go-Live Readiness`
4. inspect overview and alerts
5. switch to wallet sign-in for wallet-bound actions
6. create an API key
7. create a webhook destination
8. send a signed test webhook
9. open replay evidence for one alert

## Hand-off assets

Share these with the partner after the call:

- repo: `https://github.com/SuiForge/product-api`
- readiness endpoint for the deployed environment
- `docs/go-live.md`
- `docs/google-login-launch.md`
- a short note explaining which data sources are live and which are still demo-backed
