package alerts_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	alertapi "product-api/internal/api/alerts"
	"product-api/internal/domain/alerts"
)

type stubAlertService struct{}

func (stubAlertService) List(context.Context, alerts.ListQuery) (*alerts.AlertPage, error) {
	return &alerts.AlertPage{
		Count:  1,
		Alerts: []alerts.Alert{{ID: "alt_1", Type: "execution.risk", Severity: "high", Source: "risk-engine", Timestamp: 1710000000, EvidenceID: "evd_123"}},
	}, nil
}

func (stubAlertService) ListDestinations(context.Context) (*alerts.DestinationPage, error) {
	return &alerts.DestinationPage{
		Count:        1,
		Destinations: []alerts.Destination{{ID: "dst_1", Type: "webhook", Target: "https://example.com/hook", Status: "active", WebhookSecret: "sec_123", SignatureHeader: "X-SuiIndexer-Signature"}},
	}, nil
}

func (stubAlertService) ListDeliveries(context.Context) (*alerts.DeliveryPage, error) {
	return &alerts.DeliveryPage{
		Count:      1,
		Deliveries: []alerts.DeliveryAttempt{{ID: "dlv_1", DestinationID: "dst_1", Target: "https://example.com/hook", EventType: "risk_alert", Delivered: true, Status: "delivered", StatusCode: http.StatusOK, SentAt: 1710000000}},
	}, nil
}

func (stubAlertService) CreateDestination(context.Context, alerts.CreateDestinationRequest) (*alerts.Destination, error) {
	return &alerts.Destination{ID: "dst_1", Type: "webhook", Target: "https://example.com/hook", Status: "active", WebhookSecret: "sec_123", SignatureHeader: "X-SuiIndexer-Signature"}, nil
}

func (stubAlertService) TestDestination(context.Context, alerts.TestDestinationRequest) (*alerts.TestDeliveryResult, error) {
	return &alerts.TestDeliveryResult{Delivered: true, StatusCode: http.StatusOK, SignatureHeader: "X-SuiIndexer-Signature", Signature: "abc123", EventType: "risk_alert"}, nil
}

func (stubAlertService) RetryDelivery(context.Context, string) (*alerts.TestDeliveryResult, error) {
	return &alerts.TestDeliveryResult{Delivered: true, StatusCode: http.StatusOK, SignatureHeader: "X-SuiIndexer-Signature", Signature: "retry123", EventType: "risk_alert"}, nil
}

func TestListAlertsReturnsProductContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertapi.NewHandler(stubAlertService{})
	router := gin.New()
	router.GET("/v1/alerts", handler.List)

	req := httptest.NewRequest(http.MethodGet, "/v1/alerts?projectId=proj_1&severity=high", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var resp alerts.AlertPage
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Count != 1 || len(resp.Alerts) != 1 || resp.Alerts[0].EvidenceID == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestListDestinationsReturnsProductContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertapi.NewHandler(stubAlertService{})
	router := gin.New()
	router.GET("/v1/alerts/destinations", handler.ListDestinations)

	req := httptest.NewRequest(http.MethodGet, "/v1/alerts/destinations", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alerts.DestinationPage
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Count != 1 || len(resp.Destinations) != 1 || resp.Destinations[0].Target == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestListDeliveriesReturnsProductContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertapi.NewHandler(stubAlertService{})
	router := gin.New()
	router.GET("/v1/alerts/deliveries", handler.ListDeliveries)

	req := httptest.NewRequest(http.MethodGet, "/v1/alerts/deliveries", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alerts.DeliveryPage
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Count != 1 || len(resp.Deliveries) != 1 || resp.Deliveries[0].ID == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestCreateDestinationValidatesAndReturnsContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertapi.NewHandler(stubAlertService{})
	router := gin.New()
	router.POST("/v1/alerts/destinations", handler.CreateDestination)

	body := []byte(`{"projectId":"proj_1","type":"webhook","target":"https://example.com/hook"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/alerts/destinations", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", rec.Code)
	}

	var resp alerts.Destination
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.ID == "" || resp.Type != "webhook" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestTestDestinationReturnsDeliveryContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertapi.NewHandler(stubAlertService{})
	router := gin.New()
	router.POST("/v1/alerts/destinations/test", handler.TestDestination)

	body := []byte(`{"target":"https://example.com/hook","secret":"sec_123","eventType":"risk_alert","payload":{"tx_digest":"tx1"}}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/alerts/destinations/test", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alerts.TestDeliveryResult
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if !resp.Delivered || resp.SignatureHeader == "" || resp.Signature == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestRetryDeliveryReturnsDeliveryContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := alertapi.NewHandler(stubAlertService{})
	router := gin.New()
	router.POST("/v1/alerts/deliveries/:deliveryId/retry", handler.RetryDelivery)

	req := httptest.NewRequest(http.MethodPost, "/v1/alerts/deliveries/dlv_1/retry", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp alerts.TestDeliveryResult
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if !resp.Delivered || resp.Signature == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}
