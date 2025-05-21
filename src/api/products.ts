import { ProductListResponse } from "@/types/product/ProductListResponse";
import { ProductResponse } from "@/types/product/ProductResponse";
import { ProductUpsertRequest } from "@/types/product/ProductUpsertRequest";
import api from "./api";

// Fetch All Products
export const fetchProducts = async (): Promise<ProductListResponse[]> => {
  const response = await api.get<ProductListResponse[]>("/products");
  return response.data;
};

// Fetch Product by ID
export const fetchProductById = async (
  id: number
): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>(`/products/${id}`);
  return response.data;
};

// Create New Product
export const createProduct = async (
  data: ProductUpsertRequest
): Promise<ProductResponse> => {
  const response = await api.post<ProductResponse>("/products", data);
  return response.data;
};

// Update Product
export const updateProduct = async (
  id: number,
  data: ProductUpsertRequest
): Promise<ProductResponse> => {
  const response = await api.put<ProductResponse>(`/products/${id}`, data);
  return response.data;
};

// Delete Product
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
