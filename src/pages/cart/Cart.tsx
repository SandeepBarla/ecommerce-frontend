import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, upsertCartItem } from "../../api/cart";
import { AuthContext } from "../../context/AuthContext";
import { CartItemResponse } from "../../types/cart/CartResponse";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};
  const navigate = useNavigate();

  // ✅ Wrap fetchCart in useCallback to prevent unnecessary re-creation
  const fetchCart = useCallback(async () => {
    try {
      if (!user?.id) return;
      const cartData = await getCart(user.id);
      setCartItems(cartData.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [user?.id]); // ✅ Dependency: user.id

  useEffect(() => {
    if (token && user?.id) {
      fetchCart();
    }
  }, [token, user?.id, fetchCart]); // ✅ Now fetchCart is correctly included

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    try {
      if (!user?.id) return;
      await upsertCartItem(user.id, productId, newQuantity);
      fetchCart();
      setSuccessMessage(
        newQuantity === 0 ? "Item removed from cart" : "Cart updated!"
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

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
            <ListItem
              key={item.id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={item.product.name}
                secondary={`Quantity: ${item.quantity} | Price: ₹${item.product.price}`}
              />
              <Box>
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleUpdateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  +
                </Button>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleUpdateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  -
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleUpdateQuantity(item.product.id, 0)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </ListItem>
          ))
        )}
      </List>

      {cartItems.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      )}
    </Container>
  );
};

export default Cart;
