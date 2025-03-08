import { CategoryResponse } from "../types/product/CategoryResponse";
import api from "./api";

/**
 * Fetches all categories from the backend.
 */
export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const response = await api.get("/categories");
  return response.data;
};
