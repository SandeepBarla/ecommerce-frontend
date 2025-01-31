export interface ProductUpsertRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}
