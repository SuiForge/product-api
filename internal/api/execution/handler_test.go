package execution_test

import (
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"

    executionapi "product-api/internal/api/execution"
    "product-api/internal/domain/execution"
)

type stubExecutionService struct{}

func (stubExecutionService) GetSummary(context.Context, execution.SummaryQuery) (*execution.Summary, error) {
    return &execution.Summary{
        PoolID:         "pool-1",
        Symbol:         "SUI/USDC",
        Window:         "1h",
        Trades:         12,
        VolumeQuote:    "1200.50",
        ExecutionScore: 78.2,
    }, nil
}

func (stubExecutionService) GetFills(context.Context, execution.FillsQuery) (*execution.FillPage, error) {
    return &execution.FillPage{PoolID: "pool-1", Window: "1h", Count: 1, NextCursor: "next_1", Fills: []execution.Fill{{TxDigest: "tx1", EventSeq: 1, Price: "1.2", QuoteSize: "50"}}}, nil
}

func (stubExecutionService) GetLifecycle(context.Context, execution.LifecycleQuery) (*execution.LifecyclePage, error) {
    return &execution.LifecyclePage{PoolID: "pool-1", Window: "1h", EventType: "order_placed", Count: 1, NextCursor: "next_2", Events: []execution.LifecycleEvent{{TxDigest: "tx2", EventSeq: 2, EventType: "order_placed"}}}, nil
}

func TestGetSummaryReturnsProductContract(t *testing.T) {
    t.Parallel()
    gin.SetMode(gin.TestMode)

    handler := executionapi.NewHandler(stubExecutionService{})
    router := gin.New()
    router.GET("/v1/execution/summaries", handler.GetSummary)

    req := httptest.NewRequest(http.MethodGet, "/v1/execution/summaries?poolId=pool-1&symbol=SUI/USDC&window=1h", nil)
    rec := httptest.NewRecorder()
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rec.Code)
    }

    var body execution.Summary
    if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
        t.Fatalf("unmarshal response: %v", err)
    }
    if body.PoolID != "pool-1" || body.ExecutionScore == 0 {
        t.Fatalf("unexpected summary payload: %+v", body)
    }
}

func TestGetFillsReturnsCursorContract(t *testing.T) {
    t.Parallel()
    gin.SetMode(gin.TestMode)

    handler := executionapi.NewHandler(stubExecutionService{})
    router := gin.New()
    router.GET("/v1/execution/fills", handler.GetFills)

    req := httptest.NewRequest(http.MethodGet, "/v1/execution/fills?poolId=pool-1&window=1h&limit=50&cursor=abc", nil)
    rec := httptest.NewRecorder()
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rec.Code)
    }

    var body execution.FillPage
    if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
        t.Fatalf("unmarshal response: %v", err)
    }
    if body.NextCursor == "" || body.Count != 1 {
        t.Fatalf("unexpected fills payload: %+v", body)
    }
}

func TestGetLifecycleReturnsCursorContract(t *testing.T) {
    t.Parallel()
    gin.SetMode(gin.TestMode)

    handler := executionapi.NewHandler(stubExecutionService{})
    router := gin.New()
    router.GET("/v1/execution/lifecycle", handler.GetLifecycle)

    req := httptest.NewRequest(http.MethodGet, "/v1/execution/lifecycle?poolId=pool-1&window=1h&eventType=order_placed&limit=50&cursor=abc", nil)
    rec := httptest.NewRecorder()
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rec.Code)
    }

    var body execution.LifecyclePage
    if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
        t.Fatalf("unmarshal response: %v", err)
    }
    if body.EventType != "order_placed" || body.Count != 1 {
        t.Fatalf("unexpected lifecycle payload: %+v", body)
    }
}
