package projects_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	projectapi "product-api/internal/api/projects"
	"product-api/internal/domain/tenant"
	tenantservice "product-api/internal/services/tenant"
)

type stubTenantService struct{}

func (stubTenantService) GetCurrent(context.Context) (*tenant.Project, error) {
	return &tenant.Project{ID: "proj_1", Name: "Alpha", Plan: "design_partner", Usage: tenant.UsageSnapshot{Requests: 120, Alerts: 4}}, nil
}

func (stubTenantService) GetUsage(context.Context) (*tenant.UsageSnapshot, error) {
	return &tenant.UsageSnapshot{Requests: 120, Alerts: 4}, nil
}

func (stubTenantService) ListAPIKeys(context.Context) (*tenant.APIKeyPage, error) {
	return &tenant.APIKeyPage{Count: 1, APIKeys: []tenant.APIKey{{ID: "key_1", Name: "default", TokenPreview: "pk_live_***"}}}, nil
}

func (stubTenantService) CreateAPIKey(context.Context, tenant.CreateAPIKeyRequest) (*tenant.APIKey, error) {
	return &tenant.APIKey{ID: "key_1", Name: "default", TokenPreview: "pk_live_***"}, nil
}

type conflictTenantService struct{ stubTenantService }

func (conflictTenantService) CreateAPIKey(context.Context, tenant.CreateAPIKeyRequest) (*tenant.APIKey, error) {
	return nil, tenantservice.ErrAPIKeyAlreadyExists
}

func TestGetCurrentProjectReturnsProjectContract(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := projectapi.NewHandler(stubTenantService{})
	router := gin.New()
	router.GET("/v1/projects/me", handler.GetCurrent)

	req := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var resp tenant.Project
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.ID == "" || resp.Plan == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestGetUsageReturnsUsageSnapshot(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := projectapi.NewHandler(stubTenantService{})
	router := gin.New()
	router.GET("/v1/projects/me/usage", handler.GetUsage)

	req := httptest.NewRequest(http.MethodGet, "/v1/projects/me/usage", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}

func TestCreateAPIKeyReturnsTokenPreview(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := projectapi.NewHandler(stubTenantService{})
	router := gin.New()
	router.POST("/v1/projects/me/api-keys", handler.CreateAPIKey)

	body := []byte(`{"name":"default"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/projects/me/api-keys", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", rec.Code)
	}
}

func TestListAPIKeysReturnsStoredKeys(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := projectapi.NewHandler(stubTenantService{})
	router := gin.New()
	router.GET("/v1/projects/me/api-keys", handler.ListAPIKeys)

	req := httptest.NewRequest(http.MethodGet, "/v1/projects/me/api-keys", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var resp tenant.APIKeyPage
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if resp.Count != 1 || len(resp.APIKeys) != 1 || resp.APIKeys[0].TokenPreview == "" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestCreateAPIKeyReturnsConflictWhenWalletAlreadyHasKey(t *testing.T) {
	t.Parallel()
	gin.SetMode(gin.TestMode)

	handler := projectapi.NewHandler(conflictTenantService{})
	router := gin.New()
	router.POST("/v1/projects/me/api-keys", handler.CreateAPIKey)

	body := []byte(`{"name":"default"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/projects/me/api-keys", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusConflict {
		t.Fatalf("expected 409, got %d body=%s", rec.Code, rec.Body.String())
	}
	var payload map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
}
