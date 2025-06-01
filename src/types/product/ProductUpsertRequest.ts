export interface ProductMediaRequest {
  mediaUrl: string;
  orderIndex: number;
  type: "Image" | "Video";
}

export interface ProductUpsertRequest {
  name: string;
  description: string;

  // ✅ Simplified Pricing Structure
  originalPrice: number;
  discountedPrice?: number;

  // ✅ Category and Size (required for backend)
  categoryId: number;
  sizeId: number;

  // ✅ UI Enhancement Fields
  isFeatured?: boolean;
  newUntil?: string; // ISO date string

  media: ProductMediaRequest[];
}
