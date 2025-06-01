export interface ProductMediaRequest {
  mediaUrl: string;
  orderIndex: number;
  type: "Image" | "Video" | number; // Support both string (frontend) and numeric (backend)
}

// Backend expects numeric enum values
export interface ProductMediaRequestBackend {
  mediaUrl: string;
  orderIndex: number;
  type: number; // 0 = Image, 1 = Video
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

  media: ProductMediaRequest[] | ProductMediaRequestBackend[];
}
