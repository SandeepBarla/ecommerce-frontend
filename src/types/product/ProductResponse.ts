export interface ProductResponse {
  id: number;
  name: string;
  description: string;

  // ✅ Simplified Pricing Structure
  originalPrice: number;
  discountedPrice?: number;
  discountPercentage?: number; // Calculated by backend

  // ✅ UI Enhancement Fields
  isFeatured: boolean;
  isNew: boolean; // Calculated from newUntil by backend
  newUntil?: string; // ISO date string

  // ✅ Relationships
  categoryId: number;
  sizeId: number;
  categoryName: string;
  sizeName: string;

  // ✅ Audit Fields
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  media: ProductMediaResponse[];
}

export interface ProductMediaResponse {
  mediaUrl: string;
  orderIndex: number;
  type: "Image" | "Video";
}
