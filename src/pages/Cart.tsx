
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useShop } from "@/contexts/ShopContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, MoveRight, ShoppingCart, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal, clearCart } = useShop();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  return (
    <Layout>
      <div className="ethnic-container py-4 md:py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-serif">Your Cart</h1>
            <Link to="/" className="text-sm text-ethnic-purple flex items-center">
              Continue Shopping <MoveRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <Separator className="my-4" />
          
          {cartItems.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-6 text-muted-foreground">
                <ShoppingCart className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="mt-1 text-muted-foreground">Looks like you haven't added anything to your cart yet</p>
              <div className="mt-6">
                <Link to="/">
                  <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-1 lg:col-span-2">
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <Card key={item.product.id} className="p-4 flex flex-col sm:flex-row gap-4 relative">
                      <div className="w-full sm:w-1/4 aspect-square">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link to={`/product/${item.product.id}`} className="hover:text-ethnic-purple transition-colors">
                            <h3 className="font-medium text-lg">{item.product.name}</h3>
                          </Link>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <p className="text-muted-foreground mt-1">Size: Free Size</p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button 
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                            <button 
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="col-span-1">
                <Card className="p-5 sticky top-4">
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  
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
                      <span>{formatPrice(cartTotal + (cartTotal >= 1999 ? 0 : 99))}</span>
                    </div>
                    
                    <div className="pt-4">
                      <Link to="/checkout">
                        <Button className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90">
                          Proceed to Checkout
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
