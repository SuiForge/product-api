package contract_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"product-api/internal/api"
	"product-api/internal/config"
	"product-api/internal/domain/alerts"
	"product-api/internal/domain/execution"
	"product-api/internal/domain/tenant"
	"product-api/internal/services/evidence"
	"product-api/internal/services/risk_engine"
)

type execStub struct{}

func (execStub) GetSummary(_ context.Context, _ execution.SummaryQuery) (*execution.Summary, error) {
	return &execution.Summary{PoolID: "pool-1", Symbol: "SUI/USDC", Window: "1h", Trades: 1, VolumeQuote: "1", ExecutionScore: 88}, nil
}
func (execStub) GetFills(_ context.Context, _ execution.FillsQuery) (*execution.FillPage, error) {
	return &execution.FillPage{PoolID: "pool-1", Window: "1h", Count: 0, NextCursor: "", Fills: []execution.Fill{}}, nil
}
func (execStub) GetLifecycle(_ context.Context, _ execution.LifecycleQuery) (*execution.LifecyclePage, error) {
	return &execution.LifecyclePage{PoolID: "pool-1", Window: "1h", EventType: "all", Count: 0, NextCursor: "", Events: []execution.LifecycleEvent{}}, nil
}

type alertsStub struct{}

func (alertsStub) List(_ context.Context, _ alerts.ListQuery) (*alerts.AlertPage, error) {
	return &alerts.AlertPage{Count: 1, Alerts: []alerts.Alert{{ID: "alt_1", Type: "execution.risk", Severity: "high", Source: "risk-engine", Timestamp: 1710000000, EvidenceID: "evd_123"}}}, nil
}
func (alertsStub) ListDeliveries(_ context.Context) (*alerts.DeliveryPage, error) {
	return &alerts.DeliveryPage{Count: 1, Deliveries: []alerts.DeliveryAttempt{{ID: "dlv_1", DestinationID: "dst_1", Target: "https://example.com/hook", EventType: "risk_alert", Delivered: true, Status: "delivered", StatusCode: http.StatusOK, SentAt: 1710000000}}}, nil
}
func (alertsStub) ListDestinations(_ context.Context) (*alerts.DestinationPage, error) {
	return &alerts.DestinationPage{Count: 1, Destinations: []alerts.Destination{{ID: "dst_1", Type: "webhook", Target: "https://example.com/hook", Status: "active"}}}, nil
}
func (alertsStub) CreateDestination(_ context.Context, req alerts.CreateDestinationRequest) (*alerts.Destination, error) {
	return &alerts.Destination{ID: "dst_1", Type: req.Type, Target: req.Target, Status: "active"}, nil
}
func (alertsStub) TestDestination(_ context.Context, req alerts.TestDestinationRequest) (*alerts.TestDeliveryResult, error) {
	return &alerts.TestDeliveryResult{Delivered: true, StatusCode: http.StatusOK, Target: req.Target, EventType: req.EventType, SignatureHeader: "X-SuiIndexer-Signature", TimestampHeader: "X-SuiIndexer-Timestamp", Timestamp: "1", Signature: "abc"}, nil
}
func (alertsStub) RetryDelivery(_ context.Context, _ string) (*alerts.TestDeliveryResult, error) {
	return &alerts.TestDeliveryResult{Delivered: true, StatusCode: http.StatusOK, Target: "https://example.com/hook", EventType: "risk_alert", SignatureHeader: "X-SuiIndexer-Signature", TimestampHeader: "X-SuiIndexer-Timestamp", Timestamp: "1", Signature: "retry-abc"}, nil
}

type tenantStub struct{}

func (tenantStub) GetCurrent(_ context.Context) (*tenant.Project, error) {
	return &tenant.Project{ID: "proj_1", Name: "Alpha", Plan: "beta", Usage: tenant.UsageSnapshot{Requests: 10, Alerts: 1}}, nil
}
func (tenantStub) GetUsage(_ context.Context) (*tenant.UsageSnapshot, error) {
	return &tenant.UsageSnapshot{Requests: 10, Alerts: 1}, nil
}
func (tenantStub) ListAPIKeys(_ context.Context) (*tenant.APIKeyPage, error) {
	return &tenant.APIKeyPage{Count: 1, APIKeys: []tenant.APIKey{{ID: "key_1", Name: "default", TokenPreview: "pk_live_***"}}}, nil
}
func (tenantStub) CreateAPIKey(_ context.Context, req tenant.CreateAPIKeyRequest) (*tenant.APIKey, error) {
	return &tenant.APIKey{ID: "key_1", Name: req.Name, TokenPreview: "pk_live_***"}, nil
}

func TestCoreResponseSchemas(t *testing.T) {
	t.Parallel()

	evidenceService := evidence.NewService()
	riskService := risk_engine.NewService(evidenceService)
	router := api.NewRouter(config.Config{}, api.Dependencies{
		ExecutionService: execStub{},
		RiskService:      riskService,
		ReplayService:    evidenceService,
		AlertsService:    alertsStub{},
		TenantService:    tenantStub{},
	})
	authCookie := loginCookie(t, router)

	t.Run("risk check schema", func(t *testing.T) {
		body := []byte(`{"projectId":"proj_1","strategyId":"s1","symbol":"SUI/USDC","side":"buy","price":"1.0","size":"10"}`)
		req := httptest.NewRequest(http.MethodPost, "/v1/risk/check", bytes.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		req.AddCookie(authCookie)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", rec.Code)
		}
		var payload map[string]any
		if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
			t.Fatal(err)
		}
		requireKeys(t, payload, []string{"decision", "riskScore", "reasonCodes", "warnings", "evidenceId"})
	})

	t.Run("execution summary schema", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/v1/execution/summaries?poolId=pool-1&symbol=SUI/USDC&window=1h", nil)
		req.AddCookie(authCookie)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", rec.Code)
		}
		var payload map[string]any
		if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
			t.Fatal(err)
		}
		requireKeys(t, payload, []string{"poolId", "symbol", "window", "trades", "volumeQuote", "executionScore"})
	})

	t.Run("project schema", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
		req.AddCookie(authCookie)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", rec.Code)
		}
		var payload map[string]any
		if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
			t.Fatal(err)
		}
		requireKeys(t, payload, []string{"id", "name", "plan", "usage"})
	})
}

func loginCookie(t *testing.T, router http.Handler) *http.Cookie {
	t.Helper()
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("login expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}
	cookies := rec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected auth cookie")
	}
	return cookies[0]
}

func requireKeys(t *testing.T, payload map[string]any, keys []string) {
	t.Helper()
	for _, key := range keys {
		if _, ok := payload[key]; !ok {
			t.Fatalf("missing key %q in payload %+v", key, payload)
		}
	}
}
