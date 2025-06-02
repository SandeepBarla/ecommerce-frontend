import { fetchProducts } from "@/api/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calculateDiscountPercentage,
  formatPrice,
  getCurrentPrice,
  getPrimaryImageUrl,
  isOnSale,
} from "@/lib/productUtils";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ProductSlide {
  product: ProductListResponse;
  gradient: string;
  heading: string;
  subheading: string;
}

const gradients = [
  "from-purple-900/80 via-pink-800/70 to-rose-700/60",
  "from-emerald-900/80 via-teal-800/70 to-cyan-700/60",
  "from-indigo-900/80 via-purple-800/70 to-pink-700/60",
  "from-amber-900/80 via-orange-800/70 to-red-700/60",
  "from-cyan-900/80 via-blue-800/70 to-indigo-700/60",
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [productSlides, setProductSlides] = useState<ProductSlide[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["heroProducts"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter for new arrivals and featured products, limit to 5
      const heroProducts = products
        .filter((product) => product.isNew || product.isFeatured)
        .slice(0, 5);

      // If we don't have enough new/featured products, fill with any products
      if (heroProducts.length < 3) {
        const additionalProducts = products
          .filter((product) => !heroProducts.includes(product))
          .slice(0, 5 - heroProducts.length);
        heroProducts.push(...additionalProducts);
      }

      const slides: ProductSlide[] = heroProducts.map((product, index) => ({
        product,
        gradient: gradients[index % gradients.length],
        heading: product.isNew
          ? "New Arrival"
          : product.isFeatured
          ? "Featured Collection"
          : "Elegant Collection",
        subheading: product.isNew
          ? "Discover our latest designs"
          : product.isFeatured
          ? "Handpicked for special occasions"
          : "Timeless elegance for every celebration",
      }));

      setProductSlides(slides);
    }
  }, [products]);

  useEffect(() => {
    if (productSlides.length > 0) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % productSlides.length);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [currentSlide, productSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: false }));
  };

  // Show loading state or fallback content
  if (isLoading || productSlides.length === 0) {
    return (
      <div className="relative h-[75vh] min-h-[600px] overflow-hidden bg-gradient-to-br from-ethnic-purple via-purple-600 to-pink-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Welcome to Sakhya
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90">
              Discover Ethnic Elegance
            </p>
            <Link to="/products">
              <Button className="bg-ethnic-gold text-black hover:bg-ethnic-gold/90 text-lg px-8 py-6 rounded-full font-medium shadow-2xl hover:shadow-ethnic-gold/25 hover:scale-105 transition-all duration-300 mt-6">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[75vh] min-h-[600px] overflow-hidden bg-gradient-to-br from-ethnic-purple via-purple-600 to-pink-600">
      {/* Slides */}
      <div className="h-full">
        {productSlides.map((slide, index) => {
          const { product, gradient, heading, subheading } = slide;
          const productImage = getPrimaryImageUrl(product);
          const discountPercentage = calculateDiscountPercentage(product);
          const currentPrice = getCurrentPrice(product);
          const showDiscount = isOnSale(product) && discountPercentage;
          const hasRealDiscount =
            product.discountedPrice &&
            product.discountedPrice < product.originalPrice;

          return (
            <div
              key={`${product.id}-${index}`}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                currentSlide === index
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              {/* Mobile Layout */}
              <div className="block lg:hidden h-full">
                {/* Background with gradient overlay */}
                <div className="absolute inset-0">
                  {/* Gradient background as fallback */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                  ></div>

                  {/* Product image background */}
                  <img
                    src={productImage}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded[index] ? "opacity-70" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />

                  {/* Enhanced overlay with pattern */}
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-ethnic-gold/10 rounded-full translate-y-24 -translate-x-24 animate-pulse delay-1000"></div>
                </div>

                {/* Mobile Content */}
                <div className="relative h-full flex items-center px-4">
                  <div className="w-full space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 opacity-0 animate-fade-in-up">
                      {product.isNew && (
                        <Badge className="bg-ethnic-purple text-white text-xs px-2 py-1">
                          New Arrival
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="bg-ethnic-gold text-black text-xs px-2 py-1">
                          Featured
                        </Badge>
                      )}
                      {showDiscount && (
                        <Badge className="bg-red-600 text-white text-xs px-2 py-1">
                          {discountPercentage}% Off
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3 animate-slide-up">
                      <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
                        <span className="block opacity-0 animate-fade-in-up">
                          {heading}
                        </span>
                        <span className="block opacity-0 animate-fade-in-up animation-delay-300 text-ethnic-gold">
                          {product.name}
                        </span>
                      </h1>
                      <p className="text-base md:text-lg text-white/90 leading-relaxed opacity-0 animate-fade-in-up animation-delay-600">
                        {subheading}
                      </p>

                      {/* Price display */}
                      <div className="flex items-center gap-3 opacity-0 animate-fade-in-up animation-delay-700">
                        <span className="text-xl md:text-2xl font-bold text-ethnic-gold">
                          {formatPrice(currentPrice)}
                        </span>
                        {hasRealDiscount && (
                          <span className="text-base text-white/60 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-0 animate-fade-in-up animation-delay-900">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button className="w-full bg-ethnic-gold text-black hover:bg-ethnic-gold/90 text-sm px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-ethnic-gold/25 hover:scale-105 transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                      <Link to="/products" className="flex-1">
                        <Button className="w-full bg-white text-black hover:bg-white/90 text-sm px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-white/25 hover:scale-105 transition-all duration-300">
                          Explore Collection
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block h-full">
                {/* Background with gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                ></div>

                {/* Grid Layout */}
                <div className="relative h-full max-w-7xl mx-auto px-8 grid grid-cols-2 gap-16 items-center">
                  {/* Left Content */}
                  <div className="space-y-6 z-10">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-3 opacity-0 animate-fade-in-up">
                      {product.isNew && (
                        <Badge className="bg-white/90 text-ethnic-purple text-sm px-4 py-2 font-semibold shadow-lg">
                          New Arrival
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="bg-ethnic-gold text-black text-sm px-4 py-2 font-semibold shadow-lg">
                          Featured
                        </Badge>
                      )}
                      {showDiscount && (
                        <Badge className="bg-red-600 text-white text-sm px-4 py-2 font-semibold shadow-lg">
                          {discountPercentage}% Off
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-6 animate-slide-up">
                      <div className="space-y-3">
                        <h2 className="text-white/80 text-lg font-medium tracking-wide opacity-0 animate-fade-in-up">
                          {heading}
                        </h2>
                        <h1 className="font-serif text-5xl xl:text-6xl text-white leading-tight opacity-0 animate-fade-in-up animation-delay-300">
                          {product.name}
                        </h1>
                      </div>

                      <p className="text-xl text-white/90 leading-relaxed max-w-lg opacity-0 animate-fade-in-up animation-delay-600">
                        {subheading}
                      </p>

                      {/* Price display */}
                      <div className="flex items-center gap-4 opacity-0 animate-fade-in-up animation-delay-700">
                        <span className="text-4xl font-bold text-white">
                          {formatPrice(currentPrice)}
                        </span>
                        {hasRealDiscount && (
                          <span className="text-xl text-white/50 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 opacity-0 animate-fade-in-up animation-delay-900">
                      <Link to={`/product/${product.id}`}>
                        <Button className="bg-white text-ethnic-purple hover:bg-white/90 text-lg px-8 py-6 rounded-full font-semibold shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                      <Link to="/products">
                        <Button className="bg-ethnic-gold text-black hover:bg-ethnic-gold/90 text-lg px-8 py-6 rounded-full font-semibold shadow-2xl hover:shadow-ethnic-gold/25 hover:scale-105 transition-all duration-300">
                          Explore Collection
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative flex justify-center items-center">
                    <div className="relative transform rotate-3 hover:rotate-1 transition-transform duration-500">
                      <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                        {/* Gradient fallback */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                        {/* Product image */}
                        <img
                          src={productImage}
                          alt={product.name}
                          className={`w-full h-full object-cover transition-opacity duration-500 ${
                            imageLoaded[index] ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(index)}
                          onError={() => handleImageError(index)}
                          loading="lazy"
                        />

                        {/* Elegant overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>

                        {/* Inner glow border */}
                        <div className="absolute inset-0 rounded-2xl border border-white/30"></div>
                      </div>

                      {/* Outer decorative border */}
                      <div className="absolute -inset-2 rounded-3xl border-2 border-ethnic-gold/30 -z-10"></div>

                      {/* Shadow effect */}
                      <div className="absolute -inset-4 bg-gradient-to-br from-ethnic-gold/20 to-purple-600/20 rounded-3xl blur-xl -z-20"></div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-ethnic-gold/30 rounded-full blur-lg animate-pulse"></div>
                    <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced dots navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {productSlides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`relative w-12 h-1 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-ethnic-gold shadow-lg shadow-ethnic-gold/50"
                : "bg-white/40 hover:bg-white/60"
            }`}
          >
            {currentSlide === index && (
              <div className="absolute inset-0 bg-ethnic-gold rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() =>
          goToSlide(
            currentSlide === 0 ? productSlides.length - 1 : currentSlide - 1
          )
        }
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white group-hover:text-ethnic-gold transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % productSlides.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white group-hover:text-ethnic-gold transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Hero;
