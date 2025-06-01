import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "12345";

  return (
    <Layout>
      <div className="ethnic-container py-8 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle size={80} className="mx-auto mb-4 text-green-500" />
            <h1 className="text-3xl md:text-4xl font-serif mb-2">
              Order Successful!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">Confirmed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Estimated Delivery:
                </span>
                <span className="font-medium">5-7 business days</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 border rounded-lg">
              <Package className="mx-auto mb-2 text-ethnic-purple" size={32} />
              <h3 className="font-medium mb-1">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your order is being prepared for shipment
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <Truck className="mx-auto mb-2 text-ethnic-purple" size={32} />
              <h3 className="font-medium mb-1">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Your order qualifies for free shipping
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/orders">
              <Button className="w-full md:w-auto bg-ethnic-purple hover:bg-ethnic-purple/90">
                Track Your Order
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="outline"
                className="w-full md:w-auto ml-0 md:ml-4"
              >
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
