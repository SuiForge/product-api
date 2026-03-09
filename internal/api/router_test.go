package api_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"product-api/internal/api"
	"product-api/internal/config"
)

func TestRouterRegistersProductSurface(t *testing.T) {
	t.Parallel()

	router := api.NewRouter(config.Config{}, api.Dependencies{})

	cases := []struct {
		method string
		path   string
	}{
		{http.MethodGet, "/v1/alert-ops/manifest"},
		{http.MethodGet, "/v1/alert-ops/readiness"},
		{http.MethodGet, "/v1/alert-ops/overview"},
		{http.MethodGet, "/v1/alert-ops/rule-templates"},
		{http.MethodGet, "/v1/alert-ops/monitors"},
		{http.MethodPost, "/v1/alert-ops/monitors"},
		{http.MethodGet, "/v1/alert-ops/alerts"},
		{http.MethodGet, "/v1/alert-ops/destinations"},
		{http.MethodPost, "/v1/alert-ops/destinations"},
		{http.MethodPost, "/v1/alert-ops/destinations/test"},
		{http.MethodGet, "/v1/alert-ops/deliveries"},
		{http.MethodPost, "/v1/alert-ops/deliveries/dlv_1/retry"},
		{http.MethodGet, "/v1/alert-ops/replays/evd_123"},
		{http.MethodPost, "/v1/risk/check"},
		{http.MethodGet, "/v1/execution/summaries"},
		{http.MethodGet, "/v1/execution/fills"},
		{http.MethodGet, "/v1/execution/lifecycle"},
		{http.MethodGet, "/v1/replays/evd_123"},
		{http.MethodGet, "/v1/alerts"},
		{http.MethodGet, "/v1/alerts/deliveries"},
		{http.MethodPost, "/v1/alerts/destinations"},
		{http.MethodPost, "/v1/alerts/deliveries/dlv_1/retry"},
		{http.MethodGet, "/v1/projects/me"},
		{http.MethodGet, "/v1/projects/me/usage"},
		{http.MethodGet, "/v1/projects/me/api-keys"},
		{http.MethodPost, "/v1/projects/me/api-keys"},
	}

	for _, tc := range cases {
		req := httptest.NewRequest(tc.method, tc.path, nil)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		if rec.Code == http.StatusNotFound {
			t.Fatalf("expected route %s %s to exist", tc.method, tc.path)
		}
	}
}
