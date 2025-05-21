import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, removeFavorite } from "../../api/favorites";
import { AuthContext } from "../../context/AuthContext";
import { FavoriteResponse } from "../../types/favorites/FavoriteResponse";

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserFavorites = async () => {
      try {
        const data = await fetchFavorites(user.id);
        setFavorites(data);
      } catch {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserFavorites();
  }, [user]);

  const handleUnmarkFavorite = async (productId: number) => {
    if (!user) return;
    setRemovingId(productId);
    setTimeout(async () => {
      try {
        await removeFavorite(user.id, productId);
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.productId !== productId)
        );
      } catch (error) {
        console.error("Error removing favorite:", error);
      } finally {
        setRemovingId(null);
      }
    }, 350); // Animation duration
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">My Favorites ❤️</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="col-span-2 sm:col-span-4 md:col-span-3">
              <div className="w-full border rounded-lg bg-white shadow-md p-0">
                {/* Image Skeleton */}
                <div className="skeleton aspect-video w-full h-auto rounded-t-lg"></div>
                {/* Text Skeletons */}
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

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">My Favorites ❤️</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Favorites ❤️</h1>
      {favorites.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          <h2 className="text-2xl font-bold">Oops! No favorites yet. 😢</h2>
          <p className="text-base mt-2">
            Start exploring and add your favorite products! 🎉
          </p>
          <div className="mt-4">
            <Link to="/products" className="text-blue-500 hover:underline">
              <h3 className="text-base">Browse Products →</h3>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.productId}
              className="col-span-2 sm:col-span-4 md:col-span-3"
            >
              <Link
                to={`/products/${fav.productId}`}
                className="text-inherit no-underline transition-transform duration-200 hover:scale-104 hover:shadow-md"
              >
                <div
                  className={`w-full border rounded-lg overflow-hidden flex flex-col bg-white shadow-md p-0 transition-opacity duration-350 ${
                    removingId === fav.productId ? "opacity-50" : ""
                  }`}
                >
                  {/* Product Image */}
                  <div className="w-full aspect-video overflow-hidden bg-gray-100 flex items-center justify-center relative">
                    <img
                      src={fav.primaryImageUrl || "/placeholder.png"}
                      alt={fav.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    {/* Unmark Favorite Button */}
                    <button
                      className={`absolute top-2 right-2 bg-white bg-opacity-90 shadow-sm shadow-red-200 border border-red-200 rounded-full z-10 ${
                        removingId === fav.productId ? "bg-red-100" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnmarkFavorite(fav.productId);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 ${
                          removingId === fav.productId
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5H8.688c-2.59 0-4.688 2.015-4.688 4.5v8.5c0 2.485 2.099 4.5 4.688 4.5h8.688c2.59 0 4.688-2.015 4.688-4.5v-8.5z"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Card Content - Product Details */}
                  <div className="p-4">
                    <h2 className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                      {fav.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-800">
                        ₹{fav.price.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
