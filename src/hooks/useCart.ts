import {
  clearCart as clearCartAPI,
  getCart,
  removeCartItem,
  upsertCartItem,
} from "@/api/cart";
import { useAuth } from "@/contexts/AuthContext";
import { getEffectivePrice } from "@/lib/utils";
import { CartItemResponse } from "@/types/cart/CartResponse";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCart = () => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Only fetch cart if user is authenticated
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCart(parseInt(user!.id)),
    enabled: isAuthenticated && !!user?.id,
  });

  // Calculate cart totals
  const cartItems = cartData?.cartItems || [];
  const cartTotal = calculateTotal(cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Authentication required");
      }

      const userId = parseInt(user.id);

      // Get current cart to check if item exists
      const currentCart = await getCart(userId);
      const existingItem = currentCart.cartItems.find(
        (item) => item.product.id === productId
      );
      const newQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      return upsertCartItem(userId, productId, newQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast.success("Item added to cart");
    },
    onError: (error: Error) => {
      if (error.message === "Authentication required") {
        toast.error("Please log in to add items to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Authentication required");
      }

      return removeCartItem(parseInt(user.id), productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast.info("Item removed from cart");
    },
    onError: (error: Error) => {
      if (error.message === "Authentication required") {
        toast.error("Please log in to manage cart");
      } else {
        toast.error("Failed to remove item");
      }
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Authentication required");
      }

      if (quantity <= 0) {
        return removeCartItem(parseInt(user.id), productId);
      }

      return upsertCartItem(parseInt(user.id), productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: (error: Error) => {
      if (error.message === "Authentication required") {
        toast.error("Please log in to manage cart");
      } else {
        toast.error("Failed to update cart");
      }
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Authentication required");
      }

      return clearCartAPI(parseInt(user.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast.info("Cart cleared");
    },
    onError: (error: Error) => {
      if (error.message === "Authentication required") {
        toast.error("Please log in to manage cart");
      } else {
        toast.error("Failed to clear cart");
      }
    },
  });

  const addToCart = (product: ProductListResponse, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to cart");
      return;
    }
    addToCartMutation.mutate({ productId: product.id, quantity });
  };

  const removeFromCart = (productId: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage cart");
      return;
    }
    removeFromCartMutation.mutate(productId);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage cart");
      return;
    }
    updateQuantityMutation.mutate({ productId, quantity });
  };

  const clearCart = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage cart");
      return;
    }
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCartMutation.mutate();
    }
  };

  return {
    cartItems,
    cartTotal,
    cartCount,
    isLoading:
      isLoading ||
      addToCartMutation.isPending ||
      removeFromCartMutation.isPending ||
      updateQuantityMutation.isPending,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isAuthenticated,
  };
};

const calculateTotal = (items: CartItemResponse[]): number => {
  return items.reduce(
    (total, item) =>
      total +
      getEffectivePrice(
        item.product.originalPrice,
        item.product.discountedPrice
      ) *
        item.quantity,
    0
  );
};
