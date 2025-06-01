import { ProductListResponse } from "@/types/product/ProductListResponse";
import { ProductResponse } from "@/types/product/ProductResponse";
import { describe, expect, it } from "vitest";
import {
  calculateDiscountPercentage,
  formatPrice,
  getCurrentPrice,
  getProductImages,
  isNewProduct,
  isOnSale,
} from "../productUtils";

describe("Product Utils - Simplified Model", () => {
  const mockProduct: ProductListResponse = {
    id: 1,
    name: "Test Product",
    originalPrice: 100,
    discountedPrice: 80,
    discountPercentage: 20,
    isFeatured: true,
    isNew: true,
    categoryName: "Test Category",
    sizeName: "Test Size",
    primaryImageUrl: "https://example.com/image.jpg",
  };

  const mockProductWithoutDiscount: ProductListResponse = {
    id: 2,
    name: "Regular Product",
    originalPrice: 50,
    discountedPrice: undefined,
    discountPercentage: undefined,
    isFeatured: false,
    isNew: false,
    categoryName: "Test Category",
    sizeName: "Test Size",
    primaryImageUrl: "https://example.com/image2.jpg",
  };

  describe("getCurrentPrice", () => {
    it("should return discounted price when available", () => {
      expect(getCurrentPrice(mockProduct)).toBe(80);
    });

    it("should return original price when no discount", () => {
      expect(getCurrentPrice(mockProductWithoutDiscount)).toBe(50);
    });
  });

  describe("calculateDiscountPercentage", () => {
    it("should calculate correct discount percentage", () => {
      expect(calculateDiscountPercentage(mockProduct)).toBe(20);
    });

    it("should return undefined when no discount", () => {
      expect(
        calculateDiscountPercentage(mockProductWithoutDiscount)
      ).toBeUndefined();
    });
  });

  describe("isOnSale", () => {
    it("should return true when product has discount", () => {
      expect(isOnSale(mockProduct)).toBe(true);
    });

    it("should return false when no discount", () => {
      expect(isOnSale(mockProductWithoutDiscount)).toBe(false);
    });
  });

  describe("isNewProduct", () => {
    it("should return true for new products", () => {
      expect(isNewProduct(mockProduct)).toBe(true);
    });

    it("should return false for regular products", () => {
      expect(isNewProduct(mockProductWithoutDiscount)).toBe(false);
    });
  });

  describe("formatPrice", () => {
    it("should format price correctly", () => {
      expect(formatPrice(1000)).toBe("₹1,000");
    });

    it("should handle decimal prices", () => {
      expect(formatPrice(1234.56)).toBe("₹1,235");
    });
  });

  describe("getProductImages", () => {
    const mockDetailProduct: ProductResponse = {
      id: 1,
      name: "Test Product",
      description: "Test Description",
      originalPrice: 100,
      discountedPrice: 80,
      discountPercentage: 20,
      isFeatured: true,
      isNew: true,
      categoryId: 1,
      sizeId: 1,
      categoryName: "Test Category",
      sizeName: "Test Size",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      media: [
        {
          mediaUrl: "https://example.com/image1.jpg",
          type: "Image",
          orderIndex: 1,
        },
        {
          mediaUrl: "https://example.com/image2.jpg",
          type: "Image",
          orderIndex: 2,
        },
      ],
    };

    it("should return all image URLs", () => {
      const images = getProductImages(mockDetailProduct);
      expect(images).toEqual([
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ]);
    });

    it("should handle empty media array", () => {
      const productWithoutMedia = { ...mockDetailProduct, media: [] };
      const images = getProductImages(productWithoutMedia);
      expect(images).toEqual(["/placeholder.png"]);
    });
  });
});
