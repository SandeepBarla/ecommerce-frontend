export interface OrderProductRequest {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  orderProducts: OrderProductRequest[];
  totalAmount: number;
  shippingAddress: string;
}

export interface OrderStatusUpdateRequest {
  status: string;
}
