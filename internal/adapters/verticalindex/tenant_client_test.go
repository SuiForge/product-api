package verticalindex_test

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

	"product-api/internal/adapters/verticalindex"
)

func TestClientMapsTenantEndpoints(t *testing.T) {
	t.Parallel()

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.Method == http.MethodGet && r.URL.Path == "/api/subscription":
			if got := r.Header.Get("X-API-Key"); got != "test-key" && got != "sk_live_1234567890abcdef123456" {
				t.Fatalf("expected X-API-Key header, got %q", got)
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"wallet_address":"0xabc","plan_tier":"pro","status":"active"}`))
		case r.Method == http.MethodGet && r.URL.Path == "/api/stats/usage":
			if got := r.Header.Get("X-API-Key"); got != "test-key" {
				t.Fatalf("expected X-API-Key header, got %q", got)
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`[{"date":"2026-03-01","count":10},{"date":"2026-03-02","count":5}]`))
		case r.Method == http.MethodPost && r.URL.Path == "/api/keys":
			if got := r.Header.Get("X-API-Key"); got != "test-key" {
				t.Fatalf("expected X-API-Key header, got %q", got)
			}
			if got := r.Header.Get("Content-Type"); !strings.Contains(got, "application/x-www-form-urlencoded") {
				t.Fatalf("expected form content type, got %q", got)
			}
			body, err := io.ReadAll(r.Body)
			if err != nil {
				t.Fatalf("read body: %v", err)
			}
			values, err := url.ParseQuery(string(body))
			if err != nil {
				t.Fatalf("parse body: %v", err)
			}
			if got := values.Get("wallet_address"); got != "0xabc" {
				t.Fatalf("expected wallet_address, got %q", got)
			}
			if got := values.Get("owner_name"); got != "default" {
				t.Fatalf("expected owner_name, got %q", got)
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"api_key":"pk_live_123456","key_hash":"hash_123","owner_name":"default","wallet_address":"0xabc","plan_tier":"pro","expires_at":"2026-04-01T00:00:00Z"}`))
		default:
			http.NotFound(w, r)
		}
	}))
	defer srv.Close()

	client := verticalindex.NewClient(srv.URL, "test-key", 2*time.Second)

	subscription, err := client.GetSubscriptionStatus(context.Background())
	if err != nil {
		t.Fatalf("GetSubscriptionStatus error: %v", err)
	}
	if subscription.WalletAddress != "0xabc" || subscription.PlanTier != "pro" {
		t.Fatalf("unexpected subscription: %+v", subscription)
	}

	usage, err := client.GetUsageStats(context.Background())
	if err != nil {
		t.Fatalf("GetUsageStats error: %v", err)
	}
	if len(usage) != 2 || usage[0].Count != 10 {
		t.Fatalf("unexpected usage: %+v", usage)
	}

	apiKey, err := client.CreateAPIKey(context.Background(), "0xabc", "default")
	if err != nil {
		t.Fatalf("CreateAPIKey error: %v", err)
	}
	if apiKey.KeyHash != "hash_123" || apiKey.APIKey != "pk_live_123456" {
		t.Fatalf("unexpected api key response: %+v", apiKey)
	}

	validated, err := client.ValidateAPIKey(context.Background(), "sk_live_1234567890abcdef123456")
	if err != nil {
		t.Fatalf("ValidateAPIKey error: %v", err)
	}
	if validated.WalletAddress != "0xabc" || validated.PlanTier != "pro" {
		t.Fatalf("unexpected validated subscription: %+v", validated)
	}
}
