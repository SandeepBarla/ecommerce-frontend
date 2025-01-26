import { createContext, useState, ReactNode, useEffect } from "react";
import { setAuthToken, api } from "../api";

interface User {
  fullName: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<User>("/auth/profile"); // ✅ Fetch user details from API
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      logout(); // Logout if fetching profile fails (invalid token)
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    setAuthToken(newToken);
    fetchUserProfile(); // ✅ Fetch user data after login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};