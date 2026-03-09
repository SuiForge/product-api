package execution

type SummaryQuery struct {
	PoolID string
	Symbol string
	Window string
}

type Summary struct {
	PoolID         string  `json:"poolId"`
	Symbol         string  `json:"symbol"`
	Window         string  `json:"window"`
	Trades         int64   `json:"trades"`
	VolumeQuote    string  `json:"volumeQuote"`
	ExecutionScore float64 `json:"executionScore"`
}

type FillsQuery struct {
	PoolID string
	Window string
	Limit  int
	Cursor string
}

type Fill struct {
	TxDigest  string `json:"txDigest"`
	EventSeq  int32  `json:"eventSeq"`
	Price     string `json:"price"`
	QuoteSize string `json:"quoteSize"`
}

type FillPage struct {
	PoolID     string `json:"poolId"`
	Window     string `json:"window"`
	Count      int    `json:"count"`
	NextCursor string `json:"nextCursor"`
	Fills      []Fill `json:"fills"`
}

type LifecycleQuery struct {
	PoolID    string
	Window    string
	EventType string
	Limit     int
	Cursor    string
}

type LifecycleEvent struct {
	TxDigest  string `json:"txDigest"`
	EventSeq  int32  `json:"eventSeq"`
	EventType string `json:"eventType"`
}

type LifecyclePage struct {
	PoolID     string           `json:"poolId"`
	Window     string           `json:"window"`
	EventType  string           `json:"eventType"`
	Count      int              `json:"count"`
	NextCursor string           `json:"nextCursor"`
	Events     []LifecycleEvent `json:"events"`
}
