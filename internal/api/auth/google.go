package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"

	googleidtoken "google.golang.org/api/idtoken"
)

var errGoogleAuthNotConfigured = errors.New("google_auth_not_configured")

type GoogleIdentity struct {
	Subject       string `json:"subject,omitempty"`
	Email         string `json:"email,omitempty"`
	EmailVerified bool   `json:"emailVerified,omitempty"`
	Name          string `json:"name,omitempty"`
	Picture       string `json:"picture,omitempty"`
	HostedDomain  string `json:"hostedDomain,omitempty"`
}

type GoogleTokenVerifier interface {
	VerifyIDToken(context.Context, string) (*GoogleIdentity, error)
}

type GoogleConfig struct {
	Verifier     GoogleTokenVerifier
	ClientID     string
	HostedDomain string
}

type googleVerifyRequest struct {
	Credential    string `json:"credential"`
	WorkspaceName string `json:"workspaceName"`
	OperatorName  string `json:"operatorName"`
}

type googleService struct {
	verifier     GoogleTokenVerifier
	clientID     string
	hostedDomain string
}

func newGoogleService(cfg GoogleConfig) *googleService {
	return &googleService{
		verifier:     cfg.Verifier,
		clientID:     strings.TrimSpace(cfg.ClientID),
		hostedDomain: strings.TrimSpace(cfg.HostedDomain),
	}
}

func (s *googleService) configured() bool {
	return s != nil && s.verifier != nil && s.clientID != ""
}

func (s *googleService) verify(ctx context.Context, rawToken string) (*GoogleIdentity, error) {
	if !s.configured() {
		return nil, errGoogleAuthNotConfigured
	}
	identity, err := s.verifier.VerifyIDToken(ctx, strings.TrimSpace(rawToken))
	if err != nil {
		return nil, err
	}
	if identity == nil || strings.TrimSpace(identity.Subject) == "" || strings.TrimSpace(identity.Email) == "" || !identity.EmailVerified {
		return nil, errUnauthorized
	}
	if s.hostedDomain != "" && !strings.EqualFold(strings.TrimSpace(identity.HostedDomain), s.hostedDomain) {
		return nil, errUnauthorized
	}
	return identity, nil
}

func (s *googleService) responsePayload() map[string]any {
	if s == nil {
		return map[string]any{"enabled": false}
	}
	payload := map[string]any{
		"enabled": s.configured(),
	}
	if s.clientID != "" {
		payload["clientId"] = s.clientID
	}
	if s.hostedDomain != "" {
		payload["hostedDomain"] = s.hostedDomain
	}
	return payload
}

type GoogleIDTokenVerifier struct {
	clientID     string
	hostedDomain string
}

func NewGoogleIDTokenVerifier(clientID string, hostedDomain string) *GoogleIDTokenVerifier {
	return &GoogleIDTokenVerifier{clientID: strings.TrimSpace(clientID), hostedDomain: strings.TrimSpace(hostedDomain)}
}

func (v *GoogleIDTokenVerifier) VerifyIDToken(ctx context.Context, rawToken string) (*GoogleIdentity, error) {
	if v == nil || strings.TrimSpace(v.clientID) == "" {
		return nil, errGoogleAuthNotConfigured
	}
	payload, err := googleidtoken.Validate(ctx, strings.TrimSpace(rawToken), v.clientID)
	if err != nil {
		return nil, err
	}
	identity := &GoogleIdentity{
		Subject:       strings.TrimSpace(payload.Subject),
		Email:         strings.TrimSpace(claimString(payload.Claims, "email")),
		Name:          strings.TrimSpace(claimString(payload.Claims, "name")),
		Picture:       strings.TrimSpace(claimString(payload.Claims, "picture")),
		HostedDomain:  strings.TrimSpace(claimString(payload.Claims, "hd")),
		EmailVerified: claimBool(payload.Claims, "email_verified"),
	}
	if identity.Email == "" {
		return nil, fmt.Errorf("google token missing email claim")
	}
	if v.hostedDomain != "" && !strings.EqualFold(identity.HostedDomain, v.hostedDomain) {
		return nil, fmt.Errorf("google hosted domain mismatch")
	}
	return identity, nil
}

func claimString(claims map[string]interface{}, key string) string {
	if claims == nil {
		return ""
	}
	value, ok := claims[key]
	if !ok || value == nil {
		return ""
	}
	text, ok := value.(string)
	if !ok {
		return ""
	}
	return text
}

func claimBool(claims map[string]interface{}, key string) bool {
	if claims == nil {
		return false
	}
	value, ok := claims[key]
	if !ok || value == nil {
		return false
	}
	switch typed := value.(type) {
	case bool:
		return typed
	case string:
		return strings.EqualFold(strings.TrimSpace(typed), "true")
	default:
		return false
	}
}
