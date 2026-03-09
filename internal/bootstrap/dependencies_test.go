package bootstrap_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

	"product-api/internal/api"
	"product-api/internal/bootstrap"
	"product-api/internal/config"
)

func TestBuildDependenciesUsesDemoServicesWhenUpstreamsMissing(t *testing.T) {
	t.Parallel()

	cfg := config.Config{}
	deps := bootstrap.BuildDependencies(cfg)
	router := api.NewRouter(cfg, deps)
	authCookie := loginCookie(t, router)

	cases := []struct {
		path string
		want int
	}{
		{path: "/v1/projects/me", want: http.StatusOK},
		{path: "/v1/projects/me/usage", want: http.StatusOK},
		{path: "/v1/alerts", want: http.StatusOK},
		{path: "/v1/execution/summaries?poolId=pool-1&symbol=SUI/USDC&window=1h", want: http.StatusOK},
	}

	for _, tc := range cases {
		req := httptest.NewRequest(http.MethodGet, tc.path, nil)
		req.AddCookie(authCookie)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != tc.want {
			t.Fatalf("%s: expected %d, got %d body=%s", tc.path, tc.want, rec.Code, rec.Body.String())
		}
	}

	var project map[string]any
	req := httptest.NewRequest(http.MethodGet, "/v1/projects/me", nil)
	req.AddCookie(authCookie)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	if err := json.Unmarshal(rec.Body.Bytes(), &project); err != nil {
		t.Fatalf("unmarshal project: %v", err)
	}
	if project["plan"] == nil || project["usage"] == nil {
		t.Fatalf("unexpected project payload: %+v", project)
	}
}

func loginCookie(t *testing.T, router http.Handler) *http.Cookie {
	t.Helper()
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader([]byte(`{"workspaceName":"Alpha Desk","operatorName":"Founding PM","walletAddress":"0x1111111111111111111111111111111111111111111111111111111111111111"}`)))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("login expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}
	cookies := rec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected auth cookie")
	}
	return cookies[0]
}

func TestBuildDependenciesPersistsCreatedMonitorsWhenDataFileConfigured(t *testing.T) {
	t.Setenv("PRODUCT_API_DATA_FILE", filepath.Join(t.TempDir(), "state.json"))

	cfg := config.Load()
	deps := bootstrap.BuildDependencies(cfg)
	router := api.NewRouter(cfg, deps)
	authCookie := loginCookie(t, router)

	createReq := httptest.NewRequest(http.MethodPost, "/v1/alert-ops/monitors", bytes.NewReader([]byte(`{"name":"Treasury Persisted Watch","targetType":"wallet","targetValue":"0xabc","ruleTemplateId":"wallet_outflow","severity":"high"}`)))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.AddCookie(authCookie)
	createRec := httptest.NewRecorder()
	router.ServeHTTP(createRec, createReq)
	if createRec.Code != http.StatusCreated {
		t.Fatalf("create monitor expected 201, got %d body=%s", createRec.Code, createRec.Body.String())
	}

	refreshedDeps := bootstrap.BuildDependencies(cfg)
	refreshedRouter := api.NewRouter(cfg, refreshedDeps)
	readReq := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/monitors", nil)
	readReq.AddCookie(loginCookie(t, refreshedRouter))
	readRec := httptest.NewRecorder()
	refreshedRouter.ServeHTTP(readRec, readReq)
	if readRec.Code != http.StatusOK {
		t.Fatalf("list monitors expected 200, got %d body=%s", readRec.Code, readRec.Body.String())
	}
	if !strings.Contains(readRec.Body.String(), "Treasury Persisted Watch") {
		t.Fatalf("expected persisted monitor in response, got %s", readRec.Body.String())
	}
}

func TestBuildDependenciesPersistsCreatedDestinationsWhenDataFileConfigured(t *testing.T) {
	t.Setenv("PRODUCT_API_DATA_FILE", filepath.Join(t.TempDir(), "state.json"))

	cfg := config.Load()
	deps := bootstrap.BuildDependencies(cfg)
	router := api.NewRouter(cfg, deps)
	authCookie := loginCookie(t, router)

	createReq := httptest.NewRequest(http.MethodPost, "/v1/alert-ops/destinations", bytes.NewReader([]byte(`{"projectId":"proj_1","type":"webhook","target":"https://ops.example.com/hook"}`)))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.AddCookie(authCookie)
	createRec := httptest.NewRecorder()
	router.ServeHTTP(createRec, createReq)
	if createRec.Code != http.StatusCreated {
		t.Fatalf("create destination expected 201, got %d body=%s", createRec.Code, createRec.Body.String())
	}

	refreshedDeps := bootstrap.BuildDependencies(cfg)
	refreshedRouter := api.NewRouter(cfg, refreshedDeps)
	readReq := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/destinations", nil)
	readReq.AddCookie(loginCookie(t, refreshedRouter))
	readRec := httptest.NewRecorder()
	refreshedRouter.ServeHTTP(readRec, readReq)
	if readRec.Code != http.StatusOK {
		t.Fatalf("list destinations expected 200, got %d body=%s", readRec.Code, readRec.Body.String())
	}
	if !strings.Contains(readRec.Body.String(), "https://ops.example.com/hook") {
		t.Fatalf("expected persisted destination in response, got %s", readRec.Body.String())
	}
}

