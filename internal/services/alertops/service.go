package alertops

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"sort"
	"strings"
	"time"

	domain "product-api/internal/domain/alertops"
	statestore "product-api/internal/services/state"
)

type Service struct {
	templates []domain.RuleTemplate
	defaults  []domain.Monitor
	store     *statestore.Store
}

func NewService(stores ...*statestore.Store) *Service {
	now := time.Now().UTC().Unix()
	service := &Service{
		templates: []domain.RuleTemplate{
			{ID: "wallet_outflow", Name: "Wallet Outflow", Description: "Track large wallet outflows and treasury movement.", TargetTypes: []string{"wallet"}, DefaultSeverity: "high", EventTypes: []string{"wallet_outflow", "whale_alert"}},
			{ID: "liquidity_drop", Name: "Liquidity Drop", Description: "Detect pool liquidity changes and sudden depth loss.", TargetTypes: []string{"pool"}, DefaultSeverity: "medium", EventTypes: []string{"liquidity_drop"}},
			{ID: "protocol_anomaly", Name: "Protocol Anomaly", Description: "Watch protocol addresses for unusual activity spikes.", TargetTypes: []string{"protocol", "wallet"}, DefaultSeverity: "medium", EventTypes: []string{"protocol_anomaly", "risk_alert"}},
		},
		defaults: []domain.Monitor{
			{ID: "mon_demo_treasury", Name: "Treasury Outflow Watch", TargetType: "wallet", TargetValue: "0x1111111111111111111111111111111111111111111111111111111111111111", RuleTemplateID: "wallet_outflow", Severity: "high", Status: "active", CreatedAt: now - 7200},
			{ID: "mon_demo_pool", Name: "SUI/USDC Liquidity Watch", TargetType: "pool", TargetValue: "0xe05dafb5133bcffb8d59f4e12465dc0e9faeaa05e3e342a08fe135800e3e4407", RuleTemplateID: "liquidity_drop", Severity: "medium", Status: "active", CreatedAt: now - 3600},
		},
	}
	if len(stores) > 0 {
		service.store = stores[0]
		_, _ = service.store.Update(func(snapshot *statestore.Snapshot) error {
			if len(snapshot.Monitors) == 0 {
				snapshot.Monitors = append([]domain.Monitor(nil), service.defaults...)
			}
			return nil
		})
	}
	return service
}

func (s *Service) ListRuleTemplates(context.Context) ([]domain.RuleTemplate, error) {
	items := make([]domain.RuleTemplate, len(s.templates))
	copy(items, s.templates)
	return items, nil
}

func (s *Service) ListMonitors(context.Context) (*domain.MonitorPage, error) {
	items, err := s.monitors()
	if err != nil {
		return nil, err
	}
	sort.Slice(items, func(i, j int) bool { return items[i].CreatedAt > items[j].CreatedAt })
	return &domain.MonitorPage{Count: len(items), Monitors: items}, nil
}

func (s *Service) CreateMonitor(_ context.Context, req domain.CreateMonitorRequest) (*domain.Monitor, error) {
	monitor := domain.Monitor{
		ID:             buildID(req.Name, req.TargetType, req.TargetValue, req.RuleTemplateID),
		Name:           defaultString(req.Name, "New Monitor"),
		TargetType:     defaultString(req.TargetType, "wallet"),
		TargetValue:    strings.TrimSpace(req.TargetValue),
		RuleTemplateID: defaultString(req.RuleTemplateID, "wallet_outflow"),
		Severity:       defaultString(req.Severity, "medium"),
		Status:         "active",
		CreatedAt:      time.Now().UTC().Unix(),
	}
	if s.store == nil {
		s.defaults = append(s.defaults, monitor)
		return &monitor, nil
	}
	_, err := s.store.Update(func(snapshot *statestore.Snapshot) error {
		if len(snapshot.Monitors) == 0 {
			snapshot.Monitors = append([]domain.Monitor(nil), s.defaults...)
		}
		snapshot.Monitors = append(snapshot.Monitors, monitor)
		return nil
	})
	if err != nil {
		return nil, err
	}
	return &monitor, nil
}

func (s *Service) monitors() ([]domain.Monitor, error) {
	if s.store == nil {
		items := append([]domain.Monitor(nil), s.defaults...)
		return items, nil
	}
	snapshot, err := s.store.Snapshot()
	if err != nil {
		return nil, err
	}
	if len(snapshot.Monitors) == 0 {
		return append([]domain.Monitor(nil), s.defaults...), nil
	}
	return append([]domain.Monitor(nil), snapshot.Monitors...), nil
}

func defaultString(value, fallback string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return fallback
	}
	return trimmed
}

func buildID(parts ...string) string {
	sum := sha1.Sum([]byte(strings.Join(parts, "|")))
	return "mon_" + hex.EncodeToString(sum[:])[:12]
}
