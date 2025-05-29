import { getAllOrders, updateOrderStatus } from "@/api/orders";
import { getAllUsers } from "@/api/users";
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
  Calendar,
  DollarSign,
  ExternalLink,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "Pending", color: "text-yellow-600" },
  { value: "processing", label: "Processing", color: "text-blue-600" },
  { value: "shipped", label: "Shipped", color: "text-purple-600" },
  { value: "delivered", label: "Delivered", color: "text-green-600" },
  { value: "cancelled", label: "Cancelled", color: "text-red-600" },
];

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
    default:
      return "bg-yellow-100 text-yellow-600 border-yellow-300";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  // Get user filter from URL parameters
  const userIdFilter = searchParams.get("userId");
  const filteredUser = userIdFilter
    ? users.find((u) => String(u.id) === userIdFilter)
    : null;

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const getUser = (userId: number | string) =>
    users.find((u) => String(u.id) === String(userId));

  const filteredOrders = orders.filter((order) => {
    const user = getUser(order.userId);
    if (!user) return false;
    const customer = user.fullName || "";
    const email = user.email || "";
    const orderStatus =
      typeof order.orderStatus === "string" ? order.orderStatus : "";

    // Filter by user ID if specified in URL
    const matchesUserFilter =
      !userIdFilter || String(order.userId) === userIdFilter;

    return (
      matchesUserFilter &&
      (customer.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toString().toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" ||
        orderStatus.toLowerCase() === statusFilter.toLowerCase())
    );
  });

  const handleStatusChange = async (
    order: OrderResponse,
    newStatus: string
  ) => {
    setUpdating(order.id);
    try {
      await updateOrderStatus(order.userId, order.id, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, orderStatus: newStatus } : o
        )
      );
      toast.success(`Order ${order.id} status updated to ${newStatus}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleViewOrderDetails = (orderId: number) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const clearUserFilter = () => {
    setSearchParams((params) => {
      params.delete("userId");
      return params;
    });
  };

  return (
    <div className="space-y-4">
      {/* User Filter Display */}
      {filteredUser && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Showing orders for: {filteredUser.fullName} ({filteredUser.email})
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearUserFilter}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
            Clear filter
          </Button>
        </div>
      )}

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
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className={opt.color}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading/Error */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const user = getUser(order.userId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{user?.fullName || "-"}</div>
                            <div className="text-xs text-gray-500">
                              {user?.email || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={
                              statusOptions.some(
                                (opt) =>
                                  opt.value === order.orderStatus?.toLowerCase()
                              )
                                ? order.orderStatus.toLowerCase()
                                : "pending"
                            }
                            onValueChange={(value) =>
                              handleStatusChange(order, value)
                            }
                            disabled={updating === order.id}
                          >
                            <SelectTrigger
                              className={`w-[110px] h-8 text-xs border ${getStatusStyles(
                                order.orderStatus
                              )}`}
                            >
                              <SelectValue placeholder={order.orderStatus} />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((opt) => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                  className={opt.color}
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => {
                const user = getUser(order.userId);
                return (
                  <Card key={order.id} className="p-4">
                    <CardContent className="p-0 space-y-3">
                      {/* Order ID and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            Order
                          </span>
                          <span className="font-semibold">#{order.id}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-ethnic-purple/10 hover:text-ethnic-purple p-2"
                          onClick={() => handleViewOrderDetails(order.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {user?.fullName || "-"}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user?.email || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Date and Total */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-xs text-gray-500">Date</div>
                            <div className="text-sm font-medium">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="text-sm font-medium">
                              ₹{order.totalAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <Select
                          value={
                            statusOptions.some(
                              (opt) =>
                                opt.value === order.orderStatus?.toLowerCase()
                            )
                              ? order.orderStatus.toLowerCase()
                              : "pending"
                          }
                          onValueChange={(value) =>
                            handleStatusChange(order, value)
                          }
                          disabled={updating === order.id}
                        >
                          <SelectTrigger
                            className={`w-full h-8 text-xs border ${getStatusStyles(
                              order.orderStatus
                            )}`}
                          >
                            <SelectValue placeholder={order.orderStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className={opt.color}
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTable;
