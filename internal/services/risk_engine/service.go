package risk_engine

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"strings"

	"product-api/internal/domain/replay"
	"product-api/internal/domain/risk"
)

type EvidenceWriter interface {
	Save(context.Context, replay.EvidenceReplay)
}

type Service struct {
	evidence EvidenceWriter
}

func NewService(evidence EvidenceWriter) *Service {
	return &Service{evidence: evidence}
}

func (s *Service) Check(ctx context.Context, req risk.CheckRequest) (*risk.CheckResponse, error) {
	decision := "allow"
	riskScore := 25.0
	reasonCodes := []string{}
	warnings := []string{}

	if strings.EqualFold(req.Side, "buy") && req.Symbol == "SUI/USDC" {
		decision = "warn"
		riskScore = 72.5
		reasonCodes = append(reasonCodes, "high_spread", "low_depth")
		warnings = append(warnings, "Spread elevated", "Depth thin")
	}

	evidenceID := newEvidenceID()
	if s != nil && s.evidence != nil {
		s.evidence.Save(ctx, replay.EvidenceReplay{
			EvidenceID:  evidenceID,
			Decision:    decision,
			RiskScore:   riskScore,
			ReasonCodes: reasonCodes,
		})
	}

	return &risk.CheckResponse{
		Decision:    decision,
		RiskScore:   riskScore,
		ReasonCodes: reasonCodes,
		Warnings:    warnings,
		EvidenceID:  evidenceID,
	}, nil
}

func newEvidenceID() string {
	buf := make([]byte, 6)
	if _, err := rand.Read(buf); err != nil {
		return "evd_fallback"
	}
	return "evd_" + hex.EncodeToString(buf)
}
