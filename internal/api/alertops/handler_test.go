package alertops_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	alertopsapi "product-api/internal/api/alertops"
	alertopsdomain "product-api/internal/domain/alertops"
	"product-api/internal/domain/alerts"
	"product-api/internal/domain/replay"
	"product-api/internal/domain/tenant"
	"product-api/internal/services/evidence"
)

type stubProjectService struct{}

func (stubProjectService) GetCurrent(context.Context) (*tenant.Project, error) {
	return &tenant.Project{ID: "proj_1", Name: "Alpha Desk", Plan: "design_partner", Usage: tenant.UsageSnapshot{Requests: 120, Alerts: 4}}, nil
}

func (stubProjectService) GetUsage(context.Context) (*tenant.UsageSnapshot, error) {
	return &tenant.UsageSnapshot{Requests: 120, Alerts: 4}, nil
}

func (stubProjectService) ListAPIKeys(context.Context) (*tenant.APIKeyPage, error) {
	return &tenant.APIKeyPage{Count: 0, APIKeys: []tenant.APIKey{}}, nil
}

func (stubProjectService) CreateAPIKey(context.Context, tenant.CreateAPIKeyRequest) (*tenant.APIKey, error) {
	return &tenant.APIKey{ID: "key_1", Name: "default", TokenPreview: "sk_live_***"}, nil
}

type stubAlertsService struct{}

func (stubAlertsService) List(context.Context, alerts.ListQuery) (*alerts.AlertPage, error) {
	return &alerts.AlertPage{
		Count: 3,
		Alerts: []alerts.Alert{
			{ID: "alt_1", Type: "risk_alert", Severity: "high", Source: "risk-engine", Timestamp: 1710000001, EvidenceID: "evd_123"},
			{ID: "alt_2", Type: "liquidity_drop", Severity: "medium", Source: "liquidity-monitor", Timestamp: 1710000000, EvidenceID: "evd_122"},
			{ID: "alt_3", Type: "wallet_outflow", Severity: "high", Source: "wallet-monitor", Timestamp: 1709999999, EvidenceID: "evd_121"},
		},
	}, nil
}

type stubReplayService struct{}

func (stubReplayService) Get(context.Context, string) (*replay.EvidenceReplay, error) {
	return nil, evidence.ErrNotFound
}

type liveReplayService struct{}

func (liveReplayService) Get(context.Context, string) (*replay.EvidenceReplay, error) {
	return &replay.EvidenceReplay{EvidenceID: "evd_live", Decision: "warn", RiskScore: 72.5, ReasonCodes: []string{"high_spread", "low_depth"}}, nil
}

type missingAlertsService struct{}

func (missingAlertsService) List(context.Context, alerts.ListQuery) (*alerts.AlertPage, error) {
	return &alerts.AlertPage{Count: 0, Alerts: []alerts.Alert{}}, nil
}

type stubMonitorService struct{}

func (stubMonitorService) ListRuleTemplates(context.Context) ([]alertopsdomain.RuleTemplate, error) {
	return []alertopsdomain.RuleTemplate{
		{ID: "wallet_outflow", Name: "Wallet Outflow", Description: "Watch large wallet outflows.", TargetTypes: []string{"wallet"}, DefaultSeverity: "high", EventTypes: []string{"wallet_outflow"}},
		{ID: "liquidity_drop", Name: "Liquidity Drop", Description: "Detect liquidity changes.", TargetTypes: []string{"pool"}, DefaultSeverity: "medium", EventTypes: []string{"liquidity_drop"}},
	}, nil
}

func (stubMonitorService) ListMonitors(context.Context) (*alertopsdomain.MonitorPage, error) {
	return &alertopsdomain.MonitorPage{
		Count:    1,
		Monitors: []alertopsdomain.Monitor{{ID: "mon_1", Name: "Treasury outflow", TargetType: "wallet", TargetValue: "0x111", RuleTemplateID: "wallet_outflow", Severity: "high", Status: "active", CreatedAt: 1710000000}},
	}, nil
}

