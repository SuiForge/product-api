package auth

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"product-api/internal/identity"
)

const cookieName = "product_workspace_session"

var errUnauthorized = errors.New("unauthorized")

type Session struct {
	AuthMethod    string `json:"authMethod,omitempty"`
	WorkspaceName string `json:"workspaceName"`
	OperatorName  string `json:"operatorName"`
	WalletAddress string `json:"walletAddress"`
	GoogleSubject string `json:"googleSubject,omitempty"`
	Email         string `json:"email,omitempty"`
	Picture       string `json:"picture,omitempty"`
	IssuedAt      int64  `json:"issuedAt"`
	ExpiresAt     int64  `json:"expiresAt"`
}

type loginRequest struct {
	WorkspaceName string `json:"workspaceName"`
	OperatorName  string `json:"operatorName"`
	WalletAddress string `json:"walletAddress"`
}

type validateAPIKeyRequest struct {
	APIKey string `json:"apiKey"`
}

type APIKeyValidator interface {
	ValidateAPIKey(context.Context, string) (*identity.Identity, error)
}

type Manager struct {
	secret       []byte
	ttl          time.Duration
	cookieSecure bool
}

func NewManager(secret string, ttl time.Duration, cookieSecure bool) *Manager {
	trimmed := strings.TrimSpace(secret)
	if trimmed == "" {
		trimmed = "dev-session-secret-change-me"
	}
	if ttl <= 0 {
		ttl = 24 * time.Hour
	}
	return &Manager{secret: []byte(trimmed), ttl: ttl, cookieSecure: cookieSecure}
}

type Handler struct {
	manager   *Manager
	validator APIKeyValidator
	wallet    *walletService
	google    *googleService
}

func NewHandler(manager *Manager, validator APIKeyValidator, walletCfg WalletConfig, googleCfg GoogleConfig) *Handler {
	return &Handler{manager: manager, validator: validator, wallet: newWalletService(manager, walletCfg), google: newGoogleService(googleCfg)}
}

func (h *Handler) Login(c *gin.Context) {
	if h == nil || h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "auth_not_configured"})
		return
	}
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.WorkspaceName) == "" || strings.TrimSpace(req.OperatorName) == "" || !identity.ValidateWalletAddress(req.WalletAddress) {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "workspaceName, operatorName, and valid walletAddress are required"}})
		return
	}
	session := h.manager.newLegacySession(req.WorkspaceName, req.OperatorName, req.WalletAddress)
	if err := h.manager.writeCookie(c.Writer, session); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, session)
}

func (h *Handler) CurrentSession(c *gin.Context) {
	if h == nil || h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "auth_not_configured"})
		return
	}
	session, err := h.manager.readFromRequest(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": "login required"}})
		return
	}
	c.JSON(http.StatusOK, session)
}

func (h *Handler) ValidateAPIKey(c *gin.Context) {
	if h == nil || h.validator == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "api_key_validation_not_configured"})
		return
	}
	var req validateAPIKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.APIKey) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "apiKey is required"}})
		return
	}
	result, err := h.validator.ValidateAPIKey(c.Request.Context(), req.APIKey)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *Handler) Providers(c *gin.Context) {
	walletPayload := map[string]any{"enabled": h != nil && h.wallet != nil && h.wallet.configured()}
	if h != nil && h.wallet != nil && strings.TrimSpace(h.wallet.network) != "" {
		walletPayload["network"] = h.wallet.network
	}
	if _, ok := walletPayload["network"]; !ok {
		walletPayload["network"] = "mainnet"
	}
	googlePayload := map[string]any{"enabled": false}
	if h != nil && h.google != nil {
		googlePayload = h.google.responsePayload()
	}
	c.JSON(http.StatusOK, gin.H{
		"google":       googlePayload,
		"wallet":       walletPayload,
		"demoFallback": gin.H{"enabled": true},
	})
}

