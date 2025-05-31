export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  fullName: string;
  phone?: string;
}
