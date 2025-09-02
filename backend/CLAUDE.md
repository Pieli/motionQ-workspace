# Project Workflow
- When implementing a new feature first `api/api.yaml` is modified
- Then `make generate` generates the boilerplate code into `internal/generated/server.gen.go`
- Then the generated function need to be implemented on the server `internal/generated/server.go`

# Misc
- Errors that happen during running the controller should always be returned to the frontend, with a suitable status and description (without leaking to much). If error functions are missing add error descriptions into @api/api.yaml and generate the functions using "make generate", call the errror in the controller and then finally check for errors in the `make build`.
- generated components are in `internal/generated/server.gen.go`
- use the generic functions to get the objects from the db whenever possible. Generic functions are in `internal/util/genericGetter.go`
