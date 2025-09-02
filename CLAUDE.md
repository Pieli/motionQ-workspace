# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MotionQ is an AI-powered animation builder that solves the complexity, cost, and time barriers of promotional video creation. Instead of requiring video editing expertise, users describe their product/idea in natural language and the AI generates professional animated sequences following a Problem→Solution→Benefits→CTA structure.

**Target Use Cases**: Product Launches, SaaS Demos, Brand Stories, Pitch Decks

**Key Value Propositions**:
- No-code video creation through conversational AI
- Professional 1920x1080 HD output with sophisticated animations
- Rapid iteration and real-time preview
- Cost-effective alternative to professional video production

The application consists of a React frontend with Remotion for video generation and a Go backend with OpenAPI specification.

## Repository Structure

This is a monorepo with two main components:
- `frontend/` - React 19 + TypeScript + Remotion application
- `backend/` - Go HTTP server with OpenAPI-generated endpoints

## Development Commands

### Frontend (from `/frontend` directory)
```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Generate API client from backend OpenAPI spec
pnpm generate

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

### Backend (from `/backend` directory)
```bash
# Development with hot reload
make dev

# Build binary
make build

# Start application (builds first)
make start

# Run tests
make test

# Run tests with coverage
make testcov

# Generate code from OpenAPI spec
make generate

# Lint code
make lint

# Install development tools
make tools
```

## Architecture Overview

### Frontend Architecture
- **Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Remotion 4.0.302
- **Authentication**: Firebase Auth with backend user management
- **Routing**: React Router v7 with protected routes
- **State Management**: React Context (AuthContext, CompositionContext, ColorPaletteContext)
- **Video Generation**: Remotion compositions at 1920x1080, 30fps

#### Key Frontend Components
- `src/components/chat/Workspace.tsx` - Main editing interface with resizable panels
- `src/remotion-lib/Root.tsx` - Remotion composition registry
- `src/api/animation-factories.ts` - LLM-to-animation component mapping
- `src/lib/AuthContext.tsx` - Firebase authentication integration
- `src/components/ui/` - shadcn/ui component library

#### Animation Development Workflow
1. Create component in `src/remotion-lib/`
2. Define Zod schema for props validation
3. Add to animation factory in `src/api/animation-factories.ts`
4. Register composition in `src/remotion-lib/Root.tsx`

### Backend Architecture
- **Technology Stack**: Go 1.24.5, Echo web framework, MongoDB, Firebase Admin SDK
- **API Design**: OpenAPI 3.0 specification-driven development
- **Authentication**: Firebase JWT token validation
- **Database**: MongoDB with user and project collections

#### Backend Development Workflow
1. Modify `api/api.yaml` OpenAPI specification
2. Run `make generate` to generate boilerplate code into `internal/generated/server.gen.go`
3. Implement generated functions in `internal/generated/server.go`
4. Use generic functions from `internal/util/genericGetter.go` when possible

#### Key Backend Components
- `cmd/http/main.go` - Application entry point
- `internal/generated/server.go` - OpenAPI implementation
- `internal/util/genericGetter.go` - Generic database utilities
- `internal/storage/storage.go` - Database operations
- `api/api.yaml` - OpenAPI specification

## Development Guidelines

### Frontend
- Use absolute imports with `@/` prefix
- Use pnpm, never npm
- Follow shadcn/ui patterns for components
- Write pre/post conditions with assert statements
- Handle exceptions properly, don't hide them
- All animations target 1920x1080 at 30fps

### Backend
- Follow OpenAPI-first development
- Return descriptive errors to frontend with appropriate status codes
- Add error descriptions to `api/api.yaml` when needed
- Use generic database functions when possible
- Run `make build` to validate implementations

## Testing

### Frontend
- Playwright tests in `tests/` directory
- Run with `npx playwright test`
- ESLint for code quality

### Backend
- Go tests in `internal/` and `claude_tests/`
- Run unit tests: `make test`
- Run Claude-specific tests: `make ctest`
- Coverage reports: `make testcov` or `make guicov`

## Key Integrations

- **Firebase**: Authentication (frontend) and admin operations (backend)
- **OpenAI**: LLM integration for animation generation
- **MongoDB**: User and project data storage
- **Remotion**: Video composition and rendering engine
