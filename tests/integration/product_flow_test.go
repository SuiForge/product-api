package integration_test

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "product-api/internal/api"
    "product-api/internal/config"
    "product-api/internal/services/evidence"
    "product-api/internal/services/risk_engine"
)

func TestRiskCheckToReplayFlow(t *testing.T) {
    t.Parallel()

    evidenceService := evidence.NewService()
    riskService := risk_engine.NewService(evidenceService)
    router := api.NewRouter(config.Config{}, api.Dependencies{RiskService: riskService, ReplayService: evidenceService})

	loginReq := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
    loginReq.Header.Set("Content-Type", "application/json")
    loginRec := httptest.NewRecorder()
    router.ServeHTTP(loginRec, loginReq)
    if loginRec.Code != http.StatusOK {
        t.Fatalf("login expected 200, got %d body=%s", loginRec.Code, loginRec.Body.String())
    }
    cookies := loginRec.Result().Cookies()
    if len(cookies) == 0 {
        t.Fatalf("expected login cookie")
    }

    riskBody := []byte(`{"projectId":"proj_1","strategyId":"scalp-1","symbol":"SUI/USDC","side":"buy","price":"1.23","size":"100"}`)
    riskReq := httptest.NewRequest(http.MethodPost, "/v1/risk/check", bytes.NewReader(riskBody))
    riskReq.Header.Set("Content-Type", "application/json")
    riskReq.AddCookie(cookies[0])
    riskRec := httptest.NewRecorder()
    router.ServeHTTP(riskRec, riskReq)

    if riskRec.Code != http.StatusOK {
        t.Fatalf("risk check expected 200, got %d body=%s", riskRec.Code, riskRec.Body.String())
    }

    var riskResp struct {
        Decision   string   `json:"decision"`
        EvidenceID string   `json:"evidenceId"`
        ReasonCodes []string `json:"reasonCodes"`
    }
    if err := json.Unmarshal(riskRec.Body.Bytes(), &riskResp); err != nil {
        t.Fatalf("unmarshal risk response: %v", err)
    }
    if riskResp.EvidenceID == "" {
        t.Fatalf("missing evidenceId in risk response")
    }

    replayReq := httptest.NewRequest(http.MethodGet, "/v1/replays/"+riskResp.EvidenceID, nil)
    replayReq.AddCookie(cookies[0])
    replayRec := httptest.NewRecorder()
    router.ServeHTTP(replayRec, replayReq)

    if replayRec.Code != http.StatusOK {
        t.Fatalf("replay expected 200, got %d body=%s", replayRec.Code, replayRec.Body.String())
    }

    var replayResp struct {
        EvidenceID string   `json:"evidenceId"`
        Decision   string   `json:"decision"`
        ReasonCodes []string `json:"reasonCodes"`
    }
    if err := json.Unmarshal(replayRec.Body.Bytes(), &replayResp); err != nil {
        t.Fatalf("unmarshal replay response: %v", err)
    }
    if replayResp.EvidenceID != riskResp.EvidenceID {
        t.Fatalf("expected replay evidenceId %s, got %s", riskResp.EvidenceID, replayResp.EvidenceID)
    }
    if replayResp.Decision == "" {
        t.Fatalf("expected replay decision, got empty")
    }
}
