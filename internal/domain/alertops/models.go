package alertops

type RuleTemplate struct {
	ID              string   `json:"id"`
	Name            string   `json:"name"`
	Description     string   `json:"description"`
	TargetTypes     []string `json:"targetTypes"`
	DefaultSeverity string   `json:"defaultSeverity"`
	EventTypes      []string `json:"eventTypes"`
}

type Monitor struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	TargetType     string `json:"targetType"`
	TargetValue    string `json:"targetValue"`
	RuleTemplateID string `json:"ruleTemplateId"`
	Severity       string `json:"severity"`
	Status         string `json:"status"`
	CreatedAt      int64  `json:"createdAt"`
}

type MonitorPage struct {
	Count    int       `json:"count"`
	Monitors []Monitor `json:"monitors"`
}

type CreateMonitorRequest struct {
	Name           string `json:"name"`
	TargetType     string `json:"targetType"`
	TargetValue    string `json:"targetValue"`
	RuleTemplateID string `json:"ruleTemplateId"`
	Severity       string `json:"severity"`
}
