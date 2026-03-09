FROM node:22-bookworm-slim AS web-builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:wallet-auth

FROM golang:1.25-bookworm AS go-builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=web-builder /app/internal/console/static/wallet-auth.js /app/internal/console/static/wallet-auth.js
COPY --from=web-builder /app/internal/api/auth/scripts/verify-wallet-signature.mjs /app/internal/api/auth/scripts/verify-wallet-signature.mjs
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/product-api ./cmd/server

FROM node:22-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=go-builder /out/product-api /app/product-api
COPY --from=web-builder /app/internal/api/auth/scripts/verify-wallet-signature.mjs /app/internal/api/auth/scripts/verify-wallet-signature.mjs

RUN mkdir -p /app/data /app/internal/api/auth/scripts

ENV PRODUCT_API_PORT=8088
ENV PRODUCT_API_SESSION_SECRET=change-me-in-production
ENV PRODUCT_API_SESSION_TTL=24h
ENV PRODUCT_API_SESSION_COOKIE_SECURE=true
ENV PRODUCT_API_PUBLIC_ORIGIN=https://alertops.example.com
ENV PRODUCT_API_SUI_NETWORK=mainnet
ENV PRODUCT_API_WALLET_CHALLENGE_TTL=5m
ENV PRODUCT_API_DATA_FILE=/app/data/product-api-state.json

EXPOSE 8088

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8088/health || exit 1

CMD ["/app/product-api"]
