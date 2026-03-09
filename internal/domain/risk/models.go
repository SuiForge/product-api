package risk

type CheckRequest struct {
	ProjectID  string            `json:"projectId"`
	StrategyID string            `json:"strategyId"`
	Symbol     string            `json:"symbol"`
	Side       string            `json:"side"`
	Price      string            `json:"price"`
	Size       string            `json:"size"`
	Context    map[string]string `json:"context,omitempty"`
}

type CheckResponse struct {
	Decision    string   `json:"decision"`
	RiskScore   float64  `json:"riskScore"`
	ReasonCodes []string `json:"reasonCodes"`
	Warnings    []string `json:"warnings"`
	EvidenceID  string   `json:"evidenceId"`
}
