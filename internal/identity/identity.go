package identity

import (
	"context"
	"net/mail"
	"regexp"
	"strings"
)

type contextKey string

const identityContextKey contextKey = "product.identity"

var suiWalletPattern = regexp.MustCompile(`^0x[0-9a-fA-F]{64}$`)

type Identity struct {
	AuthMethod    string `json:"authMethod"`
	WalletAddress string `json:"walletAddress"`
	WorkspaceName string `json:"workspaceName"`
	OperatorName  string `json:"operatorName"`
	GoogleSubject string `json:"googleSubject,omitempty"`
	Email         string `json:"email,omitempty"`
	Picture       string `json:"picture,omitempty"`
	PlanTier      string `json:"planTier,omitempty"`
	APIKeyPreview string `json:"apiKeyPreview,omitempty"`
	IssuedAt      int64  `json:"issuedAt,omitempty"`
	ExpiresAt     int64  `json:"expiresAt,omitempty"`
}

func WithContext(ctx context.Context, subject *Identity) context.Context {
	return context.WithValue(ctx, identityContextKey, subject)
}

func FromContext(ctx context.Context) (*Identity, bool) {
	value := ctx.Value(identityContextKey)
	identity, ok := value.(*Identity)
	return identity, ok
}

func ValidateWalletAddress(value string) bool {
	return suiWalletPattern.MatchString(strings.TrimSpace(value))
}

func ValidateEmail(value string) bool {
	parsed, err := mail.ParseAddress(strings.TrimSpace(value))
	return err == nil && strings.TrimSpace(parsed.Address) != ""
}
