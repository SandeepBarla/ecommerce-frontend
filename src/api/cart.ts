import { CartItemResponse, CartResponse } from "../types/cart/CartResponse";
import api from "./api"; // Import Axios instance

// ✅ Get Cart
export const getCart = async (userId: number): Promise<CartResponse> => {
  if (!userId) throw new Error("User ID is required to fetch the cart");
  try {
    const response = await api.get<CartResponse>(`/users/${userId}/cart`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        // Return empty cart if none exists
        return {
          id: 0,
          userId,
          cartItems: [],
          totalPrice: 0,
        };
      }
    }
    throw error;
  }
};

// ✅ Add/Update Cart Item
export const upsertCartItem = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to update the cart");
  if (!productId) throw new Error("Product ID is required");
  if (quantity < 0) throw new Error("Quantity cannot be negative");

  await api.post(`/users/${userId}/cart`, {
    productId,
    quantity,
  });
};

// ✅ Remove Cart Item (set quantity to 0)
export const removeCartItem = async (
  userId: number,
  productId: number
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to remove item from cart");
  if (!productId) throw new Error("Product ID is required");

  await api.post(`/users/${userId}/cart`, {
    productId,
    quantity: 0,
  });
};

// ✅ Clear Cart
export const clearCart = async (userId: number): Promise<void> => {
  if (!userId) throw new Error("User ID is required to clear the cart");
  await api.delete(`/users/${userId}/cart`);
};

// ✅ Helper function to get cart total from items
export const calculateCartTotal = (cartItems: CartItemResponse[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

// ✅ Helper function to get cart item count
export const calculateCartCount = (cartItems: CartItemResponse[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};
