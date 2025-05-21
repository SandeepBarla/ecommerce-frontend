
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
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
import { toast } from "sonner";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";

// Order type
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  items: OrderItem[];
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// Sample order data for demo purposes
const getSampleOrder = (orderId: string): Order => {
  return {
    id: orderId,
    customer: "Anjali Patel",
    email: "anjali@example.com",
    total: 24999,
    status: "delivered",
    date: "2023-05-15",
    paymentMethod: "UPI",
    items: [
      {
        productId: "1",
        productName: "Embroidered Silk Saree",
        price: 24999,
        quantity: 1,
        size: "Free Size",
        color: "#800020"
      }
    ],
    address: {
      line1: "123 Main Street",
      line2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  };
};

const AdminOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch the order from an API
    // For now, we'll use sample data
    if (orderId) {
      setOrder(getSampleOrder(orderId));
      setLoading(false);
    }
  }, [orderId]);

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (order) {
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-600 border-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-600 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-600 border-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-600 border-red-300';
      default: // pending
        return 'bg-yellow-100 text-yellow-600 border-yellow-300';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading order details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
              defaultValue={order.status}
              onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            >
              <SelectTrigger className={`w-[140px] ${getStatusStyles(order.status)}`}>
                <SelectValue placeholder={order.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" className="text-yellow-600">Pending</SelectItem>
                <SelectItem value="processing" className="text-blue-600">Processing</SelectItem>
                <SelectItem value="shipped" className="text-purple-600">Shipped</SelectItem>
                <SelectItem value="delivered" className="text-green-600">Delivered</SelectItem>
                <SelectItem value="cancelled" className="text-red-600">Cancelled</SelectItem>
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
                Ordered on {order.date} • Order #{order.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574" alt={item.productName} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.color && (
                          <span className="mr-4">
                            Color: <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></span>
                          </span>
                        )}
                        {item.size && <span className="mr-4">Size: {item.size}</span>}
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
                  <CardTitle className="text-base">Customer Information</CardTitle>
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
            {order.address && (
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
                    <p>{order.address.line1}</p>
                    {order.address.line2 && <p>{order.address.line2}</p>}
                    <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;
