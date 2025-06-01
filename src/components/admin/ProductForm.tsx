import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProductResponse } from "@/types/product/ProductResponse";
import { ProductUpsertRequest } from "@/types/product/ProductUpsertRequest";
import { ChevronLeft, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: ProductResponse;
  onSubmit: (data: ProductUpsertRequest) => void;
  isLoading?: boolean;
}

const ProductForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: ProductFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    originalPrice: initialData?.originalPrice || 0,
    discountedPrice: initialData?.discountedPrice || undefined,
    categoryId: 1, // Default category
    sizeId: 1, // Default size
    isFeatured: initialData?.isFeatured || false,
    newUntil: initialData?.newUntil || null,
    media: initialData?.media || [],
  });

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

    // Prepare payload for API
    const payload: ProductUpsertRequest = {
      name: formData.name || "",
      description: formData.description || "",
      originalPrice: formData.originalPrice || 0,
      discountedPrice: formData.discountedPrice,
      categoryId: formData.categoryId,
      sizeId: formData.sizeId,
      isFeatured: formData.isFeatured,
      newUntil: formData.newUntil || undefined,
      media: formData.media.map((item, idx) => ({
        mediaUrl: typeof item === "string" ? item : item.mediaUrl,
        orderIndex: idx,
        type: "Image",
      })),
    };

    try {
      onSubmit(payload);
    } catch (err) {
      const error = err as Error;
      toast.error(error?.message || "Error saving product");
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
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                <Input
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  value={formData.discountedPrice || ""}
                  onChange={handleNumberChange}
                  placeholder="Optional - leave empty for no discount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <h2 className="text-lg font-medium mb-4">Product Status</h2>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Product
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
