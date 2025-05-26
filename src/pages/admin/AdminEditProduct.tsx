import { fetchProductById } from "@/api/products";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/contexts/ShopContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminEditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [initialProduct, setInitialProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const apiProduct = await fetchProductById(Number(id));
        setInitialProduct({
          id: String(apiProduct.id),
          name: apiProduct.name,
          description: apiProduct.description || "",
          price: apiProduct.price,
          originalPrice: undefined,
          images:
            apiProduct.media && apiProduct.media.length > 0
              ? [apiProduct.media[0].mediaUrl]
              : [],
          category: "",
          tags: [],
          colors: [],
          sizes: [],
          stockQuantity: apiProduct.stock,
          isNew: false,
          isFeatured: false,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!initialProduct) return <div>Product not found.</div>;

  return (
    <ProductForm isNew={false} initialProduct={initialProduct} productId={id} />
  );
};

export default AdminEditProduct;
