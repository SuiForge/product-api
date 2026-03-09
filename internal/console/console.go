package console

import (
	"embed"
	"net/http"
)

//go:embed static/*
var assets embed.FS

func LandingHandler() http.HandlerFunc {
	return assetHandler("landing.html", "text/html; charset=utf-8")
}

func IndexHandler() http.HandlerFunc {
	return assetHandler("index.html", "text/html; charset=utf-8")
}

func ScriptHandler() http.HandlerFunc {
	return assetHandler("app.js", "application/javascript; charset=utf-8")
}

func WalletAuthScriptHandler() http.HandlerFunc {
	return assetHandler("wallet-auth.js", "application/javascript; charset=utf-8")
}

func StyleHandler() http.HandlerFunc {
	return assetHandler("styles.css", "text/css; charset=utf-8")
}

func assetHandler(name string, contentType string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload, err := assets.ReadFile("static/" + name)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", contentType)
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(payload)
	}
}
