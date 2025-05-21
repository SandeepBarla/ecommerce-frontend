export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  media: ProductMediaResponse[];
}

export interface ProductMediaResponse {
  mediaUrl: string;
  orderIndex: number;
  type: "Image" | "Video";
}
