import {
  Alert,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../api/orders"; // ✅ Corrected import
import { OrderResponse } from "../../types/order/OrderResponse"; // ✅ Corrected type import

const AdminOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch All Orders (Admin View)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrders(response);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to load orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{ mt: 4, mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        All Orders (Admin Panel)
      </Typography>

      {/* ✅ Display Error if Orders Fail to Load */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* ✅ Back to Admin Panel Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin")}
      >
        🔙 Back to Admin Dashboard
      </Button>

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
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No orders available.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminOrderManagement;
