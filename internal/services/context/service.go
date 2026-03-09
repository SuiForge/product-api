package context

import (
	stdctx "context"
	"errors"
	"strings"

	"product-api/internal/domain/execution"
)

var ErrPoolIDRequired = errors.New("poolId is required")

type SummaryQuery = execution.SummaryQuery
type FillsQuery = execution.FillsQuery
type LifecycleQuery = execution.LifecycleQuery

type UpstreamSummary struct {
	PoolID         string  `json:"pool_id"`
	Window         string  `json:"window"`
	Trades         int64   `json:"trades"`
	VolumeQuote    string  `json:"volume_quote"`
	ExecutionScore float64 `json:"execution_score"`
}

type UpstreamFill struct {
	TxDigest  string `json:"tx_digest"`
	EventSeq  int32  `json:"event_seq"`
	Price     string `json:"price"`
	QuoteSize string `json:"quote_size"`
}

type UpstreamFillPage struct {
	PoolID     string         `json:"pool_id"`
	Window     string         `json:"window"`
	Count      int            `json:"count"`
	NextCursor string         `json:"next_cursor"`
	Fills      []UpstreamFill `json:"fills"`
}

type UpstreamLifecycleEvent struct {
	TxDigest  string `json:"tx_digest"`
	EventSeq  int32  `json:"event_seq"`
	EventType string `json:"event_type"`
}

type UpstreamLifecyclePage struct {
	PoolID     string                   `json:"pool_id"`
	Window     string                   `json:"window"`
	EventType  string                   `json:"event_type"`
	Count      int                      `json:"count"`
	NextCursor string                   `json:"next_cursor"`
	Events     []UpstreamLifecycleEvent `json:"events"`
}

type Client interface {
	GetExecutionSummary(stdctx.Context, string, string) (*UpstreamSummary, error)
	GetExecutionFills(stdctx.Context, string, string, int, string) (*UpstreamFillPage, error)
	GetExecutionLifecycle(stdctx.Context, string, string, string, int, string) (*UpstreamLifecyclePage, error)
}

type Service struct {
	client Client
}

func NewService(client Client) *Service {
	return &Service{client: client}
}

func (s *Service) GetSummary(ctx stdctx.Context, query SummaryQuery) (*execution.Summary, error) {
	if err := validatePoolID(query.PoolID); err != nil {
		return nil, err
	}

	resp, err := s.client.GetExecutionSummary(ctx, strings.TrimSpace(query.PoolID), normalizeWindow(query.Window))
	if err != nil {
		return nil, err
	}

	return &execution.Summary{
		PoolID:         resp.PoolID,
		Symbol:         query.Symbol,
		Window:         resp.Window,
		Trades:         resp.Trades,
		VolumeQuote:    resp.VolumeQuote,
		ExecutionScore: resp.ExecutionScore,
	}, nil
}

func (s *Service) GetFills(ctx stdctx.Context, query FillsQuery) (*execution.FillPage, error) {
	if err := validatePoolID(query.PoolID); err != nil {
		return nil, err
	}

	resp, err := s.client.GetExecutionFills(ctx, strings.TrimSpace(query.PoolID), normalizeWindow(query.Window), normalizeLimit(query.Limit), query.Cursor)
	if err != nil {
		return nil, err
	}

	fills := make([]execution.Fill, 0, len(resp.Fills))
	for _, fill := range resp.Fills {
		fills = append(fills, execution.Fill{
			TxDigest:  fill.TxDigest,
			EventSeq:  fill.EventSeq,
			Price:     fill.Price,
			QuoteSize: fill.QuoteSize,
		})
	}

	return &execution.FillPage{
		PoolID:     resp.PoolID,
		Window:     resp.Window,
		Count:      resp.Count,
		NextCursor: resp.NextCursor,
		Fills:      fills,
	}, nil
}

func (s *Service) GetLifecycle(ctx stdctx.Context, query LifecycleQuery) (*execution.LifecyclePage, error) {
	if err := validatePoolID(query.PoolID); err != nil {
		return nil, err
	}

	resp, err := s.client.GetExecutionLifecycle(ctx, strings.TrimSpace(query.PoolID), normalizeWindow(query.Window), query.EventType, normalizeLimit(query.Limit), query.Cursor)
	if err != nil {
		return nil, err
	}

	events := make([]execution.LifecycleEvent, 0, len(resp.Events))
	for _, event := range resp.Events {
		events = append(events, execution.LifecycleEvent{
			TxDigest:  event.TxDigest,
			EventSeq:  event.EventSeq,
			EventType: event.EventType,
		})
	}

	return &execution.LifecyclePage{
		PoolID:     resp.PoolID,
		Window:     resp.Window,
		EventType:  resp.EventType,
		Count:      resp.Count,
		NextCursor: resp.NextCursor,
		Events:     events,
	}, nil
}

func validatePoolID(poolID string) error {
	if strings.TrimSpace(poolID) == "" {
		return ErrPoolIDRequired
	}
	return nil
}

func normalizeWindow(window string) string {
	if strings.TrimSpace(window) == "" {
		return "1h"
	}
	return window
}

func normalizeLimit(limit int) int {
	if limit <= 0 {
		return 100
	}
	return limit
}
