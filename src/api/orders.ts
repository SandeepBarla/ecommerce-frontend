import {
  OrderCreateRequest,
  OrderStatusUpdateRequest,
  PaymentStatusUpdateRequest,
} from "@/types/order/OrderRequest";
import { OrderResponse } from "@/types/order/OrderResponse";
import api from "./api";

// ✅ Create Order (User-specific)
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

// ✅ Get User's Orders
export const getUserOrders = async (
  userId: number
): Promise<OrderResponse[]> => {
  if (!userId) throw new Error("User ID is required to fetch orders");
  const response = await api.get<OrderResponse[]>(`/users/${userId}/orders`);
  return response.data;
};

// ✅ Get Single Order by ID (User-specific)
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

// ✅ Get All Orders (Admin Only)
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const response = await api.get<OrderResponse[]>("/orders");
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

// ✅ Update Payment Status (Admin Only)
export const updatePaymentStatus = async (
  orderId: number,
  updateData: PaymentStatusUpdateRequest
): Promise<void> => {
  if (!orderId)
    throw new Error("Order ID is required to update payment status");
  await api.patch(`/orders/${orderId}/payment-status`, updateData);
};
