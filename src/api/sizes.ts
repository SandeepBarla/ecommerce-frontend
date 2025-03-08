import { SizeResponse } from "../types/product/SizeResponse";
import api from "./api";

/**
 * Fetches all sizes from the backend.
 */
export const fetchSizes = async (): Promise<SizeResponse[]> => {
  const response = await api.get("/sizes");
  return response.data;
};
