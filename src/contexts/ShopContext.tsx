import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import {
  clearCart as clearCartAPI,
  getCart,
  removeCartItem,
  upsertCartItem,
} from "../api/cart";
import { fetchProducts } from "../api/products";
import { CartItemResponse } from "../types/cart/CartResponse";
import { useAuth } from "./AuthContext";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  colors: string[];
  sizes: string[];
  stockQuantity: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface ShopContextType {
  products: Product[];
  featuredProducts: Product[];
  newArrivals: Product[];
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    size: string,
    color: string
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (
    productId: string,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartLoading: boolean;
  refreshCart: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Sample product data - TODO: Replace with API fetch
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Embroidered Silk Saree",
    description:
      "Exquisite hand-embroidered silk saree with intricate zari work and a rich pallu. Perfect for weddings and special occasions.",
    price: 24999,
    originalPrice: 29999,
    images: [
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
    ],
    category: "Sarees",
    tags: ["silk", "wedding", "embroidered", "premium"],
    colors: ["#800020", "#D4AF37", "#006400"],
    sizes: ["Free Size"],
    stockQuantity: 10,
    isNew: true,
    isFeatured: true,
    discount: 17,
  },
  {
    id: "2",
    name: "Designer Anarkali Suit",
    description:
      "Elegant Anarkali suit with delicate threadwork and a flowy silhouette. Includes matching bottoms and dupatta.",
    price: 15999,
    originalPrice: 18999,
    images: [
      "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
      "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
      "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
    ],
    category: "Salwar Kameez",
    tags: ["anarkali", "party", "designer"],
    colors: ["#800020", "#000080", "#D4AF37"],
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 15,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Bridal Lehenga Choli",
    description:
      "Stunning bridal lehenga with heavy embellishments, mirror work, and a contrasting dupatta. A timeless piece for your special day.",
    price: 49999,
    originalPrice: 59999,
    images: [
      "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
      "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
      "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
    ],
    category: "Lehengas",
    tags: ["bridal", "wedding", "luxury", "embellished"],
    colors: ["#800020", "#D4AF37"],
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 5,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Printed Cotton Kurti",
    description:
      "Comfortable cotton kurti with contemporary print patterns. Perfect for casual and daily wear.",
    price: 1999,
    images: [
      "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574",
      "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574",
      "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574",
    ],
    category: "Kurtis",
    tags: ["cotton", "casual", "daily", "printed"],
    colors: ["#F5F5DC", "#ADD8E6", "#FFC0CB"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 25,
    isNew: true,
  },
  {
    id: "5",
    name: "Banarasi Silk Dupatta",
    description:
      "Traditional Banarasi silk dupatta with rich gold zari work and intricate borders. A versatile addition to your ethnic collection.",
    price: 5999,
    originalPrice: 6999,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574",
    ],
    category: "Dupattas",
    tags: ["banarasi", "silk", "zari"],
    colors: ["#800020", "#D4AF37", "#006400", "#000080"],
    sizes: ["Free Size"],
    stockQuantity: 20,
    discount: 14,
  },
  {
    id: "6",
    name: "Embellished Clutch Bag",
    description:
      "Handcrafted ethnic clutch with mirror work and embroidery. The perfect accessory for festive occasions.",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671",
    ],
    category: "Accessories",
    tags: ["clutch", "embellished", "accessory", "party"],
    colors: ["#000000", "#800020", "#D4AF37"],
    sizes: ["Free Size"],
    stockQuantity: 15,
    isNew: true,
  },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiProducts = await fetchProducts();
        // Convert API products to local Product format
        const convertedProducts: Product[] = apiProducts.map((apiProduct) => ({
          id: apiProduct.id.toString(),
          name: apiProduct.name,
          description: "",
          price: apiProduct.price,
          originalPrice: undefined,
          images: apiProduct.primaryImageUrl
            ? [apiProduct.primaryImageUrl]
            : [
                "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
              ],
          category: "Uncategorized",
          tags: [],
          colors: ["#800020"],
          sizes: ["Free Size"],
          stockQuantity: apiProduct.stock || 0,
          isNew: false,
          isFeatured: false,
          discount: undefined,
        }));
        setProducts(convertedProducts);
        setFeaturedProducts(
          convertedProducts.filter((product) => product.isFeatured)
        );
        setNewArrivals(convertedProducts.filter((product) => product.isNew));
      } catch (error) {
        console.error("Failed to load products:", error);
        // Fallback to sample products
        setProducts(sampleProducts);
        setFeaturedProducts(
          sampleProducts.filter((product) => product.isFeatured)
        );
        setNewArrivals(sampleProducts.filter((product) => product.isNew));
      }
    };
    loadProducts();
  }, []);

  // Helper function to convert API cart items to local cart items
  const convertApiCartToLocal = useCallback(
    (apiCartItems: CartItemResponse[]): CartItem[] => {
      return apiCartItems.map((apiItem) => ({
        product: {
          id: apiItem.product.id.toString(),
          name: apiItem.product.name,
          description: "",
          price: apiItem.product.price,
          images: apiItem.product.primaryImageUrl
            ? [apiItem.product.primaryImageUrl]
            : [
                "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
              ],
          category: "Uncategorized",
          tags: [],
          colors: ["#800020"],
          sizes: ["Free Size"],
          stockQuantity: apiItem.product.stock || 0,
        },
        quantity: apiItem.quantity,
        size: "Free Size", // Default since API doesn't support size/color yet
        color: "Default",
      }));
    },
    []
  );

  // Load cart from API or localStorage
  const refreshCart = useCallback(async () => {
    if (isAuthenticated && user?.id) {
      setIsCartLoading(true);
      try {
        const userId = parseInt(user.id);
        const apiCart = await getCart(userId);
        const localCartItems = convertApiCartToLocal(apiCart.cartItems);
        setCartItems(localCartItems);
      } catch (error) {
        console.error("Failed to load cart from API:", error);
        toast.error("Failed to sync cart");
      } finally {
        setIsCartLoading(false);
      }
    } else {
      // Load from localStorage for non-authenticated users
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch {
          console.error("Error parsing cart from localStorage");
        }
      }
    }
  }, [isAuthenticated, user?.id, convertApiCartToLocal]);

  // Load cart on mount and when auth status changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (
    product: Product,
    quantity: number,
    size: string,
    color: string
  ) => {
    if (isAuthenticated && user?.id) {
      // Use API for authenticated users
      try {
        setIsCartLoading(true);
        const userId = parseInt(user.id);
        const productId = parseInt(product.id);

        // Get current cart to check if item exists
        const currentCart = await getCart(userId);
        const existingItem = currentCart.cartItems.find(
          (item) => item.product.id === productId
        );
        const newQuantity = existingItem
          ? existingItem.quantity + quantity
          : quantity;

        await upsertCartItem(userId, productId, newQuantity);
        await refreshCart();
        toast.success("Item added to cart");
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast.error("Failed to add item to cart");
      } finally {
        setIsCartLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      const existingItemIndex = cartItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);
      } else {
        setCartItems([...cartItems, { product, quantity, size, color }]);
      }

      toast.success("Item added to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && user?.id) {
      // Use API for authenticated users
      try {
        setIsCartLoading(true);
        const userId = parseInt(user.id);
        const productIdNum = parseInt(productId);

        await removeCartItem(userId, productIdNum);
        await refreshCart();
        toast.info("Item removed from cart");
      } catch (error) {
        console.error("Failed to remove from cart:", error);
        toast.error("Failed to remove item from cart");
      } finally {
        setIsCartLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      setCartItems(cartItems.filter((item) => item.product.id !== productId));
      toast.info("Item removed from cart");
    }
  };

  const updateCartItemQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated && user?.id) {
      // Use API for authenticated users
      try {
        setIsCartLoading(true);
        const userId = parseInt(user.id);
        const productIdNum = parseInt(productId);

        await upsertCartItem(userId, productIdNum, quantity);
        await refreshCart();
      } catch (error) {
        console.error("Failed to update cart item:", error);
        toast.error("Failed to update cart");
      } finally {
        setIsCartLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      setCartItems(
        cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user?.id) {
      // Use API for authenticated users
      try {
        setIsCartLoading(true);
        const userId = parseInt(user.id);
        await clearCartAPI(userId);
        setCartItems([]);
        toast.info("Cart cleared");
      } catch (error) {
        console.error("Failed to clear cart:", error);
        toast.error("Failed to clear cart");
      } finally {
        setIsCartLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      setCartItems([]);
      toast.info("Cart cleared");
    }
  };

  // Calculate cart totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        featuredProducts,
        newArrivals,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartLoading,
        refreshCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
