import { useEffect, useState, useContext } from "react";
import { Container, Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import { getUserOrders } from "../api";
import { AuthContext } from "../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Typography color="error">Auth context not available</Typography>;
  }

  const { token } = authContext;

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await getUserOrders();
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  if (!token) {
    return (
      <Container>
        <Typography>Please login to view your orders.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Your Orders
      </Typography>
      <List>
        {orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          orders.map((order) => (
            <ListItem key={order.id} sx={{ borderBottom: "1px solid #ddd", py: 2 }}>
              <ListItemText
                primary={`Order #${order.id} - ₹${order.totalAmount}`}
                secondary={
                  <Box>
                    <Typography>Status: {order.orderStatus}</Typography>
                    <Typography>Placed on: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                    <Typography>Shipping Address: {order.shippingAddress}</Typography>
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
