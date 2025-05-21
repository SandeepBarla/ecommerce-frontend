export interface OrderProductResponse {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  orderProducts: OrderProductResponse[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  orderDate: string; // Assuming it's a date in string format (ISO format)
  shippingAddress: string;
  trackingNumber: string;
}
