package alerts

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"product-api/internal/domain/alerts"
	alertsvc "product-api/internal/services/alerting"
)

type Service interface {
	List(context.Context, alerts.ListQuery) (*alerts.AlertPage, error)
	ListDestinations(context.Context) (*alerts.DestinationPage, error)
	ListDeliveries(context.Context) (*alerts.DeliveryPage, error)
	CreateDestination(context.Context, alerts.CreateDestinationRequest) (*alerts.Destination, error)
	TestDestination(context.Context, alerts.TestDestinationRequest) (*alerts.TestDeliveryResult, error)
	RetryDelivery(context.Context, string) (*alerts.TestDeliveryResult, error)
}

type Handler struct{ service Service }

func NewHandler(service ...Service) *Handler {
	if len(service) > 0 {
		return &Handler{service: service[0]}
	}
	return &Handler{}
}

func (h *Handler) List(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.List(c.Request.Context(), alerts.ListQuery{
		ProjectID: c.Query("projectId"),
		Severity:  c.Query("severity"),
		Status:    c.Query("status"),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) ListDestinations(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.ListDestinations(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) ListDeliveries(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.ListDeliveries(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) CreateDestination(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	var req alerts.CreateDestinationRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.ProjectID) == "" || strings.TrimSpace(req.Type) == "" || strings.TrimSpace(req.Target) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "missing required fields"}})
		return
	}
	resp, err := h.service.CreateDestination(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, alertsvc.ErrWalletIdentityRequired) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": err.Error()}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *Handler) TestDestination(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	var req alerts.TestDestinationRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Target) == "" || strings.TrimSpace(req.Secret) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "target and secret are required"}})
		return
	}
	resp, err := h.service.TestDestination(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) RetryDelivery(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	deliveryID := strings.TrimSpace(c.Param("deliveryId"))
	if deliveryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "deliveryId is required"}})
		return
	}
	resp, err := h.service.RetryDelivery(c.Request.Context(), deliveryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}
