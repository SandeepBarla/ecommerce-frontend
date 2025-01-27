import { useEffect, useState, useContext } from "react";
import { getCart, upsertCartItem, CartItem } from "../api";
import { AuthContext } from "../context/AuthContext";
import { Container, Typography, Button, List, ListItem, ListItemText, Box, IconButton, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token } = authContext || {}; // Handle missing context

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

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    try {
      await upsertCartItem(productId, newQuantity);
      fetchCart();
      setSuccessMessage(newQuantity === 0 ? "Item removed from cart" : "Cart updated!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (!token) {
    return (
      <Container>
        <Alert severity="warning" action={
          <Box>
            <Button component={Link} to="/login" sx={{ marginRight: "10px" }}>Login</Button>
            <Button component={Link} to="/register" variant="outlined">Register</Button>
          </Box>
        }>
          Please login or register to access your cart.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Shopping Cart
      </Typography>
      <List>
        {cartItems.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          cartItems.map((item) => (
            <ListItem key={item.productId} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText primary={item.productName} secondary={`Quantity: ${item.quantity} | Price: ₹${item.price}`} />
              <Box>
                <Button variant="outlined" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</Button>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <Button variant="outlined" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</Button>
                <IconButton color="error" onClick={() => handleUpdateQuantity(item.productId, 0)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default Cart;
