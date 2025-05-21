
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

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
  wishlistItems: Product[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Embroidered Silk Saree",
    description: "Exquisite hand-embroidered silk saree with intricate zari work and a rich pallu. Perfect for weddings and special occasions.",
    price: 24999,
    originalPrice: 29999,
    images: [
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574"
    ],
    category: "Sarees",
    tags: ["silk", "wedding", "embroidered", "premium"],
    colors: ["#800020", "#D4AF37", "#006400"],
    sizes: ["Free Size"],
    stockQuantity: 10,
    isNew: true,
    isFeatured: true,
    discount: 17
  },
  {
    id: "2",
    name: "Designer Anarkali Suit",
    description: "Elegant Anarkali suit with delicate threadwork and a flowy silhouette. Includes matching bottoms and dupatta.",
    price: 15999,
    originalPrice: 18999,
    images: [
      "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
      "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
      "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574"
    ],
    category: "Salwar Kameez",
    tags: ["anarkali", "party", "designer"],
    colors: ["#800020", "#000080", "#D4AF37"],
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 15,
    isFeatured: true
  },
  {
    id: "3",
    name: "Bridal Lehenga Choli",
    description: "Stunning bridal lehenga with heavy embellishments, mirror work, and a contrasting dupatta. A timeless piece for your special day.",
    price: 49999,
    originalPrice: 59999,
    images: [
      "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
      "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
      "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574"
    ],
    category: "Lehengas",
    tags: ["bridal", "wedding", "luxury", "embellished"],
    colors: ["#800020", "#D4AF37"],
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 5,
    isFeatured: true
  },
  {
    id: "4",
    name: "Printed Cotton Kurti",
    description: "Comfortable cotton kurti with contemporary print patterns. Perfect for casual and daily wear.",
    price: 1999,
    images: [
      "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574",
      "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574",
      "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574"
    ],
    category: "Kurtis",
    tags: ["cotton", "casual", "daily", "printed"],
    colors: ["#F5F5DC", "#ADD8E6", "#FFC0CB"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 25,
    isNew: true
  },
  {
    id: "5",
    name: "Banarasi Silk Dupatta",
    description: "Traditional Banarasi silk dupatta with rich gold zari work and intricate borders. A versatile addition to your ethnic collection.",
    price: 5999,
    originalPrice: 6999,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574"
    ],
    category: "Dupattas",
    tags: ["banarasi", "silk", "zari"],
    colors: ["#800020", "#D4AF37", "#006400", "#000080"],
    sizes: ["Free Size"],
    stockQuantity: 20,
    discount: 14
  },
  {
    id: "6",
    name: "Embellished Clutch Bag",
    description: "Handcrafted ethnic clutch with mirror work and embroidery. The perfect accessory for festive occasions.",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671"
    ],
    category: "Accessories",
    tags: ["clutch", "embellished", "accessory", "party"],
    colors: ["#000000", "#800020", "#D4AF37"],
    sizes: ["Free Size"],
    stockQuantity: 15,
    isNew: true
  }
];

export const ShopProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  
  // Filter products for different sections
  const featuredProducts = products.filter(product => product.isFeatured);
  const newArrivals = products.filter(product => product.isNew);

  useEffect(() => {
    // Load cart and wishlist from localStorage if available
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart from localStorage");
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error parsing wishlist from localStorage");
      }
    }
  }, []);
  
  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.size === size && item.color === color
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      // Add new item
      setCartItems([...cartItems, { product, quantity, size, color }]);
    }
    
    toast.success("Item added to cart");
  };
  
  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };
  
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems([...wishlistItems, product]);
      toast.success("Added to wishlist");
    } else {
      removeFromWishlist(product.id);
    }
  };
  
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    toast.info("Removed from wishlist");
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };
  
  // Calculate cart totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );
  
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  return (
    <ShopContext.Provider
      value={{
        products,
        featuredProducts,
        newArrivals,
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearCart,
        cartTotal,
        cartCount
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
