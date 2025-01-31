import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserOrders, updateOrderStatus } from "../../api/orders"; // ✅ Corrected API imports
import { getAllUsers } from "../../api/users"; // ✅ Corrected API import
import { OrderResponse } from "../../types/order/OrderResponse"; // ✅ Import correct type

const AdminUserOrderManagement = () => {
  // ✅ Renamed component for clarity
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<{
    [key: number]: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // ✅ Fetch User Name
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const users = await getAllUsers();
        const user = users.find((u) => u.id === Number(userId));
        if (user) {
          setUserName(user.fullName);
        }
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        setError("Failed to load user details.");
      }
    };

    if (userId) {
      loadUserName();
    }
  }, [userId]);

  // ✅ Fetch Orders for Selected User
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) return;
        const response = await getUserOrders(Number(userId));
        setOrders(response);

        // ✅ Initialize statuses
        const initialStatuses: { [key: number]: string } = {};
        response.forEach((order) => {
          initialStatuses[order.id] = order.orderStatus;
        });
        setSelectedStatuses(initialStatuses);
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
        setError("Failed to load user orders.");
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  // ✅ Handle Status Change
  const handleStatusChange = (orderId: number, newStatus: string) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  // ✅ Handle Update Click
  const handleUpdateStatus = async (orderId: number) => {
    const newStatus = selectedStatuses[orderId];

    try {
      if (!userId) return;
      await updateOrderStatus(Number(userId), orderId, { status: newStatus }); // ✅ Pass userId in the request
      setSuccessMessage(`Order #${orderId} status updated to ${newStatus}`);

      // ✅ Update the UI after status change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
    }
  };

  return (
    <Container>
      {/* Page Heading */}
      <Typography
        variant="h4"
        sx={{ mt: 4, textAlign: "center", fontWeight: "bold" }}
      >
        Orders for {userName || `User #${userId}`}
      </Typography>

      {/* Success Banner */}
      {successMessage && (
        <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }}>
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Back Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin/users")}
      >
        🔙 Back to Users
      </Button>

      {/* No Orders Message */}
      {orders.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            mt: 4,
            textAlign: "center",
            fontStyle: "italic",
            color: "gray",
          }}
        >
          No orders found for {userName || `User #${userId}`}.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Order ID</b>
                </TableCell>
                <TableCell>
                  <b>Products</b>
                </TableCell>
                <TableCell>
                  <b>Total</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell>
                  <b>Order Date</b>
                </TableCell>
                <TableCell>
                  <b>Update Status</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.orderProducts.map((product, index) => (
                      <div key={index}>
                        {`Product ID: ${product.productId}, Qty: ${product.quantity}`}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={selectedStatuses[order.id] || order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ ml: 1 }}
                      onClick={() => handleUpdateStatus(order.id)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminUserOrderManagement;
