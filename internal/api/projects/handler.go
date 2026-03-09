package projects

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"product-api/internal/domain/tenant"
	tenantservice "product-api/internal/services/tenant"
)

type Service interface {
	GetCurrent(context.Context) (*tenant.Project, error)
	GetUsage(context.Context) (*tenant.UsageSnapshot, error)
	ListAPIKeys(context.Context) (*tenant.APIKeyPage, error)
	CreateAPIKey(context.Context, tenant.CreateAPIKeyRequest) (*tenant.APIKey, error)
}

type Handler struct{ service Service }

func NewHandler(service ...Service) *Handler {
	if len(service) > 0 {
		return &Handler{service: service[0]}
	}
	return &Handler{}
}

func (h *Handler) GetCurrent(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.GetCurrent(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetUsage(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.GetUsage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) ListAPIKeys(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.ListAPIKeys(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) CreateAPIKey(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	var req tenant.CreateAPIKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "missing required fields"}})
		return
	}
	resp, err := h.service.CreateAPIKey(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, tenantservice.ErrWalletIdentityRequired) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": err.Error()}})
			return
		}
		if errors.Is(err, tenantservice.ErrAPIKeyAlreadyExists) {
			c.JSON(http.StatusConflict, gin.H{"error": gin.H{"code": "API_KEY_ALREADY_EXISTS", "message": err.Error()}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}
