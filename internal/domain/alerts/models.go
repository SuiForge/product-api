package alerts

type ListQuery struct {
	ProjectID string
	Severity  string
	Status    string
}

type Alert struct {
	ID         string `json:"id"`
	Type       string `json:"type"`
	Severity   string `json:"severity"`
	Source     string `json:"source"`
	Timestamp  int64  `json:"timestamp"`
	EvidenceID string `json:"evidenceId"`
}

type AlertPage struct {
	Count  int     `json:"count"`
	Alerts []Alert `json:"alerts"`
}

type CreateDestinationRequest struct {
	ProjectID  string   `json:"projectId"`
	Type       string   `json:"type"`
	Target     string   `json:"target"`
	EventTypes []string `json:"eventTypes,omitempty"`
}

type Destination struct {
	ID                 string   `json:"id"`
	Type               string   `json:"type"`
	Target             string   `json:"target"`
	Status             string   `json:"status"`
	EventTypes         []string `json:"eventTypes,omitempty"`
	WebhookSecret      string   `json:"webhookSecret,omitempty"`
	SignatureHeader    string   `json:"signatureHeader,omitempty"`
	TimestampHeader    string   `json:"timestampHeader,omitempty"`
	SignatureAlgorithm string   `json:"signatureAlgorithm,omitempty"`
}

type DestinationPage struct {
	Count        int           `json:"count"`
	Destinations []Destination `json:"destinations"`
}

type DeliveryAttempt struct {
	ID              string         `json:"id"`
	DestinationID   string         `json:"destinationId,omitempty"`
	Target          string         `json:"target"`
	EventType       string         `json:"eventType"`
	Delivered       bool           `json:"delivered"`
	Status          string         `json:"status"`
	StatusCode      int            `json:"statusCode"`
	SignatureHeader string         `json:"signatureHeader,omitempty"`
	TimestampHeader string         `json:"timestampHeader,omitempty"`
	Timestamp       string         `json:"timestamp,omitempty"`
	Signature       string         `json:"signature,omitempty"`
	ResponseBody    string         `json:"responseBody,omitempty"`
	Payload         map[string]any `json:"payload,omitempty"`
	SentAt          int64          `json:"sentAt"`
	RetryOf         string         `json:"retryOf,omitempty"`
}

type DeliveryPage struct {
	Count      int               `json:"count"`
	Deliveries []DeliveryAttempt `json:"deliveries"`
}

type TestDestinationRequest struct {
	DestinationID string         `json:"destinationId,omitempty"`
	Target        string         `json:"target"`
	Secret        string         `json:"secret"`
	EventType     string         `json:"eventType"`
	Payload       map[string]any `json:"payload"`
}

type TestDeliveryResult struct {
	Delivered       bool   `json:"delivered"`
	StatusCode      int    `json:"statusCode"`
	Target          string `json:"target"`
	EventType       string `json:"eventType"`
	SignatureHeader string `json:"signatureHeader"`
	TimestampHeader string `json:"timestampHeader"`
	Timestamp       string `json:"timestamp"`
	Signature       string `json:"signature"`
	ResponseBody    string `json:"responseBody,omitempty"`
}
