import {
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
import { fetchAllOrders, Order } from "../../api"; // ✅ Import API function

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch All Orders
  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .catch((error) => console.error("Failed to fetch orders:", error));
  }, []);

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{ mt: 4, mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        All Orders
      </Typography>

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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {order.products.map((product, index) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminOrders;
