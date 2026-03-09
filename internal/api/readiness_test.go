package api_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"product-api/internal/api"
	authapi "product-api/internal/api/auth"
	"product-api/internal/config"
	"product-api/internal/identity"
)

type readinessWalletVerifier struct{}

func (readinessWalletVerifier) VerifyPersonalMessage(context.Context, authapi.WalletSignatureVerification) error {
	return nil
}

type readinessGoogleVerifier struct{}

func (readinessGoogleVerifier) VerifyIDToken(context.Context, string) (*authapi.GoogleIdentity, error) {
	return &authapi.GoogleIdentity{Subject: "sub_1", Email: "ops@example.com", EmailVerified: true, HostedDomain: "example.com"}, nil
}

type readinessAPIKeyValidator struct{}

func (readinessAPIKeyValidator) ValidateAPIKey(context.Context, string) (*identity.Identity, error) {
	return &identity.Identity{AuthMethod: "api_key"}, nil
}

func TestReadinessRouteReturnsGoLiveStatus(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{
		PublicOrigin:       "https://alertops.example.com",
		SuiNetwork:         "mainnet",
		GoogleClientID:     "google-client-id.apps.googleusercontent.com",
		GoogleHostedDomain: "example.com",
		DataFile:           "data/product-api-state.json",
	}, api.Dependencies{
		WalletVerifier:  readinessWalletVerifier{},
		GoogleVerifier:  readinessGoogleVerifier{},
		IdentityService: readinessAPIKeyValidator{},
	})

	req := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/readiness", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var payload map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	service, _ := payload["service"].(map[string]any)
	if service["id"] != "sui-alert-ops" {
		t.Fatalf("expected service id, got %+v", service)
	}
	if payload["status"] != "pilot_ready" {
		t.Fatalf("expected pilot_ready status, got %+v", payload)
	}
	auth, _ := payload["auth"].(map[string]any)
	if auth["googleEnabled"] != true {
		t.Fatalf("expected googleEnabled true, got %+v", auth)
	}
	infrastructure, _ := payload["infrastructure"].(map[string]any)
	if infrastructure["publicOrigin"] != "https://alertops.example.com" {
		t.Fatalf("expected publicOrigin in payload, got %+v", infrastructure)
	}
	nextActions, _ := payload["nextActions"].([]any)
	if len(nextActions) == 0 {
		t.Fatalf("expected nextActions, got %+v", payload)
	}
}