func (h *Handler) VerifyGoogleCredential(c *gin.Context) {
	if h == nil || h.google == nil || !h.google.configured() {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "google_auth_not_configured"})
		return
	}
	var req googleVerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Credential) == "" || strings.TrimSpace(req.WorkspaceName) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "credential and workspaceName are required"}})
		return
	}
	claims, err := h.google.verify(c.Request.Context(), req.Credential)
	if err != nil {
		if errors.Is(err, errGoogleAuthNotConfigured) {
			c.JSON(http.StatusNotImplemented, gin.H{"error": "google_auth_not_configured"})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": "google credential verification failed"}})
		return
	}
	session := h.manager.newGoogleSession(strings.TrimSpace(req.WorkspaceName), strings.TrimSpace(req.OperatorName), claims)
	if err := h.manager.writeCookie(c.Writer, session); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, session)
}

func (h *Handler) IssueWalletNonce(c *gin.Context) {
	if h == nil || h.wallet == nil || !h.wallet.configured() {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "wallet_auth_not_configured"})
		return
	}
	var req walletChallengeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "workspaceName, operatorName, and valid walletAddress are required"}})
		return
	}
	challenge, err := h.wallet.issueChallenge(c.Request, req)
	if err != nil {
		if errors.Is(err, errWalletAuthNotConfigured) {
			c.JSON(http.StatusNotImplemented, gin.H{"error": "wallet_auth_not_configured"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, challenge)
}

func (h *Handler) VerifyWalletSignature(c *gin.Context) {
	if h == nil || h.wallet == nil || !h.wallet.configured() {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "wallet_auth_not_configured"})
		return
	}
	var req walletVerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Nonce) == "" || strings.TrimSpace(req.Signature) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "nonce and signature are required"}})
		return
	}
	session, err := h.wallet.verifyChallenge(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, errWalletAuthNotConfigured) {
			c.JSON(http.StatusNotImplemented, gin.H{"error": "wallet_auth_not_configured"})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": "wallet signature verification failed"}})
		return
	}
	if err := h.manager.writeCookie(c.Writer, session); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, session)
}

func (h *Handler) Logout(c *gin.Context) {
	if h == nil || h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "auth_not_configured"})
		return
	}
	h.manager.clearCookie(c.Writer)
	c.JSON(http.StatusOK, gin.H{"status": "logged_out"})
}

func (h *Handler) RequireIdentity() gin.HandlerFunc {
	return func(c *gin.Context) {
		if h == nil || h.manager == nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "auth_not_configured"})
			return
		}

		if session, err := h.manager.readFromRequest(c.Request); err == nil {
			subject := session.toIdentity()
			c.Set("identity", subject)
			c.Request = c.Request.WithContext(identity.WithContext(c.Request.Context(), subject))
			c.Next()
			return
		}

		rawAPIKey := strings.TrimSpace(c.GetHeader("X-API-Key"))
		if rawAPIKey != "" && h.validator != nil {
			subject, err := h.validator.ValidateAPIKey(c.Request.Context(), rawAPIKey)
			if err == nil && subject != nil {
				c.Set("identity", subject)
				c.Request = c.Request.WithContext(identity.WithContext(c.Request.Context(), subject))
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "UNAUTHORIZED", "message": "login required"}})
	}
}

func (m *Manager) newLegacySession(workspaceName string, operatorName string, walletAddress string) *Session {
	now := time.Now().UTC()
	return &Session{
		AuthMethod:    "session",
		WorkspaceName: strings.TrimSpace(workspaceName),
		OperatorName:  strings.TrimSpace(operatorName),
		WalletAddress: strings.TrimSpace(walletAddress),
		IssuedAt:      now.Unix(),
		ExpiresAt:     now.Add(m.ttl).Unix(),
	}
}

func (m *Manager) newWalletSession(workspaceName string, operatorName string, walletAddress string) *Session {
	session := m.newLegacySession(workspaceName, operatorName, walletAddress)
	session.AuthMethod = "wallet"
	return session
}

