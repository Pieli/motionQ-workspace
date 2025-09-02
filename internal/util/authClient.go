package util

import (
	"context"

	"firebase.google.com/go/auth"
)

type IAuth interface {
	GetUser(ctx context.Context, uid string) (*auth.UserRecord, error)
}

type AuthClient struct {
	Internal *auth.Client
}

func (a AuthClient) GetUser(ctx context.Context, uid string) (*auth.UserRecord, error) {
	return a.Internal.GetUser(ctx, uid)
}
