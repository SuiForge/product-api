package bootstrap

import (
	"time"

	"product-api/internal/api"
	authapi "product-api/internal/api/auth"
	"product-api/internal/config"
	alertopssvc "product-api/internal/services/alertops"
	"product-api/internal/services/demo"
	"product-api/internal/services/evidence"
	"product-api/internal/services/risk_engine"
	statestore "product-api/internal/services/state"
)

func BuildDependencies(cfg config.Config) api.Dependencies {
	evidenceService := evidence.NewService()
	riskService := risk_engine.NewService(evidenceService)
	sharedState := statestore.NewStore(cfg.DataFile)
	alertOpsService := alertopssvc.NewService(sharedState)
	tenantService := demo.NewTenantService(sharedState)

	return api.Dependencies{
		ExecutionService: demo.NewExecutionService(),
		RiskService:      riskService,
		ReplayService:    evidenceService,
		AlertsService:    demo.NewAlertsService(sharedState),
		AlertOpsService:  alertOpsService,
		TenantService:    tenantService,
		IdentityService:  tenantService,
		WalletVerifier:   authapi.NewNodeVerifier(nil, 5*time.Second),
		GoogleVerifier:   authapi.NewGoogleIDTokenVerifier(cfg.GoogleClientID, cfg.GoogleHostedDomain),
	}
}
