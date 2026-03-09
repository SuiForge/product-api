package deepbook_test

import (
    "context"
    "net/http"
    "net/http/httptest"
    "testing"
    "time"

    "product-api/internal/adapters/deepbook"
)

func TestClientMapsExecutionEndpoints(t *testing.T) {
    t.Parallel()

    srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        switch r.URL.Path {
        case "/v1/deepbook/pools/pool-1/execution/summary":
            w.Header().Set("Content-Type", "application/json")
            _, _ = w.Write([]byte(`{"pool_id":"pool-1","window":"1h","trades":12,"volume_quote":"1200.50","execution_score":78.2}`))
        case "/v1/deepbook/pools/pool-1/execution/fills":
            w.Header().Set("Content-Type", "application/json")
            _, _ = w.Write([]byte(`{"pool_id":"pool-1","window":"1h","count":1,"next_cursor":"next_1","fills":[{"tx_digest":"tx1","event_seq":1,"price":"1.2","quote_size":"50"}]}`))
        case "/v1/deepbook/pools/pool-1/execution/lifecycle":
            w.Header().Set("Content-Type", "application/json")
            _, _ = w.Write([]byte(`{"pool_id":"pool-1","window":"1h","event_type":"order_placed","count":1,"next_cursor":"next_2","events":[{"tx_digest":"tx2","event_seq":2,"event_type":"order_placed"}]}`))
        default:
            http.NotFound(w, r)
        }
    }))
    defer srv.Close()

    client := deepbook.NewClient(srv.URL, "", 2*time.Second)

    summary, err := client.GetExecutionSummary(context.Background(), "pool-1", "1h")
    if err != nil {
        t.Fatalf("GetExecutionSummary error: %v", err)
    }
    if summary.PoolID != "pool-1" || summary.ExecutionScore != 78.2 {
        t.Fatalf("unexpected summary: %+v", summary)
    }

    fills, err := client.GetExecutionFills(context.Background(), "pool-1", "1h", 50, "")
    if err != nil {
        t.Fatalf("GetExecutionFills error: %v", err)
    }
    if fills.NextCursor != "next_1" || len(fills.Fills) != 1 {
        t.Fatalf("unexpected fills: %+v", fills)
    }

    lifecycle, err := client.GetExecutionLifecycle(context.Background(), "pool-1", "1h", "order_placed", 50, "")
    if err != nil {
        t.Fatalf("GetExecutionLifecycle error: %v", err)
    }
    if lifecycle.EventType != "order_placed" || len(lifecycle.Events) != 1 {
        t.Fatalf("unexpected lifecycle: %+v", lifecycle)
    }
}

func TestClientHandlesNullableExecutionScore(t *testing.T) {
    t.Parallel()

    srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/v1/deepbook/pools/pool-1/execution/summary" {
            http.NotFound(w, r)
            return
        }
        w.Header().Set("Content-Type", "application/json")
        _, _ = w.Write([]byte(`{"pool_id":"pool-1","window":"1h","trades":12,"volume_quote":"1200.50","execution_score":null}`))
    }))
    defer srv.Close()

    client := deepbook.NewClient(srv.URL, "", 2*time.Second)
    summary, err := client.GetExecutionSummary(context.Background(), "pool-1", "1h")
    if err != nil {
        t.Fatalf("GetExecutionSummary error: %v", err)
    }
    if summary.ExecutionScore != 0 {
        t.Fatalf("expected zero execution score, got %+v", summary)
    }
}
