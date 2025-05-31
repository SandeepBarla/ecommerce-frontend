import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useShop } from "@/contexts/ShopContext";
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
    clearCart,
    isCartLoading,
  } = useShop();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));
    try {
      await updateCartItemQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update item quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Failed to clear cart:", error);
        toast.error("Failed to clear cart");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="ethnic-container py-4 md:py-8">
          <div className="text-center py-16">
            <ShoppingBag
              size={64}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some beautiful items to get started
            </p>
            <Link to="/">
              <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
                Start Shopping
              </Button>
            </Link>
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
            <h1 className="text-2xl md:text-3xl font-serif">Shopping Cart</h1>
            <Link
              to="/"
              className="text-sm text-ethnic-purple flex items-center"
            >
              <ChevronLeft size={16} className="mr-1" /> Continue Shopping
            </Link>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const isUpdating = updatingItems.has(item.product.id);
                return (
                  <Card
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="p-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {item.size} • Color: {item.color}
                        </p>
                        <p className="font-medium mt-2">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            disabled={isUpdating || isCartLoading}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            disabled={isUpdating || isCartLoading}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={isUpdating || isCartLoading}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isCartLoading}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{cartTotal >= 1999 ? "Free" : formatPrice(99)}</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>
                      {formatPrice(cartTotal + (cartTotal >= 1999 ? 0 : 99))}
                    </span>
                  </div>

                  <div className="pt-4">
                    <Link to="/checkout">
                      <Button
                        className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                        disabled={isCartLoading}
                      >
                        {isCartLoading ? "Updating..." : "Proceed to Checkout"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
