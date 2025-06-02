import { fetchProducts } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};

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
  const windowSize = useWindowSize();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Get items per view based on screen size - Enhanced responsive breakpoints
  const getItemsPerView = useCallback(() => {
    if (windowSize.width >= 1024) return 4; // Desktop: 4 items
    if (windowSize.width >= 640) return 3; // Tablet: 3 items
    return 2; // Mobile: 2 items
  }, [windowSize.width]);

  // Calculate card width based on container and gap - Enhanced for 3-column layout
  const getCardWidth = useCallback(() => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const gap = 24; // 6 * 4px (gap-6)
      const itemsPerView = getItemsPerView();
      return (containerWidth + gap) / itemsPerView;
    }
    // Enhanced fallback calculations
    if (windowSize.width >= 1024) return 280; // Desktop
    if (windowSize.width >= 640) return 220; // Tablet
    return 150; // Mobile
  }, [getItemsPerView, windowSize.width]);

  // Get responsive card width for CSS - Enhanced responsive calculations
  const getCardWidthStyle = useCallback(() => {
    const itemsPerView = getItemsPerView();
    let gapOffset;

    if (windowSize.width >= 1024) {
      gapOffset = 18; // Desktop gap adjustment
    } else if (windowSize.width >= 640) {
      gapOffset = 16; // Tablet gap adjustment
    } else {
      gapOffset = 12; // Mobile gap adjustment
    }

    return `calc(${100 / itemsPerView}% - ${gapOffset}px)`;
  }, [getItemsPerView, windowSize.width]);

  // Auto-scroll function
  const autoScroll = useCallback(() => {
    if (
      !scrollContainerRef.current ||
      displayProducts.length <= getItemsPerView()
    ) {
      return;
    }

    const cardWidth = getCardWidth();
    const maxIndex = displayProducts.length - getItemsPerView();

    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex >= maxIndex ? 0 : prevIndex + 1;

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: newIndex * cardWidth,
          behavior: "smooth",
        });
      }

      return newIndex;
    });
  }, [displayProducts.length, getItemsPerView, getCardWidth]);

  // Start auto-scroll
  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    if (displayProducts.length > getItemsPerView()) {
      autoScrollIntervalRef.current = setInterval(autoScroll, 3000); // Auto-scroll every 3 seconds
    }
  }, [autoScroll, displayProducts.length, getItemsPerView]);

  // Stop auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  // Manual scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = getCardWidth();
      const newIndex = Math.max(0, currentIndex - 1);
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = getCardWidth();
      const maxIndex = displayProducts.length - getItemsPerView();
      const newIndex = Math.min(maxIndex, currentIndex + 1);
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: "smooth",
      });
    }
  };

  // Handle mouse enter/leave for auto-scroll pause
  const handleMouseEnter = () => {
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    startAutoScroll();
  };

  // Initialize auto-scroll
  useEffect(() => {
    if (displayProducts.length > 0) {
      startAutoScroll();
    }

    return () => {
      stopAutoScroll();
    };
  }, [displayProducts.length, startAutoScroll, stopAutoScroll]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
      stopAutoScroll();
      setTimeout(startAutoScroll, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScrollPosition, startAutoScroll, stopAutoScroll]);

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

          {/* Enhanced Responsive Grid layout for skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: getItemsPerView() }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
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

  const showNavigation = displayProducts.length > getItemsPerView();

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

        {/* Unified Layout: Auto-scrolling Carousel */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows - Enhanced responsive visibility */}
          {showNavigation && (
            <>
              {/* Desktop Navigation - Show on larger screens */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 border transition-all duration-300 ${
                  canScrollLeft
                    ? "text-ethnic-purple border-ethnic-purple/20 hover:bg-ethnic-purple hover:text-white hover:border-ethnic-purple opacity-0 hover:opacity-100 group-hover:opacity-100"
                    : "opacity-0 cursor-not-allowed"
                }`}
                style={{ transform: "translateX(-50%) translateY(-50%)" }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 border transition-all duration-300 ${
                  canScrollRight
                    ? "text-ethnic-purple border-ethnic-purple/20 hover:bg-ethnic-purple hover:text-white hover:border-ethnic-purple opacity-0 hover:opacity-100 group-hover:opacity-100"
                    : "opacity-0 cursor-not-allowed"
                }`}
                style={{ transform: "translateX(50%) translateY(-50%)" }}
              >
                <ChevronRight size={18} />
              </button>

              {/* Mobile & Tablet Navigation - Show on smaller screens */}
              <div className="lg:hidden absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md transition-all duration-200 ${
                    canScrollLeft
                      ? "text-ethnic-purple hover:bg-ethnic-purple hover:text-white"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md transition-all duration-200 ${
                    canScrollRight
                      ? "text-ethnic-purple hover:bg-ethnic-purple hover:text-white"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* Scrollable Product Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-hidden product-carousel-scroll pb-4 group"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{
                  width: getCardWidthStyle(),
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Minimal Progress Dots */}
          {showNavigation && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1.5">
                {Array.from({
                  length: Math.ceil(displayProducts.length / getItemsPerView()),
                }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === Math.floor(currentIndex / getItemsPerView())
                        ? "bg-ethnic-purple scale-125"
                        : "bg-ethnic-purple/20 hover:bg-ethnic-purple/40"
                    }`}
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
