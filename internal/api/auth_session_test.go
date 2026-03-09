package api_test

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"product-api/internal/api"
	authapi "product-api/internal/api/auth"
	"product-api/internal/config"
	alertdomain "product-api/internal/domain/alerts"
	tenantdomain "product-api/internal/domain/tenant"
	"product-api/internal/identity"
	alertsvc "product-api/internal/services/alerting"
	tenantsvc "product-api/internal/services/tenant"
)

type stubIdentityService struct{}

type stubWalletVerifier struct {
	verify func(context.Context, authapi.WalletSignatureVerification) error
}

type stubGoogleVerifier struct {
	verify func(context.Context, string) (*authapi.GoogleIdentity, error)
}

func (s stubWalletVerifier) VerifyPersonalMessage(ctx context.Context, verification authapi.WalletSignatureVerification) error {
	if s.verify != nil {
		return s.verify(ctx, verification)
	}
	return nil
}

func (s stubGoogleVerifier) VerifyIDToken(ctx context.Context, rawToken string) (*authapi.GoogleIdentity, error) {
	if s.verify != nil {
		return s.verify(ctx, rawToken)
	}
	return &authapi.GoogleIdentity{
		Subject:       "google-subject-123",
		Email:         "founder@example.com",
		EmailVerified: true,
		Name:          "Founding PM",
		Picture:       "https://example.com/avatar.png",
	}, nil
}

func (stubIdentityService) ValidateAPIKey(_ context.Context, rawKey string) (*identity.Identity, error) {
	return &identity.Identity{
		AuthMethod:    "api_key",
		WalletAddress: "0x1111111111111111111111111111111111111111111111111111111111111111",
		WorkspaceName: "Alpha Desk",
		OperatorName:  "API Key User",
		PlanTier:      "pro",
		APIKeyPreview: rawKey,
	}, nil
}

func TestAuthLoginSetsSessionCookieAndSessionEndpointReadsIt(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{})
	body := []byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected login 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	resp := rec.Result()
	if len(resp.Cookies()) == 0 {
		t.Fatalf("expected auth cookie to be set")
	}
	cookie := resp.Cookies()[0]
	if !cookie.HttpOnly {
		t.Fatalf("expected auth cookie to be httpOnly")
	}
	if cookie.Value == "" {
		t.Fatalf("expected auth cookie value")
	}

	sessionReq := httptest.NewRequest(http.MethodGet, "/v1/auth/session", nil)
	sessionReq.AddCookie(cookie)
	sessionRec := httptest.NewRecorder()
	router.ServeHTTP(sessionRec, sessionReq)

	if sessionRec.Code != http.StatusOK {
		t.Fatalf("expected session 200, got %d body=%s", sessionRec.Code, sessionRec.Body.String())
	}

	var sessionResp struct {
		WorkspaceName string `json:"workspaceName"`
		OperatorName  string `json:"operatorName"`
		WalletAddress string `json:"walletAddress"`
	}
	if err := json.Unmarshal(sessionRec.Body.Bytes(), &sessionResp); err != nil {
		t.Fatalf("unmarshal session response: %v", err)
	}
	if sessionResp.WorkspaceName != "Alpha Desk" || sessionResp.OperatorName != "Founding PM" || sessionResp.WalletAddress == "" {
		t.Fatalf("unexpected session payload: %+v", sessionResp)
	}
}

func TestProtectedRoutesRequireAuthenticatedSession(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{})
	req := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d body=%s", rec.Code, rec.Body.String())
	}
}

func TestAuthLogoutClearsSessionCookie(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{})
	loginReq := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	loginReq.Header.Set("Content-Type", "application/json")
	loginRec := httptest.NewRecorder()
	router.ServeHTTP(loginRec, loginReq)

	if loginRec.Code != http.StatusOK {
		t.Fatalf("expected login 200, got %d body=%s", loginRec.Code, loginRec.Body.String())
	}
	cookies := loginRec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected auth cookie to be set")
	}

	logoutReq := httptest.NewRequest(http.MethodPost, "/v1/auth/logout", nil)
	logoutReq.AddCookie(cookies[0])
	logoutRec := httptest.NewRecorder()
	router.ServeHTTP(logoutRec, logoutReq)

	if logoutRec.Code != http.StatusOK {
		t.Fatalf("expected logout 200, got %d body=%s", logoutRec.Code, logoutRec.Body.String())
	}
	logoutCookies := logoutRec.Result().Cookies()
	if len(logoutCookies) == 0 || logoutCookies[0].MaxAge != -1 {
		t.Fatalf("expected logout to clear auth cookie")
	}

	protectedReq := httptest.NewRequest(http.MethodGet, "/v1/alerts", nil)
	protectedRec := httptest.NewRecorder()
	router.ServeHTTP(protectedRec, protectedReq)
	if protectedRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected unauthenticated request to be rejected after logout, got %d body=%s", protectedRec.Code, protectedRec.Body.String())
	}
}

