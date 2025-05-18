import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, removeFavorite } from "../../api/favorites";
import { AuthContext } from "../../context/AuthContext";
import { FavoriteResponse } from "../../types/favorites/FavoriteResponse";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserFavorites = async () => {
      try {
        const data = await fetchFavorites(user.id);
        setFavorites(data);
      } catch {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserFavorites();
  }, [user]);

  const handleUnmarkFavorite = async (productId: number) => {
    if (!user) return;
    setRemovingId(productId);
    setTimeout(async () => {
      try {
        await removeFavorite(user.id, productId);
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.productId !== productId)
        );
      } catch (error) {
        console.error("Error removing favorite:", error);
      } finally {
        setRemovingId(null);
      }
    }, 350); // Animation duration
  };

  if (loading) {
    return (
      <Container sx={{ px: { xs: 1, md: 5 }, pt: 3, pb: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
          My Favorites ❤️
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
                {/* Image Skeleton */}
                <Box
                  className="skeleton"
                  sx={{
                    aspectRatio: "4/5",
                    width: "100%",
                    borderRadius: "14px 14px 0 0",
                  }}
                />
                {/* Text Skeletons */}
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

  if (error)
    return (
      <Typography color="error" textAlign="center" sx={{ marginTop: "20px" }}>
        {error}
      </Typography>
    );

  return (
    <Container sx={{ px: { xs: 1, md: 5 }, pt: 3, pb: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        My Favorites ❤️
      </Typography>
      {favorites.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            padding: "50px",
            color: "gray",
            fontSize: "18px",
          }}
        >
          <Typography variant="h5">Oops! No favorites yet. 😢</Typography>
          <Typography variant="body1" sx={{ marginTop: "10px" }}>
            Start exploring and add your favorite products! 🎉
          </Typography>
          <Box sx={{ marginTop: "20px" }}>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Browse Products →
              </Typography>
            </Link>
          </Box>
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="stretch"
        >
          {favorites.map((fav) => (
            <Grid item key={fav.productId} xs={6} sm={4} md={3}>
              <Box
                component={Link}
                to={`/products/${fav.productId}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 0.2s cubic-bezier(.36,2,.57,.5)",
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <Card
                  className={
                    removingId === fav.productId ? "removing-favorite-card" : ""
                  }
                  sx={{
                    width: "100%",
                    borderRadius: "14px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    p: 0,
                    transition: "opacity 0.35s, transform 0.35s",
                  }}
                >
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "4/5",
                      overflow: "hidden",
                      background: "#f7f7f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={fav.primaryImageUrl || "/placeholder.png"}
                      alt={fav.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                    />
                    {/* Unmark Favorite Button */}
                    <IconButton
                      className={
                        removingId === fav.productId
                          ? "removing-favorite-heart"
                          : ""
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnmarkFavorite(fav.productId);
                      }}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(255,255,255,0.9)",
                        boxShadow: "0 1px 4px #E5393522",
                        borderRadius: "50%",
                        zIndex: 2,
                        "&:hover": {
                          backgroundColor: "#ffeaea",
                        },
                      }}
                    >
                      <FavoriteIcon sx={{ color: "#E53935", fontSize: 22 }} />
                    </IconButton>
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
                      {fav.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: "#222", fontSize: "1.08rem" }}
                      >
                        ₹{fav.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;
