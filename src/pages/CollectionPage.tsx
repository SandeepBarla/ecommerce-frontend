import { fetchProducts } from "@/api/products";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { useQuery } from "@tanstack/react-query";

function mapApiProductToCardProduct(apiProduct: ProductListResponse) {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    description: "",
    price: apiProduct.price,
    originalPrice: undefined,
    images: [apiProduct.primaryImageUrl],
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

const CollectionPage = () => {
  // const { collectionType } = useParams<{ collectionType: string }>();
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const displayProducts = products.map(mapApiProductToCardProduct);
  const pageTitle = "All Products";
  const pageDescription = "Browse our complete collection";

  if (isLoading)
    return (
      <Layout>
        <div className="ethnic-container py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-3">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pageDescription}
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
  if (error) return <div>Error loading products</div>;

  return (
    <Layout>
      <div className="ethnic-container py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-3">{pageTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {displayProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No products found in this collection.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CollectionPage;
