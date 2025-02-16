import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart, getCart, upsertCartItem } from "../../api/cart"; // ✅ Updated import path
import { AuthContext } from "../../context/AuthContext"; // ✅ Updated import path
import { CartResponse } from "../../types/cart/CartResponse"; // ✅ Updated import path

const Cart = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");

  useEffect(() => {
    if (token && user?.id) {
      fetchCart();
    }
  }, [token, user?.id]);

  const fetchCart = async () => {
    try {
      const response = await getCart(user!.id);
      setCart(response);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      await upsertCartItem(user!.id, productId, quantity);
      fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(user!.id);
      setCart(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (!token) {
    return (
      <Container>
        <Alert severity="warning">Please login to access your cart.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Your Shopping Cart
      </Typography>

      {cart && cart.cartItems.length > 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Image</b>
                    </TableCell>
                    <TableCell>
                      <b>Product</b>
                    </TableCell>
                    <TableCell>
                      <b>Price</b>
                    </TableCell>
                    <TableCell>
                      <b>Quantity</b>
                    </TableCell>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell>
                      <b>Remove</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width="50"
                          height="50"
                          style={{ borderRadius: "5px" }}
                        />
                      </TableCell>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>₹{item.product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <Typography sx={{ mx: 2, display: "inline" }}>
                          {item.quantity}
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </Button>
                      </TableCell>
                      <TableCell>
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, 0)
                          }
                        >
                          ❌
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button variant="contained" color="secondary" onClick={fetchCart}>
                Update Cart
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Cart Totals
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Typography>Subtotal:</Typography>
                <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography>
                  <b>Total:</b>
                </Typography>
                <Typography>
                  <b>₹{cart.totalPrice.toFixed(2)}</b>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Coupon
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "gray" }}>
                Enter your coupon code if you have one.
              </Typography>
              <Box sx={{ display: "flex", mt: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="contained" color="primary" sx={{ ml: 2 }}>
                  Apply Coupon
                </Button>
              </Box>

              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="info" sx={{ textAlign: "center", mt: 5 }}>
          Your cart is empty. Start shopping now!
        </Alert>
      )}
    </Container>
  );
};

export default Cart;
