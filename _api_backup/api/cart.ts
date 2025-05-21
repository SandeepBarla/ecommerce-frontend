import api from "./api"; // Import Axios instance

// ✅ Get Cart
export const getCart = async (userId: number) => {
  if (!userId) throw new Error("User ID is required to fetch the cart");
  const response = await api.get(`/users/${userId}/cart`);
  return response.data;
};

// ✅ Upsert Cart Item
export const upsertCartItem = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  if (!userId) throw new Error("User ID is required to update the cart");
  const response = await api.post(`/users/${userId}/cart`, {
    productId,
    quantity,
  });
  return response.data;
};

// ✅ Clear Cart
export const clearCart = async (userId: number) => {
  if (!userId) throw new Error("User ID is required to clear the cart");
  const response = await api.delete(`/users/${userId}/cart`);
  return response.data;
};
