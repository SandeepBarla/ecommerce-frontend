import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFavorite, fetchFavorites, removeFavorite } from "../api/favorites";
import { fetchProducts } from "../api/products";
import { AuthContext } from "../context/AuthContext";
import { ProductListResponse } from "../types/product/ProductListResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const [favorites, setFavorites] = useState<number[]>([]); // productIds
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(!!user);
  const [favoriteAnimating, setFavoriteAnimating] = useState<{
    [id: number]: boolean;
  }>({});
  const [favoriteLoading, setFavoriteLoading] = useState<{
    [id: number]: boolean;
  }>({});
  const [authAlert, setAuthAlert] = useState(false);

  // ✅ Fetch Products
  const fetchProductsData = useCallback(async () => {
    try {
      const productData = await fetchProducts();
      setProducts(productData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setFavoritesLoading(false);
        return;
      }
      setFavoritesLoading(true);
      try {
        const favs = await fetchFavorites(user.id);
        setFavorites(favs.map((f) => f.productId));
      } catch {
        /* ignore */
      }
      setFavoritesLoading(false);
    };
    fetchUserFavorites();
  }, [user]);

  const handleToggleFavorite = async (productId: number) => {
    if (!user || !token) {
      setAuthAlert(true);
      setTimeout(() => setAuthAlert(false), 2000);
      return;
    }
    setFavoriteLoading((fl) => ({ ...fl, [productId]: true }));
    setFavoriteAnimating((fa) => ({ ...fa, [productId]: true }));
    setTimeout(
      () => setFavoriteAnimating((fa) => ({ ...fa, [productId]: false })),
      400
    );
    try {
      if (favorites.includes(productId)) {
        await removeFavorite(user.id, productId);
        setFavorites((favs) => favs.filter((id) => id !== productId));
      } else {
        await addFavorite(user.id, productId);
        setFavorites((favs) => [...favs, productId]);
      }
    } catch {
      /* ignore */
    }
    setFavoriteLoading((fl) => ({ ...fl, [productId]: false }));
  };

  if (loading || favoritesLoading) {
    return (
      <Container sx={{ px: { xs: 1, md: 5 }, pt: 3, pb: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
          Our Collection
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item key={index} xs={6} sm={4} md={3}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: "14px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  p: 0,
                }}
              >
                {/* 🖼 Image Skeleton */}
                <Box
                  className="skeleton"
                  sx={{
                    aspectRatio: "4/5",
                    width: "100%",
                    borderRadius: "14px 14px 0 0",
                  }}
                />
                {/* 📝 Text Skeletons */}
                <CardContent sx={{ py: 1.5, px: 1.5 }}>
                  <Box
                    className="skeleton"
                    sx={{ width: "70%", height: 18, mb: 1, borderRadius: 1 }}
                  />
                  <Box
                    className="skeleton"
                    sx={{ width: "40%", height: 16, borderRadius: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
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
    <Container sx={{ px: { xs: 1, md: 5 }, pt: 3, pb: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Our Collection
      </Typography>
      {authAlert && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please login to add products to your favorites.
        </Alert>
      )}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={6} sm={4} md={3}>
            <Card
              sx={{
                width: "100%",
                borderRadius: "14px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                p: 0,
              }}
            >
              {/* Product Image (clickable) */}
              <Box
                component={Link}
                to={`/products/${product.id}`}
                sx={{
                  width: "100%",
                  aspectRatio: "4/5",
                  overflow: "hidden",
                  background: "#f7f7f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 0.2s cubic-bezier(.36,2,.57,.5)",
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={product.primaryImageUrl || "/placeholder.png"}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                />
              </Box>
              {/* Card Content - Product Details */}
              <CardContent sx={{ py: 1.5, px: 1.5, position: "relative" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "1.05rem",
                    mb: 0.5,
                  }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {product.name}
                  </Link>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "#222", fontSize: "1.08rem" }}
                  >
                    ₹{product.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <IconButton
                    className={
                      favoriteAnimating[product.id] ? "product-fav-btn" : ""
                    }
                    onClick={() => handleToggleFavorite(product.id)}
                    disabled={favoriteLoading[product.id]}
                    sx={{
                      border: favorites.includes(product.id)
                        ? "2px solid #E53935"
                        : "2px solid #008CBA",
                      borderRadius: "50px",
                      width: 38,
                      height: 38,
                      boxShadow: favorites.includes(product.id)
                        ? "0 0 8px #E53935"
                        : "0 1px 4px #008CBA22",
                      backgroundColor: favoriteAnimating[product.id]
                        ? "rgba(229,57,53,0.1)"
                        : "white",
                      transition:
                        "transform 0.3s cubic-bezier(.36,2,.57,.5), box-shadow 0.3s, border 0.3s",
                      transform: favoriteAnimating[product.id]
                        ? "scale(1.15)"
                        : "scale(1)",
                      "&:hover": {
                        backgroundColor: "#fbe9e7",
                        borderColor: "#E53935",
                      },
                    }}
                    aria-label={
                      favorites.includes(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {favorites.includes(product.id) ? (
                      <FavoriteIcon
                        sx={{
                          color: "#E53935",
                          fontSize: 22,
                          transition: "color 0.3s",
                        }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{
                          color: "#008CBA",
                          fontSize: 22,
                          transition: "color 0.3s",
                        }}
                      />
                    )}
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
