import axios from "axios";
import { User } from "./context/AuthContext";

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
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
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

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

// ✅ Add or Update a Single Cart Item (Upsert)
export const upsertCartItem = async (productId: number, quantity: number) => {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });
  return response.data;
};

// ✅ Bulk Update Cart (Multiple Products)
export const bulkUpdateCart = async (
  cartItems: { productId: number; quantity: number }[]
) => {
  const response = await api.patch("/cart", {
    items: cartItems,
  });
  return response.data;
};

// ✅ Get Cart
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

// ✅ Clear Cart
export const clearCart = async () => {
  const response = await api.delete("/cart");
  return response.data;
};

// ✅ Remove Single Item from Cart (By Setting Quantity to 0)
export const removeCartItem = async (productId: number) => {
  const response = await api.post("/cart", {
    productId,
    quantity: 0, // ✅ Setting quantity to 0 removes item
  });
  return response.data;
};

// ✅ Create Order with Correct Data Structure
export const placeOrder = async (orderData: {
  products: { productId: number; quantity: number }[]; // ✅ Fix: Send an array, not a string
  totalAmount: number;
  shippingAddress: string;
}) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// ✅ Get User Orders
export const getUserOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// Define Product Interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

// ✅ Fetch All Products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// ✅ Add New Product
export const addProduct = async (productData: Omit<Product, "id">) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// ✅ Update Existing Product
export const updateProduct = async (
  productId: number,
  productData: Omit<Product, "id">
) => {
  try {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// ✅ Delete Product
export const deleteProduct = async (productId: number) => {
  try {
    await api.delete(`/products/${productId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ✅ Fetch All Users (Admin Only)
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export interface OrderProduct {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  products: OrderProduct[];
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  shippingAddress: string;
}

// ✅ Fetch Orders of a Specific User (Admin Only) by `userId`
export const fetchUserOrders = async (userId: number): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>(`/orders/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, newStatus);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const fetchAllOrders = async () => {
  try {
    const response = await api.get<Order[]>("/orders/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};
