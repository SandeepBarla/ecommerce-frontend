import {
  OrderCreateRequest,
  OrderStatusUpdateRequest,
} from "../types/order/OrderRequest";
import { OrderResponse } from "../types/order/OrderResponse";
import api from "./api";

// ✅ Place a New Order
export const placeOrder = async (
  userId: number,
  orderData: OrderCreateRequest
): Promise<OrderResponse> => {
  if (!userId) throw new Error("User ID is required to place an order");
  const response = await api.post<OrderResponse>(
    `/users/${userId}/orders`,
    orderData
  );
  return response.data;
};

// ✅ Get All Orders for a User
export const getUserOrders = async (
  userId: number
): Promise<OrderResponse[]> => {
  if (!userId) throw new Error("User ID is required to fetch orders");
  const response = await api.get<OrderResponse[]>(`/users/${userId}/orders`);
  return response.data;
};

// ✅ Get Order Details by ID
export const getOrderById = async (
  userId: number,
  orderId: number
): Promise<OrderResponse> => {
  if (!userId || !orderId) throw new Error("User ID and Order ID are required");
  const response = await api.get<OrderResponse>(
    `/users/${userId}/orders/${orderId}`
  );
  return response.data;
};

// ✅ Update Order Status (Admin Only)
export const updateOrderStatus = async (
  userId: number,
  orderId: number,
  updateData: OrderStatusUpdateRequest
): Promise<OrderResponse> => {
  if (!userId || !orderId)
    throw new Error("User ID and Order ID are required to update order status");
  const response = await api.patch<OrderResponse>(
    `/users/${userId}/orders/${orderId}`,
    updateData
  );
  return response.data;
};

// ✅ Get All Orders (Admin Only)
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const response = await api.get<OrderResponse[]>(`/orders`);
  return response.data;
};

// ✅ Get Order Details by ID (Admin Only)
export const getOrderDetailsById = async (
  orderId: number
): Promise<OrderResponse> => {
  if (!orderId) throw new Error("Order ID is required");
  const response = await api.get<OrderResponse>(`/orders/${orderId}`);
  return response.data;
};
