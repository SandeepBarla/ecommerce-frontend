import { fetchProductById, fetchProducts } from "@/api/products";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/ui/ShareButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import {
  calculateDiscountPercentage,
  formatPrice,
  getCurrentPrice,
  getProductImages,
  isNewProduct,
  isOnSale,
} from "@/lib/productUtils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Heart, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useCart();
  const { user, addFavorite, removeFavorite } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(Number(productId)),
    enabled: !!productId,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const isInFavorites =
    user?.favoriteProductIds.includes(Number(productId)) || false;

  // Check if product is already in cart
  const isInCart = cartItems.some(
    (item) => item.product.id === Number(productId)
  );

  // ✅ Use utility functions for consistent data processing
  const productImages = product ? getProductImages(product) : [];
  const productMedia = product ? product.media || [] : [];
  const currentPrice = product ? getCurrentPrice(product) : 0;
  const discountPercentage = product
    ? calculateDiscountPercentage(product)
    : undefined;
  const showNewBadge = product ? isNewProduct(product) : false;
  const showDiscountBadge = product
    ? isOnSale(product) && discountPercentage
    : false;

  // Video controls
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const progress = (video.currentTime / video.duration) * 100;
      // Update progress bar
      const progressBar = document.getElementById(`progress-${selectedImage}`);
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;

    if (videoRef.current) {
      const newTime = clickRatio * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

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

  if (error || !product) {
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      // Convert ProductResponse to ProductListResponse format for cart
      const productForCart = {
        id: product.id,
        name: product.name,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        discountPercentage: discountPercentage || 0,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        categoryName: product.categoryName,
        sizeName: product.sizeName,
        primaryImageUrl: productImages[0] || "/placeholder.png",
      };

      addToCart(productForCart, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleWishlistToggle = async () => {
    if (!user || !isAuthenticated) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInFavorites) {
        await removeFavorite(Number(productId));
      } else {
        await addFavorite(Number(productId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
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
            {product.categoryName}
          </Link>
          <ChevronRight
            size={14}
            className="mx-1 text-muted-foreground flex-shrink-0"
          />
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        {/* Product details - mobile optimized layout */}
        <div className="flex flex-col xl:grid xl:grid-cols-2 xl:gap-16">
          {/* Product media */}
          <div className="mb-8 xl:mb-0">
            {/* Main media display */}
            <div className="relative group">
              {/* Uniform container for both images and videos */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg h-[500px] md:h-[600px] flex items-center justify-center">
                {productMedia[selectedImage]?.type === "Video" ? (
                  /* Custom Instagram-style video player */
                  <div className="relative instagram-video w-full h-full flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={productMedia[selectedImage]?.mediaUrl}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      className="max-w-full max-h-full object-contain rounded-2xl cursor-pointer"
                      onTimeUpdate={handleVideoTimeUpdate}
                      onClick={handleVideoClick}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* Minimal Instagram-style controls */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      {/* Sound toggle */}
                      <button
                        onClick={toggleMute}
                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>
                    </div>

                    {/* Play/Pause indicator (appears briefly on tap) */}
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      onClick={togglePlayPause}
                    >
                      <div
                        className={`bg-black/30 rounded-full p-4 transition-opacity duration-200 ${
                          isPlaying ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[15px] border-y-transparent ml-1"></div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full video-progress"
                          style={{ width: "0%" }}
                          id={`progress-${selectedImage}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={
                      productMedia[selectedImage]?.mediaUrl ||
                      productImages[selectedImage] ||
                      "/placeholder.png"
                    }
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded-2xl"
                  />
                )}

                {/* Image counter - positioned consistently for both images and videos */}
                {productMedia[selectedImage]?.type !== "Video" && (
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">
                      {selectedImage + 1} / {productMedia.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation arrows for main media */}
              {productMedia.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        selectedImage > 0
                          ? selectedImage - 1
                          : productMedia.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight
                      size={20}
                      className="rotate-180 text-gray-700"
                    />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        selectedImage < productMedia.length - 1
                          ? selectedImage + 1
                          : 0
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Elegant thumbnail gallery with uniform sizing */}
            {productMedia.length > 1 && (
              <div className="mt-6">
                <div className="flex space-x-3 overflow-x-auto pb-2 elegant-scrollbar">
                  {productMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 media-thumbnail ${
                        selectedImage === index
                          ? "border-ethnic-purple ring-2 ring-ethnic-purple/20 scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {media.type === "Video" ? (
                        <>
                          {/* Video thumbnail with uniform sizing */}
                          <video
                            src={media.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          {/* Video indicator */}
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                              <div className="w-0 h-0 border-l-[6px] border-l-gray-700 border-y-[4px] border-y-transparent ml-0.5"></div>
                            </div>
                          </div>
                          {/* Video label */}
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            Video
                          </div>
                        </>
                      ) : (
                        <img
                          src={media.mediaUrl}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex space-x-2 mb-2">
              {showNewBadge && (
                <Badge className="bg-ethnic-purple text-white">New</Badge>
              )}
              {showDiscountBadge && (
                <Badge className="bg-ethnic-gold text-foreground">
                  {discountPercentage}% Off
                </Badge>
              )}
              {product.isFeatured && <Badge variant="outline">Featured</Badge>}
            </div>

            {/* Product title */}
            <h1 className="font-serif text-2xl md:text-3xl mb-2">
              {product.name}
            </h1>

            {/* Category and Rating */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-muted-foreground">
                {product.categoryName} • {product.sizeName}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl md:text-3xl font-bold text-ethnic-purple">
                {formatPrice(currentPrice)}
              </span>
              {product.discountedPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                size="lg"
              >
                {isInCart ? "Already in Cart" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                variant="outline"
                size="lg"
                className={`w-full border-ethnic-purple ${
                  isInFavorites
                    ? "bg-ethnic-purple/10 text-ethnic-purple"
                    : "text-ethnic-purple hover:bg-ethnic-purple/10"
                }`}
              >
                <Heart
                  size={18}
                  className={`mr-2 ${
                    isInFavorites ? "fill-ethnic-purple" : ""
                  }`}
                />
                {wishlistLoading
                  ? "Updating..."
                  : isInFavorites
                  ? "In Wishlist"
                  : "Add to Wishlist"}
              </Button>
            </div>
            {/* Share button */}
            <ShareButton
              url={window.location.href}
              title={product.name}
              description={`${formatPrice(
                currentPrice
              )} - ${product.description?.slice(0, 100)}...`}
              className="mt-4"
            />
          </div>
        </div>
        {/* Similar products */}
        <div className="mt-10 md:mt-16">
          <RelatedProducts currentProductId={productId} />
        </div>
      </div>
    </Layout>
  );
};

// ✅ Simplified RelatedProducts component
const RelatedProducts = ({
  currentProductId,
}: {
  currentProductId: string | undefined;
}) => {
  const {
    data: allProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["relatedProducts"],
    queryFn: fetchProducts,
  });

  // Filter out current product and get up to 4 products
  const relatedProducts =
    allProducts
      ?.filter((product) => product.id.toString() !== currentProductId)
      ?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-3">
                You May Also Like
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore more products from our collection
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center mt-4 md:mt-0 text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
            >
              View All Products <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3 rounded-lg" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || relatedProducts.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-3">
                You May Also Like
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore more products from our collection
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center mt-4 md:mt-0 text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
            >
              View All Products <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No related products found</p>
            <Link
              to="/products"
              className="text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-3">
              You May Also Like
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore more products from our collection
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center mt-4 md:mt-0 text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
          >
            View All Products <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>

        {/* Product grid - responsive layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
