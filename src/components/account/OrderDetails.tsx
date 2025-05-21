
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package, Truck, CheckCircle } from "lucide-react";

interface OrderDetailsProps {
  order: any; // In a real app, you'd use a proper type
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
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
    if (status.toLowerCase().includes("paid")) {
      return "bg-green-100 text-green-800";
    } else if (status.toLowerCase().includes("pending")) {
      return "bg-amber-100 text-amber-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-medium">{order.id}</h3>
            <Badge className={getStatusClass(order.status) + " ml-2"}>
              {order.status}
            </Badge>
            <Badge className={getPaymentStatusClass(order.paymentStatus) + " ml-2"}>
              {order.paymentStatus}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Ordered on {new Date(order.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
      
      {order.status.toLowerCase() === "shipped" || order.status.toLowerCase() === "delivered" ? (
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2 flex items-center">
            <Truck size={18} className="mr-2" /> Shipping Information
          </h4>
          <p className="text-sm mb-1">
            <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
          </p>
          {order.status.toLowerCase() === "delivered" ? (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle size={14} className="mr-1" /> Delivered on {
                new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }
            </p>
          ) : (
            <p className="text-sm text-blue-600 flex items-center">
              <Package size={14} className="mr-1" /> Package in transit
            </p>
          )}
        </div>
      ) : null}
      
      <div>
        <h4 className="font-medium mb-3">Items</h4>
        <div className="space-y-3">
          {order.items.map((item: any) => (
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
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
              </div>
              <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Shipping Address</h4>
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-start mb-1">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{order.address.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Phone: {order.address.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Payment Summary</h4>
          <div className="bg-muted p-3 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.total >= 1999 ? "Free" : formatPrice(99)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
