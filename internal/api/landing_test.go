package api_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"product-api/internal/api"
	"product-api/internal/config"
)

func TestRootRouteReturnsLandingPage(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{}, api.Dependencies{})

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if contentType := rec.Header().Get("Content-Type"); !strings.Contains(contentType, "text/html") {
		t.Fatalf("expected html content type, got %q", contentType)
	}
	body := rec.Body.String()
	for _, token := range []string{
		"Wallet-native alerting for Sui teams",
		"Open Operator Console",
		"/console",
	} {
		if !strings.Contains(body, token) {
			t.Fatalf("expected %q in landing html", token)
		}
	}
}
