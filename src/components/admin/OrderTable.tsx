import { getAllOrders } from "@/api/orders";
import { getAllUsers } from "@/api/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderResponse } from "@/types/order/OrderResponse";
import { UserResponse } from "@/types/user/UserResponse";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Search,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const orderStatusOptions = [
  { value: "Pending", label: "Pending", color: "text-yellow-600" },
  { value: "Processing", label: "Processing", color: "text-blue-600" },
  { value: "Shipped", label: "Shipped", color: "text-purple-600" },
  { value: "Delivered", label: "Delivered", color: "text-green-600" },
  { value: "Cancelled", label: "Cancelled", color: "text-red-600" },
];

const paymentStatusOptions = [
  { value: "Pending", label: "Pending", color: "text-yellow-600" },
  { value: "Approved", label: "Approved", color: "text-green-600" },
  { value: "Rejected", label: "Rejected", color: "text-red-600" },
];

const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "processing":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "shipped":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
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

const OrderTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Get user filter from URL parameters
  const userIdFilter = searchParams.get("userId");
  const filteredUser = userIdFilter
    ? users.find((u) => String(u.id) === userIdFilter)
    : null;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, usersData] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getUser = (userId: number | string) =>
    users.find((u) => String(u.id) === String(userId));

  const filteredOrders = orders.filter((order) => {
    const user = order.customer || getUser(order.userId);
    const matchesSearch =
      !search ||
      order.id.toString().includes(search.toLowerCase()) ||
      user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesUser = !userIdFilter || String(order.userId) === userIdFilter;

    const matchesOrderStatus =
      orderStatusFilter === "all" ||
      order.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase();

    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      order.paymentStatus.toLowerCase() === paymentStatusFilter.toLowerCase();

    return (
      matchesSearch && matchesUser && matchesOrderStatus && matchesPaymentStatus
    );
  });

  const handleViewOrderDetails = (orderId: number) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const clearUserFilter = () => {
    setSearchParams((params) => {
      params.delete("userId");
      return params;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={fetchOrders}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-gray-600 mt-1">
            Manage customer orders and payment statuses
          </p>
        </div>
        {filteredUser && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">
              {filteredUser.fullName}
            </span>
            <Button variant="ghost" size="sm" onClick={clearUserFilter}>
              ×
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 transform -translate-y-1/2" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Order Status</SelectItem>
            {orderStatusOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value.toLowerCase()}
                className={opt.color}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={paymentStatusFilter}
          onValueChange={setPaymentStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Status</SelectItem>
            {paymentStatusOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value.toLowerCase()}
                className={opt.color}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">
              No orders found matching your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="w-32">Date</TableHead>
                    <TableHead className="w-24">Total</TableHead>
                    <TableHead className="w-36">Order Status</TableHead>
                    <TableHead className="w-36">Payment Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const user = order.customer || getUser(order.userId);

                    return (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user?.fullName || "Unknown Customer"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${getStatusBadgeColor(
                              order.orderStatus
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(order.orderStatus, "order")}
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${getStatusBadgeColor(
                              order.paymentStatus
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(order.paymentStatus, "payment")}
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.map((order) => {
              const user = order.customer || getUser(order.userId);

              return (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-lg">
                          Order #{order.id}
                        </div>
                        <div className="text-gray-600 flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" />
                          {user?.fullName || "Unknown Customer"}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrderDetails(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-2">
                          Order Status
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getStatusBadgeColor(
                            order.orderStatus
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(order.orderStatus, "order")}
                          {order.orderStatus}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-2">
                          Payment Status
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getStatusBadgeColor(
                            order.paymentStatus
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(order.paymentStatus, "payment")}
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTable;
