package demo

import (
	stdctx "context"
	"crypto/hmac"
	"crypto/rand"
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

	"product-api/internal/domain/alerts"
	"product-api/internal/domain/execution"
	"product-api/internal/domain/tenant"
	"product-api/internal/identity"
	statestore "product-api/internal/services/state"
	tenantservice "product-api/internal/services/tenant"
)

type ExecutionService struct{}

func NewExecutionService() *ExecutionService {
	return &ExecutionService{}
}

func (s *ExecutionService) GetSummary(_ stdctx.Context, query execution.SummaryQuery) (*execution.Summary, error) {
	poolID := strings.TrimSpace(query.PoolID)
	if poolID == "" {
		poolID = "pool-demo-1"
	}
	window := strings.TrimSpace(query.Window)
	if window == "" {
		window = "1h"
	}
	symbol := strings.TrimSpace(query.Symbol)
	if symbol == "" {
		symbol = "SUI/USDC"
	}
	return &execution.Summary{
		PoolID:         poolID,
		Symbol:         symbol,
		Window:         window,
		Trades:         128,
		VolumeQuote:    "48210.55",
		ExecutionScore: 84.6,
	}, nil
}

func (s *ExecutionService) GetFills(_ stdctx.Context, query execution.FillsQuery) (*execution.FillPage, error) {
	poolID := strings.TrimSpace(query.PoolID)
	if poolID == "" {
		poolID = "pool-demo-1"
	}
	window := strings.TrimSpace(query.Window)
	if window == "" {
		window = "1h"
	}
	return &execution.FillPage{
		PoolID:     poolID,
		Window:     window,
		Count:      2,
		NextCursor: "demo_fill_cursor_2",
		Fills: []execution.Fill{
			{TxDigest: "tx_demo_fill_1", EventSeq: 1, Price: "1.2301", QuoteSize: "420.00"},
			{TxDigest: "tx_demo_fill_2", EventSeq: 2, Price: "1.2310", QuoteSize: "615.00"},
		},
	}, nil
}

func (s *ExecutionService) GetLifecycle(_ stdctx.Context, query execution.LifecycleQuery) (*execution.LifecyclePage, error) {
	poolID := strings.TrimSpace(query.PoolID)
	if poolID == "" {
		poolID = "pool-demo-1"
	}
	window := strings.TrimSpace(query.Window)
	if window == "" {
		window = "1h"
	}
	eventType := strings.TrimSpace(query.EventType)
	if eventType == "" {
		eventType = "order_placed"
	}
	return &execution.LifecyclePage{
		PoolID:     poolID,
		Window:     window,
		EventType:  eventType,
		Count:      2,
		NextCursor: "demo_lifecycle_cursor_2",
		Events: []execution.LifecycleEvent{
			{TxDigest: "tx_demo_lifecycle_1", EventSeq: 10, EventType: eventType},
			{TxDigest: "tx_demo_lifecycle_2", EventSeq: 11, EventType: eventType},
		},
	}, nil
}

type AlertsService struct {
	store *statestore.Store
}

func NewAlertsService(stores ...*statestore.Store) *AlertsService {
	service := &AlertsService{}
	if len(stores) > 0 {
		service.store = stores[0]
	}
	return service
}

func (s *AlertsService) List(_ stdctx.Context, query alerts.ListQuery) (*alerts.AlertPage, error) {
	return &alerts.AlertPage{
		Count: 2,
		Alerts: []alerts.Alert{
			{ID: "alt_demo_1", Type: "execution.risk", Severity: pickSeverity(query.Severity, "high"), Source: "demo-feed", Timestamp: time.Now().Add(-2 * time.Minute).UnixMilli(), EvidenceID: "evd_demo_123"},
			{ID: "alt_demo_2", Type: "whale.alert", Severity: pickSeverity(query.Severity, "medium"), Source: "demo-feed", Timestamp: time.Now().Add(-8 * time.Minute).UnixMilli(), EvidenceID: "tx_demo_whale_1"},
		},
	}, nil
}

