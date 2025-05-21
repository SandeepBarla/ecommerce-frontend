export interface ProductMediaRequest {
  mediaUrl: string;
  orderIndex: number;
  type: "Image" | "Video";
}

export interface ProductUpsertRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  media: ProductMediaRequest[];
}
