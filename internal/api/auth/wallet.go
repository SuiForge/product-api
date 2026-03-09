package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"product-api/internal/identity"
)

var errWalletAuthNotConfigured = errors.New("wallet_auth_not_configured")

type WalletSignatureVerification struct {
	WalletAddress string `json:"walletAddress"`
	Message       string `json:"message"`
	Signature     string `json:"signature"`
}

type WalletSignatureVerifier interface {
	VerifyPersonalMessage(context.Context, WalletSignatureVerification) error
}

type WalletConfig struct {
	Verifier     WalletSignatureVerifier
	ChallengeTTL time.Duration
	PublicOrigin string
	Network      string
	Now          func() time.Time
	Store        *WalletChallengeStore
}

type walletService struct {
	verifier     WalletSignatureVerifier
	challengeTTL time.Duration
	publicOrigin string
	network      string
	now          func() time.Time
	store        *WalletChallengeStore
	manager      *Manager
}

type walletChallengeRequest struct {
	WorkspaceName string `json:"workspaceName"`
	OperatorName  string `json:"operatorName"`
	WalletAddress string `json:"walletAddress"`
}

type walletVerifyRequest struct {
	Nonce     string `json:"nonce"`
	Signature string `json:"signature"`
}

type walletChallenge struct {
	Nonce         string
	Message       string
	WorkspaceName string
	OperatorName  string
	WalletAddress string
	IssuedAt      time.Time
	ExpiresAt     time.Time
	Origin        string
	Network       string
	Consumed      bool
}

type walletChallengeResponse struct {
	Nonce         string `json:"nonce"`
	Message       string `json:"message"`
	WorkspaceName string `json:"workspaceName"`
	OperatorName  string `json:"operatorName"`
	WalletAddress string `json:"walletAddress"`
	IssuedAt      int64  `json:"issuedAt"`
	ExpiresAt     int64  `json:"expiresAt"`
	Network       string `json:"network"`
	SignMode      string `json:"signMode"`
	Statement     string `json:"statement"`
	URI           string `json:"uri"`
}

type WalletChallengeStore struct {
	mu         sync.Mutex
	challenges map[string]*walletChallenge
}

func NewWalletChallengeStore() *WalletChallengeStore {
	return &WalletChallengeStore{challenges: map[string]*walletChallenge{}}
}

func newWalletService(manager *Manager, cfg WalletConfig) *walletService {
	nowFn := cfg.Now
	if nowFn == nil {
		nowFn = func() time.Time { return time.Now().UTC() }
	}
	challengeTTL := cfg.ChallengeTTL
	if challengeTTL <= 0 {
		challengeTTL = 5 * time.Minute
	}
	network := strings.TrimSpace(cfg.Network)
	if network == "" {
		network = "mainnet"
	}
	store := cfg.Store
	if store == nil {
		store = NewWalletChallengeStore()
	}
	return &walletService{
		verifier:     cfg.Verifier,
		challengeTTL: challengeTTL,
		publicOrigin: strings.TrimRight(strings.TrimSpace(cfg.PublicOrigin), "/"),
		network:      network,
		now:          nowFn,
		store:        store,
		manager:      manager,
	}
}

func (s *walletService) configured() bool {
	return s != nil && s.verifier != nil && s.manager != nil
}

func (s *walletService) issueChallenge(r *http.Request, req walletChallengeRequest) (*walletChallengeResponse, error) {
	if !s.configured() {
		return nil, errWalletAuthNotConfigured
	}
	if strings.TrimSpace(req.WorkspaceName) == "" || strings.TrimSpace(req.OperatorName) == "" || !identity.ValidateWalletAddress(req.WalletAddress) {
		return nil, errors.New("workspaceName, operatorName, and valid walletAddress are required")
	}
	now := s.now().UTC()
	nonce, err := randomNonce(16)
	if err != nil {
		return nil, err
	}
	challenge := &walletChallenge{
		Nonce:         nonce,
		WorkspaceName: strings.TrimSpace(req.WorkspaceName),
		OperatorName:  strings.TrimSpace(req.OperatorName),
		WalletAddress: strings.TrimSpace(req.WalletAddress),
		IssuedAt:      now,
		ExpiresAt:     now.Add(s.challengeTTL),
		Origin:        s.resolveOrigin(r),
		Network:       s.network,
	}
	challenge.Message = formatWalletChallengeMessage(challenge)
	s.store.save(challenge)
	return &walletChallengeResponse{
		Nonce:         challenge.Nonce,
		Message:       challenge.Message,
		WorkspaceName: challenge.WorkspaceName,
		OperatorName:  challenge.OperatorName,
		WalletAddress: challenge.WalletAddress,
		IssuedAt:      challenge.IssuedAt.Unix(),
		ExpiresAt:     challenge.ExpiresAt.Unix(),
		Network:       challenge.Network,
		SignMode:      "personal_message",
		Statement:     walletChallengeStatement,
		URI:           challenge.Origin + "/console",
	}, nil
}

