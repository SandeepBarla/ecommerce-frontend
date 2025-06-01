import { fetchFavorites } from "@/api/favorites";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { isAuthenticated, user } = useAuth();

  const {
    data: favoriteProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavorites(parseInt(user!.id)),
    enabled: isAuthenticated && !!user?.id,
  });

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="ethnic-container py-4 md:py-8">
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-serif mb-2">Please Log In</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your wishlist
            </p>
            <Link to="/login">
              <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90 mr-4">
                Log In
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ethnic-container py-4 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {user?.favoriteProductIds?.length || 0} items saved
            </p>
          </div>
          <Link
            to="/"
            className="text-ethnic-purple hover:text-ethnic-purple/80"
          >
            Continue Shopping
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="aspect-[3/4] w-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">Failed to load favorites</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : !favoriteProducts || favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-serif mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist
            </p>
            <Link to="/">
              <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {favoriteProducts.map((favorite) => (
              <div key={favorite.productId} className="ethnic-card group">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Link to={`/product/${favorite.productId}`}>
                    <img
                      src={favorite.primaryImageUrl || "/placeholder.png"}
                      alt={favorite.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>

                <div className="p-2 md:p-4">
                  <Link to={`/product/${favorite.productId}`}>
                    <h3 className="font-medium text-sm md:text-lg truncate mb-1 group-hover:text-ethnic-purple transition-colors">
                      {favorite.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-sm md:text-base">
                      ₹{favorite.price.toFixed(0)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <Link to={`/product/${favorite.productId}`}>
                      <Button className="w-full text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-auto bg-ethnic-purple text-white hover:bg-ethnic-purple/90 transition-colors">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
