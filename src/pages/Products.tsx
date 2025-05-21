import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFavorite, fetchFavorites, removeFavorite } from "../api/favorites";
import { fetchProducts } from "../api/products";
import LoginDialog from "../components/LoginDialog";
import { AuthContext } from "../context/AuthContext";
import { ProductListResponse } from "../types/product/ProductListResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const [favorites, setFavorites] = useState<number[]>([]); // productIds
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(!!user);
  const [favoriteAnimating, setFavoriteAnimating] = useState<{
    [id: number]: boolean;
  }>({});
  const [favoriteLoading, setFavoriteLoading] = useState<{
    [id: number]: boolean;
  }>({});
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // ✅ Fetch Products
  const fetchProductsData = useCallback(async () => {
    try {
      const productData = await fetchProducts();
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

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setFavoritesLoading(false);
        return;
      }
      setFavoritesLoading(true);
      try {
        const favs = await fetchFavorites(user.id);
        setFavorites(favs.map((f) => f.productId));
      } catch {
        /* ignore */
      }
      setFavoritesLoading(false);
    };
    fetchUserFavorites();
  }, [user]);

  const handleToggleFavorite = async (productId: number) => {
    if (!user || !token) {
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
      if (favorites.includes(productId)) {
        await removeFavorite(user.id, productId);
        setFavorites((favs) => favs.filter((id) => id !== productId));
      } else {
        await addFavorite(user.id, productId);
        setFavorites((favs) => [...favs, productId]);
      }
    } catch {
      /* ignore */
    }
    setFavoriteLoading((fl) => ({ ...fl, [productId]: false }));
  };

  if (loading || favoritesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold mb-8 text-center">Our Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="col-span-6 sm:col-span-4 md:col-span-3">
              <div className="w-full border rounded-lg bg-white shadow-lg p-0">
                {/* 🖼 Image Skeleton */}
                <div className="skeleton aspect-video w-full h-[200px] rounded-t-lg"></div>
                {/* 📝 Text Skeletons */}
                <div className="p-4">
                  <div className="skeleton w-7/10 h-6 mb-2 rounded"></div>
                  <div className="skeleton w-4/10 h-5 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold mb-8 text-center">Our Collection</h2>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-8 text-center">Our Collection</h2>
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
                to={`/products/${product.id}`}
                className="w-full aspect-video overflow-hidden bg-gray-100 flex items-center justify-center text-inherit text-decoration-none transition-transform duration-200 hover:scale-104 hover:shadow-md"
              >
                <img
                  src={product.primaryImageUrl || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </Link>
              {/* Card Content - Product Details */}
              <div className="p-4 position-relative">
                <Link
                  to={`/products/${product.id}`}
                  className="text-inherit text-decoration-none"
                >
                  <h3 className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-800">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <div className="flex-1"></div>
                  <button
                    className={`product-fav-btn ${
                      favoriteAnimating[product.id] ? "" : ""
                    }`}
                    onClick={() => handleToggleFavorite(product.id)}
                    disabled={favoriteLoading[product.id]}
                  >
                    {favorites.includes(product.id) ? (
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
  );
};

export default Products;
