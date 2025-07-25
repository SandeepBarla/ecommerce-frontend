import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import {
  calculateDiscountPercentage,
  getPrimaryImageUrl,
  isNewProduct,
  isOnSale,
} from "@/lib/productUtils";
import { formatPriceWithDiscount } from "@/lib/utils";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LoginDialog from "../LoginDialog";

interface ProductCardProps {
  product: ProductListResponse;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user, addFavorite, removeFavorite, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const isInFavorites = user?.favoriteProductIds.includes(product.id) || false;
  const primaryImageUrl = getPrimaryImageUrl(product);
  const showNewBadge = isNewProduct(product);
  const discountPercentage = calculateDiscountPercentage(product);
  const showDiscountBadge = isOnSale(product) && discountPercentage;
  const { formattedPrice, hasDiscount, formattedOriginalPrice } =
    formatPriceWithDiscount(product.originalPrice, product.discountedPrice);

  // Check if product is in cart and get quantity
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  const isInCart = quantityInCart > 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isInFavorites) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product.id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <>
      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
      <div className="ethnic-card group">
        {/* Product image with badges and wishlist button */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <Link to={`/product/${product.id}`}>
            {!imgLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={primaryImageUrl}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {showNewBadge && (
              <Badge className="bg-ethnic-purple text-white text-xs py-0 px-1.5">
                New
              </Badge>
            )}
            {showDiscountBadge && (
              <Badge className="bg-ethnic-gold text-foreground text-xs py-0 px-1.5">
                {discountPercentage}% Off
              </Badge>
            )}
            {isInCart && (
              <Badge className="bg-green-600 text-white text-xs py-0 px-1.5 flex items-center gap-1">
                <ShoppingCart size={10} />
                {quantityInCart}
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            disabled={favoriteLoading}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors disabled:opacity-50"
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              className={
                isInFavorites ? "fill-red-500 text-red-500" : "text-gray-600"
              }
            />
          </button>
        </div>

        {/* Product info - Updated for mobile view */}
        <div className="p-2 md:p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-sm md:text-lg truncate mb-1 group-hover:text-ethnic-purple transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm md:text-base">
              {formattedPrice}
            </span>
            {hasDiscount && formattedOriginalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Enhanced View Details button with cart state */}
          <div className="mt-2">
            <Link to={`/product/${product.id}`}>
              <Button
                className={`w-full text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-auto transition-all duration-200 ${
                  isInCart
                    ? "bg-green-600 text-white hover:bg-green-700 border-green-600"
                    : "bg-ethnic-purple text-white hover:bg-ethnic-purple/90"
                }`}
              >
                {isInCart ? (
                  <div className="flex items-center justify-center gap-1">
                    <ShoppingCart size={14} />
                    <span>In Cart ({quantityInCart})</span>
                  </div>
                ) : (
                  "View Details"
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
