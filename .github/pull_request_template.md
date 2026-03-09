## Summary

- what changed?
- why does it matter for `Sui Alert Ops`?

## Product impact

- buyer-facing flow changed: yes / no
- auth or access flow changed: yes / no
- deployment or go-live flow changed: yes / no

## Verification

- [ ] `go test ./... -count=1`
- [ ] `PRODUCT_API_SMOKE_RUN_SERVER=true bash scripts/smoke.sh`
- [ ] `npm run test:e2e`
- [ ] docs updated if routes, auth, or deployment behavior changed

## Demo notes

- console path to verify:
- readiness status expected:
- anything still demo-backed:
