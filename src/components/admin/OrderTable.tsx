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
  AlertCircle,
  Calendar,
  Check,
  DollarSign,
  ExternalLink,
  MapPin,
  Save,
  Search,
  Undo2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

// Updated status options to match backend validation
const statusOptions = [
  { value: "Pending", label: "Pending", color: "text-yellow-600" },
  { value: "Processing", label: "Processing", color: "text-blue-600" },
  { value: "Shipped", label: "Shipped", color: "text-purple-600" },
  { value: "Delivered", label: "Delivered", color: "text-green-600" },
  { value: "Cancelled", label: "Cancelled", color: "text-red-600" },
];

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
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

  // Controlled status update state
  const [pendingStatusChanges, setPendingStatusChanges] = useState<
    Record<number, string>
  >({});
  const [savingStatus, setSavingStatus] = useState<number | null>(null);

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
    const user = order.customer || getUser(order.userId);
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

  // Handle controlled status change (doesn't save immediately)
  const handleStatusSelectionChange = (orderId: number, newStatus: string) => {
    setPendingStatusChanges((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // Save status change with confirmation
  const saveStatusChange = async (order: OrderResponse) => {
    const newStatus = pendingStatusChanges[order.id];
    if (!newStatus || newStatus === order.orderStatus) {
      return; // No change needed
    }

    setSavingStatus(order.id);
    try {
      await updateOrderStatus(order.userId, order.id, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, orderStatus: newStatus } : o
        )
      );
      setPendingStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[order.id];
        return updated;
      });
      toast.success(`Order #${order.id} status updated to ${newStatus}`, {
        description: `Customer: ${order.customer?.fullName || "Unknown"}`,
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setSavingStatus(null);
    }
  };

  // Cancel pending status change
  const cancelStatusChange = (orderId: number) => {
    setPendingStatusChanges((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
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

  // Get effective status (pending change or current)
  const getEffectiveStatus = (order: OrderResponse) => {
    return pendingStatusChanges[order.id] || order.orderStatus;
  };

  // Check if order has pending changes
  const hasPendingChanges = (orderId: number) => {
    return pendingStatusChanges[orderId] !== undefined;
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
            placeholder="Search orders by customer, email, or order ID..."
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
                  value={opt.value.toLowerCase()}
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
        <>
          {/* Desktop Table Loading */}
          <div className="hidden md:block rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24 rounded" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Loading */}
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div>
                        <Skeleton className="h-3 w-8 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div>
                        <Skeleton className="h-3 w-8 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-3 w-10 mb-1" />
                    <Skeleton className="h-8 w-full rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : error ? (
        <div className="text-center py-8 text-red-500 flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Shipping Address</TableHead>
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
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const user = order.customer || getUser(order.userId);
                    const effectiveStatus = getEffectiveStatus(order);
                    const hasChanges = hasPendingChanges(order.id);

                    return (
                      <TableRow
                        key={order.id}
                        className={hasChanges ? "bg-blue-50" : ""}
                      >
                        <TableCell className="font-medium">
                          #{order.id}
                          {hasChanges && (
                            <span className="ml-2">
                              <AlertCircle className="h-4 w-4 text-blue-600 inline" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user?.fullName || "-"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user?.email || "-"}
                            </div>
                            {user?.phone && (
                              <div className="text-xs text-gray-500">
                                📱 {user.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.address ? (
                            <div className="text-sm">
                              <div className="font-medium">
                                {order.address.name}
                              </div>
                              <div className="text-gray-600 text-xs">
                                {order.address.street}
                              </div>
                              <div className="text-gray-600 text-xs">
                                {order.address.city}, {order.address.state}{" "}
                                {order.address.pincode}
                              </div>
                              <div className="text-gray-600 text-xs">
                                📱 {order.address.phone}
                              </div>
                            </div>
                          ) : order.addressId ? (
                            <div className="text-sm text-gray-500">
                              Address ID: {order.addressId}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">
                              No address
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.orderDate).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{order.totalAmount.toLocaleString()}
                          </div>
                          {order.paymentProofUrl && (
                            <div className="text-xs text-green-600">
                              💳 Payment proof uploaded
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Select
                              value={effectiveStatus}
                              onValueChange={(value) =>
                                handleStatusSelectionChange(order.id, value)
                              }
                              disabled={savingStatus === order.id}
                            >
                              <SelectTrigger
                                className={`w-[120px] h-8 text-xs border ${getStatusStyles(
                                  effectiveStatus
                                )} ${
                                  hasChanges
                                    ? "border-blue-400 ring-1 ring-blue-200"
                                    : ""
                                }`}
                              >
                                <SelectValue placeholder={effectiveStatus} />
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

                            {hasChanges && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => saveStatusChange(order)}
                                  disabled={savingStatus === order.id}
                                >
                                  {savingStatus === order.id ? (
                                    <span className="h-3 w-3 border border-green-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                  onClick={() => cancelStatusChange(order.id)}
                                  disabled={savingStatus === order.id}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
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
                const user = order.customer || getUser(order.userId);
                const effectiveStatus = getEffectiveStatus(order);
                const hasChanges = hasPendingChanges(order.id);

                return (
                  <Card
                    key={order.id}
                    className={`p-4 ${
                      hasChanges ? "border-blue-200 bg-blue-50" : ""
                    }`}
                  >
                    <CardContent className="p-0 space-y-4">
                      {/* Order ID and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            Order
                          </span>
                          <span className="font-semibold">#{order.id}</span>
                          {hasChanges && (
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          )}
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
                          <div className="font-medium">
                            {user?.fullName || "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email || "-"}
                          </div>
                          {user?.phone && (
                            <div className="text-sm text-gray-500">
                              📱 {user.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      {order.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {order.address.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.address.street}
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.address.city}, {order.address.state}{" "}
                              {order.address.pincode}
                            </div>
                            <div className="text-sm text-gray-600">
                              📱 {order.address.phone}
                            </div>
                          </div>
                        </div>
                      )}

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
                            {order.paymentProofUrl && (
                              <div className="text-xs text-green-600">
                                💳 Payment proof
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <div className="text-xs text-gray-500 mb-2">Status</div>
                        <div className="space-y-2">
                          <Select
                            value={effectiveStatus}
                            onValueChange={(value) =>
                              handleStatusSelectionChange(order.id, value)
                            }
                            disabled={savingStatus === order.id}
                          >
                            <SelectTrigger
                              className={`w-full h-8 text-xs border ${getStatusStyles(
                                effectiveStatus
                              )} ${
                                hasChanges
                                  ? "border-blue-400 ring-1 ring-blue-200"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder={effectiveStatus} />
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

                          {hasChanges && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                                onClick={() => saveStatusChange(order)}
                                disabled={savingStatus === order.id}
                              >
                                {savingStatus === order.id ? (
                                  <>
                                    <span className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-8 text-xs"
                                onClick={() => cancelStatusChange(order.id)}
                                disabled={savingStatus === order.id}
                              >
                                <Undo2 className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
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
