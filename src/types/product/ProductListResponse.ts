export interface ProductListResponse {
  id: number;
  name: string;

  // ✅ Simplified Pricing Structure
  originalPrice: number;
  discountedPrice?: number;
  discountPercentage?: number; // Calculated by backend

  // ✅ UI Enhancement Fields
  isFeatured: boolean;
  isNew: boolean; // Calculated from newUntil by backend

  // ✅ Essential Attributes for Listing
  categoryName: string;
  sizeName: string;

  primaryImageUrl: string;
}
