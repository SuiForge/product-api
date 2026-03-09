package alerting_test

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"product-api/internal/identity"
	"product-api/internal/domain/alerts"
	svc "product-api/internal/services/alerting"
)

type stubClient struct{}

func (stubClient) ListAnomalyAlerts(context.Context, string, int) (*svc.UpstreamAlertPage, error) {
	return &svc.UpstreamAlertPage{
		Count: 1,
		Alerts: []svc.UpstreamAlert{{
			Type:        "large_transfer",
			TxDigest:    "tx1",
			Severity:    "high",
			TimestampMS: 1710000000000,
		}},
	}, nil
}

func (stubClient) UpsertWebhookConfig(context.Context, string, string, []string) (*svc.UpstreamWebhookConfig, error) {
	return &svc.UpstreamWebhookConfig{
		Address:       "0x1111111111111111111111111111111111111111111111111111111111111111",
		WebhookURL:    "https://example.com/hook",
		WebhookSecret: "sec_123",
		EventTypes:    []string{"risk_alert", "whale_alert"},
		IsActive:      true,
	}, nil
}

func TestServiceMapsPlatformAlertsAndDestinations(t *testing.T) {
	t.Parallel()

	service := svc.NewService(stubClient{})

	page, err := service.List(context.Background(), alerts.ListQuery{ProjectID: "proj_1", Severity: "high", Status: "open"})
	if err != nil {
		t.Fatalf("List error: %v", err)
	}
	if page.Count != 1 || len(page.Alerts) != 1 {
		t.Fatalf("unexpected page: %+v", page)
	}
	if page.Alerts[0].ID == "" || page.Alerts[0].EvidenceID != "tx1" || page.Alerts[0].Source != "vertical-index-api" {
		t.Fatalf("unexpected alert mapping: %+v", page.Alerts[0])
	}

	ctx := identity.WithContext(context.Background(), &identity.Identity{WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", WorkspaceName: "Alpha Desk", OperatorName: "Founding PM", AuthMethod: "session"})
	destination, err := service.CreateDestination(ctx, alerts.CreateDestinationRequest{ProjectID: "proj_1", Type: "webhook", Target: "https://example.com/hook"})
	if err != nil {
		t.Fatalf("CreateDestination error: %v", err)
	}
	if destination.ID == "" || destination.Type != "webhook" || destination.Status != "active" || destination.WebhookSecret == "" || destination.SignatureHeader != "X-SuiIndexer-Signature" {
		t.Fatalf("unexpected destination: %+v", destination)
	}
}

func TestServiceRejectsUnsupportedDestinationType(t *testing.T) {
	t.Parallel()

	service := svc.NewService(stubClient{})
	ctx := identity.WithContext(context.Background(), &identity.Identity{WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", WorkspaceName: "Alpha Desk", OperatorName: "Founding PM", AuthMethod: "session"})
	_, err := service.CreateDestination(ctx, alerts.CreateDestinationRequest{ProjectID: "proj_1", Type: "telegram", Target: "@bot"})
	if !errors.Is(err, svc.ErrUnsupportedDestinationType) {
		t.Fatalf("expected ErrUnsupportedDestinationType, got %v", err)
	}
}

func TestServiceSendsSignedWebhookTestRequest(t *testing.T) {
	t.Parallel()

	var receivedSignature string
	var receivedTimestamp string
	var receivedBody string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		receivedSignature = r.Header.Get("X-SuiIndexer-Signature")
		receivedTimestamp = r.Header.Get("X-SuiIndexer-Timestamp")
		body, _ := io.ReadAll(r.Body)
		receivedBody = string(body)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer server.Close()

	service := svc.NewService(stubClient{})
	result, err := service.TestDestination(context.Background(), alerts.TestDestinationRequest{
		Target:    server.URL,
		Secret:    "sec_123",
		EventType: "risk_alert",
		Payload: map[string]any{
			"tx_digest": "tx1",
			"severity":  "high",
		},
	})
	if err != nil {
		t.Fatalf("TestDestination error: %v", err)
	}
	if !result.Delivered || result.StatusCode != http.StatusOK || result.Signature == "" {
		t.Fatalf("unexpected test result: %+v", result)
	}
	if receivedSignature == "" || receivedTimestamp == "" || receivedBody == "" {
		t.Fatalf("expected signed webhook request, got signature=%q timestamp=%q body=%q", receivedSignature, receivedTimestamp, receivedBody)
	}
	mac := hmac.New(sha256.New, []byte("sec_123"))
	mac.Write([]byte(fmt.Sprintf("%s.%s", receivedTimestamp, receivedBody)))
	expected := hex.EncodeToString(mac.Sum(nil))
	if expected != receivedSignature {
		t.Fatalf("expected signature %q, got %q", expected, receivedSignature)
	}
}
