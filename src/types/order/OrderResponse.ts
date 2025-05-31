export interface OrderProductResponse {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  addressId?: number; // Just the ID reference, not full object
  orderProducts: OrderProductResponse[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  orderDate: string; // Date in ISO format
  trackingNumber: string;
  paymentProofUrl?: string; // Cloudinary URL for payment proof
}
