import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import Layout from "../components/layout/Layout";
import { ProductListResponse } from "../types/product/ProductListResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch Products
  const fetchProductsData = useCallback(async () => {
    try {
      const productData = await fetchProducts();
      console.log("Fetched products:", productData); // Debug log
      setProducts(productData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  if (loading) {
    return (
      <Layout>
        <div className="ethnic-container py-16">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-3">
              All Products
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Loading products...
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
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
        <div className="ethnic-container py-16">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-3">
              All Products
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchProductsData}
              className="bg-ethnic-purple text-white px-6 py-3 rounded-md hover:bg-ethnic-purple/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ethnic-container py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-3">All Products</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection
          </p>
          {products.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </Layout>
  );
};

export default Products;
