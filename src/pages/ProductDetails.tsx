import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getCart, upsertCartItem } from "../api/cart";
import { fetchCategories } from "../api/categories";
import { addFavorite, fetchFavorites, removeFavorite } from "../api/favorites";
import { fetchProductById } from "../api/products";
import { fetchSizes } from "../api/sizes";
import LoginDialog from "../components/LoginDialog";
import { AuthContext } from "../context/AuthContext";
import { CartResponse } from "../types/cart/CartResponse";
import {
  ProductMediaResponse,
  ProductResponse,
} from "../types/product/ProductResponse";
import { SizeResponse } from "../types/product/SizeResponse";

// Add spinner CSS for cart button loading
const spinnerStyle = `
.cart-btn-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2.5px solid #ccc;
  border-top: 2.5px solid #008CBA;
  border-radius: 50%;
  animation: cart-btn-spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes cart-btn-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

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
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { token, user, userLoading } = authContext || {};
  const [cartButtonLoading, setCartButtonLoading] = useState<
    "add" | "plus" | "minus" | null
  >(null);
  const [favoriteAnimating, setFavoriteAnimating] = useState<boolean>(false);
  const favoriteIconRef = useRef<HTMLButtonElement | null>(null);

  const fetchProductAndCart = useCallback(async () => {
    try {
      if (!id) return;
      const productData = await fetchProductById(Number(id));
      // Fetch categories, sizes, and set product state
      const [categories, sizes] = await Promise.all([
        fetchCategories(),
        fetchSizes(),
      ]);
      setProduct(productData);
      setCategory(
        categories.length > 0 ? categories[0].name : "Unknown Category"
      );
      setSizes(sizes);
      if (sizes.length > 0) setSelectedSize(sizes[0].name);
      if (productData.media.length > 0) setSelectedMedia(productData.media[0]);
      // Fetch cart and favorites if logged in
      if (token && user) {
        const [favorites, cartData] = await Promise.all([
          fetchFavorites(user.id),
          getCart(user.id),
        ]);
        setIsFavorite(
          favorites.some((fav) => fav.productId === productData.id)
        );
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
    if (!userLoading) {
      fetchProductAndCart();
    }
  }, [fetchProductAndCart, userLoading]);

  const handleAddToCart = async () => {
    if (!token || !user) {
      setLoginDialogOpen(true);
      return;
    }
    setCartButtonLoading("add");
    try {
      await upsertCartItem(user.id, product!.id, 1);
      const updatedCart = await getCart(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartButtonLoading(null);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // ✅ Handle Updating Cart Quantity
  const handleUpdateQuantity = async (
    newQuantity: number,
    type: "plus" | "minus"
  ) => {
    if (!token || !user) {
      setLoginDialogOpen(true);
      return;
    }
    setCartButtonLoading(type);
    try {
      await upsertCartItem(user.id, product!.id, newQuantity);
      const updatedCart = await getCart(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setCartButtonLoading(null);
    }
  };

  const toggleFavorite = async () => {
    if (!token || !user) {
      setLoginDialogOpen(true);
      return;
    }
    setFavoriteAnimating(true);
    setTimeout(() => setFavoriteAnimating(false), 400); // Animation duration
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

  if (userLoading || loading) {
    // Skeleton for product details
    return (
      <Container sx={{ padding: "40px", textAlign: "center" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "100%",
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                borderRadius: "10px",
                mb: 2,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: "10px" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={25} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ borderRadius: "8px", mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="60%"
              height={50}
              sx={{ borderRadius: "8px", mb: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );

  return (
    <>
      <style>{spinnerStyle}</style>
      <Container sx={{ padding: "40px", textAlign: "center" }}>
        <LoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
        />

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
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
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
              {/* Product Description */}
              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              <Typography variant="h4" sx={{ color: "#8B0000", mb: 2 }}>
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

              {/* Favorite Toggle Button and Cart Actions */}
              <Box sx={{ display: "flex", gap: 2, mt: 3, width: "100%" }}>
                {/* Wishlist Button */}
                <IconButton
                  ref={favoriteIconRef}
                  className="product-fav-btn"
                  sx={{
                    border: isFavorite
                      ? "2px solid #E53935"
                      : "2px solid #008CBA",
                    borderRadius: "50px",
                    width: 48,
                    height: 48,
                    boxShadow: isFavorite
                      ? "0 0 8px #E53935"
                      : "0 1px 4px #008CBA22",
                    backgroundColor: favoriteAnimating
                      ? "rgba(229,57,53,0.1)"
                      : "white",
                    transition:
                      "transform 0.3s cubic-bezier(.36,2,.57,.5), box-shadow 0.3s, border 0.3s",
                    transform: favoriteAnimating ? "scale(1.15)" : "scale(1)",
                    "&:hover": {
                      backgroundColor: "#fbe9e7",
                      borderColor: "#E53935",
                    },
                  }}
                  onClick={toggleFavorite}
                  aria-label={
                    isFavorite ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {isFavorite ? (
                    <FavoriteIcon
                      sx={{
                        color: "#E53935",
                        fontSize: 28,
                        transition: "color 0.3s",
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{
                        color: "#008CBA",
                        fontSize: 28,
                        transition: "color 0.3s",
                      }}
                    />
                  )}
                </IconButton>

                {/* Add to Cart or Stepper */}
                <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                  {isInCart(product.id) ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          minWidth: 44,
                          height: 44,
                          borderRadius: "50%",
                          fontSize: 22,
                          fontWeight: "bold",
                          borderColor: "#008CBA",
                          color: "#008CBA",
                          background: "white",
                          "&:hover": { background: "#f0f8ff" },
                        }}
                        onClick={() =>
                          handleUpdateQuantity(
                            getCartItemQuantity(product.id) - 1,
                            "minus"
                          )
                        }
                        disabled={cartButtonLoading === "minus"}
                        aria-label="Decrease quantity"
                      >
                        {cartButtonLoading === "minus" ? (
                          <span className="cart-btn-spinner" />
                        ) : (
                          "-"
                        )}
                      </Button>
                      <Typography
                        sx={{
                          mx: 2,
                          fontWeight: "bold",
                          fontSize: 20,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {getCartItemQuantity(product.id)}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          minWidth: 44,
                          height: 44,
                          borderRadius: "50%",
                          fontSize: 22,
                          fontWeight: "bold",
                          borderColor: "#008CBA",
                          color: "#008CBA",
                          background: "white",
                          "&:hover": { background: "#f0f8ff" },
                        }}
                        onClick={() =>
                          handleUpdateQuantity(
                            getCartItemQuantity(product.id) + 1,
                            "plus"
                          )
                        }
                        disabled={cartButtonLoading === "plus"}
                        aria-label="Increase quantity"
                      >
                        {cartButtonLoading === "plus" ? (
                          <span className="cart-btn-spinner" />
                        ) : (
                          "+"
                        )}
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      className="product-add-to-cart-btn"
                      sx={{
                        width: "100%",
                        height: 48,
                        borderRadius: "50px",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        background:
                          "linear-gradient(90deg, #008CBA 60%, #00b894 100%)",
                        color: "white",
                        boxShadow: "0 2px 8px #008CBA22",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #00b894 60%, #008CBA 100%)",
                          boxShadow: "0 4px 16px #008CBA33",
                        },
                      }}
                      onClick={handleAddToCart}
                      disabled={cartButtonLoading === "add"}
                      aria-label="Add to cart"
                    >
                      {cartButtonLoading === "add" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default ProductDetails;