func (s *AlertsService) ListDestinations(_ stdctx.Context) (*alerts.DestinationPage, error) {
	if s.store == nil {
		return &alerts.DestinationPage{Count: 0, Destinations: []alerts.Destination{}}, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	items := append([]alerts.Destination(nil), snapshot.Destinations...)
	return &alerts.DestinationPage{Count: len(items), Destinations: items}, nil
}

func (s *AlertsService) ListDeliveries(_ stdctx.Context) (*alerts.DeliveryPage, error) {
	if s.store == nil {
		return &alerts.DeliveryPage{Count: 0, Deliveries: []alerts.DeliveryAttempt{}}, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	items := append([]alerts.DeliveryAttempt(nil), snapshot.Deliveries...)
	return &alerts.DeliveryPage{Count: len(items), Deliveries: items}, nil
}

func (s *AlertsService) CreateDestination(_ stdctx.Context, req alerts.CreateDestinationRequest) (*alerts.Destination, error) {
	destination := alerts.Destination{
		ID:                 hashID("dst", req.ProjectID, req.Type, req.Target),
		Type:               defaultString(req.Type, "webhook"),
		Target:             defaultString(req.Target, "https://example.com/hook"),
		Status:             "active",
		EventTypes:         defaultEventTypes(req.EventTypes),
		WebhookSecret:      "sec_demo_123",
		SignatureHeader:    "X-SuiIndexer-Signature",
		TimestampHeader:    "X-SuiIndexer-Timestamp",
		SignatureAlgorithm: "hmac-sha256",
	}
	if s.store != nil {
		if _, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
			snapshot.Destinations = upsertDestination(snapshot.Destinations, destination)
			return nil
		}); err != nil {
			return nil, err
		}
	}
	return &destination, nil
}

func (s *AlertsService) TestDestination(ctx stdctx.Context, req alerts.TestDestinationRequest) (*alerts.TestDeliveryResult, error) {
	payload := req.Payload
	if payload == nil {
		payload = map[string]any{"mode": "demo"}
	}
	result, _, err := s.performDelivery(ctx, deliveryExecutionRequest{
		DestinationID: req.DestinationID,
		Target:        req.Target,
		Secret:        defaultString(req.Secret, "sec_demo_123"),
		EventType:     defaultString(req.EventType, "risk_alert"),
		Payload:       payload,
	})
	return result, err
}

func (s *AlertsService) RetryDelivery(ctx stdctx.Context, deliveryID string) (*alerts.TestDeliveryResult, error) {
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
		Secret:        defaultString(destination.WebhookSecret, "sec_demo_123"),
		EventType:     defaultString(attempt.EventType, "risk_alert"),
		Payload:       attempt.Payload,
		RetryOf:       attempt.ID,
	})
	return result, err
}

func (s *AlertsService) performDelivery(ctx stdctx.Context, req deliveryExecutionRequest) (*alerts.TestDeliveryResult, *alerts.DeliveryAttempt, error) {
	payload := req.Payload
	if payload == nil {
		payload = map[string]any{"mode": "demo"}
	}
	rawBody, err := json.Marshal(payload)
	if err != nil {
		return nil, nil, err
	}
	timestamp := fmt.Sprintf("%d", time.Now().UTC().Unix())
	target := defaultString(req.Target, "https://example.com/hook")
	eventType := defaultString(req.EventType, "risk_alert")
	mac := hmac.New(sha256.New, []byte(defaultString(req.Secret, "sec_demo_123")))
	mac.Write([]byte(fmt.Sprintf("%s.", timestamp)))
	mac.Write(rawBody)
	signature := hex.EncodeToString(mac.Sum(nil))
	result := &alerts.TestDeliveryResult{Delivered: true, StatusCode: http.StatusOK, Target: target, EventType: eventType, SignatureHeader: "X-SuiIndexer-Signature", TimestampHeader: "X-SuiIndexer-Timestamp", Timestamp: timestamp, Signature: signature, ResponseBody: `{"mode":"demo"}`}
	if strings.HasPrefix(target, "http") {
		httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, target, strings.NewReader(string(rawBody)))
		if err == nil {
			httpReq.Header.Set("Content-Type", "application/json")
			httpReq.Header.Set("X-SuiIndexer-Event", eventType)
			httpReq.Header.Set("X-SuiIndexer-Timestamp", timestamp)
			httpReq.Header.Set("X-SuiIndexer-Signature", signature)
			resp, err := (&http.Client{Timeout: 5 * time.Second}).Do(httpReq)
			if err == nil {
				defer resp.Body.Close()
				body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
				result = &alerts.TestDeliveryResult{Delivered: resp.StatusCode < http.StatusBadRequest, StatusCode: resp.StatusCode, Target: target, EventType: eventType, SignatureHeader: "X-SuiIndexer-Signature", TimestampHeader: "X-SuiIndexer-Timestamp", Timestamp: timestamp, Signature: signature, ResponseBody: string(body)}
			}
		}
	}
	attempt := buildDeliveryAttempt(req, result)
	if s.store != nil {
		if _, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
			snapshot.Deliveries = append([]alerts.DeliveryAttempt{attempt}, snapshot.Deliveries...)
			return nil
		}); err != nil {
			return nil, nil, err
		}
	}
	return result, &attempt, nil
}

