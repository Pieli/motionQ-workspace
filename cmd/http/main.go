//go:generate go tool oapi-codegen -config ../../api/config.yaml ../../api/api.yaml

package main

import (
	"log"

	"github.com/Pieli/server/config"
	"github.com/Pieli/server/internal/client"
	"github.com/Pieli/server/internal/shutdown"

	"fmt"
	"os"
)

func main() {
	// setup exit code for graceful shutdown
	var exitCode int
	defer func() {
		os.Exit(exitCode)
	}()

	// load config
	env, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("error: %v\n", err)
		exitCode = 1
		return
	}

	// run the server
	cleanup, err := client.Run(env)

	// run the cleanup after the server is terminated
	defer cleanup()
	if err != nil {
		log.Println("error:", err.Error())
		exitCode = 1
		return
	}

	// ensure the server is shutdown gracefully & app runs
	shutdown.Gracefully()

}
