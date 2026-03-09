package api

import (
	"strings"

	"github.com/gin-gonic/gin"

	"product-api/internal/config"
)

type readinessService struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Focus string `json:"focus"`
}

type readinessAuth struct {
	GoogleEnabled         bool   `json:"googleEnabled"`
	GoogleHostedDomain    string `json:"googleHostedDomain,omitempty"`
	WalletEnabled         bool   `json:"walletEnabled"`
	WalletNetwork         string `json:"walletNetwork"`
	APIKeyValidationReady bool   `json:"apiKeyValidationReady"`
}

type readinessInfrastructure struct {
	PublicOrigin           string `json:"publicOrigin,omitempty"`
	PersistentStateEnabled bool   `json:"persistentStateEnabled"`
	DataFile               string `json:"dataFile,omitempty"`
	ExecutionEmbedded      bool   `json:"executionEmbedded"`
	AlertingEmbedded       bool   `json:"alertingEmbedded"`
}

type readinessResponse struct {
	Service        readinessService        `json:"service"`
	Status         string                  `json:"status"`
	Summary        string                  `json:"summary"`
	Auth           readinessAuth           `json:"auth"`
	Infrastructure readinessInfrastructure `json:"infrastructure"`
	NextActions    []string                `json:"nextActions"`
}

func readinessHandler(cfg config.Config, deps Dependencies) gin.HandlerFunc {
	response := buildReadinessResponse(cfg, deps)
	return func(c *gin.Context) {
		c.JSON(200, response)
	}
}

func buildReadinessResponse(cfg config.Config, deps Dependencies) readinessResponse {
	googleEnabled := strings.TrimSpace(cfg.GoogleClientID) != "" && deps.GoogleVerifier != nil
	walletEnabled := deps.WalletVerifier != nil && strings.TrimSpace(cfg.PublicOrigin) != ""
	apiKeyValidationReady := deps.IdentityService != nil
	persistentStateEnabled := strings.TrimSpace(cfg.DataFile) != ""
	executionEmbedded := true
	alertingEmbedded := true

	status := "setup_required"
	summary := "Core auth or persistence configuration is still missing."
	if walletEnabled && apiKeyValidationReady && persistentStateEnabled && executionEmbedded && alertingEmbedded {
		status = "pilot_ready"
		summary = "Core wallet auth, API key validation, persistent state, and embedded product capabilities are ready for demos and paid pilots."
	}
	if status == "pilot_ready" && googleEnabled {
		status = "production_ready"
		summary = "Auth, persistence, and embedded product capabilities are ready for public-facing rollout from a single service."
	}

	nextActions := make([]string, 0, 5)
	if !googleEnabled {
		nextActions = append(nextActions, "Set PRODUCT_API_GOOGLE_CLIENT_ID to enable Google operator login.")
	}
	if !walletEnabled {
		nextActions = append(nextActions, "Set PRODUCT_API_PUBLIC_ORIGIN and keep wallet verification enabled for signed Sui wallet login.")
	}
	if !apiKeyValidationReady {
		nextActions = append(nextActions, "Attach API key validation so protected routes can be called with X-API-Key.")
	}
	if !persistentStateEnabled {
		nextActions = append(nextActions, "Set PRODUCT_API_DATA_FILE so monitors, deliveries, and API keys persist across restarts.")
	}
	if !executionEmbedded || !alertingEmbedded {
		nextActions = append(nextActions, "Keep the embedded execution, alerting, and tenant capabilities enabled inside product-api.")
	}
	if len(nextActions) == 0 {
		nextActions = append(nextActions, "Point a public domain at /console and start live pilot onboarding.")
	}

	return readinessResponse{
		Service: readinessService{
			ID:    "sui-alert-ops",
			Name:  "Sui Alert Ops",
			Focus: "Real-time alerting and incident response for Sui teams",
		},
		Status:  status,
		Summary: summary,
		Auth: readinessAuth{
			GoogleEnabled:         googleEnabled,
			GoogleHostedDomain:    strings.TrimSpace(cfg.GoogleHostedDomain),
			WalletEnabled:         walletEnabled,
			WalletNetwork:         readinessDefaultString(strings.TrimSpace(cfg.SuiNetwork), "mainnet"),
			APIKeyValidationReady: apiKeyValidationReady,
		},
		Infrastructure: readinessInfrastructure{
			PublicOrigin:           strings.TrimSpace(cfg.PublicOrigin),
			PersistentStateEnabled: persistentStateEnabled,
			DataFile:               strings.TrimSpace(cfg.DataFile),
			ExecutionEmbedded:      executionEmbedded,
			AlertingEmbedded:       alertingEmbedded,
		},
		NextActions: nextActions,
	}
}

func readinessDefaultString(value string, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return strings.TrimSpace(value)
}
