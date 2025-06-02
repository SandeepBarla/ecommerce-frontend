import { placeOrder } from "@/api/orders";
import AddressSelector from "@/components/checkout/AddressSelector";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { OrderCreateRequest } from "@/types/order/OrderRequest";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Copy,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>("");
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

  const totalAmount = cartTotal + (cartTotal >= 1999 ? 0 : 99);
  const upiId = "sakhya@ybl";

  const handlePaymentProofUpload = (url: string) => {
    setPaymentProofUrl(url);
    toast.success("Payment proof uploaded successfully!");
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("UPI ID copied to clipboard!");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!paymentProofUrl) {
      toast.error("Please upload your payment screenshot");
      return;
    }

    if (!user) {
      toast.error("User authentication required");
      return;
    }

    setIsProcessing(true);

    try {
      // Find the selected address object
      const address = user.addresses.find(
        (addr) => addr.id === selectedAddress
      );
      if (!address) {
        throw new Error("Selected address not found");
      }

      // Prepare order data
      const orderData: OrderCreateRequest = {
        orderProducts: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        totalAmount,
        addressId: parseInt(address.id), // Send address ID instead of string
        paymentProofUrl, // Cloudinary URL
      };

      // Place order via API
      const response = await placeOrder(parseInt(user.id), orderData);

      console.log("Order placed successfully:", response);

      // Clear cart after successful order
      await clearCart();

      navigate("/order-success", {
        state: {
          orderId: response.id,
          orderNumber: response.id,
        },
      });
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(
        error instanceof Error
          ? `Failed to place order: ${error.message}`
          : "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="ethnic-container py-8">
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-serif mt-2">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <Card className="p-6">
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
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </h2>

              {/* UPI Payment Instructions */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      UPI Payment Instructions
                    </h3>
                    <p className="text-sm text-blue-700">
                      Follow these steps to complete your payment
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Pay to UPI ID:
                      </p>
                      <p className="text-lg font-bold text-blue-600">{upiId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUpiId}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Amount to Pay:
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(totalAmount)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Open UPI App</p>
                        <p className="text-gray-600">
                          Use any UPI app like GPay, PhonePe, Paytm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Send Money</p>
                        <p className="text-gray-600">
                          Enter the exact amount and UPI ID
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Take Screenshot</p>
                        <p className="text-gray-600">
                          Capture the success screen
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Upload Payment Proof</h3>
                  {paymentProofUrl && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Important:</p>
                      <p className="text-yellow-700">
                        Please upload a clear screenshot of your successful UPI
                        payment. Our team will review and approve your payment
                        within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <CloudinaryUpload
                  onUploadSuccess={handlePaymentProofUpload}
                  onUploadError={handleUploadError}
                  disabled={isProcessing}
                  maxFileSize={10}
                  folder="payment-proofs"
                  supportedTypes={["Image"]}
                  acceptedFormats="image/*"
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={
                          item.product.primaryImageUrl ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(
                        getEffectivePrice(
                          item.product.originalPrice,
                          item.product.discountedPrice
                        ) * item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{cartTotal >= 1999 ? "Free" : formatPrice(99)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || !paymentProofUrl || isProcessing}
                className="w-full mt-6 bg-ethnic-purple hover:bg-ethnic-purple/90"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                By placing this order, you agree to our terms and conditions.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
