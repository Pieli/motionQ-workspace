import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { createUser, getCurrentUser } from "@/lib/api-client";
import type { UserResponse } from "@/client/types.gen";

interface AuthContextType {
  user: User | null;
  backendUser: UserResponse | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  backendUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch backend user data when Firebase user is authenticated
        try {
          const { status, user: bUser } = await getCurrentUser(user);

          if (status == 200) {
            setBackendUser(bUser);
          } else if (status == 404) {
            // fallback user creation
            const userId = await createUser(user);
            if (!userId) {
              throw new Error("fallback user creation failed");
            }

            // get creawted user
            const { status, user: bUser } = await getCurrentUser(user);
            if (status != 201) {
              throw new Error("fallback user fetching failed");
            }
            setBackendUser(bUser);
          } else {
            throw new Error("Something went wrong");
          }
        } catch (error) {
          console.error("Failed to fetch backend user data:", error);
          setBackendUser(null);
        }
      } else {
        setBackendUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, backendUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
