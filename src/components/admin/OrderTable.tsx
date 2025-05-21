
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Sample orders for demo
const sampleOrders = [
  { 
    id: "ORD-001", 
    customer: "Anjali Patel", 
    email: "anjali@example.com",
    total: 24999, 
    status: "delivered",
    date: "2023-05-15",
    paymentMethod: "UPI",
    items: 1
  },
  { 
    id: "ORD-002", 
    customer: "Priya Singh", 
    email: "priya@example.com",
    total: 15999, 
    status: "processing",
    date: "2023-05-16",
    paymentMethod: "UPI",
    items: 2
  },
  { 
    id: "ORD-003", 
    customer: "Meera Sharma", 
    email: "meera@example.com",
    total: 49999, 
    status: "pending",
    date: "2023-05-17",
    paymentMethod: "UPI",
    items: 1
  },
  { 
    id: "ORD-004", 
    customer: "Riya Gupta", 
    email: "riya@example.com",
    total: 12999, 
    status: "shipped",
    date: "2023-05-18",
    paymentMethod: "UPI",
    items: 3
  },
];

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const OrderTable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [orders, setOrders] = useState(sampleOrders);

  const filteredOrders = orders.filter(order =>
    (order.customer.toLowerCase().includes(search.toLowerCase()) ||
     order.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "" || order.status === statusFilter)
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
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

  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="flex items-center gap-2 flex-col sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders table */}
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                  <TableCell>₹{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className={`w-[110px] h-8 text-xs border ${getStatusStyles(order.status)}`}>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-ethnic-purple/10 hover:text-ethnic-purple"
                      onClick={() => handleViewOrderDetails(order.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;
