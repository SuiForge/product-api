package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"log"
	"os/exec"
	"strings"
	"time"
)

type NodeVerifier struct {
	command []string
	timeout time.Duration
}

func NewNodeVerifier(command []string, timeout time.Duration) *NodeVerifier {
	clean := make([]string, 0, len(command))
	for _, item := range command {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			clean = append(clean, trimmed)
		}
	}
	if len(clean) == 0 {
		clean = []string{"node", "internal/api/auth/scripts/verify-wallet-signature.mjs"}
	}
	if timeout <= 0 {
		timeout = 5 * time.Second
	}
	return &NodeVerifier{command: clean, timeout: timeout}
}

func (v *NodeVerifier) VerifyPersonalMessage(ctx context.Context, verification WalletSignatureVerification) error {
	if v == nil || len(v.command) == 0 {
		return errWalletAuthNotConfigured
	}
	payload, err := json.Marshal(verification)
	if err != nil {
		return err
	}
	cmdCtx, cancel := context.WithTimeout(ctx, v.timeout)
	defer cancel()
	cmd := exec.CommandContext(cmdCtx, v.command[0], v.command[1:]...)
	cmd.Stdin = bytes.NewReader(payload)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		if stderr.Len() > 0 {
			log.Printf("wallet signature verifier failed: %s", strings.TrimSpace(stderr.String()))
		} else {
			log.Printf("wallet signature verifier failed: %v", err)
		}
		if stderr.Len() == 0 {
			return err
		}
		return errors.New(strings.TrimSpace(stderr.String()))
	}
	return nil
}
