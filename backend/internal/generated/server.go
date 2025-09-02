package api

import (
	"context"
	"log"
	"net/url"
	"time"

	"firebase.google.com/go/auth"
	"github.com/Pieli/server/internal/util"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ensure that we've conformed to the `ServerInterface` with a compile-time check
var _ StrictServerInterface = (*Server)(nil)

type Server struct {
	userStorage *UserStore
}

func NewServer(userStore *UserStore) Server {
	return Server{
		userStorage: userStore,
	}
}

// storage
type UserStore struct {
	db *mongo.Database
}

type CreateProjectsIntermediate struct {
	UserId   string          `json:"userId"`
	Name     string          `json:"name"`
	Metadata ProjectMetadata `json:"metadata"`
}

func initIndexes(db *mongo.Database) {
	coll := db.Collection("users")

	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "uid", Value: 1}},
		Options: options.Index().SetUnique(true),
	}

	// create the index for uid
	_, err := coll.Indexes().CreateOne(context.TODO(), indexModel)
	if err != nil {
		log.Fatal(err.Error())
	}
}

func NewStorage(db *mongo.Database) *UserStore {
	initIndexes(db)
	return &UserStore{
		db: db,
	}
}

func (u *UserStore) Collection() *mongo.Collection {
	return u.db.Collection("users")
}

func (u *UserStore) AddProject(ctx context.Context, userID, projectID primitive.ObjectID) error {
	result := u.Collection().FindOneAndUpdate(
		ctx, bson.M{"_id": userID},
		bson.M{"$addToSet": bson.M{"projects": projectID}}, nil)

	return result.Err()
}

func (u *UserStore) RemoveProject(ctx context.Context, userID, projectID primitive.ObjectID) error {
	result := u.Collection().FindOneAndUpdate(
		ctx, bson.M{"_id": userID},
		bson.M{"$pull": bson.M{"projects": projectID}}, nil)

	return result.Err()
}

type UserCreationIntermediate struct {
	UserReq       UserCreateRequest `bson:"inline"`
	PhotoUrl      url.URL           `bson:"photoUrl,omitempty"`
	CreatedAt     time.Time         `bson:"createdAt"`
	EmailVerified bool              `bson:"emailVerified"`
	UID           string            `bson:"uid"`
}

// --- Project endpoints ---
// TODO refactor later into own service

// List all projects
// (GET /api/users/me/projects)
func (s Server) GetApiUsersMeProjects(ctx context.Context, request GetApiUsersMeProjectsRequestObject) (GetApiUsersMeProjectsResponseObject, error) {
	userColl := s.userStorage.Collection()
	projectsColl := s.userStorage.db.Collection("projects")
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return GetApiUsersMeProjects404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}

		return GetApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Find all projects for this user
	cursor, err := projectsColl.Find(ctx, bson.M{"userId": user.Id})
	if err != nil {
		return GetApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve projects.",
		}}, nil
	}

	// Decode projects
	var projects []Project
	if err = cursor.All(ctx, &projects); err != nil {
		return GetApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to decode projects.",
		}}, nil
	}

	return GetApiUsersMeProjects200JSONResponse(projects), nil
}

// Create a new project
// (POST /api/users/me/projects)
func (s Server) PostApiUsersMeProjects(ctx context.Context, request PostApiUsersMeProjectsRequestObject) (PostApiUsersMeProjectsResponseObject, error) {
	coll := s.userStorage.db.Collection("projects")
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	userColl := s.userStorage.Collection()
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		return PostApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Create new project
	toCreate := CreateProjectsIntermediate{
		UserId: user.Id,
		Name:   request.Body.Name,
		Metadata: ProjectMetadata{
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
			LastAccessed: time.Now(),
			Status:       "draft",
			Tags:         []string{},
		},
	}

	inserted, err := coll.InsertOne(ctx, toCreate)
	if err != nil {
		return PostApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to create project. Please try again later.",
		}}, nil
	}

	projectID := inserted.InsertedID.(primitive.ObjectID)
	created, err := util.GetGeneric[Project](projectID.Hex(), coll, ctx)
	if err != nil {
		return PostApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get created object.",
		}}, nil
	}

	// Add to user
	userID, _ := primitive.ObjectIDFromHex(user.Id)
	err = s.userStorage.AddProject(ctx, userID, projectID)
	if err != nil {
		return PostApiUsersMeProjects500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Something went wrong while creating a project. Please try again later.",
		}}, nil
	}

	return PostApiUsersMeProjects201JSONResponse(created), nil
}

