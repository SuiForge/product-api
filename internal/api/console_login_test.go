package api_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"product-api/internal/api"
	"product-api/internal/config"
)

func TestConsoleIncludesWorkspaceLoginEntry(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{}, api.Dependencies{})
	req := httptest.NewRequest(http.MethodGet, "/console", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	body := rec.Body.String()
	required := []string{
		"Google or Wallet Login",
		"google-signin-button",
		"Sign In With Wallet",
		"Demo Access",
		"Log Out",
		"Google login unavailable",
		"Connect Sui Wallet",
		"Connected wallet address",
	}
	for _, token := range required {
		if !strings.Contains(body, token) {
			t.Fatalf("expected %q in console html", token)
		}
	}
}