func TestProtectedRoutesAllowValidAPIKeyHeader(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{IdentityService: stubIdentityService{}})
	req := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
	req.Header.Set("X-API-Key", "sk_live_1234567890abcdef123456")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code == http.StatusUnauthorized {
		t.Fatalf("expected api key auth to pass, got %d body=%s", rec.Code, rec.Body.String())
	}
}

func TestValidateAPIKeyEndpointReturnsIdentity(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{IdentityService: stubIdentityService{}})
	body := []byte(`{"apiKey":"sk_live_1234567890abcdef123456"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/api-key/validate", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var payload struct {
		AuthMethod    string `json:"authMethod"`
		WalletAddress string `json:"walletAddress"`
		PlanTier      string `json:"planTier"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if payload.AuthMethod != "api_key" || payload.WalletAddress == "" || payload.PlanTier != "pro" {
		t.Fatalf("unexpected identity payload: %+v", payload)
	}
}

func TestWalletNonceEndpointIssuesChallenge(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{WalletVerifier: stubWalletVerifier{}})
	body := []byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/nonce", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var payload struct {
		Nonce         string `json:"nonce"`
		Message       string `json:"message"`
		WorkspaceName string `json:"workspaceName"`
		OperatorName  string `json:"operatorName"`
		WalletAddress string `json:"walletAddress"`
		ExpiresAt     int64  `json:"expiresAt"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("unmarshal response: %v", err)
	}
	if payload.Nonce == "" || payload.Message == "" || payload.ExpiresAt <= 0 {
		t.Fatalf("expected challenge payload, got %+v", payload)
	}
	if payload.WorkspaceName != "Alpha Desk" || payload.OperatorName != "Founding PM" || payload.WalletAddress == "" {
		t.Fatalf("unexpected challenge payload: %+v", payload)
	}
	if !strings.Contains(payload.Message, payload.Nonce) || !strings.Contains(payload.Message, payload.WalletAddress) {
		t.Fatalf("expected message to contain nonce and wallet, got %q", payload.Message)
	}
}

func TestWalletVerifyEndpointIssuesSessionCookie(t *testing.T) {
	t.Parallel()

	var captured authapi.WalletSignatureVerification
	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{WalletVerifier: stubWalletVerifier{verify: func(_ context.Context, verification authapi.WalletSignatureVerification) error {
		captured = verification
		return nil
	}}})

	challengeReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/nonce", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	challengeReq.Header.Set("Content-Type", "application/json")
	challengeRec := httptest.NewRecorder()
	router.ServeHTTP(challengeRec, challengeReq)
	if challengeRec.Code != http.StatusOK {
		t.Fatalf("expected challenge 200, got %d body=%s", challengeRec.Code, challengeRec.Body.String())
	}

	var challenge struct {
		Nonce         string `json:"nonce"`
		Message       string `json:"message"`
		WalletAddress string `json:"walletAddress"`
	}
	if err := json.Unmarshal(challengeRec.Body.Bytes(), &challenge); err != nil {
		t.Fatalf("unmarshal challenge: %v", err)
	}

	verifyBody := []byte(`{"nonce":"` + challenge.Nonce + `","signature":"serialized-signature"}`)
	verifyReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/verify", bytes.NewReader(verifyBody))
	verifyReq.Header.Set("Content-Type", "application/json")
	verifyRec := httptest.NewRecorder()
	router.ServeHTTP(verifyRec, verifyReq)

	if verifyRec.Code != http.StatusOK {
		t.Fatalf("expected verify 200, got %d body=%s", verifyRec.Code, verifyRec.Body.String())
	}
	if captured.WalletAddress != challenge.WalletAddress || captured.Message != challenge.Message || captured.Signature != "serialized-signature" {
		t.Fatalf("unexpected verification payload: %+v challenge=%+v", captured, challenge)
	}

	cookies := verifyRec.Result().Cookies()
	if len(cookies) == 0 || cookies[0].Value == "" {
		t.Fatalf("expected auth cookie to be set")
	}

	sessionReq := httptest.NewRequest(http.MethodGet, "/v1/auth/session", nil)
	sessionReq.AddCookie(cookies[0])
	sessionRec := httptest.NewRecorder()
	router.ServeHTTP(sessionRec, sessionReq)
	if sessionRec.Code != http.StatusOK {
		t.Fatalf("expected session 200, got %d body=%s", sessionRec.Code, sessionRec.Body.String())
	}
}

func TestWalletVerifyRejectsInvalidSignature(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{WalletVerifier: stubWalletVerifier{verify: func(context.Context, authapi.WalletSignatureVerification) error {
		return errors.New("signature verification failed")
	}}})

	challengeReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/nonce", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	challengeReq.Header.Set("Content-Type", "application/json")
	challengeRec := httptest.NewRecorder()
	router.ServeHTTP(challengeRec, challengeReq)
	if challengeRec.Code != http.StatusOK {
		t.Fatalf("expected challenge 200, got %d body=%s", challengeRec.Code, challengeRec.Body.String())
	}

	var challenge struct {
		Nonce string `json:"nonce"`
	}
	if err := json.Unmarshal(challengeRec.Body.Bytes(), &challenge); err != nil {
		t.Fatalf("unmarshal challenge: %v", err)
	}

	verifyBody := []byte(`{"nonce":"` + challenge.Nonce + `","signature":"bad-signature"}`)
	verifyReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/verify", bytes.NewReader(verifyBody))
	verifyReq.Header.Set("Content-Type", "application/json")
	verifyRec := httptest.NewRecorder()
	router.ServeHTTP(verifyRec, verifyReq)

	if verifyRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected verify 401, got %d body=%s", verifyRec.Code, verifyRec.Body.String())
	}
}

func TestWalletVerifyConsumesNonceAfterSuccess(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{WalletVerifier: stubWalletVerifier{}})

	challengeReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/nonce", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	challengeReq.Header.Set("Content-Type", "application/json")
	challengeRec := httptest.NewRecorder()
	router.ServeHTTP(challengeRec, challengeReq)
	if challengeRec.Code != http.StatusOK {
		t.Fatalf("expected challenge 200, got %d body=%s", challengeRec.Code, challengeRec.Body.String())
	}

	var challenge struct {
		Nonce string `json:"nonce"`
	}
	if err := json.Unmarshal(challengeRec.Body.Bytes(), &challenge); err != nil {
		t.Fatalf("unmarshal challenge: %v", err)
	}

	verifyBody := []byte(`{"nonce":"` + challenge.Nonce + `","signature":"serialized-signature"}`)
	firstReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/verify", bytes.NewReader(verifyBody))
	firstReq.Header.Set("Content-Type", "application/json")
	firstRec := httptest.NewRecorder()
	router.ServeHTTP(firstRec, firstReq)
	if firstRec.Code != http.StatusOK {
		t.Fatalf("expected first verify 200, got %d body=%s", firstRec.Code, firstRec.Body.String())
	}

	secondReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/verify", bytes.NewReader(verifyBody))
	secondReq.Header.Set("Content-Type", "application/json")
	secondRec := httptest.NewRecorder()
	router.ServeHTTP(secondRec, secondReq)
	if secondRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected second verify 401, got %d body=%s", secondRec.Code, secondRec.Body.String())
	}
}

func TestGoogleVerifyEndpointIssuesSessionCookie(t *testing.T) {
	t.Parallel()

	var capturedToken string
	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret", GoogleClientID: "google-client-id.apps.googleusercontent.com"}, api.Dependencies{GoogleVerifier: stubGoogleVerifier{verify: func(_ context.Context, rawToken string) (*authapi.GoogleIdentity, error) {
		capturedToken = rawToken
		return &authapi.GoogleIdentity{
			Subject:       "google-subject-123",
			Email:         "founder@example.com",
			EmailVerified: true,
			Name:          "Founder Name",
			Picture:       "https://example.com/avatar.png",
		}, nil
	}}})

	body := []byte(`{"credential":"google-id-token","workspaceName":"Alpha Desk","operatorName":""}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/google/verify", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected google verify 200, got %d body=%s", rec.Code, rec.Body.String())
	}
	if capturedToken != "google-id-token" {
		t.Fatalf("expected verifier to receive token, got %q", capturedToken)
	}

	resp := rec.Result()
	if len(resp.Cookies()) == 0 || resp.Cookies()[0].Value == "" {
		t.Fatalf("expected auth cookie to be set")
	}

	var payload struct {
		AuthMethod    string `json:"authMethod"`
		WorkspaceName string `json:"workspaceName"`
		OperatorName  string `json:"operatorName"`
		Email         string `json:"email"`
		Picture       string `json:"picture"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("unmarshal google verify response: %v", err)
	}
	if payload.AuthMethod != "google" || payload.WorkspaceName != "Alpha Desk" || payload.OperatorName != "Founder Name" || payload.Email != "founder@example.com" {
		t.Fatalf("unexpected google session payload: %+v", payload)
	}

	sessionReq := httptest.NewRequest(http.MethodGet, "/v1/auth/session", nil)
	sessionReq.AddCookie(resp.Cookies()[0])
	sessionRec := httptest.NewRecorder()
	router.ServeHTTP(sessionRec, sessionReq)
	if sessionRec.Code != http.StatusOK {
		t.Fatalf("expected session 200, got %d body=%s", sessionRec.Code, sessionRec.Body.String())
	}

	protectedReq := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
	protectedReq.AddCookie(resp.Cookies()[0])
	protectedRec := httptest.NewRecorder()
	router.ServeHTTP(protectedRec, protectedReq)
	if protectedRec.Code == http.StatusUnauthorized {
		t.Fatalf("expected google session to access protected route, got %d body=%s", protectedRec.Code, protectedRec.Body.String())
	}
}

func TestGoogleProvidersEndpointExposesPublicClientConfig(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret", GoogleClientID: "google-client-id.apps.googleusercontent.com", GoogleHostedDomain: "example.com", SuiNetwork: "testnet"}, api.Dependencies{GoogleVerifier: stubGoogleVerifier{}, WalletVerifier: stubWalletVerifier{}})
	req := httptest.NewRequest(http.MethodGet, "/v1/auth/providers", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected providers 200, got %d body=%s", rec.Code, rec.Body.String())
	}

	var payload struct {
		Google struct {
			Enabled      bool   `json:"enabled"`
			ClientID     string `json:"clientId"`
			HostedDomain string `json:"hostedDomain"`
		} `json:"google"`
		Wallet struct {
			Enabled bool   `json:"enabled"`
			Network string `json:"network"`
		} `json:"wallet"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("unmarshal providers payload: %v", err)
	}
	if !payload.Google.Enabled || payload.Google.ClientID == "" || payload.Google.HostedDomain != "example.com" {
		t.Fatalf("unexpected google provider payload: %+v", payload.Google)
	}
	if !payload.Wallet.Enabled || payload.Wallet.Network != "testnet" {
		t.Fatalf("unexpected wallet provider payload: %+v", payload.Wallet)
	}
}

