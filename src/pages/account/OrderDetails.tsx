import {
  Alert,
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/orders";
import AccountLayout from "../../components/layout/AccountLayout";
import LoginDialog from "../../components/LoginDialog";
import { AuthContext } from "../../context/AuthContext";
import { OrderResponse } from "../../types/order/OrderResponse";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user?.id || !orderId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderById(user.id, Number(orderId));
        setOrder(data);
      } catch {
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (token && user?.id && orderId) {
      fetchOrder();
    }
  }, [token, user?.id, orderId]);

  if (!token) {
    return (
      <LoginDialog open={true} onClose={() => (window.location.href = "/")} />
    );
  }

  return (
    <AccountLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 2, p: { xs: 0, sm: 2 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Order Details
        </Typography>
        {loading ? (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Skeleton width="30%" height={32} sx={{ mb: 2 }} />
            <Skeleton width="20%" height={28} sx={{ mb: 1 }} />
            <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton width="30%" height={20} sx={{ mb: 2 }} />
            <Divider sx={{ my: 2 }} />
            <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
            {[...Array(2)].map((_, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Skeleton width="60%" height={24} />
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
            <Skeleton width="80%" height={20} />
          </Paper>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : order ? (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Order ID - {order.id}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Status: {order.orderStatus}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Placed on: {new Date(order.orderDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total Amount: ₹{order.totalAmount}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Products in this order
            </Typography>
            <List>
              {order.orderProducts.map((prod) => (
                <ListItem key={prod.productId}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "#f5f5f5",
                        color: "#8B0000",
                        fontWeight: 700,
                      }}
                    >
                      #{prod.productId}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Product ID: ${prod.productId}`}
                    secondary={`Quantity: ${prod.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Shipping Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress}
            </Typography>
            {/* Placeholder for status timeline, issues, invoice, etc. */}
          </Paper>
        ) : null}
      </Box>
    </AccountLayout>
  );
};

export default OrderDetails;
