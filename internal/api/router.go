package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	alertopsapi "product-api/internal/api/alertops"
	alertapi "product-api/internal/api/alerts"
	authapi "product-api/internal/api/auth"
	executionapi "product-api/internal/api/execution"
	projectapi "product-api/internal/api/projects"
	replayapi "product-api/internal/api/replay"
	riskapi "product-api/internal/api/risk"
	"product-api/internal/config"
	"product-api/internal/console"
)

type Dependencies struct {
	ExecutionService executionapi.Service
	RiskService      riskapi.Service
	ReplayService    replayapi.Service
	AlertsService    alertapi.Service
	AlertOpsService  alertopsapi.MonitorService
	TenantService    projectapi.Service
	IdentityService  authapi.APIKeyValidator
	WalletVerifier   authapi.WalletSignatureVerifier
	GoogleVerifier   authapi.GoogleTokenVerifier
}

func NewRouter(cfg config.Config, deps Dependencies) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())

	r.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })
	r.GET("/console", gin.WrapH(console.IndexHandler()))
	r.GET("/console/app.js", gin.WrapH(console.ScriptHandler()))
	r.GET("/console/wallet-auth.js", gin.WrapH(console.WalletAuthScriptHandler()))
	r.GET("/console/styles.css", gin.WrapH(console.StyleHandler()))

	authHandler := authapi.NewHandler(authapi.NewManager(cfg.SessionSecret, cfg.SessionTTL, cfg.SessionCookieSecure), deps.IdentityService, authapi.WalletConfig{
		Verifier:     deps.WalletVerifier,
		ChallengeTTL: cfg.WalletChallengeTTL,
		PublicOrigin: cfg.PublicOrigin,
		Network:      cfg.SuiNetwork,
	}, authapi.GoogleConfig{
		Verifier:     deps.GoogleVerifier,
		ClientID:     cfg.GoogleClientID,
		HostedDomain: cfg.GoogleHostedDomain,
	})
	executionHandler := executionapi.NewHandler(deps.ExecutionService)
	riskHandler := riskapi.NewHandler(deps.RiskService)
	replayHandler := replayapi.NewHandler(deps.ReplayService)
	alertsHandler := alertapi.NewHandler(deps.AlertsService)
	projectsHandler := projectapi.NewHandler(deps.TenantService)
	alertOpsHandler := alertopsapi.NewHandler(deps.TenantService, deps.AlertsService, deps.AlertOpsService, deps.ReplayService)

	v1 := r.Group("/v1")
	{
		v1.GET("/alert-ops/manifest", alertOpsHandler.Manifest)
		v1.GET("/alert-ops/readiness", readinessHandler(cfg, deps))
		v1.GET("/auth/providers", authHandler.Providers)
		v1.POST("/auth/login", authHandler.Login)
		v1.POST("/auth/google/verify", authHandler.VerifyGoogleCredential)
		v1.POST("/auth/wallet/nonce", authHandler.IssueWalletNonce)
		v1.POST("/auth/wallet/verify", authHandler.VerifyWalletSignature)
		v1.GET("/auth/session", authHandler.CurrentSession)
		v1.POST("/auth/api-key/validate", authHandler.ValidateAPIKey)
		v1.POST("/auth/logout", authHandler.Logout)

		protected := v1.Group("")
		protected.Use(authHandler.RequireIdentity())
		protected.GET("/alert-ops/overview", alertOpsHandler.Overview)
		protected.GET("/alert-ops/rule-templates", alertOpsHandler.ListRuleTemplates)
		protected.GET("/alert-ops/monitors", alertOpsHandler.ListMonitors)
		protected.POST("/alert-ops/monitors", alertOpsHandler.CreateMonitor)
		protected.GET("/alert-ops/alerts", alertsHandler.List)
		protected.GET("/alert-ops/destinations", alertsHandler.ListDestinations)
		protected.POST("/alert-ops/destinations", alertsHandler.CreateDestination)
		protected.POST("/alert-ops/destinations/test", alertsHandler.TestDestination)
		protected.GET("/alert-ops/deliveries", alertsHandler.ListDeliveries)
		protected.POST("/alert-ops/deliveries/:deliveryId/retry", alertsHandler.RetryDelivery)
		protected.GET("/alert-ops/replays/:evidenceId", alertOpsHandler.Replay)
		protected.POST("/risk/check", riskHandler.Check)
		protected.GET("/execution/summaries", executionHandler.GetSummary)
		protected.GET("/execution/fills", executionHandler.GetFills)
		protected.GET("/execution/lifecycle", executionHandler.GetLifecycle)
		protected.GET("/replays/:evidenceId", replayHandler.GetByEvidenceID)
		protected.GET("/alerts", alertsHandler.List)
		protected.GET("/alerts/destinations", alertsHandler.ListDestinations)
		protected.POST("/alerts/destinations", alertsHandler.CreateDestination)
		protected.POST("/alerts/destinations/test", alertsHandler.TestDestination)
		protected.GET("/alerts/deliveries", alertsHandler.ListDeliveries)
		protected.POST("/alerts/deliveries/:deliveryId/retry", alertsHandler.RetryDelivery)
		protected.GET("/projects/me", projectsHandler.GetCurrent)
		protected.GET("/projects/me/usage", projectsHandler.GetUsage)
		protected.GET("/projects/me/api-keys", projectsHandler.ListAPIKeys)
		protected.POST("/projects/me/api-keys", projectsHandler.CreateAPIKey)
	}

	return r
}
