package console

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLandingHandlerPresentsBuyerFacingProductStory(t *testing.T) {
	t.Parallel()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()

	LandingHandler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if contentType := rec.Header().Get("Content-Type"); !strings.Contains(contentType, "text/html") {
		t.Fatalf("expected html content type, got %q", contentType)
	}
	body := rec.Body.String()
	for _, needle := range []string{
		"Wallet-native alerting for Sui teams",
		"Open Operator Console",
		"Apply for Design Partner Pilot",
		"Go-Live Readiness",
		"Google login for operators",
		"Sui wallet login for wallet-bound actions",
		"Webhook delivery with signed test sends",
		"Replayable alert evidence",
		"/console",
		"https://github.com/SuiForge/product-api",
	} {
		if !strings.Contains(body, needle) {
			t.Fatalf("expected landing page to contain %q", needle)
		}
	}
}
