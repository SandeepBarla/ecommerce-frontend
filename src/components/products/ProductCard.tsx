import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/contexts/ShopContext";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user, addFavorite, removeFavorite, isAuthenticated } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isInFavorites =
    user?.favoriteProductIds.includes(parseInt(product.id)) || false;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !isAuthenticated) {
      // Could trigger login dialog here if needed
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isInFavorites) {
        await removeFavorite(parseInt(product.id));
      } else {
        await addFavorite(parseInt(product.id));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="ethnic-card group">
      {/* Product image with badges and wishlist button */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link to={`/product/${product.id}`}>
          {!imgLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-ethnic-purple text-white text-xs py-0 px-1.5">
              New
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-ethnic-gold text-foreground text-xs py-0 px-1.5">
              {product.discount}% Off
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
        <div className="flex items-center mb-2">
          <span className="font-semibold text-sm md:text-base">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-xs md:text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* View Details button - Changed to always be ethnic-purple */}
        <div className="mt-2">
          <Link to={`/product/${product.id}`}>
            <Button className="w-full text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-auto bg-ethnic-purple text-white hover:bg-ethnic-purple/90 transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
