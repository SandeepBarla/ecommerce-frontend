import { createProduct, fetchProductById, updateProduct } from "@/api/products";
import ProductForm from "@/components/admin/ProductForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ProductUpsertRequest } from "@/types/product/ProductUpsertRequest";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AdminProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const isEditing = !!productId; // Determine if we're editing or creating

  const {
    data: apiProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(Number(productId)),
    enabled: isEditing, // Only fetch if we're editing
  });

  const handleSubmit = async (data: ProductUpsertRequest) => {
    try {
      if (isEditing) {
        // Update existing product
        await updateProduct(Number(productId), data);
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        await createProduct(data);
        toast.success("Product created successfully!");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} product:`,
        error
      );
      toast.error(`Failed to ${isEditing ? "update" : "create"} product`);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  // Show loading only when editing and fetching data
  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-20 w-full rounded" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative">
                    <Skeleton className="aspect-square w-full rounded" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded" />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-32 rounded" />
        </div>
      </div>
    );
  }

  // Handle error only when editing
  if (isEditing && (error || !apiProduct)) {
    toast.error("Product not found");
    navigate("/admin/products");
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <ProductForm
        initialData={isEditing ? apiProduct : undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AdminProductEdit;
