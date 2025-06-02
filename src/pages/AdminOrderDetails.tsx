import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/api/orders";
import { fetchProductById } from "@/api/products";
import { getAllUsers } from "@/api/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { getEffectivePrice } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// Types
interface OrderProduct {
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

interface ProcessedOrder {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentRemarks?: string;
  paymentProofUrl?: string;
  trackingNumber?: string;
  addressId?: number;
  orderProducts: OrderProduct[];
  customer?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  address?: {
    id: number;
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
  };
}

const orderStatusOptions = [
  {
    value: "Pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "Processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "Delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const paymentStatusOptions = [
  {
    value: "Pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "Approved",
    label: "Approved",
    color: "bg-green-100 text-green-800",
  },
  { value: "Rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

const AdminOrderDetails = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<ProcessedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<"order" | "payment" | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState("");

  // New state for pending changes
  const [pendingOrderStatus, setPendingOrderStatus] = useState("");
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState("");
  const [hasOrderStatusChanges, setHasOrderStatusChanges] = useState(false);
  const [hasPaymentStatusChanges, setHasPaymentStatusChanges] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login?redirect=/admin/orders");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setLoading(true);
      try {
        const [orders, users] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
        ]);

        const orderData = orders.find((o) => o.id === parseInt(orderId));
        if (!orderData) {
          setError("Order not found");
          return;
        }

        // Process order products with full details
        const processedProducts: OrderProduct[] = [];
        for (const orderProduct of orderData.orderProducts) {
          try {
            const product = await fetchProductById(orderProduct.productId);
            processedProducts.push({
              ...orderProduct,
              name: product.name,
              price: getEffectivePrice(
                product.originalPrice,
                product.discountedPrice
              ),
              image: product.media?.[0]?.mediaUrl || "/placeholder-product.jpg",
            });
          } catch (err) {
            console.error(
              `Failed to fetch product ${orderProduct.productId}:`,
              err
            );
            processedProducts.push({
              ...orderProduct,
              name: "Product Not Found",
              price: 0,
              image: "/placeholder-product.jpg",
            });
          }
        }

        const processedOrder: ProcessedOrder = {
          ...orderData,
          orderProducts: processedProducts,
          customer:
            orderData.customer || users.find((u) => u.id === orderData.userId),
        };

        setOrder(processedOrder);
        setPendingOrderStatus(processedOrder.orderStatus);
        setPendingPaymentStatus(processedOrder.paymentStatus);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleOrderStatusChange = (newStatus: string) => {
    setPendingOrderStatus(newStatus);
    setHasOrderStatusChanges(newStatus !== order?.orderStatus);
  };

  const handlePaymentStatusChange = (newStatus: string) => {
    setPendingPaymentStatus(newStatus);
    setHasPaymentStatusChanges(newStatus !== order?.paymentStatus);
  };

  const saveOrderStatus = async () => {
    if (!order || !hasOrderStatusChanges) return;

    setUpdating("order");
    try {
      await updateOrderStatus(order.userId, order.id, {
        status: pendingOrderStatus,
      });
      setOrder((prev) =>
        prev ? { ...prev, orderStatus: pendingOrderStatus } : null
      );
      setHasOrderStatusChanges(false);
      toast.success(`Order status updated to ${pendingOrderStatus}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const savePaymentStatus = async (remarks?: string) => {
    if (!order || !hasPaymentStatusChanges) return;

    setUpdating("payment");
    try {
      await updatePaymentStatus(order.id, {
        status: pendingPaymentStatus,
        remarks: remarks || undefined,
      });

      // Update the order state with new status and remarks
      const updatedOrder = {
        ...order,
        paymentStatus: pendingPaymentStatus,
        paymentRemarks: remarks || order.paymentRemarks,
      };

      setOrder(updatedOrder);
      setHasPaymentStatusChanges(false);
      setPendingPaymentStatus(pendingPaymentStatus); // Ensure pending matches saved
      setRejectionRemarks(""); // Clear rejection remarks immediately
      toast.success(`Payment status updated to ${pendingPaymentStatus}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update payment status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const resetOrderStatus = () => {
    if (order) {
      setPendingOrderStatus(order.orderStatus);
      setHasOrderStatusChanges(false);
    }
  };

  const resetPaymentStatus = () => {
    if (order) {
      setPendingPaymentStatus(order.paymentStatus);
      setHasPaymentStatusChanges(false);
      setRejectionRemarks("");
    }
  };

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const options =
      type === "order" ? orderStatusOptions : paymentStatusOptions;
    const option = options.find(
      (opt) => opt.value.toLowerCase() === status.toLowerCase()
    );

    let icon;
    if (type === "payment") {
      switch (status.toLowerCase()) {
        case "approved":
          icon = <CheckCircle className="h-4 w-4" />;
          break;
        case "rejected":
          icon = <XCircle className="h-4 w-4" />;
          break;
        default:
          icon = <AlertTriangle className="h-4 w-4" />;
      }
    } else {
      switch (status.toLowerCase()) {
        case "delivered":
          icon = <CheckCircle className="h-4 w-4" />;
          break;
        case "shipped":
          icon = <Truck className="h-4 w-4" />;
          break;
        case "cancelled":
          icon = <XCircle className="h-4 w-4" />;
          break;
        default:
          icon = <Clock className="h-4 w-4" />;
      }
    }

    return (
      <Badge
        variant="secondary"
        className={`${
          option?.color || "bg-gray-100 text-gray-800"
        } flex items-center gap-1`}
      >
        {icon}
        {option?.label || status}
      </Badge>
    );
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          Error: {error || "Order not found"}
        </div>
        <Button onClick={() => navigate("/admin/orders")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <p className="text-gray-600">
              Placed on{" "}
              {new Date(order.orderDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Order Status</span>
            {getStatusBadge(order.orderStatus, "order")}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Payment Status</span>
            {getStatusBadge(order.paymentStatus, "payment")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Name:</span>
                <span>{order.customer?.fullName || "Unknown Customer"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {order.customer?.email || "Not available"}
                </span>
              </div>
              {order.customer?.phone && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Phone:</span>
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {order.customer.phone}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">{order.address.name}</div>
                  <div className="text-gray-600">{order.address.street}</div>
                  <div className="text-gray-600">
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.pincode}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    {order.address.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ₹
                        {(
                          (product.price || 0) * product.quantity
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        ₹{(product.price || 0).toLocaleString()} each
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Management */}
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Update order and payment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Status */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  📦 Order Status
                </label>
                <Select
                  value={pendingOrderStatus}
                  onValueChange={handleOrderStatusChange}
                  disabled={updating === "order"}
                >
                  <SelectTrigger
                    className={
                      hasOrderStatusChanges
                        ? "border-blue-400 ring-1 ring-blue-200"
                        : ""
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasOrderStatusChanges && (
                  <div className="flex gap-2">
                    <Button
                      onClick={saveOrderStatus}
                      disabled={updating === "order"}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updating === "order" ? (
                        <>
                          <span className="h-4 w-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Order Status
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetOrderStatus}
                      disabled={updating === "order"}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  💳 Payment Status
                </label>
                <div className="space-y-3">
                  <Select
                    value={pendingPaymentStatus}
                    onValueChange={handlePaymentStatusChange}
                    disabled={updating === "payment"}
                  >
                    <SelectTrigger
                      className={
                        hasPaymentStatusChanges
                          ? "border-blue-400 ring-1 ring-blue-200"
                          : ""
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasPaymentStatusChanges && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          savePaymentStatus(
                            pendingPaymentStatus === "Rejected"
                              ? rejectionRemarks
                              : undefined
                          )
                        }
                        disabled={
                          updating === "payment" ||
                          (pendingPaymentStatus === "Rejected" &&
                            !rejectionRemarks.trim())
                        }
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updating === "payment" ? (
                          <>
                            <span className="h-4 w-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Payment Status
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetPaymentStatus}
                        disabled={updating === "payment"}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Rejection remarks - only show when Rejected is selected */}
                  {pendingPaymentStatus === "Rejected" && (
                    <div className="space-y-3 border-t pt-4">
                      <label className="text-sm font-medium text-gray-700">
                        Rejection Remarks (Required)
                      </label>
                      <Textarea
                        placeholder="Enter rejection remarks (required for rejection)..."
                        value={rejectionRemarks}
                        onChange={(e) => setRejectionRemarks(e.target.value)}
                        rows={3}
                        className={
                          !rejectionRemarks.trim() ? "border-red-300" : ""
                        }
                      />
                      {!rejectionRemarks.trim() && (
                        <p className="text-sm text-red-600">
                          Rejection remarks are required when rejecting payment
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Number */}
              {order.trackingNumber &&
                order.trackingNumber !== "Not Assigned" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      🚚 Tracking Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg font-mono">
                      {order.trackingNumber}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(order.paymentStatus, "payment")}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Amount:</span>
                <span className="text-lg font-semibold text-green-600">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Payment Proof */}
              {order.paymentProofUrl && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Payment Proof</label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={order.paymentProofUrl}
                      alt="Payment Proof"
                      className="w-full h-64 object-contain cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        window.open(order.paymentProofUrl, "_blank")
                      }
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(order.paymentProofUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Size
                  </Button>
                </div>
              )}

              {/* Payment Remarks */}
              {order.paymentStatus.toLowerCase() === "rejected" &&
                order.paymentRemarks && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Rejection Remarks
                    </h4>
                    <p className="text-red-700 text-sm">
                      {order.paymentRemarks}
                    </p>
                  </div>
                )}

              {!order.paymentProofUrl && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No payment proof uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
