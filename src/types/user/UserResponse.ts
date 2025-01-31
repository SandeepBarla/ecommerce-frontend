export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  userId: number;
  token: string;
  role: string;
}
