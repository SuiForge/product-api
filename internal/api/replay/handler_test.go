package replay_test

import (
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"

    replayapi "product-api/internal/api/replay"
    "product-api/internal/domain/replay"
)

type stubReplayService struct{}

func (stubReplayService) Get(context.Context, string) (*replay.EvidenceReplay, error) {
    return &replay.EvidenceReplay{
        EvidenceID: "evd_123",
        Decision:   "warn",
        RiskScore:  72.5,
        ReasonCodes: []string{"high_spread"},
    }, nil
}

func TestReplayReturnsEvidenceContract(t *testing.T) {
    t.Parallel()
    gin.SetMode(gin.TestMode)

    handler := replayapi.NewHandler(stubReplayService{})
    router := gin.New()
    router.GET("/v1/replays/:evidenceId", handler.GetByEvidenceID)

    req := httptest.NewRequest(http.MethodGet, "/v1/replays/evd_123", nil)
    rec := httptest.NewRecorder()
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rec.Code)
    }

    var resp replay.EvidenceReplay
    if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
        t.Fatalf("unmarshal response: %v", err)
    }
    if resp.EvidenceID != "evd_123" || resp.Decision == "" {
        t.Fatalf("unexpected response: %+v", resp)
    }
}
