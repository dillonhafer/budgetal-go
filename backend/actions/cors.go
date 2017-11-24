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
		AllowedHeaders:   []string{"Accept", "Content-Type", AUTH_HEADER_KEY},
	})
}
