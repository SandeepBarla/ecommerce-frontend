import { fetchProductById } from "@/api/products";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { ProductResponse } from "@/types/product/ProductResponse";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function mapApiProductToFormProduct(apiProduct: ProductResponse | undefined) {
  if (!apiProduct) return null;
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: undefined,
    images: apiProduct.media.map((m) => m.mediaUrl),
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

const AdminProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const isNewProduct = productId === undefined;

  const {
    data: apiProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(Number(productId)),
    enabled: !!productId,
  });

  const product = mapApiProductToFormProduct(apiProduct);

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  if (!isNewProduct && isLoading) return <div>Loading...</div>;
  if (!isNewProduct && (error || !product)) {
    toast.error("Product not found");
    navigate("/admin/products");
    return null;
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {isNewProduct ? "Add New Product" : "Edit Product"}
        </h1>
      </div>

      <ProductForm
        initialProduct={product}
        isNew={isNewProduct}
        productId={productId}
      />
    </AdminLayout>
  );
};

export default AdminProductEdit;
