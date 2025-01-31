import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, upsertCartItem } from "../api/cart"; // ✅ Correct import
import { fetchProducts } from "../api/products"; // ✅ Correct import
import { AuthContext } from "../context/AuthContext";
import { CartResponse } from "../types/cart/CartResponse";
import { ProductResponse } from "../types/product/ProductResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authBanner, setAuthBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {}; // ✅ Handle missing context

  // ✅ Fetch Products and Cart Data
  const fetchProductsAndCart = useCallback(async () => {
    try {
      const productData = await fetchProducts();
      setProducts(productData);
      if (token && user) {
        const cartData = await getCart(user.id);
        setCart(cartData);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchProductsAndCart();
  }, [fetchProductsAndCart]);

  // ✅ Handle Adding to Cart
  const handleAddToCart = async (productId: number) => {
    if (!token || !user) {
      setAuthBanner(true);
      return;
    }

    try {
      await upsertCartItem(user.id, productId, 1);
      const updatedCart = await getCart(user.id);
      setCart(updatedCart);
      setSuccessMessage("Item added to cart!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ✅ Handle Updating Cart Quantity
  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (!user) return;
    try {
      await upsertCartItem(user.id, productId, newQuantity);
      const updatedCart = await getCart(user.id);
      setCart(updatedCart);
      setSuccessMessage(
        newQuantity === 0 ? "Item removed from cart" : "Cart updated!"
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const isInCart = (productId: number) =>
    cart?.cartItems.some((item) => item.product.id === productId) ?? false;
  const getCartItemQuantity = (productId: number) =>
    cart?.cartItems.find((item) => item.product.id === productId)?.quantity ||
    0;

  if (loading) {
    return (
      <Typography textAlign="center" sx={{ marginTop: "20px" }}>
        Loading products...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" sx={{ marginTop: "20px" }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container sx={{ padding: "40px" }}>
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
          onClose={() => setAuthBanner(false)}
          sx={{ marginBottom: "20px" }}
        >
          Please login or register to add items to the cart.
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: "20px" }}>
          {successMessage}
        </Alert>
      )}

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Our Collection
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: "10px" }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{product.price}
                </Typography>

                {/* View Details Button */}
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/products/${product.id}`}
                  sx={{ mt: 1, width: "100%" }}
                >
                  View Details
                </Button>

                {isInCart(product.id) ? (
                  <Box
                    sx={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleUpdateQuantity(
                          product.id,
                          getCartItemQuantity(product.id) + 1
                        )
                      }
                    >
                      +
                    </Button>
                    <Typography sx={{ mx: 2 }}>
                      {getCartItemQuantity(product.id)}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleUpdateQuantity(
                          product.id,
                          getCartItemQuantity(product.id) - 1
                        )
                      }
                    >
                      -
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleAddToCart(product.id)}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
