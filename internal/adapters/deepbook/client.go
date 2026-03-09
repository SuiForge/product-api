package deepbook

import (
	stdctx "context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	contextsvc "product-api/internal/services/context"
)

type Client struct {
	baseURL    string
	token      string
	httpClient *http.Client
}

func NewClient(baseURL string, token string, timeout time.Duration) *Client {
	if timeout <= 0 {
		timeout = 5 * time.Second
	}
	return &Client{
		baseURL: strings.TrimRight(baseURL, "/"),
		token:   token,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

func (c *Client) GetExecutionSummary(ctx stdctx.Context, poolID string, window string) (*contextsvc.UpstreamSummary, error) {
	endpoint := fmt.Sprintf("/v1/deepbook/pools/%s/execution/summary", url.PathEscape(poolID))
	query := url.Values{}
	query.Set("window", window)

	var resp contextsvc.UpstreamSummary
	if err := c.get(ctx, endpoint, query, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) GetExecutionFills(ctx stdctx.Context, poolID string, window string, limit int, cursor string) (*contextsvc.UpstreamFillPage, error) {
	endpoint := fmt.Sprintf("/v1/deepbook/pools/%s/execution/fills", url.PathEscape(poolID))
	query := url.Values{}
	query.Set("window", window)
	query.Set("limit", fmt.Sprintf("%d", limit))
	if strings.TrimSpace(cursor) != "" {
		query.Set("cursor", cursor)
	}

	var resp contextsvc.UpstreamFillPage
	if err := c.get(ctx, endpoint, query, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) GetExecutionLifecycle(ctx stdctx.Context, poolID string, window string, eventType string, limit int, cursor string) (*contextsvc.UpstreamLifecyclePage, error) {
	endpoint := fmt.Sprintf("/v1/deepbook/pools/%s/execution/lifecycle", url.PathEscape(poolID))
	query := url.Values{}
	query.Set("window", window)
	query.Set("limit", fmt.Sprintf("%d", limit))
	if strings.TrimSpace(eventType) != "" {
		query.Set("event_type", eventType)
	}
	if strings.TrimSpace(cursor) != "" {
		query.Set("cursor", cursor)
	}

	var resp contextsvc.UpstreamLifecyclePage
	if err := c.get(ctx, endpoint, query, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) get(ctx stdctx.Context, endpoint string, query url.Values, target any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+endpoint, nil)
	if err != nil {
		return err
	}
	req.URL.RawQuery = query.Encode()
	if strings.TrimSpace(c.token) != "" {
		req.Header.Set("Authorization", "Bearer "+c.token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= http.StatusBadRequest {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return fmt.Errorf("deepbook request failed: status=%d body=%s", resp.StatusCode, strings.TrimSpace(string(body)))
	}

	if err := json.NewDecoder(resp.Body).Decode(target); err != nil {
		return fmt.Errorf("decode deepbook response: %w", err)
	}

	return nil
}
