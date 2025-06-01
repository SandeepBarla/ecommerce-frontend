import { ProductListResponse } from "@/types/product/ProductListResponse";
import { ProductResponse } from "@/types/product/ProductResponse";

/**
 * ✅ Safely parse JSON strings from backend
 */
export const safeJsonParse = <T = string[]>(
  jsonString: string | undefined | null,
  fallback: T = [] as T
): T => {
  try {
    return jsonString ? JSON.parse(jsonString) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * ✅ Get current price (discounted or original)
 */
export const getCurrentPrice = (
  product: ProductListResponse | ProductResponse
): number => {
  return product.discountedPrice ?? product.originalPrice;
};

/**
 * ✅ Calculate discount percentage from original and discounted price
 */
export const calculateDiscountPercentage = (
  product: ProductListResponse | ProductResponse
): number | undefined => {
  if (
    !product.discountedPrice ||
    product.discountedPrice >= product.originalPrice
  ) {
    return undefined;
  }
  return Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );
};

/**
 * ✅ Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * ✅ Get primary image URL with fallback
 */
export const getPrimaryImageUrl = (
  product: ProductListResponse | ProductResponse,
  fallback = "/placeholder.png"
): string => {
  if ("primaryImageUrl" in product && product.primaryImageUrl) {
    return product.primaryImageUrl;
  }
  if ("media" in product && product.media?.length > 0) {
    const primaryImage = product.media
      .filter((m) => m.type === "Image")
      .sort((a, b) => a.orderIndex - b.orderIndex)[0];
    return primaryImage?.mediaUrl || fallback;
  }
  return fallback;
};

/**
 * ✅ Get all image URLs from product
 */
export const getProductImages = (product: ProductResponse): string[] => {
  if (!product.media || product.media.length === 0) {
    return ["/placeholder.png"];
  }

  const images = product.media
    .filter((m) => m.type === "Image")
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((m) => m.mediaUrl);

  return images.length > 0 ? images : ["/placeholder.png"];
};

/**
 * ✅ Get video URLs from product
 */
export const getProductVideos = (product: ProductResponse): string[] => {
  if (!product.media || product.media.length === 0) {
    return [];
  }

  return product.media
    .filter((m) => m.type === "Video")
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((m) => m.mediaUrl);
};

/**
 * ✅ Check if product is on sale
 */
export const isOnSale = (
  product: ProductListResponse | ProductResponse
): boolean => {
  return !!(
    product.discountedPrice && product.discountedPrice < product.originalPrice
  );
};

/**
 * ✅ Get discount amount in currency
 */
export const getDiscountAmount = (
  product: ProductListResponse | ProductResponse
): number => {
  if (
    !product.discountedPrice ||
    product.discountedPrice >= product.originalPrice
  ) {
    return 0;
  }
  return product.originalPrice - product.discountedPrice;
};

/**
 * ✅ Check if product is new (uses backend calculated isNew flag)
 */
export const isNewProduct = (
  product: ProductListResponse | ProductResponse
): boolean => {
  return product.isNew;
};
