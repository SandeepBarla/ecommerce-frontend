import { ProductListResponse } from "../product/ProductListResponse";

export interface CartResponse {
  id: number;
  userId: number;
  cartItems: CartItemResponse[];
  totalPrice: number;
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  product: ProductListResponse;
  quantity: number;
}
