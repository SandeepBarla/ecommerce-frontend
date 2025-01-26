import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define Product Interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers["Authorization"];
    }
};  

// API Functions with Type Safety
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get<Product[]>("/products");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Fetch a single product by ID
export const getProductById = async (id: number): Promise<Product> => {

    try {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Define User Authentication Interfaces
export interface AuthResponse {
    token: string;
}
  
export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}
  
export interface LoginData {
    email: string;
    password: string;
}
  
  // Register User
  export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
      try {
          const response = await api.post<AuthResponse>("/auth/register", data);
          return response.data;
      } catch (error) {
          console.error("Error during registration:", error);
          throw error;
      }
  };
  
  // Login User
  export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
      try {
          const response = await api.post<AuthResponse>("/auth/login", data);
          return response.data;
      } catch (error) {
          console.error("Error during login:", error);
          throw error;
      }
  };
  