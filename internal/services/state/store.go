package state

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"sync"

	alertopsdomain "product-api/internal/domain/alertops"
	alertsdomain "product-api/internal/domain/alerts"
	tenantdomain "product-api/internal/domain/tenant"
)

type Snapshot struct {
	Monitors     []alertopsdomain.Monitor       `json:"monitors,omitempty"`
	Destinations []alertsdomain.Destination     `json:"destinations,omitempty"`
	Deliveries   []alertsdomain.DeliveryAttempt `json:"deliveries,omitempty"`
	APIKeys      []tenantdomain.APIKey          `json:"apiKeys,omitempty"`
}

type Store struct {
	mu       sync.Mutex
	path     string
	loaded   bool
	snapshot Snapshot
}

func NewStore(path string) *Store {
	return &Store{path: strings.TrimSpace(path)}
}

func (s *Store) Snapshot() (Snapshot, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := s.loadLocked(); err != nil {
		return Snapshot{}, err
	}
	return cloneSnapshot(s.snapshot), nil
}

func (s *Store) Update(apply func(*Snapshot) error) (Snapshot, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := s.loadLocked(); err != nil {
		return Snapshot{}, err
	}
	next := cloneSnapshot(s.snapshot)
	if apply != nil {
		if err := apply(&next); err != nil {
			return Snapshot{}, err
		}
	}
	if err := s.persistLocked(next); err != nil {
		return Snapshot{}, err
	}
	s.snapshot = cloneSnapshot(next)
	s.loaded = true
	return cloneSnapshot(s.snapshot), nil
}

func (s *Store) loadLocked() error {
	if s == nil || s.loaded {
		return nil
	}
	if s.path == "" {
		s.loaded = true
		return nil
	}
	payload, err := os.ReadFile(s.path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			s.loaded = true
			return nil
		}
		return err
	}
	if len(payload) == 0 {
		s.loaded = true
		return nil
	}
	var snapshot Snapshot
	if err := json.Unmarshal(payload, &snapshot); err != nil {
		return err
	}
	s.snapshot = cloneSnapshot(snapshot)
	s.loaded = true
	return nil
}

func (s *Store) persistLocked(snapshot Snapshot) error {
	if s == nil || s.path == "" {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return err
	}
	payload, err := json.MarshalIndent(snapshot, "", "  ")
	if err != nil {
		return err
	}
	tmpPath := s.path + ".tmp"
	if err := os.WriteFile(tmpPath, payload, 0o644); err != nil {
		return err
	}
	return os.Rename(tmpPath, s.path)
}

func cloneSnapshot(snapshot Snapshot) Snapshot {
	cloned := Snapshot{}
	if len(snapshot.Monitors) > 0 {
		cloned.Monitors = append([]alertopsdomain.Monitor(nil), snapshot.Monitors...)
	}
	if len(snapshot.Destinations) > 0 {
		cloned.Destinations = append([]alertsdomain.Destination(nil), snapshot.Destinations...)
	}
	if len(snapshot.Deliveries) > 0 {
		cloned.Deliveries = append([]alertsdomain.DeliveryAttempt(nil), snapshot.Deliveries...)
	}
	if len(snapshot.APIKeys) > 0 {
		cloned.APIKeys = append([]tenantdomain.APIKey(nil), snapshot.APIKeys...)
	}
	return cloned
}
