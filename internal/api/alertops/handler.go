package alertops

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	alertopsdomain "product-api/internal/domain/alertops"
	"product-api/internal/domain/alerts"
	"product-api/internal/domain/replay"
	"product-api/internal/domain/tenant"
	"product-api/internal/services/evidence"
)

type ProjectService interface {
	GetCurrent(context.Context) (*tenant.Project, error)
	GetUsage(context.Context) (*tenant.UsageSnapshot, error)
}

type AlertsService interface {
	List(context.Context, alerts.ListQuery) (*alerts.AlertPage, error)
}

type MonitorService interface {
	ListRuleTemplates(context.Context) ([]alertopsdomain.RuleTemplate, error)
	ListMonitors(context.Context) (*alertopsdomain.MonitorPage, error)
	CreateMonitor(context.Context, alertopsdomain.CreateMonitorRequest) (*alertopsdomain.Monitor, error)
}

type ReplayService interface {
	Get(context.Context, string) (*replay.EvidenceReplay, error)
}

type Handler struct {
	projects ProjectService
	alerts   AlertsService
	monitors MonitorService
	replay   ReplayService
}

type ServiceDescriptor struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Focus        string   `json:"focus"`
	PrimaryValue string   `json:"primaryValue"`
	Capabilities []string `json:"capabilities"`
	AuthMethods  []string `json:"authMethods"`
}

type AlertsOverview struct {
	Count            int            `json:"count"`
	HighSeverity     int            `json:"highSeverity"`
	LatestEvidenceID string         `json:"latestEvidenceId,omitempty"`
	Latest           []alerts.Alert `json:"latest,omitempty"`
}

type DestinationsOverview struct {
	SupportedTypes []string `json:"supportedTypes"`
	WalletRequired bool     `json:"walletRequired"`
}

type ReplayOverview struct {
	Available bool   `json:"available"`
	Mode      string `json:"mode"`
}

type OverviewResponse struct {
	Service      ServiceDescriptor     `json:"service"`
	Workspace    *tenant.Project       `json:"workspace,omitempty"`
	Usage        *tenant.UsageSnapshot `json:"usage,omitempty"`
	Alerts       AlertsOverview        `json:"alerts"`
	Destinations DestinationsOverview  `json:"destinations"`
	Replay       ReplayOverview        `json:"replay"`
}

func NewHandler(projects ProjectService, alerts AlertsService, monitors MonitorService, replayServices ...ReplayService) *Handler {
	var replayService ReplayService
	if len(replayServices) > 0 {
		replayService = replayServices[0]
	}
	return &Handler{projects: projects, alerts: alerts, monitors: monitors, replay: replayService}
}

func (h *Handler) Manifest(c *gin.Context) {
	c.JSON(http.StatusOK, manifest())
}

func (h *Handler) Overview(c *gin.Context) {
	if h == nil || h.projects == nil || h.alerts == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}

	project, err := h.projects.GetCurrent(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	usage, err := h.projects.GetUsage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	alertPage, err := h.alerts.List(c.Request.Context(), alerts.ListQuery{ProjectID: project.ID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	latest := alertPage.Alerts
	if len(latest) > 5 {
		latest = latest[:5]
	}
	latestEvidenceID := ""
	if len(latest) > 0 {
		latestEvidenceID = strings.TrimSpace(latest[0].EvidenceID)
	}
	highSeverity := 0
	for _, alert := range alertPage.Alerts {
		if strings.EqualFold(strings.TrimSpace(alert.Severity), "high") {
			highSeverity++
		}
	}

	c.JSON(http.StatusOK, OverviewResponse{
		Service:   manifest(),
		Workspace: project,
		Usage:     usage,
		Alerts: AlertsOverview{
			Count:            alertPage.Count,
			HighSeverity:     highSeverity,
			LatestEvidenceID: latestEvidenceID,
			Latest:           latest,
		},
		Destinations: DestinationsOverview{
			SupportedTypes: []string{"webhook"},
			WalletRequired: true,
		},
		Replay: ReplayOverview{
			Available: true,
			Mode:      "evidence_replay",
		},
	})
}

func (h *Handler) Replay(c *gin.Context) {
	if h == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	evidenceID := strings.TrimSpace(c.Param("evidenceId"))
	if evidenceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "evidenceId is required"}})
		return
	}
	if h.replay != nil {
		resp, err := h.replay.Get(c.Request.Context(), evidenceID)
		if err == nil && resp != nil {
			c.JSON(http.StatusOK, resp)
			return
		}
		if err != nil && !errors.Is(err, evidence.ErrNotFound) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	fallback, err := h.deriveReplayFromAlerts(c.Request.Context(), evidenceID)
	if err == nil && fallback != nil {
		c.JSON(http.StatusOK, fallback)
		return
	}
	if err != nil && !errors.Is(err, evidence.ErrNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "evidence not found"}})
}

