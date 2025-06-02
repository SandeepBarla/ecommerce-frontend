import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Receipt,
  Truck,
  XCircle,
} from "lucide-react";

interface OrderDetailsProps {
  order: {
    id: string | number;
    userId?: number;
    addressId?: number;
    items: Array<{
      id: number;
      name: string;
      image: string;
      quantity: number;
      price: number;
    }>;
    status: string;
    paymentStatus?: string;
    paymentRemarks?: string;
    date: string;
    total: number;
    trackingNumber?: string;
    paymentProofUrl?: string;
  };
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string, type: "order" | "payment") => {
    if (type === "payment") {
      switch (status?.toLowerCase()) {
        case "approved":
          return <CheckCircle className="h-4 w-4" />;
        case "rejected":
          return <XCircle className="h-4 w-4" />;
        default:
          return <AlertTriangle className="h-4 w-4" />;
      }
    } else {
      switch (status?.toLowerCase()) {
        case "delivered":
          return <CheckCircle className="h-4 w-4" />;
        case "shipped":
          return <Truck className="h-4 w-4" />;
        case "cancelled":
          return <XCircle className="h-4 w-4" />;
        default:
          return <Clock className="h-4 w-4" />;
      }
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-medium">{order.id}</h3>
            <Badge
              className={`${getStatusClass(
                order.status
              )} flex items-center gap-1`}
            >
              Order: {getStatusIcon(order.status, "order")} {order.status}
            </Badge>
            {order.paymentStatus && (
              <Badge
                className={`${getPaymentStatusClass(
                  order.paymentStatus
                )} flex items-center gap-1`}
              >
                Payment: {getStatusIcon(order.paymentStatus, "payment")}{" "}
                {order.paymentStatus}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Ordered on{" "}
            {new Date(order.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Payment Status Alert */}
      {order.paymentStatus?.toLowerCase() === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">
                Payment Rejected
              </h4>
              {order.paymentRemarks && (
                <div className="space-y-1 mb-3">
                  <p className="text-sm font-medium text-red-700">
                    Rejection Remarks:
                  </p>
                  <p className="text-sm text-red-700 bg-red-100 p-2 rounded border-l-4 border-red-400">
                    {order.paymentRemarks}
                  </p>
                </div>
              )}
              <p className="text-red-600 text-xs">
                Please contact customer support or upload a new payment proof.
              </p>
            </div>
          </div>
        </div>
      )}

      {order.paymentStatus?.toLowerCase() === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">
                Payment Under Review
              </h4>
              <p className="text-yellow-700 text-sm">
                Your payment proof is being reviewed by our team. We'll update
                you once verified.
              </p>
            </div>
          </div>
        </div>
      )}

      {order.paymentStatus?.toLowerCase() === "approved" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 mb-1">
                Payment Approved
              </h4>
              <p className="text-green-700 text-sm">
                Your payment has been verified and approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {order.status.toLowerCase() === "shipped" ||
      order.status.toLowerCase() === "delivered" ? (
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2 flex items-center">
            <Truck size={18} className="mr-2" /> Shipping Information
          </h4>
          <p className="text-sm mb-1">
            <span className="font-medium">Tracking Number:</span>{" "}
            {order.trackingNumber}
          </p>
          {order.status.toLowerCase() === "delivered" ? (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle size={14} className="mr-1" /> Delivered on{" "}
              {new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : (
            <p className="text-sm text-blue-600 flex items-center">
              <Package size={14} className="mr-1" /> Package in transit
            </p>
          )}
        </div>
      ) : null}

      {/* Payment Proof Section */}
      {order.paymentProofUrl && (
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-3 flex items-center">
            <Receipt size={18} className="mr-2" /> Payment Proof
          </h4>
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <img
                src={order.paymentProofUrl}
                alt="Payment Proof"
                className="w-32 h-24 object-cover rounded cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => window.open(order.paymentProofUrl, "_blank")}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700">
                Payment screenshot uploaded
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click image to view full size
              </p>
              {order.paymentStatus && (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(
                      order.paymentStatus
                    )}`}
                  >
                    {getStatusIcon(order.paymentStatus, "payment")}
                    {order.paymentStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-3">Items</h4>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h5 className="font-medium">{item.name}</h5>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <span className="font-medium">Total</span>
        <span className="text-lg font-semibold">
          {formatPrice(order.total)}
        </span>
      </div>
    </div>
  );
};

export default OrderDetails;
