import { fetchProductById, updateProduct } from "@/api/products";
import ProductForm from "@/components/admin/ProductForm";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductUpsertRequest } from "@/types/product/ProductUpsertRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AdminEditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductUpsertRequest) => updateProduct(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    },
    onError: (error) => {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    },
  });

  const handleSubmit = (data: ProductUpsertRequest) => {
    updateProductMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="ethnic-container py-8">
          <div className="mb-6">
            <Link
              to="/admin/products"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Products
            </Link>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="ethnic-container py-8">
          <div className="mb-6">
            <Link
              to="/admin/products"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Products
            </Link>
          </div>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/admin/products")}>
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ethnic-container py-8">
        <div className="mb-6">
          <Link
            to="/admin/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Update the product information below.
          </p>
        </div>

        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={updateProductMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default AdminEditProduct;
