import { fetchProducts } from "@/api/products";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { isOnSale } from "@/lib/productUtils";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Sparkles, Tag } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

const CollectionPage = () => {
  const { collectionType } = useParams<{ collectionType: string }>();
  const location = useLocation();

  // Determine the page type based on URL
  const pageType = useMemo(() => {
    if (location.pathname === "/new-arrivals") return "new-arrivals";
    if (location.pathname === "/offers") return "offers";
    if (collectionType) return collectionType;
    return "all";
  }, [location.pathname, collectionType]);

  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "collection", pageType],
    queryFn: fetchProducts,
  });

  // Filter products based on page type
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    switch (pageType) {
      case "new-arrivals":
        return allProducts.filter((product) => product.isNew);
      case "offers":
        return allProducts.filter((product) => isOnSale(product));
      case "lehengas":
        return allProducts.filter((product) =>
          product.categoryName?.toLowerCase().includes("lehenga")
        );
      case "sarees":
        return allProducts.filter((product) =>
          product.categoryName?.toLowerCase().includes("saree")
        );
      default:
        // For other categories or "all" case
        return allProducts;
    }
  }, [allProducts, pageType]);

  // Page content configuration
  const pageConfig = useMemo(() => {
    switch (pageType) {
      case "new-arrivals":
        return {
          title: "New Arrivals",
          description: "Discover our latest collection of stunning ethnic wear",
          emptyIcon: (
            <Sparkles className="w-16 h-16 text-ethnic-purple/60 mb-4" />
          ),
          emptyTitle: "No New Arrivals Yet",
          emptyDescription:
            "We're working on bringing you fresh designs. Check back soon for our latest collection!",
          emptyAction: "Browse All Products",
        };
      case "offers":
        return {
          title: "Special Offers",
          description:
            "Amazing deals on beautiful ethnic wear - limited time only!",
          emptyIcon: <Tag className="w-16 h-16 text-ethnic-gold/60 mb-4" />,
          emptyTitle: "No Active Offers",
          emptyDescription:
            "All our products are at regular prices right now. Follow us for updates on upcoming sales!",
          emptyAction: "Browse All Products",
        };
      case "lehengas":
        return {
          title: "Lehengas",
          description:
            "Exquisite lehengas for weddings, festivals, and special occasions",
          emptyIcon: (
            <ShoppingBag className="w-16 h-16 text-ethnic-purple/60 mb-4" />
          ),
          emptyTitle: "No Lehengas Available",
          emptyDescription:
            "We're currently updating our lehenga collection. Check back soon!",
          emptyAction: "Browse All Products",
        };
      case "sarees":
        return {
          title: "Sarees",
          description:
            "Elegant sarees crafted with traditional artistry and modern elegance",
          emptyIcon: (
            <ShoppingBag className="w-16 h-16 text-ethnic-purple/60 mb-4" />
          ),
          emptyTitle: "No Sarees Available",
          emptyDescription:
            "We're currently building our saree collection. Exciting designs coming soon!",
          emptyAction: "Browse All Products",
        };
      default:
        return {
          title: collectionType
            ? collectionType.charAt(0).toUpperCase() +
              collectionType.slice(1).replace("-", " ")
            : "All Products",
          description: collectionType
            ? `Browse our ${collectionType} collection`
            : "Browse our complete collection of ethnic wear",
          emptyIcon: (
            <ShoppingBag className="w-16 h-16 text-muted-foreground/60 mb-4" />
          ),
          emptyTitle: "No Products Found",
          emptyDescription: "We couldn't find any products in this category.",
          emptyAction: "Browse All Products",
        };
    }
  }, [pageType, collectionType]);

  if (isLoading) {
    return (
      <Layout>
        <div className="ethnic-container py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-3">
              {pageConfig.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pageConfig.description}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="ethnic-container py-8 md:py-12">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <ShoppingBag className="w-16 h-16 text-red-500/60 mx-auto mb-4" />
                <h1 className="text-2xl font-serif mb-2 text-red-600">
                  Error Loading Products
                </h1>
                <p className="text-muted-foreground">
                  We're having trouble loading the products. Please try again
                  later.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-ethnic-purple text-white px-6 py-2 rounded-md hover:bg-ethnic-purple/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ethnic-container py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-3">
            {pageConfig.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {pageConfig.description}
          </p>
          {filteredProducts.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center">{pageConfig.emptyIcon}</div>
              <h2 className="text-2xl font-serif mb-3 text-muted-foreground">
                {pageConfig.emptyTitle}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {pageConfig.emptyDescription}
              </p>
              <a
                href="/products"
                className="inline-flex items-center bg-ethnic-purple text-white px-6 py-3 rounded-md hover:bg-ethnic-purple/90 transition-colors font-medium"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {pageConfig.emptyAction}
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CollectionPage;
