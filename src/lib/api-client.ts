import { postApiUsers, getApiUsersMe, postApiUsersMeProjects, getApiUsersMeProjects } from '@/client/sdk.gen';
import type { User } from 'firebase/auth';
import type { Project } from '@/client/types.gen';


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
        email: firebaseUser.email || '',
      },
    });

    if (response.data) {
      return response.data.userId;
    }

    console.error('Failed to create user:', response.error);
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
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

    console.error('Failed to get user profile:', response.error);
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Get user projects from the backend API
 */
export async function getUserProjects(firebaseUser: User): Promise<Project[] | null> {
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

    console.error('Failed to get projects:', response.error);
    return null;
  } catch (error) {
    console.error('Error getting projects:', error);
    return null;
  }
}

/**
 * Create a new project in the backend API
 */
export async function createProject(firebaseUser: User, projectName: string): Promise<Project | null> {
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

    console.error('Failed to create project:', response.error);
    return null;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}