// Delete a project
// (DELETE /api/users/me/projects/{projectId})
func (s Server) DeleteApiUsersMeProjectsProjectId(ctx context.Context, request DeleteApiUsersMeProjectsProjectIdRequestObject) (DeleteApiUsersMeProjectsProjectIdResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return DeleteApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}
		return DeleteApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Convert project ID from string to ObjectID
	projectObjectID, err := primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return DeleteApiUsersMeProjectsProjectId400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Check if project exists and belongs to the user
	var project Project
	err = projectsColl.FindOne(ctx, bson.M{
		"_id":    projectObjectID,
		"userId": user.Id,
	}).Decode(&project)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return DeleteApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist or does not belong to you.",
			}}, nil
		}
		return DeleteApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to verify project ownership.",
		}}, nil
	}

	// Delete the project
	_, err = projectsColl.DeleteOne(ctx, bson.M{"_id": projectObjectID})
	if err != nil {
		return DeleteApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to delete project.",
		}}, nil
	}

	// Remove project reference from user's projects array
	userObjectID, _ := primitive.ObjectIDFromHex(user.Id)
	err = s.userStorage.RemoveProject(ctx, userObjectID, projectObjectID)
	if err != nil {
		return DeleteApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Project was deleted but failed to update user references.",
		}}, nil
	}

	return DeleteApiUsersMeProjectsProjectId204Response{}, nil
}

// Get a specific project
// (GET /api/users/me/projects/{projectId})
func (s Server) GetApiUsersMeProjectsProjectId(ctx context.Context, request GetApiUsersMeProjectsProjectIdRequestObject) (GetApiUsersMeProjectsProjectIdResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		return GetApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// TODO add this to all object ids middleware in the spec

	// Validate project ID format
	_, err = primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return GetApiUsersMeProjectsProjectId400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Get the project using GenericGetter but verify it belongs to the user
	project, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return GetApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist.",
			}}, nil
		}
		return GetApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve project.",
		}}, nil
	}

	// Verify the project belongs to the current user
	if project.UserId != user.Id {
		return GetApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
			Error:   "Project not found",
			Message: "The project with the specified ID does not exist or does not belong to you.",
		}}, nil
	}

	return GetApiUsersMeProjectsProjectId200JSONResponse(project), nil
}

// Update project compositions
// (PUT /api/users/me/projects/{projectId})
func (s Server) PutApiUsersMeProjectsProjectId(ctx context.Context, request PutApiUsersMeProjectsProjectIdRequestObject) (PutApiUsersMeProjectsProjectIdResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID using generic function
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PutApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}
		return PutApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Validate project ID format
	_, err = primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return PutApiUsersMeProjectsProjectId400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Get the project using generic function to verify it exists and belongs to user
	project, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PutApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist.",
			}}, nil
		}
		return PutApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve project.",
		}}, nil
	}

	// Verify the project belongs to the current user
	if project.UserId != user.Id {
		return PutApiUsersMeProjectsProjectId404JSONResponse{NotFoundJSONResponse{
			Error:   "Project not found",
			Message: "The project with the specified ID does not exist or does not belong to you.",
		}}, nil
	}

	// Update the project compositions using generic function
	updateData := struct {
		Compositions *[]Composition `bson:"compositions"`
		Metadata     struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		} `bson:"metadata"`
	}{
		Compositions: request.Body.Compositions,
		Metadata: struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		}{
			UpdatedAt: time.Now(),
		},
	}

	err = util.UpdateGeneric(request.ProjectId, updateData, projectsColl, ctx)
	if err != nil {
		return PutApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to update project compositions.",
		}}, nil
	}

	// Fetch and return the updated project using generic function
	updatedProject, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		return PutApiUsersMeProjectsProjectId500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve updated project.",
		}}, nil
	}

	return PutApiUsersMeProjectsProjectId200JSONResponse(updatedProject), nil
}

