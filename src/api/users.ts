import {
  UserRegisterRequest,
  UserUpdateRequest,
} from "../types/user/UserRequest";
import { AuthResponse, UserResponse } from "../types/user/UserResponse";
import api from "./api";

// ✅ Register User
export const registerUser = async (
  userData: UserRegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/users", userData);
  return response.data;
};

// ✅ Get All Users (Admin Only)
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>("/users");
  return response.data;
};

// ✅ Get User by ID
export const getUserById = async (userId: number): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/users/${userId}`);
  return response.data;
};

// ✅ Update User Profile
export const updateUserProfile = async (
  userId: number,
  userData: UserUpdateRequest
): Promise<void> => {
  await api.put(`/users/${userId}`, userData);
};
