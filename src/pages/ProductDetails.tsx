import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
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
import { fetchCategories } from "../api/categories";
import { addFavorite, fetchFavorites, removeFavorite } from "../api/favorites";
import { fetchProductById } from "../api/products";
import { fetchSizes } from "../api/sizes";
import { AuthContext } from "../context/AuthContext";
import { CartResponse } from "../types/cart/CartResponse";
import {
  ProductMediaResponse,
  ProductResponse,
} from "../types/product/ProductResponse";
import { SizeResponse } from "../types/product/SizeResponse";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] =
    useState<ProductMediaResponse | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true); // ✅ Default muted
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizes, setSizes] = useState<SizeResponse[]>([]); // ✅ Store all sizes
  const [category, setCategory] = useState<string>("Unknown Category");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [authBanner, setAuthBanner] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};

  const fetchProductAndCart = useCallback(async () => {
    try {
      if (!id) return;

      const productData = await fetchProductById(Number(id));
      setProduct(productData);

      // ✅ Fetch categories (still selecting first one as we have only one)
      const categories = await fetchCategories();
      setCategory(
        categories.length > 0 ? categories[0].name : "Unknown Category"
      );

      // ✅ Fetch all sizes
      const sizes = await fetchSizes();
      setSizes(sizes); // Store all available sizes

      // ✅ Preselect the first available size (if exists)
      if (sizes.length > 0) {
        setSelectedSize(sizes[0].name);
      }

      // ✅ Set default selected media (First Image/Video)
      if (productData.media.length > 0) {
        setSelectedMedia(productData.media[0]);
      }

      // ✅ Fetch Cart
      if (token && user) {
        // ✅ Fetch user favorites
        const favorites = await fetchFavorites(user.id);
        setIsFavorite(
          favorites.some((fav) => fav.productId === productData.id)
        );
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

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // ✅ Handle Updating Cart Quantity
  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!token || !user) {
      setAuthBanner(true);
      return;
    }

    try {
      await upsertCartItem(user.id, product!.id, newQuantity);
      const updatedCart = await getCart(user.id);
      setCart(updatedCart);
      setSuccessMessage("Cart updated!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!token || !user) {
      setAuthBanner(true);
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(user.id, product!.id);
        setIsFavorite(false);
      } else {
        await addFavorite(user.id, product!.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const isInCart = (productId: number) =>
    cart?.cartItems.some((item) => item.product.id === productId) ?? false;
  const getCartItemQuantity = (productId: number) =>
    cart?.cartItems.find((item) => item.product.id === productId)?.quantity ||
    0;

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
          {/* ✅ Main Media Display (Fixed Size) */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                width: "100%",
                maxWidth: "500px",
                height: "400px", // ✅ Keep media size fixed
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                overflow: "hidden",
                backgroundColor: "#f9f9f9",
              }}
            >
              {selectedMedia?.type === "Video" ? (
                <Box
                  sx={{ position: "relative", width: "100%", height: "100%" }}
                >
                  <video
                    width="100%"
                    height="100%"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    style={{ objectFit: "contain" }} // ✅ No cropping
                  >
                    <source src={selectedMedia.mediaUrl} type="video/mp4" />
                  </video>
                  {/* ✅ Audio Toggle Button */}
                  <IconButton
                    onClick={toggleMute}
                    sx={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      borderRadius: "50%",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                    }}
                  >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </IconButton>
                </Box>
              ) : (
                <img
                  src={selectedMedia?.mediaUrl}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>

            {/* ✅ Thumbnail Previews */}
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
            >
              {product.media.map((media) => (
                <Box
                  key={media.orderIndex}
                  sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    border:
                      selectedMedia?.mediaUrl === media.mediaUrl
                        ? "2px solid #008CBA"
                        : "none",
                  }}
                  onClick={() => setSelectedMedia(media)}
                >
                  {media.type === "Video" ? (
                    <Box sx={{ position: "relative" }}>
                      <video width="100%" height="100%" muted playsInline>
                        <source src={media.mediaUrl} type="video/mp4" />
                      </video>
                      {/* Play Button Overlay */}
                      <PlayCircleIcon
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: 30,
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  ) : (
                    <img
                      src={media.mediaUrl}
                      alt="Thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* ✅ Product Info */}
          <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "gray", mb: 2 }}>
              Category: <b>{category}</b>
            </Typography>
            <Typography variant="h3" sx={{ color: "#8B0000", mb: 2 }}>
              ₹{product.price.toFixed(2)}
            </Typography>

            {/* Select Size */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Select Size
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {sizes.map((size) => (
                <Button
                  key={size.id}
                  variant={
                    selectedSize === size.name ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedSize(size.name)}
                  sx={{
                    minWidth: "50px",
                    color: selectedSize === size.name ? "white" : "black",
                    backgroundColor:
                      selectedSize === size.name ? "#008CBA" : "white",
                  }}
                >
                  {size.name}
                </Button>
              ))}
            </Box>

            {/* Product Description */}
            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            {/* Favorite Toggle Button */}
            <IconButton
              sx={{ border: "1px solid #008CBA", borderRadius: "50%", mr: 2 }}
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <FavoriteIcon sx={{ color: "#E53935" }} /> // Filled heart ❤️
              ) : (
                <FavoriteBorderIcon sx={{ color: "#008CBA" }} /> // Outlined heart 🤍
              )}
            </IconButton>

            {/* Cart Actions */}
            {isInCart(product.id) ? (
              <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleUpdateQuantity(getCartItemQuantity(product.id) - 1)
                  }
                >
                  -
                </Button>
                <Typography sx={{ mx: 2 }}>
                  {getCartItemQuantity(product.id)}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() =>
                    handleUpdateQuantity(getCartItemQuantity(product.id) + 1)
                  }
                >
                  +
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#008CBA", color: "white" }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ProductDetails;