func (s Server) PutApiUsersMeProjectsProjectIdCompositions(ctx context.Context, request PutApiUsersMeProjectsProjectIdCompositionsRequestObject) (PutApiUsersMeProjectsProjectIdCompositionsResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PutApiUsersMeProjectsProjectIdCompositions404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}
		return PutApiUsersMeProjectsProjectIdCompositions500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Validate project ID format
	_, err = primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return PutApiUsersMeProjectsProjectIdCompositions400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Get the project using generic function to verify it exists and belongs to user
	project, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PutApiUsersMeProjectsProjectIdCompositions404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist.",
			}}, nil
		}
		return PutApiUsersMeProjectsProjectIdCompositions500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve project.",
		}}, nil
	}

	// Verify the project belongs to the current user
	if project.UserId != user.Id {
		return PutApiUsersMeProjectsProjectIdCompositions404JSONResponse{NotFoundJSONResponse{
			Error:   "Project not found",
			Message: "The project with the specified ID does not exist or does not belong to you.",
		}}, nil
	}

	// Update the project compositions using generic function
	updateData := struct {
		Compositions *[]Composition `bson:"compositions"`
		Metadata     struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		} `bson:"metadata"`
	}{
		Compositions: request.Body.Compositions,
		Metadata: struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		}{
			UpdatedAt: time.Now(),
		},
	}

	err = util.UpdateGeneric(request.ProjectId, updateData, projectsColl, ctx)
	if err != nil {
		return PutApiUsersMeProjectsProjectIdCompositions500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to update project compositions.",
		}}, nil
	}

	// Fetch and return the updated project
	updatedProject, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		return PutApiUsersMeProjectsProjectIdCompositions500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve updated project.",
		}}, nil
	}

	return PutApiUsersMeProjectsProjectIdCompositions200JSONResponse(updatedProject), nil
}

// Add message to project chat history
// (POST /api/users/me/projects/{projectId}/chat)
func (s Server) PostApiUsersMeProjectsProjectIdChat(ctx context.Context, request PostApiUsersMeProjectsProjectIdChatRequestObject) (PostApiUsersMeProjectsProjectIdChatResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PostApiUsersMeProjectsProjectIdChat404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}
		return PostApiUsersMeProjectsProjectIdChat500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Validate project ID format
	_, err = primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return PostApiUsersMeProjectsProjectIdChat400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Get the project to verify it exists and belongs to user
	project, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PostApiUsersMeProjectsProjectIdChat404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist.",
			}}, nil
		}
		return PostApiUsersMeProjectsProjectIdChat500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve project.",
		}}, nil
	}

	// Verify the project belongs to the current user
	if project.UserId != user.Id {
		return PostApiUsersMeProjectsProjectIdChat404JSONResponse{NotFoundJSONResponse{
			Error:   "Project not found",
			Message: "The project with the specified ID does not exist or does not belong to you.",
		}}, nil
	}

	// Create new chat message
	chatMessage := ChatMessage{
		Id:        primitive.NewObjectID().Hex(),
		Role:      ChatMessageRole(request.Body.Role),
		Content:   request.Body.Content,
		Timestamp: time.Now(),
		Metadata:  nil,
	}

	// Add message to project's chat history
	updateData := bson.M{
		"$push": bson.M{"chatHistory": chatMessage},
		"$set":  bson.M{"metadata.updatedAt": time.Now()},
	}

	projectObjectID, _ := primitive.ObjectIDFromHex(request.ProjectId)
	_, err = projectsColl.UpdateOne(ctx, bson.M{"_id": projectObjectID}, updateData)
	if err != nil {
		return PostApiUsersMeProjectsProjectIdChat500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to add message to chat history.",
		}}, nil
	}

	return PostApiUsersMeProjectsProjectIdChat200JSONResponse(chatMessage), nil
}

