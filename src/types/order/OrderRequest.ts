export interface OrderProductRequest {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  orderProducts: OrderProductRequest[];
  totalAmount: number;
  addressId?: number; // Foreign key to Address instead of string
  paymentProofUrl?: string; // Cloudinary URL for payment proof image
}

export interface OrderStatusUpdateRequest {
  status: string;
}
