import {
  Alert,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { getUserOrders } from "../../api/orders"; // ✅ Corrected import
import { AuthContext } from "../../context/AuthContext";
import { OrderResponse } from "../../types/order/OrderResponse"; // ✅ Import correct type

const Orders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  const { token, user } = authContext || {}; // ✅ Ensure authContext is safely accessed

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) return;
        const response = await getUserOrders(user.id); // ✅ Pass userId correctly
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      }
    };

    if (token && user?.id) {
      fetchOrders();
    }
  }, [token, user?.id]); // ✅ Dependencies added

  if (!token) {
    return (
      <Container>
        <Alert severity="warning">Please login to view your orders.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Your Orders
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <List>
        {orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          orders.map((order) => (
            <ListItem
              key={order.id}
              sx={{ borderBottom: "1px solid #ddd", py: 2 }}
            >
              <ListItemText
                primary={`Order #${order.id} - ₹${order.totalAmount}`}
                secondary={
                  <Box>
                    <Typography>Status: {order.orderStatus}</Typography>
                    <Typography>
                      Placed on:{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Shipping Address: {order.shippingAddress}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default Orders;