// --- End Project endpoints ---

// Create current user profile
// (POST /api/public/users)
func (s Server) PostApiUsers(ctx context.Context, request PostApiUsersRequestObject) (PostApiUsersResponseObject, error) {
	coll := s.userStorage.Collection()

	createUser := UserCreateRequest(*request.Body)
	userRecord := ctx.Value("user").(*auth.UserRecord)

	// little bit hacky
	_, err := util.GetGenericUID[UserResponse](userRecord.UID, coll, ctx)
	if err != mongo.ErrNoDocuments {
		return PostApiUsers400JSONResponse{BadRequestJSONResponse{
			Error:   "Something went wrong",
			Message: "User already exists",
		}}, nil

	}

	// firebase is the source of truth
	email := userRecord.Email
	if email == "" {
		return PostApiUsers400JSONResponse{BadRequestJSONResponse{
			Error:   "Missing email",
			Message: "User email is required but not found in Firebase record.",
		}}, nil
	}
	createUser.Email = openapi_types.Email(email)

	// Create intermediate object with timestamp and photo URL
	userIntermediate := UserCreationIntermediate{
		UserReq:   createUser,
		CreatedAt: time.Now(),
		UID:       userRecord.UID,
	}

	// Add photo URL if available from Firebase
	if userRecord.UserInfo.PhotoURL != "" {
		if photoURL, err := url.Parse(userRecord.UserInfo.PhotoURL); err == nil {
			userIntermediate.PhotoUrl = *photoURL
		}
	}

	result, err := s.userStorage.Collection().InsertOne(ctx, userIntermediate)
	if err != nil {
		return PostApiUsers500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Error while creating user. Please try again later.",
		}}, nil
	}

	return PostApiUsers200JSONResponse{
		UserId: result.InsertedID.(primitive.ObjectID).Hex(),
	}, nil

}

// Get current user profile
// (GET /api/users/me)
func (s Server) GetApiUsersMe(ctx context.Context, request GetApiUsersMeRequestObject) (GetApiUsersMeResponseObject, error) {
	coll := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	user, err := util.GetGenericUID[UserResponse](uid, coll, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return GetApiUsersMe404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}

		return GetApiUsersMe500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "An error occurred while retrieving the user profile.",
		}}, nil
	}

	return GetApiUsersMe200JSONResponse(user), nil
}

// Get current user credit information
// (GET /api/users/me/credit)
func (s Server) GetApiUsersMeCredit(ctx context.Context, request GetApiUsersMeCreditRequestObject) (GetApiUsersMeCreditResponseObject, error) {
	return nil, nil
}

