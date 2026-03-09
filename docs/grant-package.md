# Sui Alert Ops Grant Package Outline

This document packages `Sui Alert Ops` into a grant-friendly submission story.

## One-line thesis

`Sui Alert Ops` gives Sui teams a wallet-native operator console for alerting, webhook routing, API-key-based automation, and replayable incident evidence.

## What already exists

- one outward-facing product instead of a fragmented service set
- Google login surface for easy reviewer access
- Sui wallet signature login for wallet-native actions
- API key creation, listing, and validation
- webhook creation, signed test delivery, history, and retry
- replay view for alert investigation
- persistent local state so product setup survives restarts
- public deployment assets and CI-backed validation

## Why this is credible now

Reviewers do not need to trust a slide deck alone. The product can already be demonstrated with:

- `/console` for the operator experience
- `/v1/alert-ops/readiness` for deployment readiness proof
- GitHub Actions CI for ongoing validation
- public deployment scripts for buyer-facing or reviewer-facing sharing

## What to emphasize in an application

- the repo is focused on one product story: alert operations for Sui teams
- the product already supports real wallet-native access patterns
- the service exposes both human operator flows and machine-oriented API key flows
- the same product can serve buyer demos, ecosystem pilots, and reviewer walkthroughs

## Recommended milestone framing

Use milestones that reviewers can verify quickly:

### Milestone 1: pilot-ready public demo

- public HTTPS deployment
- wallet login working on the public domain
- persistent state enabled
- readiness reports at least `pilot_ready`

### Milestone 2: buyer-friendly operator access

- Google login enabled
- polished console walkthrough
- seeded monitors, destinations, and replayable alert examples

### Milestone 3: live ecosystem integrations

- real execution telemetry source
- real alert or tenant upstream source
- production-ready readiness status

### Milestone 4: partner onboarding package

- buyer runbook
- webhook integration examples
- operator setup guide

## Reviewer demo script

1. open the public `/console`
2. sign in with Google if enabled, otherwise use the wallet path
3. show `Go-Live Readiness`
4. open the alert feed
5. create or inspect a webhook destination
6. send a signed test delivery
7. open replay evidence for one alert
8. show API key issuance and validation

## Proof links to include

- public repo: `https://github.com/SuiForge/product-api`
- actions: `https://github.com/SuiForge/product-api/actions`
- deployed console URL
- deployed readiness URL

## Honest disclosure section

Be explicit about what is already live versus what is demo-backed.

Suggested language:

- operator console, auth, API keys, webhook flows, replay, deployment tooling, and CI are already implemented
- some alert or execution sources may still be demo-backed until final upstream providers are wired
- the readiness endpoint is included so reviewers can see the current state without guessing

## Submission checklist

- public URL works over HTTPS
- readiness endpoint is shareable
- Google login is enabled if reviewer convenience matters
- wallet login is verified on the same origin
- one alert, one webhook, and one replay flow are ready to demo
- the repo README links to pilot and go-live documentation
