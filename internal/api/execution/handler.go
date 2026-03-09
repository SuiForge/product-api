package execution

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"product-api/internal/domain/execution"
)

type Service interface {
	GetSummary(context.Context, execution.SummaryQuery) (*execution.Summary, error)
	GetFills(context.Context, execution.FillsQuery) (*execution.FillPage, error)
	GetLifecycle(context.Context, execution.LifecycleQuery) (*execution.LifecyclePage, error)
}

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetSummary(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.GetSummary(c.Request.Context(), execution.SummaryQuery{
		PoolID: c.Query("poolId"),
		Symbol: c.Query("symbol"),
		Window: defaultWindow(c.Query("window")),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetFills(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.GetFills(c.Request.Context(), execution.FillsQuery{
		PoolID: c.Query("poolId"),
		Window: defaultWindow(c.Query("window")),
		Limit:  defaultLimit(c.Query("limit")),
		Cursor: c.Query("cursor"),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetLifecycle(c *gin.Context) {
	if h == nil || h.service == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "not_implemented"})
		return
	}
	resp, err := h.service.GetLifecycle(c.Request.Context(), execution.LifecycleQuery{
		PoolID:    c.Query("poolId"),
		Window:    defaultWindow(c.Query("window")),
		EventType: c.Query("eventType"),
		Limit:     defaultLimit(c.Query("limit")),
		Cursor:    c.Query("cursor"),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func defaultWindow(window string) string {
	if window == "" {
		return "1h"
	}
	return window
}

func defaultLimit(raw string) int {
	if raw == "" {
		return 100
	}
	parsed, err := strconv.Atoi(raw)
	if err != nil || parsed <= 0 {
		return 100
	}
	return parsed
}
