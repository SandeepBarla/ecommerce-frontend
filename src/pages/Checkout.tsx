import AddressSelector from "@/components/checkout/AddressSelector";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { ChevronLeft, FileUp } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useShop();
  const { user, isAuthenticated } = useAuth();
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="ethnic-container py-8 text-center">
          <h2 className="text-2xl font-serif mb-4">Login Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please login to proceed with checkout
          </p>
          <Link to="/login?redirect=/checkout">
            <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
              Login to Continue
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="ethnic-container py-8 text-center">
          <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Add items to your cart to proceed with checkout
          </p>
          <Link to="/">
            <Button className="bg-ethnic-purple hover:bg-ethnic-purple/90">
              Browse Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!paymentProof) {
      toast.error("Please upload your payment screenshot");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear cart after successful order
      await clearCart();

      navigate("/order-success");
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="ethnic-container py-4 md:py-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm hover:text-ethnic-purple mb-6"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Cart
        </Link>

        <h1 className="text-2xl md:text-3xl font-serif mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="space-y-6">
              {/* Delivery Address Section */}
              <Card className="p-5">
                <h2 className="text-lg font-medium mb-4">Delivery Address</h2>

                {user?.addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">
                      You haven't added any addresses yet
                    </p>
                    <Link to="/account/addresses">
                      <Button variant="outline">Add New Address</Button>
                    </Link>
                  </div>
                ) : (
                  <AddressSelector
                    addresses={user?.addresses || []}
                    selectedAddressId={selectedAddress}
                    onSelect={setSelectedAddress}
                  />
                )}
              </Card>

              {/* Payment Section */}
              <Card className="p-5">
                <h2 className="text-lg font-medium mb-4">Payment</h2>

                <div className="bg-muted rounded-md p-4 mb-6">
                  <p className="font-medium">UPI Payment Instructions:</p>
                  <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
                    <li>
                      Pay using your UPI app to:{" "}
                      <span className="font-medium">sakhya@ybl</span>
                    </li>
                    <li>
                      Enter the exact amount:{" "}
                      {formatPrice(cartTotal + (cartTotal >= 1999 ? 0 : 99))}
                    </li>
                    <li>Take a screenshot of the successful payment</li>
                    <li>Upload the screenshot below</li>
                  </ol>
                </div>

                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <input
                    type="file"
                    id="payment-proof"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {!paymentProof ? (
                    <label
                      htmlFor="payment-proof"
                      className="cursor-pointer block py-6"
                    >
                      <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium">Upload Payment Screenshot</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click to browse
                      </p>
                    </label>
                  ) : (
                    <div className="py-2">
                      <p className="text-sm mb-2">
                        <span className="font-medium">File uploaded:</span>{" "}
                        {paymentProof.name}
                      </p>
                      <div className="flex justify-center gap-2">
                        <label htmlFor="payment-proof">
                          <Button variant="outline" size="sm">
                            Change File
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div className="col-span-1">
            <Card className="p-5 sticky top-4">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>

              <div className="max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center py-2 text-sm"
                  >
                    <div className="flex items-center">
                      <span>{item.product.name}</span>
                      <span className="text-muted-foreground ml-1">
                        x{item.quantity}
                      </span>
                    </div>
                    <span>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

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
                  <Button
                    className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress || !paymentProof || isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
