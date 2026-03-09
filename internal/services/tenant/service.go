package tenant

import (
	stdctx "context"
	"errors"
	"strings"

	domain "product-api/internal/domain/tenant"
	"product-api/internal/identity"
	alertsvc "product-api/internal/services/alerting"
	statestore "product-api/internal/services/state"
)

var ErrWalletIdentityRequired = errors.New("wallet identity required")
var ErrAPIKeyAlreadyExists = errors.New("api key already exists for this wallet")

type UpstreamAlertPage = alertsvc.UpstreamAlertPage

type UpstreamSubscription struct {
	WalletAddress string `json:"wallet_address"`
	PlanTier      string `json:"plan_tier"`
	Status        string `json:"status"`
}

type UpstreamUsageDay struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type UpstreamAPIKeyResponse struct {
	APIKey        string `json:"api_key"`
	KeyHash       string `json:"key_hash"`
	OwnerName     string `json:"owner_name"`
	WalletAddress string `json:"wallet_address"`
	PlanTier      string `json:"plan_tier"`
	ExpiresAt     string `json:"expires_at"`
}

type Client interface {
	GetSubscriptionStatus(stdctx.Context) (*UpstreamSubscription, error)
	GetUsageStats(stdctx.Context) ([]UpstreamUsageDay, error)
	CreateAPIKey(stdctx.Context, string, string) (*UpstreamAPIKeyResponse, error)
	ValidateAPIKey(stdctx.Context, string) (*UpstreamSubscription, error)
	ListAnomalyAlerts(stdctx.Context, string, int) (*UpstreamAlertPage, error)
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

func (s *Service) GetCurrent(ctx stdctx.Context) (*domain.Project, error) {
	var wallet string
	var plan string
	if subject, ok := identity.FromContext(ctx); ok && strings.TrimSpace(subject.WalletAddress) != "" {
		wallet = strings.TrimSpace(subject.WalletAddress)
		plan = strings.TrimSpace(subject.PlanTier)
	} else {
		subscription, err := s.client.GetSubscriptionStatus(ctx)
		if err != nil {
			return nil, err
		}
		wallet = strings.TrimSpace(subscription.WalletAddress)
		plan = strings.TrimSpace(subscription.PlanTier)
	}

	usage, err := s.GetUsage(ctx)
	if err != nil {
		return nil, err
	}

	if plan == "" {
		plan = "free"
	}

	return &domain.Project{
		ID:    wallet,
		Name:  workspaceName(wallet),
		Plan:  plan,
		Usage: *usage,
	}, nil
}

func (s *Service) GetUsage(ctx stdctx.Context) (*domain.UsageSnapshot, error) {
	days, err := s.client.GetUsageStats(ctx)
	if err != nil {
		return nil, err
	}

	var requests int64
	for _, day := range days {
		requests += day.Count
	}

	alertsPage, err := s.client.ListAnomalyAlerts(ctx, "", 50)
	if err != nil {
		return nil, err
	}

	return &domain.UsageSnapshot{
		Requests: requests,
		Alerts:   int64(alertsPage.Count),
	}, nil
}

func (s *Service) ListAPIKeys(_ stdctx.Context) (*domain.APIKeyPage, error) {
	if s.store == nil {
		return &domain.APIKeyPage{Count: 0, APIKeys: []domain.APIKey{}}, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	items := make([]domain.APIKey, 0, len(snapshot.APIKeys))
	for _, item := range snapshot.APIKeys {
		item.Token = ""
		item.Message = ""
		items = append(items, item)
	}
	return &domain.APIKeyPage{Count: len(items), APIKeys: items}, nil
}

func (s *Service) CreateAPIKey(ctx stdctx.Context, req domain.CreateAPIKeyRequest) (*domain.APIKey, error) {
	subject, ok := identity.FromContext(ctx)
	if !ok || !identity.ValidateWalletAddress(subject.WalletAddress) {
		return nil, ErrWalletIdentityRequired
	}

	name := strings.TrimSpace(req.Name)
	resp, err := s.client.CreateAPIKey(ctx, subject.WalletAddress, name)
	if err != nil {
		if strings.Contains(err.Error(), "status=409") || strings.Contains(strings.ToLower(err.Error()), "already exists") {
			return nil, ErrAPIKeyAlreadyExists
		}
		return nil, err
	}

	apiKey := domain.APIKey{
		ID:            strings.TrimSpace(resp.KeyHash),
		Name:          name,
		Token:         strings.TrimSpace(resp.APIKey),
		TokenPreview:  previewToken(resp.APIKey),
		WalletAddress: strings.TrimSpace(resp.WalletAddress),
		PlanTier:      strings.TrimSpace(resp.PlanTier),
		ExpiresAt:     strings.TrimSpace(resp.ExpiresAt),
		Message:       "Store this API key securely. It will not be shown again.",
	}
	if s.store != nil {
		apiKey.CreatedAt = 0
		if _, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
			snapshot.APIKeys = append([]domain.APIKey{apiKey}, snapshot.APIKeys...)
			return nil
		}); err != nil {
			return nil, err
		}
	}
	return &apiKey, nil
}

func (s *Service) ValidateAPIKey(ctx stdctx.Context, rawKey string) (*identity.Identity, error) {
	subscription, err := s.client.ValidateAPIKey(ctx, strings.TrimSpace(rawKey))
	if err != nil {
		return nil, err
	}
	plan := strings.TrimSpace(subscription.PlanTier)
	if plan == "" {
		plan = "free"
	}
	wallet := strings.TrimSpace(subscription.WalletAddress)
	return &identity.Identity{
		AuthMethod:    "api_key",
		WalletAddress: wallet,
		WorkspaceName: workspaceName(wallet),
		OperatorName:  "API Key User",
		PlanTier:      plan,
		APIKeyPreview: previewToken(rawKey),
	}, nil
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
