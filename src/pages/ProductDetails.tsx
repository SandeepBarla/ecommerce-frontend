import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCart, upsertCartItem } from "../api/cart";
import { fetchProductById } from "../api/products";
import { AuthContext } from "../context/AuthContext";
import { CartResponse } from "../types/cart/CartResponse";
import { ProductResponse } from "../types/product/ProductResponse";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [authBanner, setAuthBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};

  // ✅ Cloudinary Video URL
  const cloudinaryVideoUrl =
    "https://res.cloudinary.com/dkwnjlpaz/video/upload/v1739731017/Video-903_roc81c.mp4";

  const fetchProductAndCart = useCallback(async () => {
    if (!id) return;
    try {
      const productData = await fetchProductById(Number(id));
      setProduct(productData);
      if (token && user) {
        const cartData = await getCart(user.id);
        setCart(cartData);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, token, user]);

  useEffect(() => {
    fetchProductAndCart();
  }, [fetchProductAndCart]);

  const handleAddToCart = async () => {
    if (!token || !user) {
      setAuthBanner(true);
      return;
    }
    try {
      await upsertCartItem(user.id, product!.id, 1);
      const updatedCart = await getCart(user.id);
      setCart(updatedCart);
      setSuccessMessage("Item added to cart!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );

  return (
    <Container sx={{ padding: "40px", textAlign: "center" }}>
      {authBanner && (
        <Alert
          severity="warning"
          action={
            <Box>
              <Button component={Link} to="/login" sx={{ marginRight: "10px" }}>
                Login
              </Button>
              <Button component={Link} to="/register" variant="outlined">
                Register
              </Button>
            </Box>
          }
        >
          Please login or register to add items to the cart.
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: "20px" }}>
          {successMessage}
        </Alert>
      )}

      {product && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* ✅ Display Video Only (POC) */}
            <Box sx={{ textAlign: "center" }}>
              <video
                width="100%"
                height="auto"
                autoPlay
                muted
                loop
                playsInline
                controls
                style={{
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  maxWidth: "500px",
                }}
              >
                <source src={cloudinaryVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="h3" sx={{ color: "#8B0000", mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Select Size
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "contained" : "outlined"}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: "50px",
                    color: selectedSize === size ? "white" : "black",
                    backgroundColor:
                      selectedSize === size ? "#008CBA" : "white",
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            {/* Add to Favorites */}
            <IconButton
              sx={{ border: "1px solid #008CBA", borderRadius: "50%", mr: 2 }}
            >
              <FavoriteBorderIcon sx={{ color: "#008CBA" }} />
            </IconButton>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              sx={{ backgroundColor: "#008CBA", color: "white" }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ProductDetails;
