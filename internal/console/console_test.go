package console

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestScriptHandlerIncludesUnifiedAlertOpsEndpoints(t *testing.T) {
	t.Parallel()

	req := httptest.NewRequest(http.MethodGet, "/console/app.js", nil)
	rec := httptest.NewRecorder()

	ScriptHandler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	body := rec.Body.String()
	for _, needle := range []string{
		"/v1/auth/providers",
		"/v1/auth/google/verify",
		"/v1/auth/login",
		"/v1/auth/wallet/nonce",
		"/v1/auth/wallet/verify",
		"/v1/auth/session",
		"/v1/auth/logout",
		"const alertOpsBase = '/v1/alert-ops';",
		"${alertOpsBase}/overview",
		"${alertOpsBase}/rule-templates",
		"${alertOpsBase}/monitors",
		"${alertOpsBase}/alerts",
		"${alertOpsBase}/destinations",
		"${alertOpsBase}/replays/",
		"initializeGoogleLogin",
		"https://suiscan.xyz/mainnet/tx/",
		"renderReplayView",
	} {
		if !strings.Contains(body, needle) {
			t.Fatalf("expected script to contain %q", needle)
		}
	}
}

func TestIndexHandlerReflectsSingleAlertOpsProduct(t *testing.T) {
	t.Parallel()

	req := httptest.NewRequest(http.MethodGet, "/console", nil)
	rec := httptest.NewRecorder()

	IndexHandler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	body := rec.Body.String()
	for _, needle := range []string{
		"Sui Alert Ops",
		"Real-time alerting and incident response",
		"Monitor Builder",
		"Rule Templates",
		"Create Monitor",
		"Inspect Overview",
		"Review Alerts",
		"Open Replay",
		"google-signin-button",
		"google-connection-badge",
		"Use Google for fast operator access or connect a real Sui wallet",
		"Configure Google Sign-In to enable popup login for non-wallet operators.",
		"wallet-connect-button",
		"workspace-demo-login",
		"wallet-connection-badge",
		"replay-detail-card",
		"alerts-summary-strip",
		"alerts-feed",
		"alerts-detail-card",
		"workspace-panel",
		"alerts-panel",
		"replay-panel",
		"destination-form",
	} {
		if !strings.Contains(body, needle) {
			t.Fatalf("expected index to contain %q", needle)
		}
	}
	for _, unwanted := range []string{
		"Generate API Key",
		"Run First Decision",
	} {
		if strings.Contains(body, unwanted) {
			t.Fatalf("expected index to omit %q", unwanted)
		}
	}
}
