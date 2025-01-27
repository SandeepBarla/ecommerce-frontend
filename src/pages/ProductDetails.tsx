import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Box, CircularProgress, Alert } from "@mui/material";
import { getProductById, upsertCartItem, getCart, Product, CartItem } from "../api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authBanner, setAuthBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token } = authContext || {};

  useEffect(() => {
    if (!id) return;

    getProductById(Number(id))
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch product details");
        setLoading(false);
      });

    if (token) {
      getCart().then((cartData) => setCartItems(cartData.items));
    }
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!token) {
      setAuthBanner(true);
      return;
    }

    await upsertCartItem(product!.id, 1);
    const cartData = await getCart();
    setCartItems(cartData.items);
    setSuccessMessage("Item added to cart!");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!token) {
      setAuthBanner(true);
      return;
    }

    await upsertCartItem(product!.id, newQuantity);
    const cartData = await getCart();
    setCartItems(cartData.items);
    setSuccessMessage("Cart updated!");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const isInCart = (productId: number) => cartItems.some((item) => item.productId === productId);
  const getCartItemQuantity = (productId: number) => cartItems.find((item) => item.productId === productId)?.quantity || 0;

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (error) return <Typography color="error" textAlign="center">{error}</Typography>;

  return (
    <Container sx={{ padding: "40px", textAlign: "center" }}>
      {authBanner && (
        <Alert severity="warning" action={
          <Box>
            <Button component={Link} to="/login" sx={{ marginRight: "10px" }}>Login</Button>
            <Button component={Link} to="/register" variant="outlined">Register</Button>
          </Box>
        }>
          Please login or register to add items to the cart.
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: "20px" }}>
          {successMessage}
        </Alert>
      )}

      {product && (
        <>
          {/* ✅ Product Image (Restored) */}
          <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100%", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}
            />
          </Box>

          <Typography variant="h3" fontWeight="bold" sx={{ marginTop: "20px" }}>
            {product.name}
          </Typography>
          <Typography variant="h6" sx={{ color: "gray", marginTop: "10px" }}>
            {product.description}
          </Typography>
          <Typography variant="h4" sx={{ color: "#8B0000", marginTop: "15px" }}>
            ₹{product.price}
          </Typography>

          {isInCart(product.id) ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
              <Button variant="outlined" onClick={() => handleUpdateQuantity(getCartItemQuantity(product.id) + 1)}>+</Button>
              <Typography sx={{ mx: 2 }}>{getCartItemQuantity(product.id)}</Typography>
              <Button
                variant="outlined"
                onClick={() => handleUpdateQuantity(getCartItemQuantity(product.id) - 1)}
              >
                -
              </Button>
            </Box>
          ) : (
            <Button variant="contained" sx={{ marginTop: "10px", backgroundColor: "#007bff" }} onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductDetails;
