import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import { getCart, placeOrder, clearCart, CartItem } from "../api";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return <Typography color="error">Auth context not available</Typography>;
  }

  const { token } = authContext;

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address.");
      return;
    }

    const productsArray = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    if (productsArray.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    if (totalAmount <= 0) {
      setError("Total amount must be greater than 0.");
      return;
    }

    const orderData = {
      products: JSON.stringify(productsArray),
      totalAmount,
      shippingAddress: shippingAddress.trim(),
    };

    try {
      await placeOrder(orderData);
      await clearCart();  // ✅ Clear the cart after placing the order
      setSuccessMessage("Order placed successfully! Redirecting...");
      setTimeout(() => navigate("/orders"), 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
    }
  };

  if (!token) {
    return (
      <Container>
        <Alert severity="warning">Please login to proceed to checkout.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 3 }}>
        Checkout
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Typography variant="h6" sx={{ mt: 2 }}>Shipping Address:</Typography>
      <TextField
        fullWidth
        placeholder="Enter your shipping address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
        margin="normal"
        required
      />

      <Typography variant="h6" sx={{ mt: 3 }}>Order Summary:</Typography>
      {cartItems.map((item) => (
        <Box key={item.productId} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>{item.productName}</Typography>
          <Typography>₹{item.price} x {item.quantity}</Typography>
        </Box>
      ))}

      <Typography variant="h6" sx={{ mt: 2 }}>Total: ₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</Typography>

      <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handlePlaceOrder}>
        Place Order
      </Button>
    </Container>
  );
};

export default Checkout;
