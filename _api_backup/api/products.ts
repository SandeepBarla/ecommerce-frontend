import { ProductListResponse } from "../types/product/ProductListResponse";
import { ProductResponse } from "../types/product/ProductResponse";
import { ProductUpsertRequest } from "../types/product/ProductUpsertRequest";
import api from "./api";

// ✅ Fetch All Products (returns only primaryImageUrl)
export const fetchProducts = async (): Promise<ProductListResponse[]> => {
  const response = await api.get<ProductListResponse[]>("/products");
  return response.data;
};

// ✅ Fetch Product by ID (returns full media list)
export const fetchProductById = async (
  id: number
): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>(`/products/${id}`);
  return response.data;
};

// ✅ Create New Product (Admin Only)
export const createProduct = async (
  data: ProductUpsertRequest
): Promise<ProductResponse> => {
  const response = await api.post<ProductResponse>("/products", data);
  return response.data;
};

// ✅ Update Product (Admin Only)
export const updateProduct = async (
  id: number,
  data: ProductUpsertRequest
): Promise<ProductResponse> => {
  const response = await api.put<ProductResponse>(`/products/${id}`, data);
  return response.data;
};

// ✅ Delete Product (Admin Only)
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