// Update project name
// (PATCH /api/users/me/projects/{projectId}/name)
func (s Server) PatchApiUsersMeProjectsProjectIdName(ctx context.Context, request PatchApiUsersMeProjectsProjectIdNameRequestObject) (PatchApiUsersMeProjectsProjectIdNameResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PatchApiUsersMeProjectsProjectIdName404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}
		return PatchApiUsersMeProjectsProjectIdName500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Validate project ID format
	_, err = primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return PatchApiUsersMeProjectsProjectIdName400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Get the project using generic function to verify it exists and belongs to user
	project, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PatchApiUsersMeProjectsProjectIdName404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist.",
			}}, nil
		}
		return PatchApiUsersMeProjectsProjectIdName500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve project.",
		}}, nil
	}

	// Verify the project belongs to the current user
	if project.UserId != user.Id {
		return PatchApiUsersMeProjectsProjectIdName404JSONResponse{NotFoundJSONResponse{
			Error:   "Project not found",
			Message: "The project with the specified ID does not exist or does not belong to you.",
		}}, nil
	}

	// Update the project name using generic function
	updateData := struct {
		Name     string `bson:"name"`
		Metadata struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		} `bson:"metadata"`
	}{
		Name: request.Body.Name,
		Metadata: struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		}{
			UpdatedAt: time.Now(),
		},
	}

	err = util.UpdateGeneric(request.ProjectId, updateData, projectsColl, ctx)
	if err != nil {
		return PatchApiUsersMeProjectsProjectIdName500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to update project name.",
		}}, nil
	}

	// Fetch and return the updated project
	updatedProject, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		return PatchApiUsersMeProjectsProjectIdName500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve updated project.",
		}}, nil
	}

	return PatchApiUsersMeProjectsProjectIdName200JSONResponse(updatedProject), nil
}

func (s Server) PatchApiUsersMeProjectsProjectIdColorScheme(ctx context.Context, request PatchApiUsersMeProjectsProjectIdColorSchemeRequestObject) (PatchApiUsersMeProjectsProjectIdColorSchemeResponseObject, error) {
	projectsColl := s.userStorage.db.Collection("projects")
	userColl := s.userStorage.Collection()
	uid := ctx.Value("uid").(string)

	// Get user ID from UID
	user, err := util.GetGenericUID[UserResponse](uid, userColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PatchApiUsersMeProjectsProjectIdColorScheme404JSONResponse{NotFoundJSONResponse{
				Error:   "User not found",
				Message: "The user with the specified ID does not exist.",
			}}, nil
		}
		return PatchApiUsersMeProjectsProjectIdColorScheme500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to get user information.",
		}}, nil
	}

	// Validate project ID format
	_, err = primitive.ObjectIDFromHex(request.ProjectId)
	if err != nil {
		return PatchApiUsersMeProjectsProjectIdColorScheme400JSONResponse{BadRequestJSONResponse{
			Error:   "Invalid project ID",
			Message: "The provided project ID is not valid.",
		}}, nil
	}

	// Get the project using generic function to verify it exists and belongs to user
	project, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return PatchApiUsersMeProjectsProjectIdColorScheme404JSONResponse{NotFoundJSONResponse{
				Error:   "Project not found",
				Message: "The project with the specified ID does not exist.",
			}}, nil
		}
		return PatchApiUsersMeProjectsProjectIdColorScheme500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve project.",
		}}, nil
	}

	// Verify the project belongs to the current user
	if project.UserId != user.Id {
		return PatchApiUsersMeProjectsProjectIdColorScheme404JSONResponse{NotFoundJSONResponse{
			Error:   "Project not found",
			Message: "The project with the specified ID does not exist or does not belong to you.",
		}}, nil
	}

	// Update the project color scheme using generic function
	updateData := struct {
		ColorScheme *ColorPalette `bson:"colorScheme"`
		Metadata    struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		} `bson:"metadata"`
	}{
		ColorScheme: &request.Body.ColorScheme,
		Metadata: struct {
			UpdatedAt time.Time `bson:"updatedAt"`
		}{
			UpdatedAt: time.Now(),
		},
	}

	err = util.UpdateGeneric(request.ProjectId, updateData, projectsColl, ctx)
	if err != nil {
		return PatchApiUsersMeProjectsProjectIdColorScheme500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to update project color scheme.",
		}}, nil
	}

	// Fetch and return the updated project
	updatedProject, err := util.GetGeneric[Project](request.ProjectId, projectsColl, ctx)
	if err != nil {
		return PatchApiUsersMeProjectsProjectIdColorScheme500JSONResponse{InternalServerErrorJSONResponse{
			Error:   err.Error(),
			Message: "Failed to retrieve updated project.",
		}}, nil
	}

	return PatchApiUsersMeProjectsProjectIdColorScheme200JSONResponse(updatedProject), nil
}