type TenantService struct {
	store *statestore.Store
}

func NewTenantService(stores ...*statestore.Store) *TenantService {
	service := &TenantService{}
	if len(stores) > 0 {
		service.store = stores[0]
	}
	return service
}

func (s *TenantService) GetCurrent(ctx stdctx.Context) (*tenant.Project, error) {
	workspaceName := "Alpha Desk"
	plan := "design_partner"
	projectID := "proj_demo_alpha"
	if subject, ok := identity.FromContext(ctx); ok {
		if strings.TrimSpace(subject.WorkspaceName) != "" {
			workspaceName = strings.TrimSpace(subject.WorkspaceName)
		}
		if identity.ValidateWalletAddress(subject.WalletAddress) {
			projectID = strings.TrimSpace(subject.WalletAddress)
		}
		if strings.TrimSpace(subject.PlanTier) != "" {
			plan = strings.TrimSpace(subject.PlanTier)
		}
	}
	return &tenant.Project{
		ID:   projectID,
		Name: workspaceName,
		Plan: plan,
		Usage: tenant.UsageSnapshot{
			Requests: 1248,
			Alerts:   12,
		},
	}, nil
}

func (s *TenantService) GetUsage(_ stdctx.Context) (*tenant.UsageSnapshot, error) {
	return &tenant.UsageSnapshot{Requests: 1248, Alerts: 12}, nil
}

func (s *TenantService) ListAPIKeys(_ stdctx.Context) (*tenant.APIKeyPage, error) {
	if s.store == nil {
		return &tenant.APIKeyPage{Count: 0, APIKeys: []tenant.APIKey{}}, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	items := make([]tenant.APIKey, 0, len(snapshot.APIKeys))
	for _, item := range snapshot.APIKeys {
		items = append(items, sanitizeAPIKey(item))
	}
	return &tenant.APIKeyPage{Count: len(items), APIKeys: items}, nil
}

func (s *TenantService) CreateAPIKey(ctx stdctx.Context, req tenant.CreateAPIKeyRequest) (*tenant.APIKey, error) {
	subject, ok := identity.FromContext(ctx)
	if !ok || !identity.ValidateWalletAddress(subject.WalletAddress) {
		return nil, tenantservice.ErrWalletIdentityRequired
	}
	name := defaultString(req.Name, "demo-operator")
	planTier := defaultString(subject.PlanTier, "design_partner")
	token, err := generateDemoToken()
	if err != nil {
		return nil, err
	}
	key := tenant.APIKey{
		ID:            hashID("key", subject.WalletAddress, name, fmt.Sprintf("%d", time.Now().UnixNano())),
		Name:          name,
		Token:         token,
		TokenPreview:  previewToken(token),
		WalletAddress: strings.TrimSpace(subject.WalletAddress),
		PlanTier:      planTier,
		ExpiresAt:     time.Now().Add(30 * 24 * time.Hour).UTC().Format(time.RFC3339),
		Message:       "Store this API key securely. It will not be shown again.",
		CreatedAt:     time.Now().UTC().Unix(),
	}
	if s.store != nil {
		if _, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
			snapshot.APIKeys = append([]tenant.APIKey{key}, snapshot.APIKeys...)
			return nil
		}); err != nil {
			return nil, err
		}
	}
	return &key, nil
}

