
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useShop } from "@/contexts/ShopContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MoveRight, X } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Separator } from "@/components/ui/separator";

const Wishlist = () => {
  const { wishlistItems, addToCart, removeFromWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState<string>("Free Size");

  return (
    <Layout>
      <div className="ethnic-container py-4 md:py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-serif">Your Wishlist</h1>
            <Link to="/" className="text-sm text-ethnic-purple flex items-center">
              Continue Shopping <MoveRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <Separator className="my-4" />
          
          {wishlistItems.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-6 text-muted-foreground">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Your wishlist is empty</h3>
              <p className="mt-1 text-muted-foreground">Items added to your wishlist will appear here</p>
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
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative ethnic-card">
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <X size={16} />
                  </button>
                  
                  <div className="p-4">
                    <ProductCard product={product} />
                    <Button 
                      onClick={() => addToCart(product, 1, selectedSize, "Default")}
                      className="w-full mt-2 bg-ethnic-purple hover:bg-ethnic-purple/90"
                    >
                      <ShoppingCart size={16} className="mr-1" /> Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
