import { ProductResponse } from "../product/ProductResponse";

export interface CartResponse {
  id: number;
  userId: number;
  cartItems: CartItemResponse[];
  totalPrice: number;
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  product: ProductResponse;
  quantity: number;
}
