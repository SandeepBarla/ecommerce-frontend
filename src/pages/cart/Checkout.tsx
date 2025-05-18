import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart, getCart } from "../../api/cart";
import { placeOrder } from "../../api/orders"; // Import order API
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { CartItemResponse } from "../../types/cart/CartResponse";
import { OrderCreateRequest } from "../../types/order/OrderRequest"; // Import the correct request type

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  const { setLoading: setGlobalLoading } = useLoading();

  const { token, user } = authContext || {}; // Ensure `authContext` is always accessed safely

  // Wrap fetchCart in useCallback (MUST be at the top level)
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      setGlobalLoading(true);
      if (!user?.id) return;
      const response = await getCart(user.id);
      setCartItems(response.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [user?.id, setGlobalLoading]);

  // useEffect must always be called unconditionally
  useEffect(() => {
    if (token && user?.id) {
      fetchCart();
    }
  }, [token, user?.id, fetchCart]);

  // Move the early return *after* hooks
  if (!authContext) {
    return <Typography color="error">Auth context not available</Typography>;
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address.");
      return;
    }

    if (!user?.id) {
      setError("User ID not found.");
      return;
    }

    const orderProducts = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    if (orderProducts.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    if (totalAmount <= 0) {
      setError("Total amount must be greater than 0.");
      return;
    }

    setPlacingOrder(true);
    setGlobalLoading(true);
    try {
      const orderData: OrderCreateRequest = {
        orderProducts, // ✅ Correct key based on backend DTO
        totalAmount,
        shippingAddress: shippingAddress.trim(),
      };
      await placeOrder(user.id, orderData); // Pass userId in API URL, not in request body
      await clearCart(user.id); // Clear the cart for the specific user
      setSuccessMessage("Order placed successfully! Redirecting...");
      setTimeout(() => navigate("/orders"), 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
      setGlobalLoading(false);
    }
  };

  if (!token) {
    return (
      <Container>
        <Alert severity="warning">Please login to proceed to checkout.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ textAlign: "center", mb: 3 }}
      >
        Checkout
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="h6" sx={{ mt: 2 }}>
        Shipping Address:
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter your shipping address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
        margin="normal"
        required
      />

      <Typography variant="h6" sx={{ mt: 3 }}>
        Order Summary:
      </Typography>
      {cartItems.map((item) => (
        <Box
          key={item.id}
          sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
        >
          <Typography>{item.product.name}</Typography>
          <Typography>
            ₹{item.product.price} x {item.quantity}
          </Typography>
        </Box>
      ))}

      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ₹
        {cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )}
      </Typography>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handlePlaceOrder}
        disabled={placingOrder}
      >
        {placingOrder ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Place Order"
        )}
      </Button>
    </Container>
  );
};

export default Checkout;
