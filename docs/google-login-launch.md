# Google Login Launch Checklist

This checklist turns Google login from a placeholder into a buyer-facing or grant-facing sign-in path for `Sui Alert Ops`.

## What Google login is for

Use Google login when you want:

- buyers to inspect the console without connecting a wallet first
- grant reviewers to open the product with a familiar sign-in flow
- non-wallet operators to review alerts and readiness status quickly

Keep wallet login enabled as the path for wallet-bound actions such as API key issuance and webhook provisioning.

## 1. Create a Google Identity client

In Google Cloud Console:

1. open `APIs & Services` → `Credentials`
2. create an `OAuth 2.0 Client ID`
3. choose `Web application`
4. add your public origins

Recommended Authorized JavaScript origins:

- `https://alertops.example.com`
- `https://www.alertops.example.com` if you use both hostnames

For local testing you can also add:

- `http://127.0.0.1:8088`
- `http://localhost:8088`

## 2. Configure product env

Add these values to `.env.production`:

```bash
PRODUCT_API_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
PRODUCT_API_GOOGLE_HOSTED_DOMAIN=example.com
```

Notes:

- `PRODUCT_API_GOOGLE_HOSTED_DOMAIN` is optional.
- Leave it empty if reviewers or buyers come from many domains.
- Set it if you want only your team or a partner workspace to sign in.

## 3. Match the public origin

These values must agree with the domain you expose publicly:

- `APP_DOMAIN`
- `PRODUCT_API_PUBLIC_ORIGIN`
- Google Authorized JavaScript origins

Example:

```bash
APP_DOMAIN=alertops.example.com
PRODUCT_API_PUBLIC_ORIGIN=https://alertops.example.com
```

If these do not match, Google login will look configured but fail in the browser.

## 4. Verify after deploy

After deployment, check:

```bash
curl -fsS https://alertops.example.com/v1/auth/providers
curl -fsS https://alertops.example.com/v1/alert-ops/readiness
```

Expected:

- `google.enabled` is `true` in `/v1/auth/providers`
- readiness still reports at least `pilot_ready`
- the remaining next actions no longer mention `PRODUCT_API_GOOGLE_CLIENT_ID`

## 5. Browser validation

Open `/console` and confirm:

- the Google badge says `Google login ready`
- the Google button renders
- popup sign-in creates a session
- the console unlocks after Google login
- wallet-only actions still explain that wallet login is required for API keys and webhook setup

## 6. Recommended demo flow

For a buyer or grant reviewer:

1. open `/console`
2. sign in with Google
3. inspect `Go-Live Readiness`
4. inspect overview and alerts
5. show wallet login only when you want to demonstrate API key issuance

This keeps the first experience simple while preserving wallet-native actions for the deeper product story.