func (s *TenantService) ValidateAPIKey(_ stdctx.Context, rawKey string) (*identity.Identity, error) {
	if s.store == nil {
		return nil, errors.New("api key not found")
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	token := strings.TrimSpace(rawKey)
	for _, item := range snapshot.APIKeys {
		if strings.TrimSpace(item.Token) != token {
			continue
		}
		planTier := defaultString(item.PlanTier, "design_partner")
		walletAddress := strings.TrimSpace(item.WalletAddress)
		return &identity.Identity{
			AuthMethod:    "api_key",
			WalletAddress: walletAddress,
			WorkspaceName: workspaceName(walletAddress),
			OperatorName:  "API Key User",
			PlanTier:      planTier,
			APIKeyPreview: previewToken(token),
		}, nil
	}
	return nil, errors.New("api key not found")
}

func generateDemoToken() (string, error) {
	buffer := make([]byte, 12)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	return "sk_live_" + hex.EncodeToString(buffer), nil
}

func sanitizeAPIKey(item tenant.APIKey) tenant.APIKey {
	item.Token = ""
	item.Message = ""
	return item
}

func workspaceName(wallet string) string {
	trimmed := strings.TrimSpace(wallet)
	if trimmed == "" {
		return "Workspace"
	}
	if len(trimmed) <= 10 {
		return trimmed
	}
	return trimmed[:6] + "..." + trimmed[len(trimmed)-4:]
}

func previewToken(token string) string {
	trimmed := strings.TrimSpace(token)
	if trimmed == "" {
		return ""
	}
	if len(trimmed) <= 8 {
		return trimmed
	}
	return trimmed[:8] + "***"
}

func hashID(prefix string, parts ...string) string {
	sum := sha1.Sum([]byte(strings.Join(parts, "|")))
	return prefix + "_" + hex.EncodeToString(sum[:])[:12]
}

func defaultString(value string, fallback string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return fallback
	}
	return trimmed
}

func defaultEventTypes(values []string) []string {
	if len(values) > 0 {
		return append([]string(nil), values...)
	}
	return []string{"risk_alert", "whale_alert"}
}

func pickSeverity(value string, fallback string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return fallback
	}
	return trimmed
}

func upsertDestination(items []alerts.Destination, next alerts.Destination) []alerts.Destination {
	updated := append([]alerts.Destination(nil), items...)
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

func buildDeliveryAttempt(req deliveryExecutionRequest, result *alerts.TestDeliveryResult) alerts.DeliveryAttempt {
	status := "failed"
	if result != nil && result.Delivered {
		status = "delivered"
	}
	return alerts.DeliveryAttempt{
		ID:              hashID("dlv", req.DestinationID, req.Target, req.EventType, fmt.Sprintf("%d", time.Now().UnixNano())),
		DestinationID:   req.DestinationID,
		Target:          defaultString(req.Target, "https://example.com/hook"),
		EventType:       defaultString(req.EventType, "risk_alert"),
		Delivered:       result != nil && result.Delivered,
		Status:          status,
		StatusCode:      valueOrDefaultStatus(result),
		SignatureHeader: valueOrDefaultString(result, func(item *alerts.TestDeliveryResult) string { return item.SignatureHeader }, "X-SuiIndexer-Signature"),
		TimestampHeader: valueOrDefaultString(result, func(item *alerts.TestDeliveryResult) string { return item.TimestampHeader }, "X-SuiIndexer-Timestamp"),
		Timestamp:       valueOrDefaultString(result, func(item *alerts.TestDeliveryResult) string { return item.Timestamp }, ""),
		Signature:       valueOrDefaultString(result, func(item *alerts.TestDeliveryResult) string { return item.Signature }, ""),
		ResponseBody:    valueOrDefaultString(result, func(item *alerts.TestDeliveryResult) string { return item.ResponseBody }, ""),
		Payload:         clonePayload(req.Payload),
		SentAt:          time.Now().UTC().Unix(),
		RetryOf:         req.RetryOf,
	}
}

func valueOrDefaultStatus(result *alerts.TestDeliveryResult) int {
	if result == nil {
		return http.StatusInternalServerError
	}
	return result.StatusCode
}

func valueOrDefaultString(result *alerts.TestDeliveryResult, getter func(*alerts.TestDeliveryResult) string, fallback string) string {
	if result == nil {
		return fallback
	}
	value := getter(result)
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
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

func findDestination(items []alerts.Destination, id string) (alerts.Destination, bool) {
	for _, item := range items {
		if item.ID == id {
			return item, true
		}
	}
	return alerts.Destination{}, false
}

func findDelivery(items []alerts.DeliveryAttempt, id string) (alerts.DeliveryAttempt, bool) {
	for _, item := range items {
		if item.ID == id {
			return item, true
		}
	}
	return alerts.DeliveryAttempt{}, false
}
