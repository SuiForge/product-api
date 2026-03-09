package tenant

type UsageSnapshot struct {
	Requests int64 `json:"requests"`
	Alerts   int64 `json:"alerts"`
}

type Project struct {
	ID    string        `json:"id"`
	Name  string        `json:"name"`
	Plan  string        `json:"plan"`
	Usage UsageSnapshot `json:"usage"`
}

type CreateAPIKeyRequest struct {
	Name string `json:"name"`
}

type APIKey struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Token         string `json:"token,omitempty"`
	TokenPreview  string `json:"tokenPreview"`
	WalletAddress string `json:"walletAddress,omitempty"`
	PlanTier      string `json:"planTier,omitempty"`
	ExpiresAt     string `json:"expiresAt,omitempty"`
	Message       string `json:"message,omitempty"`
	CreatedAt     int64  `json:"createdAt,omitempty"`
}

type APIKeyPage struct {
	Count   int      `json:"count"`
	APIKeys []APIKey `json:"apiKeys"`
}
