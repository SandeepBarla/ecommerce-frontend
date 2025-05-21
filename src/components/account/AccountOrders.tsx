
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronRight, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OrderDetails from "./OrderDetails";

// Sample order data (in a real app, this would come from an API)
const sampleOrders = [
  {
    id: "ORD4289",
    date: "2025-05-12",
    total: 24999,
    status: "Delivered",
    paymentStatus: "Paid",
    items: [
      {
        id: "1",
        name: "Embroidered Silk Saree",
        price: 24999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574"
      }
    ],
    address: {
      name: "Home",
      street: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "9876543210"
    },
    trackingNumber: "IN4289756HK"
  },
  {
    id: "ORD4163",
    date: "2025-05-02",
    total: 15999,
    status: "Processing",
    paymentStatus: "Verification Pending",
    items: [
      {
        id: "2",
        name: "Designer Anarkali Suit",
        price: 15999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574"
      }
    ],
    address: {
      name: "Office",
      street: "456 Business Park, Building C",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      phone: "9876543210"
    }
  },
  {
    id: "ORD3972",
    date: "2025-04-20",
    total: 49999,
    status: "Shipped",
    paymentStatus: "Paid",
    items: [
      {
        id: "3",
        name: "Bridal Lehenga Choli",
        price: 49999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574"
      }
    ],
    address: {
      name: "Home",
      street: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "9876543210"
    },
    trackingNumber: "IN3972541HK"
  }
];

const AccountOrders = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const filterOrders = () => {
    if (selectedTab === "all") return sampleOrders;
    return sampleOrders.filter(order => order.status.toLowerCase() === selectedTab);
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
  
  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };
  
  const filteredOrders = filterOrders();
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
                  <Button asChild className="bg-ethnic-purple hover:bg-ethnic-purple/90">
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
                            {new Date(order.date).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusClass(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPaymentStatusClass(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-3">
                            <img 
                              src={order.items[0].image} 
                              alt={order.items[0].name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{order.items[0].name}</p>
                            {order.items.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                +{order.items.length - 1} more item(s)
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                          <p className="font-medium">{formatPrice(order.total)}</p>
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
