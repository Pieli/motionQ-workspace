package util

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetAllFromList[V any](ctx context.Context, coll *mongo.Collection, list []primitive.ObjectID) ([]V, error) {
	if len(list) == 0 {
		return []V{}, nil
	}

	extendedQuery := bson.A{
		bson.D{{Key: "$match", Value: bson.D{
			{Key: "_id", Value: bson.D{
				{Key: "$in", Value: list},
			}}}}},
		bson.D{{Key: "$sort", Value: bson.D{
			{Key: "_id", Value: -1},
		}}},
	}

	response, err := GetAllGeneric[V](coll, extendedQuery, ctx)
	return response, err
}

func GetAllFromListPreserveOrder[V any](ctx context.Context, coll *mongo.Collection, list []primitive.ObjectID) ([]V, error) {
	if len(list) == 0 {
		return []V{}, nil
	}

	extendedQuery := bson.A{
		bson.D{{Key: "$match", Value: bson.D{
			{Key: "_id", Value: bson.D{
				{Key: "$in", Value: list},
			}}}}},
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "__order", Value: bson.D{
				{Key: "$indexOfArray", Value: bson.A{list, "$_id"}},
			}},
		}}},
		bson.D{{Key: "$sort", Value: bson.D{
			{Key: "__order", Value: -1},
		}}},
	}

	response, err := GetAllGeneric[V](coll, extendedQuery, ctx)
	return response, err
}

func GetGenericExtended[V any](query bson.D, coll *mongo.Collection, ctx context.Context) (V, error) {
	var result V

	cursor := coll.FindOne(ctx, query)
	if err := cursor.Err(); err != nil {
		return result, err
	}

	if err := cursor.Decode(&result); err != nil {
		return result, err
	}
	return result, nil
}

func GetGeneric[V any](objID string, coll *mongo.Collection, ctx context.Context) (V, error) {
	var result V

	objectID, err := primitive.ObjectIDFromHex(objID)
	if err != nil {
		return result, err
	}

	return GetGenericExtended[V](bson.D{{Key: "_id", Value: objectID}}, coll, ctx)
}

func GetGenericUID[V any](uid string, coll *mongo.Collection, ctx context.Context) (V, error) {
	return GetGenericExtended[V](bson.D{{Key: "uid", Value: uid}}, coll, ctx)
}

func GetAllGeneric[V any](coll *mongo.Collection, query bson.A, ctx context.Context) ([]V, error) {
	cursor, err := coll.Aggregate(ctx, query)
	if err != nil {
		return nil, err
	}

	posts := make([]V, 0)
	if err = cursor.All(ctx, &posts); err != nil {
		return nil, err
	}

	return posts, nil
}

func GetAllGenericSorted[V any](coll *mongo.Collection, query bson.A, ctx context.Context) ([]V, error) {
	if query == nil {
		query = bson.A{}
	}

	sortStage := bson.A{
		bson.D{
			{Key: "$sort",
				Value: bson.D{
					{Key: "createdAt", Value: -1},
				},
			},
		},
		// for debuggin purposes
		// bson.D{{Key: "$out", Value: "temp"}},
	}

	query = append(query, sortStage...)
	return GetAllGeneric[V](coll, query, ctx)
}

func UpdateGeneric[V any](objID string, req V, coll *mongo.Collection, ctx context.Context) error {
	objectID, err := primitive.ObjectIDFromHex(objID)
	if err != nil {
		return err
	}

	result := coll.FindOneAndUpdate(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": req}, nil)

	if result.Err() != nil {
		return result.Err()
	}

	return nil
}

func DeleteGeneric(objID string, coll *mongo.Collection, ctx context.Context) error {
	objectID, err := primitive.ObjectIDFromHex(objID)
	if err != nil {
		return err
	}

	_, err = coll.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
