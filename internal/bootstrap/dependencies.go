package bootstrap

import (
	"time"

	"product-api/internal/adapters/deepbook"
	"product-api/internal/adapters/verticalindex"
	"product-api/internal/api"
	authapi "product-api/internal/api/auth"
	"product-api/internal/config"
	alertsvc "product-api/internal/services/alerting"
	alertopssvc "product-api/internal/services/alertops"
	contextsvc "product-api/internal/services/context"
	"product-api/internal/services/demo"
	"product-api/internal/services/evidence"
	"product-api/internal/services/risk_engine"
	statestore "product-api/internal/services/state"
	tenantsvc "product-api/internal/services/tenant"
)

func BuildDependencies(cfg config.Config) api.Dependencies {
	evidenceService := evidence.NewService()
	riskService := risk_engine.NewService(evidenceService)
	sharedState := statestore.NewStore(cfg.DataFile)
	alertOpsService := alertopssvc.NewService(sharedState)
	demoTenantService := demo.NewTenantService(sharedState)

	deps := api.Dependencies{
		ExecutionService: demo.NewExecutionService(),
		RiskService:      riskService,
		ReplayService:    evidenceService,
		AlertsService:    demo.NewAlertsService(sharedState),
		AlertOpsService:  alertOpsService,
		TenantService:    demoTenantService,
		IdentityService:  demoTenantService,
		WalletVerifier:   authapi.NewNodeVerifier(nil, 5*time.Second),
		GoogleVerifier:   authapi.NewGoogleIDTokenVerifier(cfg.GoogleClientID, cfg.GoogleHostedDomain),
	}

	if cfg.DeepBookAPIBaseURL != "" {
		deepbookClient := deepbook.NewClient(cfg.DeepBookAPIBaseURL, cfg.DeepBookAPIToken, cfg.DeepBookAPITimeout)
		deps.ExecutionService = contextsvc.NewService(deepbookClient)
	}

	if cfg.VerticalIndexAPIBaseURL != "" {
		verticalClient := verticalindex.NewClient(cfg.VerticalIndexAPIBaseURL, cfg.VerticalIndexAPIKey, cfg.VerticalIndexAPITimeout)
		deps.AlertsService = alertsvc.NewService(verticalClient, sharedState)
		tenantService := tenantsvc.NewService(verticalClient, sharedState)
		deps.TenantService = tenantService
		deps.IdentityService = tenantService
	}

	return deps
}
