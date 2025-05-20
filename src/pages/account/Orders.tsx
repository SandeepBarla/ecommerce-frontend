import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  Button,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../../api/orders";
import AccountLayout from "../../components/layout/AccountLayout";
import LoginDialog from "../../components/LoginDialog";
import { AuthContext } from "../../context/AuthContext";
import { OrderResponse } from "../../types/order/OrderResponse";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getUserOrders(user.id);
        setOrders(data);
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (token && user?.id) {
      fetchOrders();
    }
  }, [token, user?.id]);

  if (!token) {
    return (
      <LoginDialog open={true} onClose={() => (window.location.href = "/")} />
    );
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.orderStatus?.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search)
  );

  return (
    <AccountLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 2, p: { xs: 0, sm: 2 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          My Orders
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            placeholder="Search your order here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { bgcolor: "white", borderRadius: 2 },
            }}
            sx={{ mr: 1 }}
          />
          <Button
            startIcon={<FilterListIcon />}
            sx={{ color: "#8B0000", fontWeight: 600, borderRadius: 2 }}
          >
            Filters
          </Button>
        </Box>
        {loading ? (
          <List sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
            {[...Array(4)].map((_, idx) => (
              <ListItem
                key={idx}
                sx={{ borderBottom: "1px solid #eee", py: 2 }}
              >
                <ListItemAvatar>
                  <Skeleton variant="rounded" width={56} height={56} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton width="40%" />}
                  secondary={<Skeleton width="60%" />}
                />
                <Skeleton variant="circular" width={24} height={24} />
              </ListItem>
            ))}
          </List>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
            {filteredOrders.length === 0 ? (
              <Typography sx={{ p: 2 }}>No orders found.</Typography>
            ) : (
              filteredOrders.map((order) => (
                <ListItem
                  key={order.id}
                  alignItems="flex-start"
                  component="button"
                  onClick={() => navigate(`/account/orders/${order.id}`)}
                  sx={{ borderBottom: "1px solid #eee", py: 2 }}
                  secondaryAction={
                    <ChevronRightIcon sx={{ color: "#8B0000" }} />
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "#f5f5f5",
                        color: "#8B0000",
                        fontWeight: 700,
                      }}
                    >
                      {order.orderProducts && order.orderProducts.length > 0 ? (
                        `#${order.orderProducts[0].productId}`
                      ) : (
                        <ChevronRightIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {order.orderStatus === "Delivered" &&
                        order.orderDate ? (
                          <>
                            Delivered on{" "}
                            <span style={{ color: "#222" }}>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: "#888" }}>
                            {order.orderStatus}
                          </span>
                        )}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body1" color="text.primary" noWrap>
                          Order #{order.id} &mdash; {order.orderProducts.length}{" "}
                          item{order.orderProducts.length !== 1 ? "s" : ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: ₹{order.totalAmount}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>
    </AccountLayout>
  );
};

export default Orders;