func TestBuildDependenciesPersistsDeliveryHistoryWhenDataFileConfigured(t *testing.T) {
	t.Setenv("PRODUCT_API_DATA_FILE", filepath.Join(t.TempDir(), "state.json"))

	receiver := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer receiver.Close()

	cfg := config.Load()
	deps := bootstrap.BuildDependencies(cfg)
	router := api.NewRouter(cfg, deps)
	authCookie := loginCookie(t, router)

	createReq := httptest.NewRequest(http.MethodPost, "/v1/alert-ops/destinations", bytes.NewReader([]byte(`{"projectId":"proj_1","type":"webhook","target":"`+receiver.URL+`"}`)))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.AddCookie(authCookie)
	createRec := httptest.NewRecorder()
	router.ServeHTTP(createRec, createReq)
	if createRec.Code != http.StatusCreated {
		t.Fatalf("create destination expected 201, got %d body=%s", createRec.Code, createRec.Body.String())
	}

	var destination map[string]any
	if err := json.Unmarshal(createRec.Body.Bytes(), &destination); err != nil {
		t.Fatalf("unmarshal destination: %v", err)
	}

	testReq := httptest.NewRequest(http.MethodPost, "/v1/alert-ops/destinations/test", bytes.NewReader([]byte(`{"destinationId":"`+destination["id"].(string)+`","target":"`+receiver.URL+`","secret":"sec_demo_123","eventType":"risk_alert","payload":{"hello":"world"}}`)))
	testReq.Header.Set("Content-Type", "application/json")
	testReq.AddCookie(authCookie)
	testRec := httptest.NewRecorder()
	router.ServeHTTP(testRec, testReq)
	if testRec.Code != http.StatusOK {
		t.Fatalf("test delivery expected 200, got %d body=%s", testRec.Code, testRec.Body.String())
	}

	refreshedDeps := bootstrap.BuildDependencies(cfg)
	refreshedRouter := api.NewRouter(cfg, refreshedDeps)
	readReq := httptest.NewRequest(http.MethodGet, "/v1/alert-ops/deliveries", nil)
	readReq.AddCookie(loginCookie(t, refreshedRouter))
	readRec := httptest.NewRecorder()
	refreshedRouter.ServeHTTP(readRec, readReq)
	if readRec.Code != http.StatusOK {
		t.Fatalf("list deliveries expected 200, got %d body=%s", readRec.Code, readRec.Body.String())
	}
	if !strings.Contains(readRec.Body.String(), receiver.URL) {
		t.Fatalf("expected persisted delivery in response, got %s", readRec.Body.String())
	}
}

func TestBuildDependenciesPersistsAPIKeysAndValidatesThemWhenDataFileConfigured(t *testing.T) {
	t.Setenv("PRODUCT_API_DATA_FILE", filepath.Join(t.TempDir(), "state.json"))

	cfg := config.Load()
	deps := bootstrap.BuildDependencies(cfg)
	router := api.NewRouter(cfg, deps)
	authCookie := loginCookie(t, router)

	createReq := httptest.NewRequest(http.MethodPost, "/v1/projects/me/api-keys", bytes.NewReader([]byte(`{"name":"ops-agent"}`)))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.AddCookie(authCookie)
	createRec := httptest.NewRecorder()
	router.ServeHTTP(createRec, createReq)
	if createRec.Code != http.StatusCreated {
		t.Fatalf("create api key expected 201, got %d body=%s", createRec.Code, createRec.Body.String())
	}

	var created map[string]any
	if err := json.Unmarshal(createRec.Body.Bytes(), &created); err != nil {
		t.Fatalf("unmarshal api key: %v", err)
	}
	token, _ := created["token"].(string)
	if token == "" {
		t.Fatalf("expected token in create response: %s", createRec.Body.String())
	}

	refreshedDeps := bootstrap.BuildDependencies(cfg)
	refreshedRouter := api.NewRouter(cfg, refreshedDeps)
	listReq := httptest.NewRequest(http.MethodGet, "/v1/projects/me/api-keys", nil)
	listReq.AddCookie(loginCookie(t, refreshedRouter))
	listRec := httptest.NewRecorder()
	refreshedRouter.ServeHTTP(listRec, listReq)
	if listRec.Code != http.StatusOK {
		t.Fatalf("list api keys expected 200, got %d body=%s", listRec.Code, listRec.Body.String())
	}
	if !strings.Contains(listRec.Body.String(), "ops-agent") {
		t.Fatalf("expected persisted api key in response, got %s", listRec.Body.String())
	}

	validateReq := httptest.NewRequest(http.MethodPost, "/v1/auth/api-key/validate", bytes.NewReader([]byte(`{"apiKey":"`+token+`"}`)))
	validateReq.Header.Set("Content-Type", "application/json")
	validateRec := httptest.NewRecorder()
	refreshedRouter.ServeHTTP(validateRec, validateReq)
	if validateRec.Code != http.StatusOK {
		t.Fatalf("validate api key expected 200, got %d body=%s", validateRec.Code, validateRec.Body.String())
	}
	if !strings.Contains(validateRec.Body.String(), "api_key") {
		t.Fatalf("expected api_key auth method in response, got %s", validateRec.Body.String())
	}
}

func TestBuildDependenciesUsesInternalProvidersWithSingleServiceArchitecture(t *testing.T) {
	t.Parallel()

	cfg := config.Config{
		SessionSecret: "test-session-secret",
		PublicOrigin:  "https://alertops.example.com",
		DataFile:      filepath.Join(t.TempDir(), "state.json"),
	}
	deps := bootstrap.BuildDependencies(cfg)
	router := api.NewRouter(cfg, deps)
	authCookie := loginCookie(t, router)

	cases := []string{
		"/v1/projects/me",
		"/v1/alerts",
		"/v1/execution/summaries?poolId=pool-1&symbol=SUI/USDC&window=1h",
	}
	for _, path := range cases {
		req := httptest.NewRequest(http.MethodGet, path, nil)
		req.AddCookie(authCookie)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("%s: expected internal provider response 200, got %d body=%s", path, rec.Code, rec.Body.String())
		}
	}
}
