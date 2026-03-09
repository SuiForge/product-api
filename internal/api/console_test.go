package api_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"product-api/internal/api"
	"product-api/internal/config"
)

func TestConsoleRouteReturnsWorkspaceShell(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{}, api.Dependencies{})

	req := httptest.NewRequest(http.MethodGet, "/console", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if contentType := rec.Header().Get("Content-Type"); !strings.Contains(contentType, "text/html") {
		t.Fatalf("expected html content type, got %q", contentType)
	}
	body := rec.Body.String()
	required := []string{
		"Sui Alert Ops",
		"Service Overview",
		"Go-Live Readiness",
		"Monitor Builder",
		"API Keys",
		"Rule Templates",
		"Create Monitor",
		"Inspect Overview",
		"Review Alerts",
		"Open Replay",
		"Risk Check",
		"Replay",
		"Alerts",
		"Configured routes",
		"Delivery History",
		"Alert Ops Flow",
		"Configure Webhook",
	}
	for _, token := range required {
		if !strings.Contains(body, token) {
			t.Fatalf("expected %q in console html", token)
		}
	}
}

func TestConsoleAssetsAreServed(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{}, api.Dependencies{})

	cases := []struct {
		path        string
		contentType string
	}{
		{path: "/console/app.js", contentType: "javascript"},
		{path: "/console/styles.css", contentType: "text/css"},
	}

	for _, tc := range cases {
		req := httptest.NewRequest(http.MethodGet, tc.path, nil)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200 for %s, got %d", tc.path, rec.Code)
		}
		if contentType := rec.Header().Get("Content-Type"); !strings.Contains(contentType, tc.contentType) {
			t.Fatalf("expected %s content type for %s, got %q", tc.contentType, tc.path, contentType)
		}
	}
}
