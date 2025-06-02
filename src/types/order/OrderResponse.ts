import { AddressResponse } from "../address/AddressResponse";

export interface OrderProductResponse {
  productId: number;
  quantity: number;
  productName: string; // Enhanced with product details
  price: number; // Price at time of order
}

export interface CustomerInfoResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  addressId?: number; // Just the ID reference for backward compatibility
  address?: AddressResponse; // Full address object
  customer?: CustomerInfoResponse; // Customer details for admin - made optional since it might not always be present
  orderProducts: OrderProductResponse[];
  totalAmount: number;
  paymentStatus: string;
  paymentRemarks?: string; // Admin remarks for payment rejection
  orderStatus: string;
  orderDate: string; // Date in ISO format
  trackingNumber: string;
  paymentProofUrl?: string; // Cloudinary URL for payment proof
}
