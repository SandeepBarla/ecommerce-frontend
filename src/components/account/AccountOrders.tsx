import { getUserOrders } from "@/api/orders";
import { fetchProductById } from "@/api/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getEffectivePrice } from "@/lib/utils";
import { Eye, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderDetails from "./OrderDetails";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ProcessedOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  address: string;
  trackingNumber?: string;
  paymentProofUrl?: string;
}

const AccountOrders = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProcessedOrder | null>(
    null
  );
  const [orders, setOrders] = useState<ProcessedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const userOrders = await getUserOrders(Number(user.id));

        // Process orders and fetch product details
        const processedOrders: ProcessedOrder[] = [];

        for (const order of userOrders) {
          const orderItems: OrderItem[] = [];

          // Fetch product details for each order item
          for (const orderProduct of order.orderProducts) {
            try {
              const product = await fetchProductById(orderProduct.productId);
              orderItems.push({
                id: product.id,
                name: product.name,
                price: getEffectivePrice(
                  product.originalPrice,
                  product.discountedPrice
                ),
                quantity: orderProduct.quantity,
                image:
                  product.media?.[0]?.mediaUrl || "/placeholder-product.jpg",
              });
            } catch (err) {
              console.error(
                `Failed to fetch product ${orderProduct.productId}:`,
                err
              );
              // Add fallback item if product fetch fails
              orderItems.push({
                id: orderProduct.productId,
                name: "Product Not Found",
                price: 0,
                quantity: orderProduct.quantity,
                image: "/placeholder-product.jpg",
              });
            }
          }

          processedOrders.push({
            id: `ORD${order.id}`,
            date: order.orderDate,
            total: order.totalAmount,
            status: order.orderStatus,
            paymentStatus: order.paymentStatus || "Paid",
            items: orderItems,
            address: `Address ID: ${order.addressId || "Not specified"}`,
            trackingNumber:
              order.trackingNumber && order.trackingNumber !== "Not Assigned"
                ? order.trackingNumber
                : undefined,
            paymentProofUrl: order.paymentProofUrl,
          });
        }

        setOrders(processedOrders);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filterOrders = () => {
    if (selectedTab === "all") return orders;
    return orders.filter((order) => order.status.toLowerCase() === selectedTab);
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

  const handleOrderClick = (order: ProcessedOrder) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const filteredOrders = filterOrders();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 flex w-full overflow-x-auto">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {/* Order Card Skeletons */}
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border rounded-md p-4">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <Skeleton className="h-5 w-20 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>

                    {/* Product and Price Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Skeleton className="h-12 w-12 rounded-md mr-3" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                        <Skeleton className="h-5 w-16 mr-4" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="all"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="mb-4 flex w-full overflow-x-auto">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <h3 className="font-medium text-lg mb-1">No orders found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedTab === "all"
                      ? "You haven't placed any orders yet"
                      : `You don't have any ${selectedTab} orders`}
                  </p>
                  <Button
                    asChild
                    className="bg-ethnic-purple hover:bg-ethnic-purple/90"
                  >
                    <a href="/">Shop Now</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-md p-4 hover:border-ethnic-purple transition-colors cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusClass(order.status)}>
                            Order: {order.status}
                          </Badge>
                          <Badge
                            className={getPaymentStatusClass(
                              order.paymentStatus
                            )}
                          >
                            Payment: {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-3">
                            <img
                              src={
                                order.items[0]?.image ||
                                "/placeholder-product.jpg"
                              }
                              alt={order.items[0]?.name || "Product"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/placeholder-product.jpg";
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">
                              {order.items[0]?.name || "Product"}
                            </p>
                            {order.items.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                +{order.items.length - 1} more item(s)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                          <p className="font-medium">
                            {formatPrice(order.total)}
                          </p>
                          <Button variant="ghost" size="sm" className="ml-4">
                            <Eye size={16} className="mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountOrders;
