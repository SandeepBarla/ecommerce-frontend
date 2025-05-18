import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { getCart, upsertCartItem } from "../../api/cart";
import { AuthContext } from "../../context/AuthContext";
import { CartResponse } from "../../types/cart/CartResponse";

const Cart = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (token && user?.id) {
      fetchCart();
    }
  }, [token, user?.id]);

  const fetchCart = async () => {
    setSkeletonLoading(true);
    try {
      const response = await getCart(user!.id);
      setCart(response);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setSkeletonLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 0) return;
    setUpdatingItemId(productId);
    try {
      await upsertCartItem(user!.id, productId, quantity);
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.cartItems
          .map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        return { ...prevCart, cartItems: updatedItems, totalPrice };
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (!token) {
    return (
      <Container>
        <Alert severity="warning">Please login to access your cart.</Alert>
      </Container>
    );
  }

  if (skeletonLoading) {
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
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Box
                          className="skeleton"
                          sx={{ width: 60, height: 60, borderRadius: "5px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          className="skeleton"
                          sx={{ width: 120, height: 20, borderRadius: "4px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          className="skeleton"
                          sx={{ width: 60, height: 20, borderRadius: "4px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          className="skeleton"
                          sx={{ width: 80, height: 30, borderRadius: "4px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          className="skeleton"
                          sx={{ width: 60, height: 20, borderRadius: "4px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          className="skeleton"
                          sx={{ width: 40, height: 30, borderRadius: "4px" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Box
                className="skeleton"
                sx={{ width: "80%", height: 30, mb: 2, borderRadius: "6px" }}
              />
              <Box
                className="skeleton"
                sx={{ width: "60%", height: 20, mb: 1, borderRadius: "4px" }}
              />
              <Box
                className="skeleton"
                sx={{ width: "60%", height: 20, mb: 1, borderRadius: "4px" }}
              />
              <Box
                className="skeleton"
                sx={{ width: "100%", height: 40, mt: 3, borderRadius: "8px" }}
              />
            </Paper>
          </Grid>
        </Grid>
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
                          src={item.product.primaryImageUrl} // ✅ Use primary image
                          alt={item.product.name}
                          width="60"
                          height="60"
                          style={{ borderRadius: "5px", objectFit: "contain" }}
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
                          disabled={updatingItemId === item.product.id}
                        >
                          {updatingItemId === item.product.id ? (
                            <CircularProgress size={18} />
                          ) : (
                            "-"
                          )}
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
                          disabled={updatingItemId === item.product.id}
                        >
                          {updatingItemId === item.product.id ? (
                            <CircularProgress size={18} />
                          ) : (
                            "+"
                          )}
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
                          disabled={updatingItemId === item.product.id}
                        >
                          {updatingItemId === item.product.id ? (
                            <CircularProgress size={18} />
                          ) : (
                            "❌"
                          )}
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
        // 🎨 Creative Empty Cart Message
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "gray" }} />
          <Typography variant="h5" sx={{ mt: 2, color: "gray" }}>
            Oops! Your cart is empty. 😢
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: "gray" }}>
            Looks like you haven't added anything yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/products")}
          >
            Start Shopping 🛍️
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Cart;
