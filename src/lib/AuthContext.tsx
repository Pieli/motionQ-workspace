import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { getCurrentUser } from "@/lib/api-client";
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
          const userData = await getCurrentUser(user);
          setBackendUser(userData);
        } catch (error) {
          console.error('Failed to fetch backend user data:', error);
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
