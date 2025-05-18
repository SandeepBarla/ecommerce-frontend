import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, upsertCartItem } from "../../api/cart";
import { AuthContext } from "../../context/AuthContext";
import { CartResponse } from "../../types/cart/CartResponse";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(true);
  const [updatingItem, setUpdatingItem] = useState<{
    id: number;
    type: "plus" | "minus" | "delete";
  } | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);

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

  const handleUpdateQuantity = async (
    productId: number,
    quantity: number,
    type: "plus" | "minus" | "delete"
  ) => {
    if (quantity < 0) return;
    setUpdatingItem({ id: productId, type });
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
      setUpdatingItem(null);
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
    const isMobile = window.innerWidth <= 600;
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
        {isMobile ? (
          <Box sx={{ maxWidth: 480, mx: "auto", pb: 8 }}>
            {/* Card skeletons for cart items */}
            {Array.from({ length: 2 }).map((_, idx) => (
              <Paper
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                  p: 2,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  gap: 2,
                  minHeight: 100,
                }}
              >
                <Box
                  className="skeleton"
                  sx={{ width: 80, height: 80, borderRadius: 2, mr: 2 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    className="skeleton"
                    sx={{ width: "70%", height: 20, borderRadius: 2, mb: 1 }}
                  />
                  <Box
                    className="skeleton"
                    sx={{ width: "40%", height: 16, borderRadius: 2, mb: 1 }}
                  />
                  <Box
                    className="skeleton"
                    sx={{ width: 100, height: 32, borderRadius: 2 }}
                  />
                </Box>
              </Paper>
            ))}
            {/* Skeleton for price details and coupon */}
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Box
                className="skeleton"
                sx={{ width: "60%", height: 24, mb: 2, borderRadius: 2 }}
              />
              <Box
                className="skeleton"
                sx={{ width: "40%", height: 18, mb: 1, borderRadius: 2 }}
              />
              <Box
                className="skeleton"
                sx={{ width: "40%", height: 18, mb: 1, borderRadius: 2 }}
              />
              <Box
                className="skeleton"
                sx={{ width: "100%", height: 40, mt: 3, borderRadius: 2 }}
              />
            </Paper>
            {/* Sticky footer skeleton for mobile */}
            <Box
              sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                maxWidth: 480,
                mx: "auto",
                zIndex: 1000,
                display: "flex",
                bgcolor: "background.paper",
                boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
                p: 2,
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box
                className="skeleton"
                sx={{ width: 100, height: 28, borderRadius: 2 }}
              />
              <Box
                className="skeleton"
                sx={{ width: 120, height: 40, borderRadius: 2 }}
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            {/* Left: Cart item skeletons */}
            <Box sx={{ flex: 2 }}>
              {Array.from({ length: 2 }).map((_, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    gap: 2,
                    minHeight: 100,
                  }}
                >
                  <Box
                    className="skeleton"
                    sx={{ width: 80, height: 80, borderRadius: 2, mr: 2 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      className="skeleton"
                      sx={{ width: "70%", height: 20, borderRadius: 2, mb: 1 }}
                    />
                    <Box
                      className="skeleton"
                      sx={{ width: "40%", height: 16, borderRadius: 2, mb: 1 }}
                    />
                    <Box
                      className="skeleton"
                      sx={{ width: 100, height: 32, borderRadius: 2 }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
            {/* Right: Price details skeleton */}
            <Box sx={{ flex: 1, minWidth: 260, maxWidth: 400, width: 360 }}>
              <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                <Box
                  className="skeleton"
                  sx={{ width: "60%", height: 24, mb: 2, borderRadius: 2 }}
                />
                <Box
                  className="skeleton"
                  sx={{ width: "40%", height: 18, mb: 1, borderRadius: 2 }}
                />
                <Box
                  className="skeleton"
                  sx={{ width: "40%", height: 18, mb: 1, borderRadius: 2 }}
                />
                <Box
                  className="skeleton"
                  sx={{ width: "100%", height: 40, mt: 3, borderRadius: 2 }}
                />
              </Paper>
            </Box>
          </Box>
        )}
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
        <Box
          sx={{
            maxWidth: { xs: 480, md: "100%" },
            mx: "auto",
            pb: 8,
            display: { md: "flex" },
            gap: { md: 3 },
            alignItems: "flex-start",
          }}
        >
          {/* Cart Items (left) */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            {cart.cartItems.map((item) => (
              <Paper
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                  p: 2,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  gap: 2,
                }}
              >
                <Link
                  to={`/products/${item.product.id}`}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: "hidden",
                      mr: 2,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.product.primaryImageUrl}
                      alt={item.product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Link>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/products/${item.product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "1.1rem",
                        mb: 0.5,
                      }}
                    >
                      {item.product.name}
                    </Typography>
                  </Link>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    ₹{item.product.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          "minus"
                        )
                      }
                      disabled={
                        updatingItem?.id === item.product.id &&
                        updatingItem?.type === "minus"
                      }
                      sx={{ minWidth: 36, px: 0 }}
                    >
                      {updatingItem?.id === item.product.id &&
                      updatingItem?.type === "minus" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        "-"
                      )}
                    </Button>
                    <Typography
                      sx={{ mx: 1, minWidth: 24, textAlign: "center" }}
                    >
                      {item.quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          "plus"
                        )
                      }
                      disabled={
                        updatingItem?.id === item.product.id &&
                        updatingItem?.type === "plus"
                      }
                      sx={{ minWidth: 36, px: 0 }}
                    >
                      {updatingItem?.id === item.product.id &&
                      updatingItem?.type === "plus" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        "+"
                      )}
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, 0, "delete")
                      }
                      disabled={
                        updatingItem?.id === item.product.id &&
                        updatingItem?.type === "delete"
                      }
                      sx={{ ml: 1 }}
                    >
                      {updatingItem?.id === item.product.id &&
                      updatingItem?.type === "delete" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
          {/* Price Details, Coupon, Checkout (right) */}
          <Box
            sx={{
              flex: 1,
              minWidth: 260,
              maxWidth: 400,
              width: { xs: "100%", md: 360 },
              mx: { xs: "auto", md: 0 },
            }}
          >
            {/* Coupon Collapsible */}
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  px: 0.5,
                }}
                onClick={() => setCouponOpen((open) => !open)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DiscountIcon color="primary" sx={{ mr: 1 }} />
                  <Typography fontWeight="bold">Have a promo code?</Typography>
                </Box>
                <ExpandMoreIcon
                  sx={{
                    transform: couponOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: "#666",
                  }}
                />
              </Box>
              <Collapse in={couponOpen}>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError("");
                    }}
                    style={{
                      flex: 1,
                      border: couponError
                        ? "1.5px solid #d32f2f"
                        : "1.5px solid #ccc",
                      borderRadius: 6,
                      outline: "none",
                      fontSize: 16,
                      background: "transparent",
                      padding: 8,
                      transition: "border 0.2s",
                    }}
                  />
                  {coupon && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCoupon("");
                        setCouponError("");
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      px: 2,
                      minWidth: 70,
                    }}
                    disabled={!coupon}
                    onClick={() => {
                      setCouponError("We couldn't find this promo");
                    }}
                  >
                    Apply
                  </Button>
                </Box>
                {couponError && (
                  <Typography
                    color="error"
                    sx={{
                      mt: 1,
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18, mr: 0.5 }} /> {couponError}
                  </Typography>
                )}
              </Collapse>
            </Paper>
            {/* Price Details */}
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Price Details
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>
                  Subtotal ({cart.cartItems.length} item
                  {cart.cartItems.length > 1 ? "s" : ""})
                </Typography>
                <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>Delivery Charges</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  mb: 1,
                }}
              >
                <Typography fontWeight="bold">Total Amount</Typography>
                <Typography fontWeight="bold">
                  ₹{cart.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                maxWidth: 480,
                mx: { xs: "auto", md: 0 },
                justifyContent: "space-between",
              }}
            >
              <Box className="cart-total-price">
                ₹{cart.totalPrice.toFixed(2)}
              </Box>
              <Button
                variant="contained"
                color="success"
                sx={{
                  py: 1.2,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  borderRadius: 2,
                  minWidth: 140,
                }}
                onClick={() => navigate("/checkout")}
              >
                Place Order
              </Button>
            </Paper>
          </Box>
        </Box>
      ) : (
        // Modern empty cart state
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <img
            src="/empty-cart-illustration.svg"
            alt="Empty Cart"
            style={{ width: 160, marginBottom: 24, opacity: 0.8 }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <Typography
            variant="h5"
            sx={{ mt: 2, color: "gray", fontWeight: "bold" }}
          >
            Oops! Your cart is empty. 😢
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: "gray" }}>
            Looks like you haven't added anything yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderRadius: 2,
              px: 4,
              py: 1.2,
            }}
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
