package actions

import (
	"strings"

	"github.com/gobuffalo/envy"
	"github.com/rs/cors"
)

func CorsPreware() *cors.Cors {
	allowedOrigins := strings.Split(envy.Get("CORS", "http://localhost:3001"), " ")
	return cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "PUT", "PATCH", "DELETE", "POST", "OPTIONS"},
		AllowedHeaders: []string{
			"DNT",
			"X-CustomHeader",
			"X-Budgetal-Session",
			"Keep-Alive",
			"User-Agent",
			"X-Requested-With",
			"If-Modified-Since",
			"Cache-Control",
			"Accept",
			"Content-Type",
			AUTH_HEADER_KEY,
		},
	})
}
