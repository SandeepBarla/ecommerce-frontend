import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getEffectivePrice } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import LoginDialog from "../components/LoginDialog";
import Layout from "../components/layout/Layout";
import { ProductListResponse } from "../types/product/ProductListResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, addFavorite, removeFavorite } = useAuth();
  const [favoriteAnimating, setFavoriteAnimating] = useState<{
    [id: number]: boolean;
  }>({});
  const [favoriteLoading, setFavoriteLoading] = useState<{
    [id: number]: boolean;
  }>({});
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [id: number]: boolean }>({});

  // ✅ Fetch Products
  const fetchProductsData = useCallback(async () => {
    try {
      const productData = await fetchProducts();
      console.log("Fetched products:", productData); // Debug log
      setProducts(productData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  const handleToggleFavorite = async (productId: number) => {
    if (!user || !isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setFavoriteLoading((fl) => ({ ...fl, [productId]: true }));
    setFavoriteAnimating((fa) => ({ ...fa, [productId]: true }));
    setTimeout(
      () => setFavoriteAnimating((fa) => ({ ...fa, [productId]: false })),
      400
    );

    try {
      if (user.favoriteProductIds.includes(productId)) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading((fl) => ({ ...fl, [productId]: false }));
    }
  };

  const handleImageError = (productId: number) => {
    console.log("Image error for product:", productId); // Debug log
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const handleImageLoad = (productId: number) => {
    console.log("Image loaded for product:", productId); // Debug log
    setImageErrors((prev) => ({ ...prev, [productId]: false }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Our Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="col-span-6 sm:col-span-4 md:col-span-3"
              >
                <div className="w-full border rounded-lg bg-white shadow-lg p-0">
                  {/* 🖼 Image Skeleton */}
                  <Skeleton className="aspect-video w-full h-[200px] rounded-t-lg" />
                  {/* 📝 Text Skeletons */}
                  <div className="p-4">
                    <Skeleton className="w-7/10 h-6 mb-2 rounded" />
                    <Skeleton className="w-4/10 h-5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Our Collection
          </h2>
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">All Products</h1>
        <p className="text-center text-muted-foreground mb-8">
          Browse our complete collection
        </p>
        <LoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
        />
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-span-6 sm:col-span-4 md:col-span-3"
            >
              <div className="w-full border rounded-lg overflow-hidden flex flex-col bg-white shadow-lg p-0">
                {/* Product Image (clickable) */}
                <Link
                  to={`/product/${product.id}`}
                  className="w-full aspect-video overflow-hidden bg-gray-100 flex items-center justify-center text-inherit text-decoration-none transition-transform duration-200 hover:scale-104 hover:shadow-md"
                >
                  {imageErrors[product.id] ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                      <span className="text-sm">Image not available</span>
                      <span className="text-xs mt-1">{product.name}</span>
                    </div>
                  ) : (
                    <img
                      src={product.primaryImageUrl || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                      onError={() => handleImageError(product.id)}
                      onLoad={() => handleImageLoad(product.id)}
                      loading="lazy"
                    />
                  )}
                </Link>
                {/* Card Content - Product Details */}
                <div className="p-4 position-relative">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-inherit text-decoration-none"
                  >
                    <h3 className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-800">
                      ₹
                      {getEffectivePrice(
                        product.originalPrice,
                        product.discountedPrice
                      ).toFixed(2)}
                    </span>
                    <div className="flex-1"></div>
                    <button
                      className={`product-fav-btn ${
                        favoriteAnimating[product.id] ? "" : ""
                      }`}
                      onClick={() => handleToggleFavorite(product.id)}
                      disabled={favoriteLoading[product.id]}
                    >
                      {user?.favoriteProductIds.includes(product.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`${
                            favoriteAnimating[product.id] ? "" : ""
                          } transition-colors duration-300`}
                        >
                          <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.4 5.401-5.4 2.88 0 5.304 2.336 5.304 5.4 0 0 6.38 7.425 13.116 7.425 7.425 0 0 0 0-7.425C20.4 3.02 22.92 5.356 22.92 8.478c0 3.064-2.52 5.304-5.397 5.304z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="transition-colors duration-300"
                        >
                          <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.4 5.401-5.4 2.88 0 5.304 2.336 5.304 5.4 0 0 6.38 7.425 13.116 7.425 7.425 0 0 0 0-7.425C20.4 3.02 22.92 5.356 22.92 8.478c0 3.064-2.52 5.304-5.397 5.304z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
