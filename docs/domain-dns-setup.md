# Domain and DNS Setup Guide

This guide explains how to expose `Sui Alert Ops` on a public domain so wallet login, Google login, and HTTPS all line up correctly.

## Recommended domain shape

Use one dedicated hostname for the product, for example:

- `alertops.example.com`

This keeps the product origin stable for:

- Google Authorized JavaScript origins
- Sui wallet sign-in messages
- public buyer and grant demo links

## DNS records

Point the hostname to the machine that runs the Docker + Caddy stack.

Common setup:

- `A` record: `alertops.example.com` → your server IPv4
- `AAAA` record: `alertops.example.com` → your server IPv6 if used

If you also want `www.alertops.example.com`, point it to the same host and add it to your reverse proxy / Google settings.

## Ports and firewall

The public stack expects:

- port `80` open for HTTP and ACME challenges
- port `443` open for HTTPS traffic

If your cloud provider has network ACLs or security groups, allow inbound TCP on `80` and `443`.

## Required env alignment

These values should all describe the same public hostname:

```bash
APP_DOMAIN=alertops.example.com
PRODUCT_API_PUBLIC_ORIGIN=https://alertops.example.com
```

Why this matters:

- Caddy uses `APP_DOMAIN` to serve the correct site and issue TLS certificates.
- wallet login uses `PRODUCT_API_PUBLIC_ORIGIN` in the signed challenge message.
- Google login requires the same origin in Google Cloud Console.

## Google origin alignment

If Google login is enabled, add the exact origin in Google Cloud Console:

- `https://alertops.example.com`

If you use both root and `www`, add both origins explicitly.

Do not include a path like `/console`. Google expects the origin only.

## Verify after DNS points correctly

Once DNS resolves and the stack is running:

```bash
./scripts/verify-public-demo.sh https://alertops.example.com
```

This checks:

- `/health`
- `/v1/alert-ops/readiness`
- `/v1/auth/providers`
- console shell content

## Common mistakes

- `APP_DOMAIN` and `PRODUCT_API_PUBLIC_ORIGIN` use different hostnames
- Google origin includes `/console` instead of the bare origin
- port `80` is blocked, so automatic TLS issuance fails
- port `443` is blocked, so the site looks down externally
- DNS still points to an old server

