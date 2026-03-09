package replay

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"product-api/internal/domain/replay"
	"product-api/internal/services/evidence"
)

type Service interface {
	Get(context.Context, string) (*replay.EvidenceReplay, error)
}

type Handler struct{ service Service }

func NewHandler(service ...Service) *Handler {
	if len(service) > 0 {
		return &Handler{service: service[0]}
	}
	return &Handler{}
}

func (h *Handler) GetByEvidenceID(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented", "evidenceId": c.Param("evidenceId")})
		return
	}
	resp, err := h.service.Get(c.Request.Context(), c.Param("evidenceId"))
	if err != nil {
		if errors.Is(err, evidence.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "evidence not found"}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}
