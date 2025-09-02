package storage

import (
	"context"
	"time"
)

import (
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func BootstrapMongo(uri, dbName string, timeout time.Duration) (*mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	bsonOptions := &options.BSONOptions{
		UseJSONStructTags: true,
		NilSliceAsEmpty:   true,
	}

	clientOpts := options.Client().ApplyURI(uri).SetBSONOptions(bsonOptions)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		return nil, err
	}

	return client.Database(dbName), nil
}

func CloseMongo(db *mongo.Database) error {
	return db.Client().Disconnect(context.Background())
}
