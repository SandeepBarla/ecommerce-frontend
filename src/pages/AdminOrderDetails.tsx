import { getAllOrders, updateOrderStatus } from "@/api/orders";
import { fetchProductById } from "@/api/products";
import { getAllUsers } from "@/api/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, MapPin, Package, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// Order type
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  id: number;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  items: OrderItem[];
  address: string;
  trackingNumber: string;
  userId: number;
}

const AdminOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all orders and find the specific one
        const [orders, users] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
        ]);

        const foundOrder = orders.find((o) => o.id === parseInt(orderId));
        if (!foundOrder) {
          setError("Order not found");
          return;
        }

        const user = users.find((u) => u.id === foundOrder.userId);
        if (!user) {
          setError("User not found for this order");
          return;
        }

        // Fetch product details for each order item
        const orderItems: OrderItem[] = [];
        for (const orderProduct of foundOrder.orderProducts) {
          try {
            const product = await fetchProductById(orderProduct.productId);
            orderItems.push({
              productId: product.id,
              productName: product.name,
              productImage:
                product.media?.[0]?.mediaUrl || "/placeholder-product.jpg",
              price: product.price,
              quantity: orderProduct.quantity,
            });
          } catch (err) {
            console.error(
              `Failed to fetch product ${orderProduct.productId}:`,
              err
            );
            // Add a fallback item if product fetch fails
            orderItems.push({
              productId: orderProduct.productId,
              productName: "Product Not Found",
              productImage: "/placeholder-product.jpg",
              price: 0,
              quantity: orderProduct.quantity,
            });
          }
        }

        const orderDetails: OrderDetails = {
          id: foundOrder.id,
          customer: user.fullName,
          email: user.email,
          total: foundOrder.totalAmount,
          status: foundOrder.orderStatus.toLowerCase() as OrderStatus,
          date: foundOrder.orderDate,
          paymentMethod: foundOrder.paymentStatus || "UPI", // Default to UPI if not specified
          items: orderItems,
          address: foundOrder.shippingAddress,
          trackingNumber: foundOrder.trackingNumber,
          userId: foundOrder.userId,
        };

        setOrder(orderDetails);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      await updateOrderStatus(order.userId, order.id, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600 border-green-300";
      case "processing":
        return "bg-blue-100 text-blue-600 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-600 border-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-600 border-red-300";
      default: // pending
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error || "Order not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Order Details: {order.id}
          </h1>
        </div>

        <div>
          <Select
            value={order.status}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
          >
            <SelectTrigger
              className={`w-[140px] ${getStatusStyles(order.status)}`}
            >
              <SelectValue placeholder={order.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending" className="text-yellow-600">
                Pending
              </SelectItem>
              <SelectItem value="processing" className="text-blue-600">
                Processing
              </SelectItem>
              <SelectItem value="shipped" className="text-purple-600">
                Shipped
              </SelectItem>
              <SelectItem value="delivered" className="text-green-600">
                Delivered
              </SelectItem>
              <SelectItem value="cancelled" className="text-red-600">
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Ordered on {new Date(order.date).toLocaleDateString()} • Order #
              {order.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="font-medium">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div>Payment Method</div>
            <div className="font-medium">{order.paymentMethod}</div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Customer Information
                </CardTitle>
                <User className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customer}</p>
                <p className="text-sm text-gray-500">{order.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Shipping Address</CardTitle>
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>{order.customer}</p>
                <p className="whitespace-pre-line">{order.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Order Summary</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.trackingNumber && order.trackingNumber !== "Not Assigned" && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Tracking Information
                  </CardTitle>
                  <Package className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">Tracking Number:</p>
                  <p className="text-gray-600">{order.trackingNumber}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
