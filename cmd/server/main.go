package main

import (
	"log"

	"product-api/internal/app"
	"product-api/internal/bootstrap"
	"product-api/internal/config"
)

func main() {
	cfg := config.Load()
	application := app.New(cfg, bootstrap.BuildDependencies(cfg))
	log.Printf("product-api listening on :%s", cfg.Port)
	if err := application.Server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
