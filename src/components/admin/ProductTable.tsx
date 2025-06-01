import { deleteProduct, fetchProducts } from "@/api/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Edit,
  MoreVertical,
  Search,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ProductTable = () => {
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    product: ProductListResponse;
  } | null>(null);
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
      setDeleteConfirm(null);
    },
  });

  const handleDelete = (product: ProductListResponse) => {
    setDeleteConfirm({ id: product.id, product });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteProductMutation.mutate(deleteConfirm.id);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-red-500">
          Failed to load products. Please try again.
        </div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: ProductListResponse }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img
            src={product.primaryImageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-sm leading-tight truncate pr-2">
                {product.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(product)}
                    className="text-red-600 focus:text-red-600"
                    disabled={deleteProductMutation.status === "pending"}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {product.categoryName}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {formatPrice(
                      getEffectivePrice(
                        product.originalPrice,
                        product.discountedPrice
                      )
                    )}
                  </span>
                  {product.discountedPrice &&
                    product.discountedPrice < product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-1 justify-end">
                  {product.isFeatured && (
                    <Badge variant="secondary" className="text-xs h-5">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="outline" className="text-xs h-5">
                      New
                    </Badge>
                  )}
                  {product.discountedPrice &&
                    product.discountedPrice < product.originalPrice && (
                      <Badge variant="destructive" className="text-xs h-5">
                        <Tag className="w-3 h-3 mr-1" />
                        Sale
                      </Badge>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No products found</div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="block lg:hidden space-y-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    {/* Product column */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.primaryImageUrl || "/placeholder.png"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category column */}
                    <TableCell>{product.categoryName}</TableCell>

                    {/* Status column */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.isFeatured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        )}
                        {product.discountedPrice &&
                          product.discountedPrice < product.originalPrice && (
                            <Badge variant="destructive" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              Sale
                            </Badge>
                          )}
                        {!product.isFeatured &&
                          !product.isNew &&
                          (!product.discountedPrice ||
                            product.discountedPrice >=
                              product.originalPrice) && (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              Standard
                            </Badge>
                          )}
                      </div>
                    </TableCell>

                    {/* Price column */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatPrice(
                            getEffectivePrice(
                              product.originalPrice,
                              product.discountedPrice
                            )
                          )}
                        </div>
                        {product.discountedPrice &&
                          product.discountedPrice < product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                      </div>
                    </TableCell>

                    {/* Actions column */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${product.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(product)}
                          disabled={deleteProductMutation.status === "pending"}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Product count */}
      {filteredProducts.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}

      {/* Beautiful Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 h-8 w-8 p-0"
              onClick={() => setDeleteConfirm(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>

              {/* Product Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      deleteConfirm.product.primaryImageUrl ||
                      "/placeholder.png"
                    }
                    alt={deleteConfirm.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 truncate">
                      {deleteConfirm.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {deleteConfirm.product.categoryName}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{deleteConfirm.product.originalPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmDelete}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