func (h *Handler) ListRuleTemplates(c *gin.Context) {
	if h == nil || h.monitors == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.monitors.ListRuleTemplates(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) ListMonitors(c *gin.Context) {
	if h == nil || h.monitors == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.monitors.ListMonitors(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) CreateMonitor(c *gin.Context) {
	if h == nil || h.monitors == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	var req alertopsdomain.CreateMonitorRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.TargetType) == "" || strings.TrimSpace(req.TargetValue) == "" || strings.TrimSpace(req.RuleTemplateID) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "missing required fields"}})
		return
	}
	resp, err := h.monitors.CreateMonitor(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *Handler) deriveReplayFromAlerts(ctx context.Context, evidenceID string) (*replay.EvidenceReplay, error) {
	if h == nil || h.alerts == nil {
		return nil, evidence.ErrNotFound
	}
	page, err := h.alerts.List(ctx, alerts.ListQuery{})
	if err != nil {
		return nil, err
	}
	for _, item := range page.Alerts {
		if strings.TrimSpace(item.EvidenceID) != evidenceID && strings.TrimSpace(item.ID) != evidenceID {
			continue
		}
		return &replay.EvidenceReplay{
			EvidenceID:  evidenceID,
			Decision:    deriveReplayDecision(item.Severity),
			RiskScore:   deriveReplayScore(item.Severity),
			ReasonCodes: deriveReplayReasons(item),
		}, nil
	}
	return nil, evidence.ErrNotFound
}

func deriveReplayDecision(severity string) string {
	switch strings.ToLower(strings.TrimSpace(severity)) {
	case "high":
		return "review"
	case "low":
		return "observe"
	default:
		return "warn"
	}
}

func deriveReplayScore(severity string) float64 {
	switch strings.ToLower(strings.TrimSpace(severity)) {
	case "high":
		return 80
	case "low":
		return 35
	default:
		return 60
	}
}

func deriveReplayReasons(item alerts.Alert) []string {
	reasons := []string{}
	if value := strings.TrimSpace(item.Type); value != "" {
		reasons = append(reasons, value)
	}
	if value := strings.TrimSpace(item.Source); value != "" {
		reasons = append(reasons, value)
	}
	if value := strings.TrimSpace(item.Severity); value != "" {
		reasons = append(reasons, "severity_"+strings.ToLower(value))
	}
	if len(reasons) == 0 {
		return []string{"alert_detected"}
	}
	return reasons
}

func manifest() ServiceDescriptor {
	return ServiceDescriptor{
		ID:           "sui-alert-ops",
		Name:         "Sui Alert Ops",
		Focus:        "Real-time alerting and incident response for Sui teams",
		PrimaryValue: "Detect important chain activity, route it to the right channel, and keep evidence ready for replay",
		Capabilities: []string{"alerts", "destinations", "replay", "workspace-access"},
		AuthMethods:  []string{"google", "wallet", "api-key"},
	}
}
