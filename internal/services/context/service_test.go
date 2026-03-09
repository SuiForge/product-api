package context_test

import (
    "context"
    "errors"
    "testing"

    svc "product-api/internal/services/context"
)

type stubClient struct{}

func (stubClient) GetExecutionSummary(context.Context, string, string) (*svc.UpstreamSummary, error) {
    return &svc.UpstreamSummary{PoolID: "pool-1", Window: "1h", Trades: 12, VolumeQuote: "1200.50", ExecutionScore: 78.2}, nil
}
func (stubClient) GetExecutionFills(context.Context, string, string, int, string) (*svc.UpstreamFillPage, error) {
    return &svc.UpstreamFillPage{PoolID: "pool-1", Window: "1h", Count: 1, NextCursor: "n1", Fills: []svc.UpstreamFill{{TxDigest: "tx1", EventSeq: 1, Price: "1.2", QuoteSize: "50"}}}, nil
}
func (stubClient) GetExecutionLifecycle(context.Context, string, string, string, int, string) (*svc.UpstreamLifecyclePage, error) {
    return &svc.UpstreamLifecyclePage{PoolID: "pool-1", Window: "1h", EventType: "order_placed", Count: 1, NextCursor: "n2", Events: []svc.UpstreamLifecycleEvent{{TxDigest: "tx2", EventSeq: 2, EventType: "order_placed"}}}, nil
}

func TestServiceMapsUpstreamToProductExecution(t *testing.T) {
    t.Parallel()

    service := svc.NewService(stubClient{})

    summary, err := service.GetSummary(context.Background(), svc.SummaryQuery{PoolID: "pool-1", Symbol: "SUI/USDC", Window: "1h"})
    if err != nil {
        t.Fatalf("GetSummary error: %v", err)
    }
    if summary.Symbol != "SUI/USDC" || summary.ExecutionScore != 78.2 {
        t.Fatalf("unexpected summary: %+v", summary)
    }

    fills, err := service.GetFills(context.Background(), svc.FillsQuery{PoolID: "pool-1", Window: "1h", Limit: 50})
    if err != nil {
        t.Fatalf("GetFills error: %v", err)
    }
    if fills.NextCursor != "n1" || len(fills.Fills) != 1 {
        t.Fatalf("unexpected fills: %+v", fills)
    }

    lifecycle, err := service.GetLifecycle(context.Background(), svc.LifecycleQuery{PoolID: "pool-1", Window: "1h", EventType: "order_placed", Limit: 50})
    if err != nil {
        t.Fatalf("GetLifecycle error: %v", err)
    }
    if lifecycle.EventType != "order_placed" || len(lifecycle.Events) != 1 {
        t.Fatalf("unexpected lifecycle: %+v", lifecycle)
    }
}

func TestServiceRejectsMissingPoolID(t *testing.T) {
    t.Parallel()

    service := svc.NewService(stubClient{})
    _, err := service.GetSummary(context.Background(), svc.SummaryQuery{Window: "1h"})
    if !errors.Is(err, svc.ErrPoolIDRequired) {
        t.Fatalf("expected ErrPoolIDRequired, got %v", err)
    }
}
