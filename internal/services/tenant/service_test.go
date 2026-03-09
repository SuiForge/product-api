package tenant_test

import (
	"context"
	"errors"
	"strings"
	"testing"

	"product-api/internal/identity"
	domain "product-api/internal/domain/tenant"
	svc "product-api/internal/services/tenant"
)

type stubClient struct{}

func (stubClient) GetSubscriptionStatus(context.Context) (*svc.UpstreamSubscription, error) {
	return &svc.UpstreamSubscription{WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", PlanTier: "pro", Status: "active"}, nil
}

func (stubClient) GetUsageStats(context.Context) ([]svc.UpstreamUsageDay, error) {
	return []svc.UpstreamUsageDay{{Date: "2026-03-01", Count: 10}, {Date: "2026-03-02", Count: 5}}, nil
}

func (stubClient) CreateAPIKey(context.Context, string, string) (*svc.UpstreamAPIKeyResponse, error) {
	return &svc.UpstreamAPIKeyResponse{APIKey: "sk_live_1234567890abcdef123456", KeyHash: "hash_123", OwnerName: "default", WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", PlanTier: "pro"}, nil
}

func (stubClient) ValidateAPIKey(context.Context, string) (*svc.UpstreamSubscription, error) {
	return &svc.UpstreamSubscription{WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", PlanTier: "pro", Status: "active"}, nil
}

func (stubClient) ListAnomalyAlerts(context.Context, string, int) (*svc.UpstreamAlertPage, error) {
	return &svc.UpstreamAlertPage{Count: 3}, nil
}

func TestServiceMapsPlatformTenantData(t *testing.T) {
	t.Parallel()

	service := svc.NewService(stubClient{})

	project, err := service.GetCurrent(context.Background())
	if err != nil {
		t.Fatalf("GetCurrent error: %v", err)
	}
	if project.ID != "0x1111111111111111111111111111111111111111111111111111111111111111" || project.Plan != "pro" || project.Usage.Requests != 15 || project.Usage.Alerts != 3 {
		t.Fatalf("unexpected project: %+v", project)
	}
	if project.Name == "" {
		t.Fatalf("expected non-empty project name")
	}

	usage, err := service.GetUsage(context.Background())
	if err != nil {
		t.Fatalf("GetUsage error: %v", err)
	}
	if usage.Requests != 15 || usage.Alerts != 3 {
		t.Fatalf("unexpected usage: %+v", usage)
	}

	ctx := identity.WithContext(context.Background(), &identity.Identity{WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", WorkspaceName: "Alpha", OperatorName: "Founding PM", AuthMethod: "session"})
	apiKey, err := service.CreateAPIKey(ctx, domain.CreateAPIKeyRequest{Name: "default"})
	if err != nil {
		t.Fatalf("CreateAPIKey error: %v", err)
	}
	if apiKey.ID != "hash_123" || apiKey.Name != "default" || apiKey.TokenPreview != "sk_live_***" || apiKey.Token == "" || apiKey.WalletAddress != "0x1111111111111111111111111111111111111111111111111111111111111111" {
		t.Fatalf("unexpected api key: %+v", apiKey)
	}

	validated, err := service.ValidateAPIKey(context.Background(), "sk_live_1234567890abcdef123456")
	if err != nil {
		t.Fatalf("ValidateAPIKey error: %v", err)
	}
	if validated.AuthMethod != "api_key" || validated.WalletAddress != "0x1111111111111111111111111111111111111111111111111111111111111111" || validated.PlanTier != "pro" {
		t.Fatalf("unexpected validated identity: %+v", validated)
	}
}

type failingCreateKeyClient struct{ stubClient }

func (failingCreateKeyClient) CreateAPIKey(context.Context, string, string) (*svc.UpstreamAPIKeyResponse, error) {
	return nil, errors.New("vertical index request failed: status=409 body={\"error\":\"API key already exists for this wallet\"}")
}

func TestServiceReturnsConflictWhenWalletAlreadyHasAPIKey(t *testing.T) {
	t.Parallel()

	service := svc.NewService(failingCreateKeyClient{})

	ctx := identity.WithContext(context.Background(), &identity.Identity{WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111", WorkspaceName: "Alpha", OperatorName: "Founding PM", AuthMethod: "session"})
	_, err := service.CreateAPIKey(ctx, domain.CreateAPIKeyRequest{Name: "default"})
	if err == nil || !strings.Contains(err.Error(), "already exists") {
		t.Fatalf("expected provider create failure, got %v", err)
	}
}
