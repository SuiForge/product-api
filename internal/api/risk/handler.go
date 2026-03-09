package risk

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"product-api/internal/domain/risk"
)

type Service interface {
	Check(context.Context, risk.CheckRequest) (*risk.CheckResponse, error)
}

type Handler struct{ service Service }

func NewHandler(service ...Service) *Handler {
	if len(service) > 0 {
		return &Handler{service: service[0]}
	}
	return &Handler{}
}

func (h *Handler) Check(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}

	var req risk.CheckRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "invalid request body"}})
		return
	}
	if invalid(req) {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "missing required fields"}})
		return
	}

	resp, err := h.service.Check(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func invalid(req risk.CheckRequest) bool {
	return strings.TrimSpace(req.ProjectID) == "" || strings.TrimSpace(req.StrategyID) == "" || strings.TrimSpace(req.Symbol) == "" || strings.TrimSpace(req.Side) == "" || strings.TrimSpace(req.Price) == "" || strings.TrimSpace(req.Size) == ""
}
