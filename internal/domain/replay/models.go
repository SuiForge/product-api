package replay

type EvidenceReplay struct {
	EvidenceID  string   `json:"evidenceId"`
	Decision    string   `json:"decision"`
	RiskScore   float64  `json:"riskScore"`
	ReasonCodes []string `json:"reasonCodes"`
}
