import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { MoveRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites } from "../api/favorites";
import { FavoriteResponse } from "../types/favorites/FavoriteResponse";

const Wishlist = () => {
  const { user, removeFavorite } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserFavorites = async () => {
      try {
        const data = await fetchFavorites(parseInt(user.id));
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserFavorites();
  }, [user]);

  // Re-fetch when favorites list changes in AuthContext
  useEffect(() => {
    if (user && user.favoriteProductIds.length !== favorites.length) {
      const fetchUserFavorites = async () => {
        try {
          const data = await fetchFavorites(parseInt(user.id));
          setFavorites(data);
        } catch (error) {
          console.error("Error refetching favorites:", error);
        }
      };
      fetchUserFavorites();
    }
  }, [user?.favoriteProductIds, favorites.length, user]);

  const handleRemoveFromWishlist = async (productId: number) => {
    if (!user) return;

    setRemovingId(productId);
    try {
      await removeFavorite(productId);
      // Remove from local state immediately
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="ethnic-container py-4 md:py-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-serif">Your Wishlist</h1>
              <Link
                to="/"
                className="text-sm text-ethnic-purple flex items-center"
              >
                Continue Shopping <MoveRight size={16} className="ml-1" />
              </Link>
            </div>
            <Separator className="my-4" />

            {/* Loading skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="relative ethnic-card animate-pulse">
                  <div className="p-4">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="ethnic-container py-4 md:py-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-serif">Your Wishlist</h1>
              <Link
                to="/"
                className="text-sm text-ethnic-purple flex items-center"
              >
                Continue Shopping <MoveRight size={16} className="ml-1" />
              </Link>
            </div>
            <Separator className="my-4" />
            <div className="py-12 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="ethnic-container py-4 md:py-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-serif">Your Wishlist</h1>
              <Link
                to="/"
                className="text-sm text-ethnic-purple flex items-center"
              >
                Continue Shopping <MoveRight size={16} className="ml-1" />
              </Link>
            </div>
            <Separator className="my-4" />
            <div className="py-12 text-center">
              <div className="mb-6 text-muted-foreground">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">
                Please log in to view your wishlist
              </h3>
              <p className="mt-1 text-muted-foreground">
                Sign in to access your favorite products
              </p>
              <div className="mt-6">
                <Link to="/login">
                  <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ethnic-container py-4 md:py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-serif">Your Wishlist</h1>
            <Link
              to="/"
              className="text-sm text-ethnic-purple flex items-center"
            >
              Continue Shopping <MoveRight size={16} className="ml-1" />
            </Link>
          </div>

          <Separator className="my-4" />

          {favorites.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-6 text-muted-foreground">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Your wishlist is empty</h3>
              <p className="mt-1 text-muted-foreground">
                Items added to your wishlist will appear here
              </p>
              <div className="mt-6">
                <Link to="/">
                  <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
                    Discover Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => {
                const isRemoving = removingId === product.productId;
                return (
                  <div
                    key={product.productId}
                    className={`relative ethnic-card transition-opacity duration-350 ${
                      isRemoving ? "opacity-50" : ""
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(product.productId)
                      }
                      className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full shadow-sm hover:bg-white"
                      aria-label="Remove from wishlist"
                      disabled={isRemoving}
                    >
                      <X size={16} />
                    </button>

                    <div className="p-4">
                      <Link
                        to={`/product/${product.productId}`}
                        className="block"
                      >
                        <div className="aspect-square overflow-hidden rounded-lg mb-4">
                          <img
                            src={product.primaryImageUrl || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium text-lg leading-tight mb-2">
                          {product.name}
                        </h3>
                        <p className="text-xl font-bold text-ethnic-purple">
                          ₹{product.price.toFixed(2)}
                        </p>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
