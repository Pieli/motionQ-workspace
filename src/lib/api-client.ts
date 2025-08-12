import {
  postApiUsers,
  getApiUsersMe,
  postApiUsersMeProjects,
  getApiUsersMeProjects,
  getApiUsersMeProjectsByProjectId,
  putApiUsersMeProjectsByProjectId,
  deleteApiUsersMeProjectsByProjectId,
  postApiUsersMeProjectsByProjectIdChat,
} from "@/client/sdk.gen";
import type { User } from "firebase/auth";
import type { Composition, Project } from "@/client/types.gen";

/**
 * Create a new user in the backend API
 */
export async function createUser(firebaseUser: User): Promise<string | null> {
  try {
    // Get the ID token from Firebase user
    const idToken = await firebaseUser.getIdToken();

    const response = await postApiUsers({
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: {
        email: firebaseUser.email || "",
      },
    });

    if (response.data) {
      return response.data.userId;
    }

    console.error("Failed to create user:", response.error);
    return null;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

/**
 * Get current user profile from the backend API
 */
export async function getCurrentUser(firebaseUser: User) {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await getApiUsersMe({
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.data) {
      return response.data;
    }

    console.error("Failed to get user profile:", response.error);
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Get user projects from the backend API
 */
export async function getUserProjects(
  firebaseUser: User,
): Promise<Project[] | null> {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await getApiUsersMeProjects({
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.data) {
      return response.data;
    }

    console.error("Failed to get projects:", response.error);
    return null;
  } catch (error) {
    console.error("Error getting projects:", error);
    return null;
  }
}

/**
 * Get a specific project by ID from the backend API
 */
export async function getProject(
  firebaseUser: User,
  projectId: string,
): Promise<Project | null> {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await getApiUsersMeProjectsByProjectId({
      path: {
        projectId: projectId,
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.data) {
      return response.data;
    }

    console.error("Failed to get project:", response.error);
    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    return null;
  }
}

/**
 * Update a project in the backend API
 */
export async function updateProject(
  firebaseUser: User,
  projectId: string,
  updates: {
    name?: string;
    history?: string[];
    compositions?: Composition[];
  },
): Promise<Project | null> {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await putApiUsersMeProjectsByProjectId({
      path: {
        projectId: projectId,
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: updates,
    });

    if (response.data) {
      return response.data;
    }

    console.error("Failed to update project:", response.error);
    return null;
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
}

/**
 * Create a new project in the backend API
 */
export async function createProject(
  firebaseUser: User,
  projectName: string,
): Promise<Project | null> {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await postApiUsersMeProjects({
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: {
        name: projectName,
      },
    });

    if (response.data) {
      return response.data;
    }

    console.error("Failed to create project:", response.error);
    return null;
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
}

/**
 * Add a message to project history
 */
export async function addToProjectHistory(
  firebaseUser: User,
  projectId: string,
  role: 'user' | 'agent',
  message: string,
): Promise<boolean> {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await postApiUsersMeProjectsByProjectIdChat({
      path: {
        projectId: projectId,
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: {
        role: role,
        content: message,
      },
    });

    return response.data !== undefined;
  } catch (error) {
    console.error("Error adding to project history:", error);
    return false;
  }
}

/**
 * Delete a project from the backend API
 */
export async function deleteProject(
  firebaseUser: User,
  projectId: string,
): Promise<boolean> {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await deleteApiUsersMeProjectsByProjectId({
      path: {
        projectId: projectId,
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.response.ok) {
      return true;
    }

    console.error("Failed to delete project:", response.error);
    return false;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}
