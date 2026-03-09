package alerting

import (
	"bytes"
	stdctx "context"
	"crypto/hmac"
	"crypto/sha1"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	domain "product-api/internal/domain/alerts"
	"product-api/internal/identity"
	statestore "product-api/internal/services/state"
)

var ErrUnsupportedDestinationType = errors.New("unsupported destination type")
var ErrWalletIdentityRequired = errors.New("wallet identity required")

type UpstreamAlert struct {
	Type         string `json:"type"`
	TxDigest     string `json:"tx_digest"`
	Address      string `json:"address"`
	Counterparty string `json:"counterparty"`
	Amount       int64  `json:"amount"`
	TimestampMS  int64  `json:"timestamp_ms"`
	Severity     string `json:"severity"`
}

type UpstreamAlertPage struct {
	Count  int             `json:"count"`
	Alerts []UpstreamAlert `json:"alerts"`
}

type UpstreamWebhookConfig struct {
	Address       string   `json:"address"`
	WebhookURL    string   `json:"webhook_url"`
	WebhookSecret string   `json:"webhook_secret"`
	EventTypes    []string `json:"event_types"`
	IsActive      bool     `json:"is_active"`
}

type Client interface {
	ListAnomalyAlerts(stdctx.Context, string, int) (*UpstreamAlertPage, error)
	UpsertWebhookConfig(stdctx.Context, string, string, []string) (*UpstreamWebhookConfig, error)
}

type Service struct {
	client Client
	store  *statestore.Store
}

func NewService(client Client, stores ...*statestore.Store) *Service {
	service := &Service{client: client}
	if len(stores) > 0 {
		service.store = stores[0]
	}
	return service
}

func (s *Service) List(ctx stdctx.Context, query domain.ListQuery) (*domain.AlertPage, error) {
	page, err := s.client.ListAnomalyAlerts(ctx, strings.TrimSpace(query.Severity), 50)
	if err != nil {
		return nil, err
	}

	alerts := make([]domain.Alert, 0, len(page.Alerts))
	for _, alert := range page.Alerts {
		alerts = append(alerts, domain.Alert{
			ID:         buildAlertID(alert),
			Type:       normalizeType(alert.Type),
			Severity:   normalizeSeverity(alert.Severity),
			Source:     "vertical-index-api",
			Timestamp:  alert.TimestampMS,
			EvidenceID: strings.TrimSpace(alert.TxDigest),
		})
	}

	return &domain.AlertPage{Count: page.Count, Alerts: alerts}, nil
}

func (s *Service) ListDestinations(_ stdctx.Context) (*domain.DestinationPage, error) {
	if s.store == nil {
		return &domain.DestinationPage{Count: 0, Destinations: []domain.Destination{}}, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	items := append([]domain.Destination(nil), snapshot.Destinations...)
	return &domain.DestinationPage{Count: len(items), Destinations: items}, nil
}

func (s *Service) ListDeliveries(_ stdctx.Context) (*domain.DeliveryPage, error) {
	if s.store == nil {
		return &domain.DeliveryPage{Count: 0, Deliveries: []domain.DeliveryAttempt{}}, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	items := append([]domain.DeliveryAttempt(nil), snapshot.Deliveries...)
	return &domain.DeliveryPage{Count: len(items), Deliveries: items}, nil
}

func (s *Service) CreateDestination(ctx stdctx.Context, req domain.CreateDestinationRequest) (*domain.Destination, error) {
	if !strings.EqualFold(strings.TrimSpace(req.Type), "webhook") {
		return nil, ErrUnsupportedDestinationType
	}
	subject, ok := identity.FromContext(ctx)
	if !ok || !identity.ValidateWalletAddress(subject.WalletAddress) {
		return nil, ErrWalletIdentityRequired
	}
	eventTypes := req.EventTypes
	if len(eventTypes) == 0 {
		eventTypes = []string{"risk_alert", "whale_alert"}
	}

	cfg, err := s.client.UpsertWebhookConfig(ctx, subject.WalletAddress, strings.TrimSpace(req.Target), eventTypes)
	if err != nil {
		return nil, err
	}

	status := "inactive"
	if cfg.IsActive {
		status = "active"
	}

	destination := &domain.Destination{
		ID:                 buildDestinationID(cfg.Address, cfg.WebhookURL),
		Type:               "webhook",
		Target:             cfg.WebhookURL,
		Status:             status,
		EventTypes:         cfg.EventTypes,
		WebhookSecret:      cfg.WebhookSecret,
		SignatureHeader:    "X-SuiIndexer-Signature",
		TimestampHeader:    "X-SuiIndexer-Timestamp",
		SignatureAlgorithm: "hmac-sha256",
	}
	if s.store != nil {
		if _, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
			snapshot.Destinations = upsertDestination(snapshot.Destinations, *destination)
			return nil
		}); err != nil {
			return nil, err
		}
	}
	return destination, nil
}

func (s *Service) TestDestination(ctx stdctx.Context, req domain.TestDestinationRequest) (*domain.TestDeliveryResult, error) {
	result, _, err := s.performDelivery(ctx, deliveryExecutionRequest{
		DestinationID: req.DestinationID,
		Target:        req.Target,
		Secret:        req.Secret,
		EventType:     req.EventType,
		Payload:       req.Payload,
	})
	return result, err
}

