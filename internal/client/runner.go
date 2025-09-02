package client

import (
	"context"

	firebase "firebase.google.com/go"

	"github.com/Pieli/server/config"
	"github.com/Pieli/server/internal/generated"
	"net/http"
	"strings"

	"google.golang.org/api/option"

	"fmt"
	"log"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/Pieli/server/internal/storage"
)

var fab *firebase.App

func Run(env config.EnvVars) (func(), error) {

	opt := option.WithCredentialsJSON([]byte(env.FIREBASE_CONFIG))

	var err error
	fab, err = firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing app: %v\n", err)
	}
	app, cleanup, err := buildServer(env)
	if err != nil {
		return nil, err
	}
	address := "0.0.0.0:" + env.PORT
	log.Println("Will listening on:", address)

	// start the server
	go func() {
		err := app.Start(address)
		if err != nil {
			return
		}
	}()

	// return a function to close the server and database
	return func() {
		cleanup()
		err := app.Shutdown(context.Background())
		if err != nil {
			return
		}
	}, nil
}

func buildServer(env config.EnvVars) (*echo.Echo, func(), error) {
	// init the storage
	db, err := storage.BootstrapMongo(env.MONGODB_URI, env.MONGODB_NAME, 10*time.Second)
	if err != nil {
		return nil, nil, err
	}

	// create the echo app
	app := echo.New()

	// add middleware
	app.Use(middleware.CORS())
	app.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${time_rfc3339} | [${remote_ip}] | ${status} - ${method} | ${latency_human} | ${uri} | ${error} |  \n",
		Output: os.Stdout,
	}))
	app.Use(authMiddleware)

	// add health check
	app.GET("/health", func(c echo.Context) error {
		return c.String(200, "Healthy!")
	})

	// add docs
	if os.Getenv("GO_ENV") != "production" {
		// Serve swagger UI
		app.GET("/docs", func(c echo.Context) error {
			return c.File("./web/swagger.html")
		})

		// Serve the yaml file
		app.Static("/swagger", "./api")
	}

	store := api.NewStorage(db)
	serv := api.NewServer(store)

	api.RegisterHandlers(app, api.NewStrictHandler(serv, nil))

	return app, func() {
		err := storage.CloseMongo(db)
		if err != nil {
			log.Printf("error closing database: %v\n", err)
		}
	}, nil
}

func authMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		// exception skipping url / subideal
		if strings.HasPrefix(c.Path(), "/docs") ||
			strings.HasPrefix(c.Path(), "/swagger") ||
			c.Path() == "/health" {
			return next(c)
		}

		auth := c.Request().Header.Get("Authorization")
		if auth == "" {
			return echo.NewHTTPError(http.StatusUnauthorized,
				map[string]string{
					"info":    "Unauthorized",
					"message": "No token provided",
				})
		}

		// Extract bearer token
		if !strings.HasPrefix(auth, "Bearer ") {
			return echo.NewHTTPError(http.StatusUnauthorized,
				map[string]string{
					"info":    "Unauthorized",
					"message": "faulty token",
				})
		}
		token := strings.TrimPrefix(auth, "Bearer ")

		var ctx context.Context
		ctx = c.Request().Context()

		// create the auth client
		client, err := fab.Auth(ctx)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError,
				map[string]string{
					"error":   "Server Error",
					"message": "Failed to create auth clients",
				})
		}

		// verify the token
		tokObj, err := client.VerifyIDToken(ctx, token)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
				"info":    "Unauthorized",
				"message": "Invalid token",
				"error":   err.Error(),
			})
		}

		user, err := client.GetUser(ctx, tokObj.UID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"info":    "Server Error",
				"message": "User not found",
				"error":   err.Error(),
			})
		}

		// set Firebase auth info in context for handlers
		ctx = context.WithValue(ctx, "uid", tokObj.UID)
		ctx = context.WithValue(ctx, "user", user)

		c.SetRequest(c.Request().WithContext(ctx))

		return next(c)
	}
}
