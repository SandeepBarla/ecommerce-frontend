import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Price calculation utilities for new pricing structure
export const getEffectivePrice = (
  originalPrice: number,
  discountedPrice?: number
): number => {
  return discountedPrice ?? originalPrice;
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString()}`;
};

export const formatPriceWithDiscount = (
  originalPrice: number,
  discountedPrice?: number
): {
  effectivePrice: number;
  formattedPrice: string;
  hasDiscount: boolean;
  formattedOriginalPrice?: string;
} => {
  const effectivePrice = getEffectivePrice(originalPrice, discountedPrice);
  const hasDiscount =
    discountedPrice !== undefined && discountedPrice < originalPrice;

  return {
    effectivePrice,
    formattedPrice: formatPrice(effectivePrice),
    hasDiscount,
    formattedOriginalPrice: hasDiscount
      ? formatPrice(originalPrice)
      : undefined,
  };
};