func (s *Service) RetryDelivery(ctx stdctx.Context, deliveryID string) (*domain.TestDeliveryResult, error) {
	if s.store == nil {
		return nil, fmt.Errorf("delivery history unavailable")
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	attempt, ok := findDelivery(snapshot.Deliveries, deliveryID)
	if !ok {
		return nil, fmt.Errorf("delivery not found")
	}
	destination, ok := findDestination(snapshot.Destinations, attempt.DestinationID)
	if !ok {
		return nil, fmt.Errorf("destination not found")
	}
	result, _, err := s.performDelivery(ctx, deliveryExecutionRequest{
		DestinationID: attempt.DestinationID,
		Target:        attempt.Target,
		Secret:        destination.WebhookSecret,
		EventType:     attempt.EventType,
		Payload:       attempt.Payload,
		RetryOf:       attempt.ID,
	})
	return result, err
}

func (s *Service) performDelivery(ctx stdctx.Context, req deliveryExecutionRequest) (*domain.TestDeliveryResult, *domain.DeliveryAttempt, error) {
	payload := req.Payload
	if payload == nil {
		payload = map[string]any{}
	}
	eventType := strings.TrimSpace(req.EventType)
	if eventType == "" {
		eventType = "risk_alert"
	}
	rawBody, err := json.Marshal(payload)
	if err != nil {
		return nil, nil, err
	}
	timestamp := fmt.Sprintf("%d", time.Now().UTC().Unix())
	signature := signWebhook(strings.TrimSpace(req.Secret), timestamp, rawBody)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, strings.TrimSpace(req.Target), bytes.NewReader(rawBody))
	if err != nil {
		return nil, nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-SuiIndexer-Event", eventType)
	httpReq.Header.Set("X-SuiIndexer-Timestamp", timestamp)
	httpReq.Header.Set("X-SuiIndexer-Signature", signature)

	resp, err := (&http.Client{Timeout: 5 * time.Second}).Do(httpReq)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()
	responseBody, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))

	result := &domain.TestDeliveryResult{
		Delivered:       resp.StatusCode < http.StatusBadRequest,
		StatusCode:      resp.StatusCode,
		Target:          strings.TrimSpace(req.Target),
		EventType:       eventType,
		SignatureHeader: "X-SuiIndexer-Signature",
		TimestampHeader: "X-SuiIndexer-Timestamp",
		Timestamp:       timestamp,
		Signature:       signature,
		ResponseBody:    strings.TrimSpace(string(responseBody)),
	}
	attempt := buildDeliveryAttempt(req, result)
	if s.store != nil {
		if _, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
			snapshot.Deliveries = append([]domain.DeliveryAttempt{attempt}, snapshot.Deliveries...)
			return nil
		}); err != nil {
			return nil, nil, err
		}
	}
	return result, &attempt, nil
}

func signWebhook(secret string, timestamp string, rawBody []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(fmt.Sprintf("%s.", timestamp)))
	mac.Write(rawBody)
	return hex.EncodeToString(mac.Sum(nil))
}

func buildAlertID(alert UpstreamAlert) string {
	if strings.TrimSpace(alert.TxDigest) != "" {
		return "alt_" + strings.TrimSpace(alert.TxDigest)
	}
	return buildDestinationID(alert.Type, fmt.Sprintf("%d", alert.TimestampMS))
}

func buildDestinationID(parts ...string) string {
	joined := strings.Join(parts, "|")
	sum := sha1.Sum([]byte(joined))
	return "dst_" + hex.EncodeToString(sum[:])[:12]
}

func normalizeType(value string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return "anomaly"
	}
	return trimmed
}

func normalizeSeverity(value string) string {
	trimmed := strings.ToLower(strings.TrimSpace(value))
	if trimmed == "" {
		return "medium"
	}
	return trimmed
}

func upsertDestination(items []domain.Destination, next domain.Destination) []domain.Destination {
	updated := append([]domain.Destination(nil), items...)
	for index, item := range updated {
		if item.ID == next.ID {
			updated[index] = next
			return updated
		}
	}
	return append(updated, next)
}

type deliveryExecutionRequest struct {
	DestinationID string
	Target        string
	Secret        string
	EventType     string
	Payload       map[string]any
	RetryOf       string
}

func buildDeliveryAttempt(req deliveryExecutionRequest, result *domain.TestDeliveryResult) domain.DeliveryAttempt {
	status := "failed"
	if result != nil && result.Delivered {
		status = "delivered"
	}
	return domain.DeliveryAttempt{
		ID:              buildDestinationID(req.DestinationID, req.Target, req.EventType, fmt.Sprintf("%d", time.Now().UnixNano())),
		DestinationID:   strings.TrimSpace(req.DestinationID),
		Target:          strings.TrimSpace(req.Target),
		EventType:       strings.TrimSpace(req.EventType),
		Delivered:       result != nil && result.Delivered,
		Status:          status,
		StatusCode:      result.StatusCode,
		SignatureHeader: result.SignatureHeader,
		TimestampHeader: result.TimestampHeader,
		Timestamp:       result.Timestamp,
		Signature:       result.Signature,
		ResponseBody:    result.ResponseBody,
		Payload:         clonePayload(req.Payload),
		SentAt:          time.Now().UTC().Unix(),
		RetryOf:         strings.TrimSpace(req.RetryOf),
	}
}

func clonePayload(payload map[string]any) map[string]any {
	if payload == nil {
		return nil
	}
	cloned := make(map[string]any, len(payload))
	for key, value := range payload {
		cloned[key] = value
	}
	return cloned
}

func findDestination(items []domain.Destination, id string) (domain.Destination, bool) {
	for _, item := range items {
		if item.ID == id {
			return item, true
		}
	}
	return domain.Destination{}, false
}

func findDelivery(items []domain.DeliveryAttempt, id string) (domain.DeliveryAttempt, bool) {
	for _, item := range items {
		if item.ID == id {
			return item, true
		}
	}
	return domain.DeliveryAttempt{}, false
}
