import { fetchProducts } from "@/api/products";
import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const AdminProducts = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const displayProducts = products.map(mapApiProductToCardProduct);

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32 rounded" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative">
                <Skeleton className="aspect-square w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-3" />
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading products</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Product Management
        </h1>
        <Button
          onClick={() => navigate("/admin/products/new")}
          className="bg-ethnic-purple hover:bg-ethnic-purple/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <ProductTable products={displayProducts} />
    </>
  );
};

export default AdminProducts;
