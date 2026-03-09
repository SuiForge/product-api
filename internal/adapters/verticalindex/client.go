package verticalindex

import (
	"bytes"
	stdctx "context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	alertsvc "product-api/internal/services/alerting"
	tenantsvc "product-api/internal/services/tenant"
)

type Client struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

func NewClient(baseURL string, apiKey string, timeout time.Duration) *Client {
	if timeout <= 0 {
		timeout = 5 * time.Second
	}
	return &Client{
		baseURL: strings.TrimRight(baseURL, "/"),
		apiKey:  apiKey,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

func (c *Client) ListAnomalyAlerts(ctx stdctx.Context, severity string, limit int) (*alertsvc.UpstreamAlertPage, error) {
	query := url.Values{}
	if strings.TrimSpace(severity) != "" {
		query.Set("severity", strings.TrimSpace(severity))
	}
	if limit > 0 {
		query.Set("limit", fmt.Sprintf("%d", limit))
	}

	var page alertsvc.UpstreamAlertPage
	if err := c.doJSON(ctx, http.MethodGet, "/api/alerts/anomalies", query, nil, &page); err != nil {
		return nil, err
	}
	return &page, nil
}

func (c *Client) UpsertWebhookConfig(ctx stdctx.Context, walletAddress string, webhookURL string, eventTypes []string) (*alertsvc.UpstreamWebhookConfig, error) {
	payload := url.Values{}
	payload.Set("wallet_address", strings.TrimSpace(walletAddress))
	payload.Set("webhook_url", strings.TrimSpace(webhookURL))
	if len(eventTypes) == 0 {
		eventTypes = []string{"risk_alert", "whale_alert"}
	}
	rawEventTypes, err := json.Marshal(eventTypes)
	if err != nil {
		return nil, err
	}
	payload.Set("event_types", string(rawEventTypes))

	var cfg alertsvc.UpstreamWebhookConfig
	if err := c.doJSON(ctx, http.MethodPut, "/api/webhook", nil, payload, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func (c *Client) GetSubscriptionStatus(ctx stdctx.Context) (*tenantsvc.UpstreamSubscription, error) {
	var subscription tenantsvc.UpstreamSubscription
	if err := c.doJSON(ctx, http.MethodGet, "/api/subscription", nil, nil, &subscription); err != nil {
		return nil, err
	}
	return &subscription, nil
}

func (c *Client) GetUsageStats(ctx stdctx.Context) ([]tenantsvc.UpstreamUsageDay, error) {
	var usage []tenantsvc.UpstreamUsageDay
	if err := c.doJSON(ctx, http.MethodGet, "/api/stats/usage", nil, nil, &usage); err != nil {
		return nil, err
	}
	return usage, nil
}

func (c *Client) CreateAPIKey(ctx stdctx.Context, walletAddress string, ownerName string) (*tenantsvc.UpstreamAPIKeyResponse, error) {
	payload := url.Values{}
	payload.Set("wallet_address", strings.TrimSpace(walletAddress))
	payload.Set("owner_name", strings.TrimSpace(ownerName))

	var response tenantsvc.UpstreamAPIKeyResponse
	if err := c.doJSON(ctx, http.MethodPost, "/api/keys", nil, payload, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) ValidateAPIKey(ctx stdctx.Context, rawKey string) (*tenantsvc.UpstreamSubscription, error) {
	validator := *c
	validator.apiKey = strings.TrimSpace(rawKey)
	return validator.GetSubscriptionStatus(ctx)
}

func (c *Client) doJSON(ctx stdctx.Context, method string, path string, query url.Values, form url.Values, target any) error {
	endpoint := c.baseURL + path
	var body io.Reader
	if len(form) > 0 {
		body = bytes.NewBufferString(form.Encode())
	}

	req, err := http.NewRequestWithContext(ctx, method, endpoint, body)
	if err != nil {
		return err
	}
	if query != nil {
		req.URL.RawQuery = query.Encode()
	}
	if strings.TrimSpace(c.apiKey) != "" {
		req.Header.Set("X-API-Key", c.apiKey)
	}
	if len(form) > 0 {
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= http.StatusBadRequest {
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return fmt.Errorf("vertical index request failed: status=%d body=%s", resp.StatusCode, strings.TrimSpace(string(raw)))
	}

	if err := json.NewDecoder(resp.Body).Decode(target); err != nil {
		return fmt.Errorf("decode vertical index response: %w", err)
	}
	return nil
}
