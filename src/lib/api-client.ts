import { createClient } from '@/client/client';
import { postApiUsers, getApiUsersMe } from '@/client/sdk.gen';
import type { User } from 'firebase/auth';

// Create the API client instance
const client = createClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

/**
 * Create a new user in the backend API
 */
export async function createUser(firebaseUser: User): Promise<string | null> {
  try {
    // Get the ID token from Firebase user
    const idToken = await firebaseUser.getIdToken();

    const response = await postApiUsers({
      client,
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
        isVerified: firebaseUser.emailVerified,
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
      client,
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

export { client };
