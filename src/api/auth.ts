import { UserLoginRequest } from "../types/user/UserRequest";
import { AuthResponse } from "../types/user/UserResponse";
import api from "./api";

// ✅ User Login
export const loginUser = async (
  loginData: UserLoginRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", loginData);
  return response.data;
};
