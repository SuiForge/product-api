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

func TestClientMapsAnomalyAlertsAndWebhookConfig(t *testing.T) {
	t.Parallel()

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.Method == http.MethodGet && r.URL.Path == "/api/alerts/anomalies":
			if got := r.Header.Get("X-API-Key"); got != "test-key" {
				t.Fatalf("expected X-API-Key header, got %q", got)
			}
			if got := r.URL.Query().Get("severity"); got != "high" {
				t.Fatalf("expected severity=high, got %q", got)
			}
			if got := r.URL.Query().Get("limit"); got != "20" {
				t.Fatalf("expected limit=20, got %q", got)
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"count":1,"alerts":[{"type":"large_transfer","tx_digest":"tx1","address":"0x1","counterparty":"0x2","amount":123,"timestamp_ms":1710000000000,"severity":"high"}]}`))
		case r.Method == http.MethodPut && r.URL.Path == "/api/webhook":
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
			if got := values.Get("webhook_url"); got != "https://example.com/hook" {
				t.Fatalf("expected webhook_url, got %q", got)
			}
			if got := values.Get("event_types"); got != `["risk_alert","whale_alert"]` {
				t.Fatalf("unexpected event_types: %q", got)
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"address":"0xabc","webhook_url":"https://example.com/hook","webhook_secret":"sec_123","event_types":["risk_alert","whale_alert"],"is_active":true}`))
		default:
			http.NotFound(w, r)
		}
	}))
	defer srv.Close()

	client := verticalindex.NewClient(srv.URL, "test-key", 2*time.Second)

	alertsPage, err := client.ListAnomalyAlerts(context.Background(), "high", 20)
	if err != nil {
		t.Fatalf("ListAnomalyAlerts error: %v", err)
	}
	if alertsPage.Count != 1 || len(alertsPage.Alerts) != 1 || alertsPage.Alerts[0].TxDigest != "tx1" {
		t.Fatalf("unexpected alerts page: %+v", alertsPage)
	}

	cfg, err := client.UpsertWebhookConfig(context.Background(), "0xabc", "https://example.com/hook", []string{"risk_alert", "whale_alert"})
	if err != nil {
		t.Fatalf("UpsertWebhookConfig error: %v", err)
	}
	if cfg.WebhookURL != "https://example.com/hook" || cfg.WebhookSecret != "sec_123" || !cfg.IsActive {
		t.Fatalf("unexpected webhook config: %+v", cfg)
	}
}
