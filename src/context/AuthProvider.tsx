import { ReactNode, useCallback, useEffect, useState } from "react";
import api, { setAuthToken } from "../api/api";
import { UserResponse } from "../types/user/UserResponse"; // ✅ Use defined UserResponse type
import { AuthContext } from "./AuthContext"; // ✅ Import from new file

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [user, setUser] = useState<UserResponse | null>(null);

  // ✅ Wrap fetchUserProfile in useCallback to avoid unnecessary re-renders
  const fetchUserProfile = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId"); // Retrieve user ID
      if (!userId) return; // Prevent making an invalid request

      const response = await api.get<UserResponse>(`/users/${userId}`); // ✅ Correct API endpoint
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      logout(); // ✅ Logout if fetching profile fails (invalid token)
    }
  }, []); // ✅ No external dependencies

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]); // ✅ Added fetchUserProfile as a dependency

  const login = (newToken: string, userRole: string) => {
    setToken(newToken);
    setRole(userRole);
    setAuthToken(newToken);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);

    fetchUserProfile(); // ✅ Fetch user data after login
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setAuthToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
