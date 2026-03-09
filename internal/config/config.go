package config

import (
	"os"
	"time"
)

type Config struct {
	Port                string
	SessionSecret       string
	SessionTTL          time.Duration
	SessionCookieSecure bool
	WalletChallengeTTL  time.Duration
	PublicOrigin        string
	SuiNetwork          string
	GoogleClientID      string
	GoogleHostedDomain  string
	DataFile            string
}

func Load() Config {
	port := os.Getenv("PRODUCT_API_PORT")
	if port == "" {
		port = "8088"
	}

	sessionTTL := 24 * time.Hour
	if raw := os.Getenv("PRODUCT_API_SESSION_TTL"); raw != "" {
		if parsed, err := time.ParseDuration(raw); err == nil && parsed > 0 {
			sessionTTL = parsed
		}
	}

	sessionSecret := os.Getenv("PRODUCT_API_SESSION_SECRET")
	if sessionSecret == "" {
		sessionSecret = "dev-session-secret-change-me"
	}

	walletChallengeTTL := 5 * time.Minute
	if raw := os.Getenv("PRODUCT_API_WALLET_CHALLENGE_TTL"); raw != "" {
		if parsed, err := time.ParseDuration(raw); err == nil && parsed > 0 {
			walletChallengeTTL = parsed
		}
	}

	suiNetwork := os.Getenv("PRODUCT_API_SUI_NETWORK")
	if suiNetwork == "" {
		suiNetwork = "mainnet"
	}

	return Config{
		Port:                port,
		SessionSecret:       sessionSecret,
		SessionTTL:          sessionTTL,
		SessionCookieSecure: os.Getenv("PRODUCT_API_SESSION_COOKIE_SECURE") == "true",
		WalletChallengeTTL:  walletChallengeTTL,
		PublicOrigin:        os.Getenv("PRODUCT_API_PUBLIC_ORIGIN"),
		SuiNetwork:          suiNetwork,
		GoogleClientID:      os.Getenv("PRODUCT_API_GOOGLE_CLIENT_ID"),
		GoogleHostedDomain:  os.Getenv("PRODUCT_API_GOOGLE_HOSTED_DOMAIN"),
		DataFile:            defaultStringEnv("PRODUCT_API_DATA_FILE", "data/product-api-state.json"),
	}
}

func defaultStringEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
