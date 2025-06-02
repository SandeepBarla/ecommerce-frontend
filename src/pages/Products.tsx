import { fetchProducts } from "@/api/products";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [searchParams] = useSearchParams();

  // Get search query from URL parameters for navbar search functionality
  const urlSearchQuery = searchParams.get("search") || "";

  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Filter products based on URL search query (from navbar search)
  const filteredProducts = useMemo(() => {
    if (!urlSearchQuery.trim()) {
      return allProducts;
    }

    const query = urlSearchQuery.toLowerCase().trim();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.categoryName?.toLowerCase().includes(query)
    );
  }, [allProducts, urlSearchQuery]);

  const fetchProductsData = async () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="ethnic-container py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-3">
              Our Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of ethnic wear
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
              <h1 className="text-2xl font-serif mb-3 text-red-600">
                Error Loading Products
              </h1>
              <p className="text-muted-foreground mb-6">
                We're having trouble loading the products. Please try again
                later.
              </p>
              <button
                onClick={fetchProductsData}
                className="bg-ethnic-purple text-white px-6 py-3 rounded-md hover:bg-ethnic-purple/90 transition-colors font-medium"
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
            Our Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of ethnic wear
          </p>
        </div>

        {/* Search Results Info - only show when there's a search query from navbar */}
        {urlSearchQuery.trim() && (
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length > 0
                ? `Found ${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } for "${urlSearchQuery}"`
                : `No products found for "${urlSearchQuery}"`}
            </p>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-serif mb-3 text-muted-foreground">
                No Products Found
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We couldn't find any products to display at the moment. Please
                check back later or contact support if this issue persists.
              </p>
              <button
                onClick={fetchProductsData}
                className="bg-ethnic-purple text-white px-6 py-3 rounded-md hover:bg-ethnic-purple/90 transition-colors font-medium"
              >
                Refresh Products
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-serif mb-3 text-muted-foreground">
                No Results Found
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Try adjusting your search terms or browse all products.
              </p>
              <a
                href="/products"
                className="bg-ethnic-purple text-white px-6 py-3 rounded-md hover:bg-ethnic-purple/90 transition-colors font-medium inline-block"
              >
                View All Products
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