func (s *walletService) verifyChallenge(ctx context.Context, req walletVerifyRequest) (*Session, error) {
	if !s.configured() {
		return nil, errWalletAuthNotConfigured
	}
	if strings.TrimSpace(req.Nonce) == "" || strings.TrimSpace(req.Signature) == "" {
		return nil, errors.New("nonce and signature are required")
	}
	challenge, err := s.store.consume(req.Nonce, s.now())
	if err != nil {
		return nil, errUnauthorized
	}
	verification := WalletSignatureVerification{
		WalletAddress: challenge.WalletAddress,
		Message:       challenge.Message,
		Signature:     strings.TrimSpace(req.Signature),
	}
	if err := s.verifier.VerifyPersonalMessage(ctx, verification); err != nil {
		return nil, errUnauthorized
	}
	return s.manager.newWalletSession(challenge.WorkspaceName, challenge.OperatorName, challenge.WalletAddress), nil
}

func (s *walletService) resolveOrigin(r *http.Request) string {
	if s.publicOrigin != "" {
		return s.publicOrigin
	}
	if r == nil {
		return "http://localhost"
	}
	scheme := "http"
	if strings.EqualFold(strings.TrimSpace(r.Header.Get("X-Forwarded-Proto")), "https") || r.TLS != nil {
		scheme = "https"
	}
	host := strings.TrimSpace(r.Header.Get("X-Forwarded-Host"))
	if host == "" {
		host = strings.TrimSpace(r.Host)
	}
	if host == "" {
		host = "localhost"
	}
	return scheme + "://" + host
}

func (s *WalletChallengeStore) save(challenge *walletChallenge) {
	if s == nil || challenge == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.pruneLocked(time.Now().UTC())
	s.challenges[challenge.Nonce] = challenge
}

func (s *WalletChallengeStore) consume(nonce string, now time.Time) (*walletChallenge, error) {
	if s == nil {
		return nil, errUnauthorized
	}
	nonce = strings.TrimSpace(nonce)
	s.mu.Lock()
	defer s.mu.Unlock()
	s.pruneLocked(now.UTC())
	challenge, ok := s.challenges[nonce]
	if !ok || challenge == nil || challenge.Consumed || challenge.ExpiresAt.Before(now.UTC()) {
		return nil, errUnauthorized
	}
	challenge.Consumed = true
	delete(s.challenges, nonce)
	return challenge, nil
}

func (s *WalletChallengeStore) pruneLocked(now time.Time) {
	for nonce, challenge := range s.challenges {
		if challenge == nil || challenge.Consumed || challenge.ExpiresAt.Before(now) {
			delete(s.challenges, nonce)
		}
	}
}

const walletChallengeStatement = "Sign in to Sui Execution & Risk Workspace. This request does not trigger an on-chain transaction or cost gas."

func formatWalletChallengeMessage(challenge *walletChallenge) string {
	if challenge == nil {
		return ""
	}
	return fmt.Sprintf(
		"Sui Execution & Risk Workspace wants you to sign in with your Sui account:\n%s\n\n%s\n\nURI: %s/console\nVersion: 1\nChain ID: sui:%s\nNonce: %s\nIssued At: %s\nExpiration Time: %s\nWorkspace: %s\nOperator: %s",
		challenge.WalletAddress,
		walletChallengeStatement,
		challenge.Origin,
		challenge.Network,
		challenge.Nonce,
		challenge.IssuedAt.Format(time.RFC3339),
		challenge.ExpiresAt.Format(time.RFC3339),
		challenge.WorkspaceName,
		challenge.OperatorName,
	)
}

func randomNonce(size int) (string, error) {
	if size <= 0 {
		size = 16
	}
	buf := make([]byte, size)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}
