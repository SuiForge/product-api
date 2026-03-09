package evidence

import (
	"context"
	"errors"
	"sync"

	"product-api/internal/domain/replay"
)

var ErrNotFound = errors.New("evidence not found")

type Service struct {
	mu    sync.RWMutex
	items map[string]replay.EvidenceReplay
}

func NewService() *Service {
	return &Service{items: make(map[string]replay.EvidenceReplay)}
}

func (s *Service) Save(_ context.Context, item replay.EvidenceReplay) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items[item.EvidenceID] = item
}

func (s *Service) Get(_ context.Context, evidenceID string) (*replay.EvidenceReplay, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	item, ok := s.items[evidenceID]
	if !ok {
		return nil, ErrNotFound
	}
	copy := item
	return &copy, nil
}
