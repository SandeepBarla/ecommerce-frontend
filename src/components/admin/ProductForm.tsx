import { fetchCategories } from "@/api/categories";
import { fetchSizes } from "@/api/sizes";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ProductResponse } from "@/types/product/ProductResponse";
import {
  ProductMediaRequestBackend,
  ProductUpsertRequest,
} from "@/types/product/ProductUpsertRequest";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image,
  Loader2,
  Save,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: ProductResponse;
  onSubmit: (data: ProductUpsertRequest) => void;
  isLoading?: boolean;
}

interface MediaItem {
  mediaUrl: string;
  orderIndex: number;
  type: "Image" | "Video";
}

const ProductForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: ProductFormProps) => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    originalPrice: initialData?.originalPrice || undefined,
    discountedPrice: initialData?.discountedPrice || undefined,
    categoryId: initialData?.categoryId || 1,
    sizeId: initialData?.sizeId || 1,
    isFeatured: initialData?.isFeatured || false,
    newUntil: initialData?.newUntil || undefined,
  });

  const [media, setMedia] = useState<MediaItem[]>(initialData?.media || []);
  const [newUntilDate, setNewUntilDate] = useState<Date | undefined>(
    initialData?.newUntil ? new Date(initialData.newUntil) : undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMedia, setPreviewMedia] = useState<{
    item: MediaItem;
    index: number;
  } | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    index: number;
    item: MediaItem;
  } | null>(null);
  const [isNewUntilEnabled, setIsNewUntilEnabled] = useState(
    initialData?.newUntil ? true : false
  );

  // Fetch categories and sizes
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: sizes = [], isLoading: sizesLoading } = useQuery({
    queryKey: ["sizes"],
    queryFn: fetchSizes,
  });

  // Update newUntil when date changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      newUntil:
        isNewUntilEnabled && newUntilDate
          ? newUntilDate.toISOString()
          : undefined,
    }));
  }, [newUntilDate, isNewUntilEnabled]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for discountedPrice and originalPrice - allow empty/undefined
    if (name === "discountedPrice" || name === "originalPrice") {
      const numValue = value.trim() === "" ? undefined : parseFloat(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const numValue = parseInt(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMediaUpload = (url: string, type: "Image" | "Video") => {
    const newMedia: MediaItem = {
      mediaUrl: url,
      orderIndex: media.length + 1,
      type: type,
    };
    setMedia((prev) => [...prev, newMedia]);
    toast.success(`${type} uploaded successfully!`);
  };

  const handleMediaUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
  };

  const handleMediaDelete = (index: number) => {
    setMedia((prev) => {
      const newMedia = prev.filter((_, i) => i !== index);
      // Reorder the remaining items
      return newMedia.map((item, i) => ({ ...item, orderIndex: i + 1 }));
    });
    toast.success("Media deleted successfully");
  };

  const confirmDelete = (index: number) => {
    handleMediaDelete(index);
    setDeleteConfirm(null);
  };

  const handleMediaReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || isReordering) return;

    setIsReordering(true);
    setMedia((prev) => {
      const newMedia = [...prev];
      const [removed] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, removed);
      // Update order indices
      const reorderedMedia = newMedia.map((item, i) => ({
        ...item,
        orderIndex: i + 1,
      }));
      console.log(
        `Reordered: moved item from ${fromIndex} to ${toIndex}`,
        reorderedMedia
      );
      return reorderedMedia;
    });

    // Reset reordering state after a short delay
    setTimeout(() => setIsReordering(false), 300);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.originalPrice || formData.originalPrice <= 0) {
      newErrors.originalPrice = "Original price must be greater than 0";
    }

    if (formData.discountedPrice) {
      if (formData.discountedPrice <= 0) {
        newErrors.discountedPrice =
          "Discounted price must be greater than 0 if provided";
      } else if (
        formData.originalPrice &&
        formData.discountedPrice > formData.originalPrice
      ) {
        newErrors.discountedPrice =
          "Discounted price cannot be higher than original price";
      }
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!formData.sizeId) {
      newErrors.sizeId = "Please select a size";
    }

    if (media.length === 0) {
      newErrors.media = "At least one product image or video is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Convert string MediaType to numeric enum values for backend
    const convertedMedia: ProductMediaRequestBackend[] = media.map((item) => ({
      mediaUrl: item.mediaUrl,
      orderIndex: item.orderIndex,
      type: item.type === "Image" ? 0 : 1, // Convert to numeric enum: Image = 0, Video = 1
    }));

    // Set discounted price to original price if not provided, or cap at original price if higher
    let finalDiscountedPrice = formData.discountedPrice;
    if (!formData.discountedPrice) {
      finalDiscountedPrice = formData.originalPrice; // Set to original price when empty
    } else if (formData.discountedPrice > (formData.originalPrice || 0)) {
      finalDiscountedPrice = formData.originalPrice; // Cap at original price
    }

    const payload: ProductUpsertRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      originalPrice: formData.originalPrice || 0, // Ensure we send a number to the API
      discountedPrice: finalDiscountedPrice,
      categoryId: formData.categoryId!,
      sizeId: formData.sizeId!,
      isFeatured: formData.isFeatured,
      newUntil: formData.newUntil,
      media: convertedMedia,
    };

    try {
      onSubmit(payload);
    } catch (err) {
      const error = err as Error;
      toast.error(error?.message || "Error saving product");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-ethnic-purple hover:bg-ethnic-purple/90 order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={errors.description ? "border-red-500" : ""}
                    placeholder="Enter detailed product description"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">
                      Original Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.originalPrice || ""}
                      onChange={handleNumberChange}
                      className={errors.originalPrice ? "border-red-500" : ""}
                      placeholder="Enter original price"
                    />
                    {errors.originalPrice && (
                      <p className="text-sm text-red-500">
                        {errors.originalPrice}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">
                      Discounted Price (₹)
                    </Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountedPrice || ""}
                      onChange={handleNumberChange}
                      className={errors.discountedPrice ? "border-red-500" : ""}
                      placeholder="Leave empty to use original price, or enter lower/equal price"
                    />
                    {errors.discountedPrice && (
                      <p className="text-sm text-red-500">
                        {errors.discountedPrice}
                      </p>
                    )}
                    {!errors.discountedPrice && (
                      <p className="text-xs text-gray-500">
                        💡 <strong>Tip:</strong> Leave empty to use original
                        price as final price. Enter a lower price for discounts,
                        or the same price to show consistent pricing. Cannot be
                        higher than original price.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.categoryId?.toString()}
                      onValueChange={(value) =>
                        handleSelectChange("categoryId", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.categoryId ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-sm text-red-500">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">
                      Size <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.sizeId?.toString()}
                      onValueChange={(value) =>
                        handleSelectChange("sizeId", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.sizeId ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizesLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          sizes
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((size) => (
                              <SelectItem
                                key={size.id}
                                value={size.id.toString()}
                              >
                                {size.name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.sizeId && (
                      <p className="text-sm text-red-500">{errors.sizeId}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Product Media
                  <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div className="space-y-4">
                  <CloudinaryUpload
                    onUploadSuccess={handleMediaUpload}
                    onUploadError={handleMediaUploadError}
                    disabled={isLoading}
                    maxFileSize={10}
                    acceptedFormats="image/*,video/*"
                    folder="product-images"
                    supportedTypes={["Image", "Video"]}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-ethnic-purple/50 transition-colors"
                  />
                  {errors.media && (
                    <p className="text-sm text-red-500">{errors.media}</p>
                  )}
                </div>

                {/* Media Grid */}
                {media.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {media.map((item, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:border-ethnic-purple/30 transition-all duration-200"
                        >
                          {/* Media Content - Clickable for preview */}
                          {item.type === "Image" ? (
                            <img
                              src={item.mediaUrl}
                              alt={`Product ${item.type.toLowerCase()} ${
                                index + 1
                              }`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                              onClick={() => setPreviewMedia({ item, index })}
                            />
                          ) : (
                            <div
                              className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer"
                              onClick={() => setPreviewMedia({ item, index })}
                            >
                              <video
                                src={item.mediaUrl}
                                className="w-full h-full object-cover"
                                preload="metadata"
                                muted
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                  <Video className="h-6 w-6 text-gray-700" />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Preview Icon - Shows on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                              <Eye className="h-6 w-6 text-gray-700" />
                            </div>
                          </div>

                          {/* Control Buttons - Positioned absolutely */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 shadow-lg"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteConfirm({ index, item });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {index > 0 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isReordering}
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg disabled:opacity-50"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleMediaReorder(index, index - 1);
                                  toast.success("Media moved left");
                                }}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                            )}
                            {index < media.length - 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isReordering}
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg disabled:opacity-50"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleMediaReorder(index, index + 1);
                                  toast.success("Media moved right");
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Media Type Badge */}
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 pointer-events-none">
                            {item.type === "Video" && (
                              <Video className="h-3 w-3" />
                            )}
                            {index === 0 ? "Primary" : `#${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-blue-900">
                            Media Management Tips
                          </p>
                          <ul className="mt-1 space-y-1 text-blue-700">
                            <li>• Click any media to preview in full size</li>
                            <li>
                              • The first item will be the primary display image
                            </li>
                            <li>• Use arrow buttons to reorder media items</li>
                            <li>
                              • Upload both images and videos to showcase your
                              product
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 rounded-full p-2">
                          <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Delete Media
                          </h3>
                          <p className="text-sm text-gray-500">
                            This action cannot be undone
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                          {deleteConfirm.item.type === "Image" ? (
                            <img
                              src={deleteConfirm.item.mediaUrl}
                              alt="Delete preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={deleteConfirm.item.mediaUrl}
                              className="w-full h-full object-cover"
                              muted
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Are you sure you want to delete this{" "}
                          {deleteConfirm.item.type.toLowerCase()}? This will
                          permanently remove it from your product.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => confirmDelete(deleteConfirm.index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Preview Modal */}
                {previewMedia && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                      {/* Close Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -top-12 right-0 bg-white/90 hover:bg-white z-10"
                        onClick={() => setPreviewMedia(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Close
                      </Button>

                      {/* Media Content */}
                      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                        {previewMedia.item.type === "Image" ? (
                          <img
                            src={previewMedia.item.mediaUrl}
                            alt={`Product image ${previewMedia.index + 1}`}
                            className="w-full h-auto max-h-[80vh] object-contain"
                          />
                        ) : (
                          <video
                            src={previewMedia.item.mediaUrl}
                            controls
                            className="w-full h-auto max-h-[80vh] object-contain"
                            autoPlay
                            muted
                            loop
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}

                        {/* Media Info */}
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {previewMedia.item.type === "Video" ? (
                                <Video className="h-5 w-5 text-gray-600" />
                              ) : (
                                <Image className="h-5 w-5 text-gray-600" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {previewMedia.item.type}{" "}
                                  {previewMedia.index + 1}
                                  {previewMedia.index === 0 && " (Primary)"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {previewMedia.item.type === "Video"
                                    ? "Product video"
                                    : "Product image"}
                                </p>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  confirmDelete(previewMedia.index);
                                  setPreviewMedia(null);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation */}
                      {media.length > 1 && (
                        <>
                          {previewMedia.index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                              onClick={() =>
                                setPreviewMedia({
                                  item: media[previewMedia.index - 1],
                                  index: previewMedia.index - 1,
                                })
                              }
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          )}
                          {previewMedia.index < media.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                              onClick={() =>
                                setPreviewMedia({
                                  item: media[previewMedia.index + 1],
                                  index: previewMedia.index + 1,
                                })
                              }
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isFeatured">Featured Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Display on homepage
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

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="newUntilEnabled">Mark as "New"</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable to mark product as new until a specific date
                      </p>
                    </div>
                    <Switch
                      id="newUntilEnabled"
                      checked={isNewUntilEnabled}
                      onCheckedChange={(checked) => {
                        setIsNewUntilEnabled(checked);
                        if (!checked) {
                          setNewUntilDate(undefined);
                        }
                      }}
                    />
                  </div>

                  {isNewUntilEnabled && (
                    <div className="space-y-3">
                      <Label>New Until Date</Label>
                      <p className="text-sm text-muted-foreground">
                        Product will be marked as "New" until this date
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newUntilDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newUntilDate ? (
                              format(newUntilDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newUntilDate}
                            onSelect={setNewUntilDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                          {newUntilDate && (
                            <div className="p-3 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNewUntilDate(undefined)}
                                className="w-full"
                              >
                                Clear Date
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - Mobile/Tablet Only */}
            <Card className="xl:hidden">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Touch-friendly controls for mobile
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Product
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