func (stubMonitorService) CreateMonitor(_ context.Context, req alertopsdomain.CreateMonitorRequest) (*alertopsdomain.Monitor, error) {
	return &alertopsdomain.Monitor{ID: "mon_new", Name: req.Name, TargetType: req.TargetType, TargetValue: req.TargetValue, RuleTemplateID: req.RuleTemplateID, Severity: req.Severity, Status: "active", CreatedAt: 1710000001}, nil
}

func TestManifestReturnsUnifiedServiceDefinition(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/manifest", handler.Manifest)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/manifest", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var resp map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp["id"] != "sui-alert-ops" {
		t.Fatalf("expected service id, got %+v", resp)
	}
	if resp["name"] != "Sui Alert Ops" {
		t.Fatalf("expected service name, got %+v", resp)
	}
	capabilities, ok := resp["capabilities"].([]any)
	if !ok || len(capabilities) < 3 {
		t.Fatalf("expected capabilities, got %+v", resp)
	}
}

func TestOverviewAggregatesProjectUsageAndAlerts(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/overview", handler.Overview)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/overview", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alertopsapi.OverviewResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Service.ID != "sui-alert-ops" || resp.Workspace == nil || resp.Usage == nil {
		t.Fatalf("unexpected overview response: %+v", resp)
	}
	if resp.Alerts.Count != 3 || resp.Alerts.HighSeverity != 2 || resp.Alerts.LatestEvidenceID != "evd_123" {
		t.Fatalf("unexpected alerts aggregation: %+v", resp.Alerts)
	}
	if len(resp.Alerts.Latest) != 3 {
		t.Fatalf("expected alerts preview, got %+v", resp.Alerts)
	}
	if !resp.Destinations.WalletRequired || len(resp.Destinations.SupportedTypes) == 0 {
		t.Fatalf("unexpected destinations metadata: %+v", resp.Destinations)
	}
	if !resp.Replay.Available {
		t.Fatalf("expected replay availability: %+v", resp.Replay)
	}
}

func TestReplayFallsBackToAlertDerivedEvidence(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/replays/:evidenceId", handler.Replay)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/replays/evd_123", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp replay.EvidenceReplay
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.EvidenceID != "evd_123" || len(resp.ReasonCodes) == 0 {
		t.Fatalf("unexpected fallback replay: %+v", resp)
	}
}

func TestReplayUsesPrimaryEvidenceServiceWhenAvailable(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, liveReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/replays/:evidenceId", handler.Replay)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/replays/evd_live", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp replay.EvidenceReplay
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.EvidenceID != "evd_live" || resp.Decision != "warn" {
		t.Fatalf("unexpected primary replay: %+v", resp)
	}
}

func TestReplayReturnsNotFoundWhenNoEvidenceExists(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, missingAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/replays/:evidenceId", handler.Replay)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/replays/evd_missing", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code == http.StatusOK {
		t.Fatalf("expected missing replay to fail")
	}
	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d body=%s", rec.Code, rec.Body.String())
	}
}

func TestListRuleTemplatesReturnsCatalog(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/rule-templates", handler.ListRuleTemplates)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/rule-templates", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp []alertopsdomain.RuleTemplate
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if len(resp) < 2 || resp[0].ID == "" {
		t.Fatalf("unexpected templates response: %+v", resp)
	}
}

func TestListMonitorsReturnsActiveMonitors(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.GET("/v1/alert-ops/monitors", handler.ListMonitors)

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/monitors", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alertopsdomain.MonitorPage
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Count != 1 || len(resp.Monitors) != 1 || resp.Monitors[0].ID == "" {
		t.Fatalf("unexpected monitors response: %+v", resp)
	}
}

func TestCreateMonitorReturnsCreatedMonitor(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertopsapi.NewHandler(stubProjectService{}, stubAlertsService{}, stubMonitorService{}, stubReplayService{})
	router := gin.New()
	router.POST("/v1/alert-ops/monitors", handler.CreateMonitor)

	body := []byte(`{"name":"Treasury watch","targetType":"wallet","targetValue":"0xabc","ruleTemplateId":"wallet_outflow","severity":"high"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/alert-ops/monitors", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alertopsdomain.Monitor
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.ID == "" || resp.RuleTemplateID != "wallet_outflow" {
		t.Fatalf("unexpected monitor response: %+v", resp)
	}
}
