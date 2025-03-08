import { FavoriteResponse } from "../types/favorites/FavoriteResponse";
import api from "./api"; // Ensure api.ts is correctly imported

// ✅ Fetch user's favorite products
export const fetchFavorites = async (
  userId: number
): Promise<FavoriteResponse[]> => {
  const response = await api.get<FavoriteResponse[]>(
    `/users/${userId}/favorites`
  );
  return response.data;
};

// ✅ Add product to favorites
export const addFavorite = async (userId: number, productId: number) => {
  await api.post(`/users/${userId}/favorites/${productId}`);
};

// ✅ Remove product from favorites
export const removeFavorite = async (userId: number, productId: number) => {
  await api.delete(`/users/${userId}/favorites/${productId}`);
};
