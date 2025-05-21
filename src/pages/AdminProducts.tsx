import { fetchProducts } from "@/api/products";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default AdminProducts;
