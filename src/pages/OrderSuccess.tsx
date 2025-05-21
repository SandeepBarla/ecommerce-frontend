
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { cartItems } = useShop();
  
  // Redirect if coming directly to this page without order
  useEffect(() => {
    if (cartItems.length > 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  return (
    <Layout>
      <div className="ethnic-container py-8 md:py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 text-ethnic-purple">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif mb-3">Thank You!</h1>
          <p className="text-lg mb-2">Your order has been received</p>
          <p className="text-muted-foreground mb-6">
            We've sent you an email with your order details. Our team will review your payment and update the status soon.
          </p>
          
          <div className="space-y-3">
            <Link to="/account/orders">
              <Button className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90">
                <ShoppingBag size={18} className="mr-2" /> View My Orders
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