func TestGoogleVerifyRejectsInvalidCredential(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret", GoogleClientID: "google-client-id.apps.googleusercontent.com"}, api.Dependencies{GoogleVerifier: stubGoogleVerifier{verify: func(context.Context, string) (*authapi.GoogleIdentity, error) {
		return nil, errors.New("invalid google token")
	}}})

	body := []byte(`{"credential":"bad-google-id-token","workspaceName":"Alpha Desk"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/google/verify", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected google verify 401, got %d body=%s", rec.Code, rec.Body.String())
	}
}

type walletBoundTenantService struct{}

type walletBoundAlertsService struct{}

func (walletBoundTenantService) GetCurrent(context.Context) (*tenantdomain.Project, error) {
	return &tenantdomain.Project{ID: "workspace_1", Name: "Alpha Desk", Plan: "free"}, nil
}

func (walletBoundTenantService) GetUsage(context.Context) (*tenantdomain.UsageSnapshot, error) {
	return &tenantdomain.UsageSnapshot{Requests: 12, Alerts: 3}, nil
}

func (walletBoundTenantService) ListAPIKeys(context.Context) (*tenantdomain.APIKeyPage, error) {
	return &tenantdomain.APIKeyPage{Count: 1, APIKeys: []tenantdomain.APIKey{{ID: "key_1", Name: "ops-agent", TokenPreview: "sk_live_***"}}}, nil
}

func (walletBoundTenantService) CreateAPIKey(ctx context.Context, req tenantdomain.CreateAPIKeyRequest) (*tenantdomain.APIKey, error) {
	subject, ok := identity.FromContext(ctx)
	if !ok || !identity.ValidateWalletAddress(subject.WalletAddress) {
		return nil, tenantsvc.ErrWalletIdentityRequired
	}
	return &tenantdomain.APIKey{ID: "key_1", Name: req.Name, TokenPreview: "sk_live_***", WalletAddress: subject.WalletAddress}, nil
}

func (walletBoundAlertsService) List(context.Context, alertdomain.ListQuery) (*alertdomain.AlertPage, error) {
	return &alertdomain.AlertPage{Count: 1, Alerts: []alertdomain.Alert{{ID: "alt_1", Type: "risk_alert", Severity: "medium", Source: "test", Timestamp: 1, EvidenceID: "ev_1"}}}, nil
}

func (walletBoundAlertsService) ListDeliveries(context.Context) (*alertdomain.DeliveryPage, error) {
	return &alertdomain.DeliveryPage{Count: 1, Deliveries: []alertdomain.DeliveryAttempt{{ID: "dlv_1", DestinationID: "dst_1", Target: "https://example.com/hook", EventType: "risk_alert", Delivered: true, Status: "delivered", StatusCode: http.StatusOK, SentAt: 1}}}, nil
}

func (walletBoundAlertsService) ListDestinations(context.Context) (*alertdomain.DestinationPage, error) {
	return &alertdomain.DestinationPage{Count: 1, Destinations: []alertdomain.Destination{{ID: "dst_1", Type: "webhook", Target: "https://example.com/hook", Status: "active"}}}, nil
}

func (walletBoundAlertsService) CreateDestination(ctx context.Context, req alertdomain.CreateDestinationRequest) (*alertdomain.Destination, error) {
	subject, ok := identity.FromContext(ctx)
	if !ok || !identity.ValidateWalletAddress(subject.WalletAddress) {
		return nil, alertsvc.ErrWalletIdentityRequired
	}
	return &alertdomain.Destination{ID: "dst_1", Type: req.Type, Target: req.Target, Status: "active"}, nil
}

func (walletBoundAlertsService) TestDestination(context.Context, alertdomain.TestDestinationRequest) (*alertdomain.TestDeliveryResult, error) {
	return &alertdomain.TestDeliveryResult{Delivered: true, StatusCode: 200}, nil
}

func (walletBoundAlertsService) RetryDelivery(context.Context, string) (*alertdomain.TestDeliveryResult, error) {
	return &alertdomain.TestDeliveryResult{Delivered: true, StatusCode: 200}, nil
}

func loginGoogleSessionCookie(t *testing.T, router http.Handler) *http.Cookie {
	t.Helper()
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/google/verify", bytes.NewReader([]byte(`{"credential":"google-id-token","workspaceName":"Alpha Desk"}`)))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected google login 200, got %d body=%s", rec.Code, rec.Body.String())
	}
	cookies := rec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected auth cookie")
	}
	return cookies[0]
}

func loginWalletSessionCookie(t *testing.T, router http.Handler) *http.Cookie {
	t.Helper()
	challengeReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/nonce", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	challengeReq.Header.Set("Content-Type", "application/json")
	challengeRec := httptest.NewRecorder()
	router.ServeHTTP(challengeRec, challengeReq)
	if challengeRec.Code != http.StatusOK {
		t.Fatalf("expected challenge 200, got %d body=%s", challengeRec.Code, challengeRec.Body.String())
	}
	var challenge struct {
		Nonce string `json:"nonce"`
	}
	if err := json.Unmarshal(challengeRec.Body.Bytes(), &challenge); err != nil {
		t.Fatalf("unmarshal challenge: %v", err)
	}
	verifyReq := httptest.NewRequest(http.MethodPost, "/v1/auth/wallet/verify", bytes.NewReader([]byte(`{"nonce":"`+challenge.Nonce+`","signature":"serialized-signature"}`)))
	verifyReq.Header.Set("Content-Type", "application/json")
	verifyRec := httptest.NewRecorder()
	router.ServeHTTP(verifyRec, verifyReq)
	if verifyRec.Code != http.StatusOK {
		t.Fatalf("expected wallet verify 200, got %d body=%s", verifyRec.Code, verifyRec.Body.String())
	}
	cookies := verifyRec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected auth cookie")
	}
	return cookies[0]
}

func TestGoogleSessionAllowsReadOnlyRoutesButBlocksWalletBoundRoutes(t *testing.T) {
	t.Parallel()
	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret", GoogleClientID: "google-client-id.apps.googleusercontent.com"}, api.Dependencies{
		GoogleVerifier: stubGoogleVerifier{},
		TenantService:  walletBoundTenantService{},
		AlertsService:  walletBoundAlertsService{},
	})
	cookie := loginGoogleSessionCookie(t, router)

	readReq := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
	readReq.AddCookie(cookie)
	readRec := httptest.NewRecorder()
	router.ServeHTTP(readRec, readReq)
	if readRec.Code != http.StatusOK {
		t.Fatalf("expected google session read route 200, got %d body=%s", readRec.Code, readRec.Body.String())
	}

	alertsReq := httptest.NewRequest(http.MethodGet, "/v1/alerts", nil)
	alertsReq.AddCookie(cookie)
	alertsRec := httptest.NewRecorder()
	router.ServeHTTP(alertsRec, alertsReq)
	if alertsRec.Code != http.StatusOK {
		t.Fatalf("expected google session alerts route 200, got %d body=%s", alertsRec.Code, alertsRec.Body.String())
	}

	apiKeyReq := httptest.NewRequest(http.MethodPost, "/v1/projects/me/api-keys", bytes.NewReader([]byte(`{"name":"demo-operator"}`)))
	apiKeyReq.Header.Set("Content-Type", "application/json")
	apiKeyReq.AddCookie(cookie)
	apiKeyRec := httptest.NewRecorder()
	router.ServeHTTP(apiKeyRec, apiKeyReq)
	if apiKeyRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected google session api key route 401, got %d body=%s", apiKeyRec.Code, apiKeyRec.Body.String())
	}

	destinationReq := httptest.NewRequest(http.MethodPost, "/v1/alerts/destinations", bytes.NewReader([]byte(`{"projectId":"alpha","type":"webhook","target":"https://example.com/hook"}`)))
	destinationReq.Header.Set("Content-Type", "application/json")
	destinationReq.AddCookie(cookie)
	destinationRec := httptest.NewRecorder()
	router.ServeHTTP(destinationRec, destinationReq)
	if destinationRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected google session destination route 401, got %d body=%s", destinationRec.Code, destinationRec.Body.String())
	}
}

func TestWalletSessionUnlocksWalletBoundRoutes(t *testing.T) {
	t.Parallel()
	router := api.NewRouter(config.Config{SessionSecret: "test-session-secret"}, api.Dependencies{
		WalletVerifier: stubWalletVerifier{},
		TenantService:  walletBoundTenantService{},
		AlertsService:  walletBoundAlertsService{},
	})
	cookie := loginWalletSessionCookie(t, router)

	apiKeyReq := httptest.NewRequest(http.MethodPost, "/v1/projects/me/api-keys", bytes.NewReader([]byte(`{"name":"demo-operator"}`)))
	apiKeyReq.Header.Set("Content-Type", "application/json")
	apiKeyReq.AddCookie(cookie)
	apiKeyRec := httptest.NewRecorder()
	router.ServeHTTP(apiKeyRec, apiKeyReq)
	if apiKeyRec.Code != http.StatusCreated {
		t.Fatalf("expected wallet session api key route 201, got %d body=%s", apiKeyRec.Code, apiKeyRec.Body.String())
	}

	destinationReq := httptest.NewRequest(http.MethodPost, "/v1/alerts/destinations", bytes.NewReader([]byte(`{"projectId":"alpha","type":"webhook","target":"https://example.com/hook"}`)))
	destinationReq.Header.Set("Content-Type", "application/json")
	destinationReq.AddCookie(cookie)
	destinationRec := httptest.NewRecorder()
	router.ServeHTTP(destinationRec, destinationReq)
	if destinationRec.Code != http.StatusCreated {
		t.Fatalf("expected wallet session destination route 201, got %d body=%s", destinationRec.Code, destinationRec.Body.String())
	}
}
