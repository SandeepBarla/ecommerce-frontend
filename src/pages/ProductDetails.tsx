import { fetchProductById } from "@/api/products";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useShop } from "@/contexts/ShopContext";
import { ProductResponse } from "@/types/product/ProductResponse";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Heart, Share2, Star } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function mapApiProductToCardProduct(apiProduct: ProductResponse | undefined) {
  if (!apiProduct) return undefined;
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: undefined,
    images: apiProduct.media.map((m) => m.mediaUrl),
    category: "",
    tags: [],
    colors: [],
    sizes: [],
    stockQuantity: apiProduct.stock,
    isNew: false,
    isFeatured: false,
    discount: undefined,
  };
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist } = useShop();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(Number(productId)),
    enabled: !!productId,
  });

  const uiProduct = mapApiProductToCardProduct(product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity] = useState(1);

  if (isLoading) {
    return (
      <Layout>
        <div className="py-4 px-4 md:py-8 md:px-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8">
            {/* Product images skeleton */}
            <div className="mb-6 md:mb-0">
              <Skeleton className="w-full aspect-square md:h-[500px] mb-4" />
              <div className="flex space-x-2 mt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded-md" />
                ))}
              </div>
            </div>
            {/* Product info skeleton */}
            <div className="flex flex-col">
              <div className="flex space-x-2 mb-2">
                <Skeleton className="w-16 h-6" />
                <Skeleton className="w-20 h-6" />
              </div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-5 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-6 w-1/2 mt-4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  if (error || !uiProduct) {
    return (
      <Layout>
        <div className="py-20 text-center px-4">
          <h2 className="font-serif text-2xl mb-4">Product Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn't find the product you were looking for.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      uiProduct,
      quantity,
      "Free Size",
      uiProduct.colors[0] || "Default"
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      <div className="py-4 px-4 md:py-8 md:px-6 max-w-5xl mx-auto">
        {/* Breadcrumbs - simplified for mobile */}
        <nav className="flex mb-4 text-xs md:text-sm overflow-x-auto whitespace-nowrap pb-2">
          <Link
            to="/"
            className="text-muted-foreground hover:text-ethnic-purple transition-colors"
          >
            Home
          </Link>
          <ChevronRight
            size={14}
            className="mx-1 text-muted-foreground flex-shrink-0"
          />
          <Link
            to="/category/lehengas"
            className="text-muted-foreground hover:text-ethnic-purple transition-colors"
          >
            Lehengas
          </Link>
          <ChevronRight
            size={14}
            className="mx-1 text-muted-foreground flex-shrink-0"
          />
          <span className="text-foreground truncate">{uiProduct.name}</span>
        </nav>
        {/* Product details - mobile optimized layout */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8">
          {/* Product images */}
          <div className="mb-6 md:mb-0">
            {/* Main image */}
            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <img
                src={uiProduct.images[selectedImage]}
                alt={uiProduct.name}
                className="w-full aspect-square md:h-[500px] object-cover object-center"
              />
            </div>
            {/* Thumbnail gallery - horizontally scrollable on mobile */}
            {uiProduct.images.length > 1 && (
              <div className="flex space-x-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                {uiProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border flex-shrink-0 ${
                      selectedImage === index
                        ? "border-ethnic-purple"
                        : "border-border hover:border-ethnic-purple/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${uiProduct.name} view ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Product info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex space-x-2 mb-2">
              {uiProduct.isNew && (
                <Badge className="bg-ethnic-purple text-white">New</Badge>
              )}
              {uiProduct.discount && (
                <Badge className="bg-ethnic-gold text-foreground">
                  {uiProduct.discount}% Off
                </Badge>
              )}
            </div>
            {/* Title and price */}
            <h1 className="font-serif text-xl md:text-3xl mb-2">
              {uiProduct.name}
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-xl md:text-2xl font-semibold">
                {formatPrice(uiProduct.price)}
              </span>
              {uiProduct.originalPrice && (
                <span className="ml-2 text-sm md:text-lg text-muted-foreground line-through">
                  {formatPrice(uiProduct.originalPrice)}
                </span>
              )}
            </div>
            {/* Rating placeholder */}
            <div className="flex items-center mb-4">
              <div className="flex text-ethnic-gold mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-ethnic-gold" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                (Customer Reviews)
              </span>
            </div>
            {/* Description */}
            <p className="text-sm text-muted-foreground mb-6">
              {uiProduct.description}
            </p>
            {/* Action buttons - stacked on mobile, side by side on desktop */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                onClick={() => addToWishlist(uiProduct)}
                variant="outline"
                size="lg"
                className={`w-full border-ethnic-purple ${
                  isInWishlist(uiProduct.id)
                    ? "bg-ethnic-purple/10 text-ethnic-purple"
                    : "text-ethnic-purple hover:bg-ethnic-purple/10"
                }`}
              >
                <Heart
                  size={18}
                  className={`mr-2 ${
                    isInWishlist(uiProduct.id) ? "fill-ethnic-purple" : ""
                  }`}
                />
                {isInWishlist(uiProduct.id) ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            {/* Share button */}
            <button className="flex items-center mt-4 text-muted-foreground hover:text-ethnic-purple transition-colors text-sm">
              <Share2 size={16} className="mr-1.5" />
              Share this product
            </button>
          </div>
        </div>
        {/* Similar products */}
        <div className="mt-10 md:mt-16">
          <FeaturedProducts
            title="You May Also Like"
            subtitle="Explore more lehengas from our collection"
            limit={4}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
