import { createProduct, updateProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/contexts/ShopContext";
import { ProductUpsertRequest } from "@/types/product/ProductUpsertRequest";
import { ChevronLeft, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductFormProps {
  initialProduct: Product | null;
  isNew: boolean;
  productId?: string;
}

const ProductForm = ({
  initialProduct,
  isNew,
  productId,
}: ProductFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>(
    initialProduct || {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      images: [
        "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
      ],
      category: "Lehengas",
      tags: [],
      colors: [],
      sizes: ["Free Size"],
      stockQuantity: 10,
      isNew: false,
      isFeatured: false,
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare payload for API
    const payload: ProductUpsertRequest = {
      name: formData.name || "",
      description: formData.description || "",
      price: formData.price || 0,
      stock: formData.stockQuantity || 0,
      media: (formData.images || []).map((url, idx) => ({
        mediaUrl: url,
        orderIndex: idx,
        type: "Image",
      })),
    };

    try {
      if (isNew) {
        await createProduct(payload);
        toast.success("Product created successfully");
      } else if (productId) {
        await updateProduct(Number(productId), payload);
        toast.success("Product updated successfully");
      }
      navigate("/admin/products");
    } catch (err: any) {
      toast.error(err?.message || "Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/products")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Basic Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <h2 className="text-lg font-medium mb-4">Product Status</h2>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isNew">Mark as New Arrival</Label>
                  <p className="text-sm text-gray-500">
                    This product will be displayed in the New Arrivals section
                  </p>
                </div>
                <Switch
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isNew", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured">Featured Product</Label>
                  <p className="text-sm text-gray-500">
                    This product will be displayed on the homepage
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isFeatured", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/products")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-ethnic-purple hover:bg-ethnic-purple/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isNew ? "Create Product" : "Update Product"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
