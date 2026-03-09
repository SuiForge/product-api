package risk_test

import (
    "bytes"
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"

    riskapi "product-api/internal/api/risk"
    "product-api/internal/domain/risk"
)

type stubRiskService struct{}

func (stubRiskService) Check(context.Context, risk.CheckRequest) (*risk.CheckResponse, error) {
    return &risk.CheckResponse{
        Decision:    "warn",
        RiskScore:   72.5,
        ReasonCodes: []string{"high_spread", "low_depth"},
        Warnings:    []string{"Spread elevated", "Depth thin"},
        EvidenceID:  "evd_123",
    }, nil
}

func TestRiskCheckReturnsDecisionContract(t *testing.T) {
    t.Parallel()
    gin.SetMode(gin.TestMode)

    handler := riskapi.NewHandler(stubRiskService{})
    router := gin.New()
    router.POST("/v1/risk/check", handler.Check)

    body := []byte(`{"projectId":"proj_1","strategyId":"scalp-1","symbol":"SUI/USDC","side":"buy","price":"1.23","size":"100"}`)
    req := httptest.NewRequest(http.MethodPost, "/v1/risk/check", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    rec := httptest.NewRecorder()
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rec.Code)
    }

    var resp risk.CheckResponse
    if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
        t.Fatalf("unmarshal response: %v", err)
    }
    if resp.Decision == "" || resp.EvidenceID == "" || len(resp.ReasonCodes) == 0 {
        t.Fatalf("unexpected response: %+v", resp)
    }
}

func TestRiskCheckRejectsInvalidPayload(t *testing.T) {
    t.Parallel()
    gin.SetMode(gin.TestMode)

    handler := riskapi.NewHandler(stubRiskService{})
    router := gin.New()
    router.POST("/v1/risk/check", handler.Check)

    req := httptest.NewRequest(http.MethodPost, "/v1/risk/check", bytes.NewReader([]byte(`{"projectId":""}`)))
    req.Header.Set("Content-Type", "application/json")
    rec := httptest.NewRecorder()
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusBadRequest {
        t.Fatalf("expected 400, got %d", rec.Code)
    }
}
