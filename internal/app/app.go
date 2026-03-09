package app

import (
	"fmt"
	"net/http"

	"product-api/internal/api"
	"product-api/internal/config"
)

type App struct {
	Config config.Config
	Server *http.Server
}

func New(cfg config.Config, deps api.Dependencies) *App {
	router := api.NewRouter(cfg, deps)
	return &App{
		Config: cfg,
		Server: &http.Server{Addr: fmt.Sprintf(":%s", cfg.Port), Handler: router},
	}
}