func (m *Manager) newGoogleSession(workspaceName string, operatorName string, claims *GoogleIdentity) *Session {
	now := time.Now().UTC()
	resolvedOperator := strings.TrimSpace(operatorName)
	if resolvedOperator == "" && claims != nil {
		resolvedOperator = strings.TrimSpace(claims.Name)
	}
	if resolvedOperator == "" && claims != nil {
		resolvedOperator = strings.TrimSpace(claims.Email)
	}
	return &Session{
		AuthMethod:    "google",
		WorkspaceName: strings.TrimSpace(workspaceName),
		OperatorName:  resolvedOperator,
		GoogleSubject: strings.TrimSpace(claims.Subject),
		Email:         strings.TrimSpace(claims.Email),
		Picture:       strings.TrimSpace(claims.Picture),
		IssuedAt:      now.Unix(),
		ExpiresAt:     now.Add(m.ttl).Unix(),
	}
}

func (s *Session) toIdentity() *identity.Identity {
	if s == nil {
		return nil
	}
	authMethod := strings.TrimSpace(s.AuthMethod)
	if authMethod == "" {
		authMethod = "session"
	}
	return &identity.Identity{
		AuthMethod:    authMethod,
		WalletAddress: s.WalletAddress,
		WorkspaceName: s.WorkspaceName,
		OperatorName:  s.OperatorName,
		GoogleSubject: s.GoogleSubject,
		Email:         s.Email,
		Picture:       s.Picture,
		IssuedAt:      s.IssuedAt,
		ExpiresAt:     s.ExpiresAt,
	}
}

func (m *Manager) writeCookie(w http.ResponseWriter, session *Session) error {
	token, err := m.encode(session)
	if err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{
		Name:     cookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   m.cookieSecure,
		MaxAge:   int(m.ttl.Seconds()),
	})
	return nil
}

func (m *Manager) clearCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     cookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   m.cookieSecure,
		MaxAge:   -1,
	})
}

func (m *Manager) readFromRequest(r *http.Request) (*Session, error) {
	cookie, err := r.Cookie(cookieName)
	if err != nil || strings.TrimSpace(cookie.Value) == "" {
		return nil, errUnauthorized
	}
	session, err := m.decode(cookie.Value)
	if err != nil {
		return nil, errUnauthorized
	}
	if session.ExpiresAt <= time.Now().UTC().Unix() {
		return nil, errUnauthorized
	}
	return session, nil
}

func (m *Manager) encode(session *Session) (string, error) {
	payload, err := json.Marshal(session)
	if err != nil {
		return "", err
	}
	encodedPayload := base64.RawURLEncoding.EncodeToString(payload)
	mac := hmac.New(sha256.New, m.secret)
	_, _ = mac.Write([]byte(encodedPayload))
	signature := hex.EncodeToString(mac.Sum(nil))
	return encodedPayload + "." + signature, nil
}

func (m *Manager) decode(token string) (*Session, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return nil, errUnauthorized
	}
	encodedPayload := parts[0]
	providedSignature := parts[1]
	mac := hmac.New(sha256.New, m.secret)
	_, _ = mac.Write([]byte(encodedPayload))
	expectedSignature := hex.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(expectedSignature), []byte(providedSignature)) {
		return nil, errUnauthorized
	}
	payload, err := base64.RawURLEncoding.DecodeString(encodedPayload)
	if err != nil {
		return nil, errUnauthorized
	}
	var session Session
	if err := json.Unmarshal(payload, &session); err != nil {
		return nil, errUnauthorized
	}
	if !session.valid() {
		return nil, errUnauthorized
	}
	return &session, nil
}

func (s *Session) valid() bool {
	if s == nil || strings.TrimSpace(s.WorkspaceName) == "" || strings.TrimSpace(s.OperatorName) == "" {
		return false
	}
	authMethod := strings.TrimSpace(s.AuthMethod)
	switch authMethod {
	case "", "session", "wallet":
		return identity.ValidateWalletAddress(s.WalletAddress)
	case "google":
		return strings.TrimSpace(s.GoogleSubject) != "" && identity.ValidateEmail(s.Email)
	default:
		return identity.ValidateWalletAddress(s.WalletAddress) || (strings.TrimSpace(s.GoogleSubject) != "" && identity.ValidateEmail(s.Email))
	}
}
