import { CategoryResponse } from "../types/product/CategoryResponse";
import api from "./api";

/**
 * Fetches all categories from the backend.
 */
export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (
  name: string
): Promise<CategoryResponse> => {
  const response = await api.post<CategoryResponse>("/categories", { name });
  return response.data;
};

export const updateCategory = async (
  id: number,
  name: string
): Promise<CategoryResponse> => {
  const response = await api.put<CategoryResponse>(`/categories/${id}`, {
    name,
  });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
