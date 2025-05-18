import { createContext } from "react";
import { UserResponse } from "../types/user/UserResponse"; // ✅ Use defined UserResponse type

interface AuthContextType {
  token: string | null;
  role: string | null;
  user: UserResponse | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  userLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
