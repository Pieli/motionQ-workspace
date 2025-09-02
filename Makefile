# Variables
BINARY_NAME := http-server
MAIN_PATH := cmd/http/main.go
COVERAGE_DIR := ./tmp
COVERAGE_FILE := $(COVERAGE_DIR)/coverage.out
DOCKER_IMAGE := local-prod
GOLANGCI_VERSION := v1.56.2

# Default target
.DEFAULT_GOAL := build

.PHONY: help dev build start install test testcov guicov lint lint-docker prod clean fmt tools generate

help: ## Show this help message
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)


generate:
	go generate $(MAIN_PATH)

dev: generate
	air

build: generate
	go build -o $(BINARY_NAME) $(MAIN_PATH)

start: build ## Start the application (builds first)
	./$(BINARY_NAME)

install: tools ## Install all dependencies (alias for tools)

tools: ## Install development tools
	go install github.com/air-verse/air@latest  
	go install github.com/stretchr/testify/mock@v1.10.0                                                                │

test: ## Run tests
	go test -v ./internal/...

ctest:
	go test -v ./claude_tests/...

testcov: ## Run tests with coverage
	go test -cover ./...

guicov: ## Run tests with coverage and open HTML report
	@mkdir -p $(COVERAGE_DIR)
	go test -coverprofile=$(COVERAGE_FILE) ./... || echo "Tests failed but continuing with coverage report"
	go tool cover -html=$(COVERAGE_FILE)

lint: ## Run golangci-lint
	golangci-lint run

lint-docker: ## Run golangci-lint in Docker
	docker run --rm -v $$(pwd):/app -w /app golangci/golangci-lint:$(GOLANGCI_VERSION) golangci-lint run -v

prod: ## Build and run production Docker image
	docker build . -t $(DOCKER_IMAGE)
	docker run $(DOCKER_IMAGE)

clean: ## Remove build artifacts and temporary files
	rm -f $(BINARY_NAME)
	rm -rf $(COVERAGE_DIR)
	docker rmi $(DOCKER_IMAGE) 2>/dev/null || true
