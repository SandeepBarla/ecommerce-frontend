import { fetchProducts } from "@/api/products";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
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
  limit = 4,
  skipProducts = 0,
}: FeaturedProductsProps) => {
  const {
    data: allProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const displayProducts =
    allProducts
      ?.filter((product) => {
        if (filterFeatured && !product.isFeatured) return false;
        if (filterNew && !product.isNew) return false;
        return true;
      })
      ?.slice(skipProducts, skipProducts + limit) || [];

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
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
              className="text-ethnic-purple hover:text-ethnic-purple/80 transition-colors mt-2 inline-block"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>
    );
  }

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
