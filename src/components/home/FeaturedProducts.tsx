import { fetchProducts } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  filterFeatured?: boolean;
  filterNew?: boolean;
  limit?: number;
  skipProducts?: number;
}

const FeaturedProducts = ({
  title = "Featured Collection",
  subtitle = "Discover our most popular styles and designs",
  viewAllLink = "/products",
  viewAllText = "View All Products",
  filterFeatured = true,
  filterNew = false,
  limit = 8,
  skipProducts = 0,
}: FeaturedProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const {
    data: allProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "featured", filterFeatured, filterNew],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const { displayProducts, totalFiltered } = useMemo(() => {
    if (!allProducts) return { displayProducts: [], totalFiltered: 0 };

    const filtered = allProducts.filter((product) => {
      if (filterFeatured && !product.isFeatured) {
        return false;
      }

      if (filterNew && !product.isNew) {
        return false;
      }

      return true;
    });

    const result = filtered.slice(skipProducts, skipProducts + limit);

    return { displayProducts: result, totalFiltered: filtered.length };
  }, [allProducts, filterFeatured, filterNew, skipProducts, limit]);

  // Check scroll position and update navigation state
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Approximate card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2, // Scroll by 2 cards
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Approximate card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2, // Scroll by 2 cards
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="ethnic-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl mb-3">{title}</h2>
              <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
            </div>
            <Link
              to={viewAllLink}
              className="inline-flex items-center mt-4 md:mt-0 text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
            >
              {viewAllText} <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          {/* Mobile: Grid layout */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>

          {/* Desktop: Horizontal scroll layout */}
          <div className="hidden md:block">
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-64">
                  <Skeleton className="aspect-[3/4] w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="ethnic-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl mb-3">{title}</h2>
              <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
            </div>
          </div>
          <div className="text-red-500 text-center">
            Failed to load products. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <section className="py-16">
        <div className="ethnic-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl mb-3">{title}</h2>
              <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
            </div>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <p>No products found matching the criteria.</p>
            <Link
              to={viewAllLink}
              className="text-ethnic-purple hover:text-ethnic-purple/80 transition-colors underline"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const showNavigation = displayProducts.length > 4;

  return (
    <section className="py-16">
      <div className="ethnic-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl mb-3">{title}</h2>
            <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
            {totalFiltered > displayProducts.length && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing {displayProducts.length} of {totalFiltered} products
              </p>
            )}
          </div>
          <Link
            to={viewAllLink}
            className="inline-flex items-center mt-4 md:mt-0 text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
          >
            {viewAllText} <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        {/* Mobile Layout: 2x2 Grid + Horizontal Scroll for Additional Products */}
        <div className="md:hidden">
          {/* First 4 products in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {displayProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Additional products in horizontal scroll */}
          {displayProducts.length > 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">More {title}</h3>
                <span className="text-sm text-muted-foreground">
                  Swipe to see more
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto mobile-product-scroll elegant-scrollbar pb-3">
                {displayProducts.slice(4).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout: Horizontal Scroll with Navigation */}
        <div className="hidden md:block relative">
          {/* Navigation Arrows */}
          {showNavigation && (
            <>
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 shadow-xl rounded-full p-3 border-2 carousel-nav-button ${
                  canScrollLeft
                    ? "text-ethnic-purple border-ethnic-purple/20 hover:bg-ethnic-purple hover:text-white hover:border-ethnic-purple"
                    : "text-gray-300 border-gray-200 cursor-not-allowed"
                }`}
                style={{ transform: "translateX(-50%) translateY(-50%)" }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 shadow-xl rounded-full p-3 border-2 carousel-nav-button ${
                  canScrollRight
                    ? "text-ethnic-purple border-ethnic-purple/20 hover:bg-ethnic-purple hover:text-white hover:border-ethnic-purple"
                    : "text-gray-300 border-gray-200 cursor-not-allowed"
                }`}
                style={{ transform: "translateX(50%) translateY(-50%)" }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Scrollable Product Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-x-auto product-carousel-scroll pb-4"
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          {showNavigation && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {Array.from({
                  length: Math.ceil(displayProducts.length / 4),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-ethnic-purple/30 transition-colors duration-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
