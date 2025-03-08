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

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};

  useEffect(() => {
    if (!user) return;
    const fetchUserFavorites = async () => {
      try {
        const data = await fetchFavorites(user.id);
        setFavorites(data);
      } catch (err) {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserFavorites();
  }, [user]);

  const handleUnmarkFavorite = async (productId: number) => {
    if (!user) return;
    try {
      await removeFavorite(user.id, productId);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading)
    return (
      <Typography textAlign="center" sx={{ marginTop: "20px" }}>
        Loading favorites...
      </Typography>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" sx={{ marginTop: "20px" }}>
        {error}
      </Typography>
    );

  return (
    <Container sx={{ padding: "40px" }}>
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
        <Grid container spacing={4}>
          {favorites.map((fav) => (
            <Grid item key={fav.productId} xs={12} sm={6} md={4} lg={3}>
              <Box
                component={Link}
                to={`/products/${fav.productId}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Card
                  sx={{
                    maxWidth: 300,
                    height: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    backgroundColor: "white",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {/* ✅ Primary Image */}
                  <Box
                    sx={{
                      position: "relative",
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={fav.primaryImageUrl || "/placeholder.png"}
                      alt={fav.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    {/* ✅ Unmark Favorite Button */}
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnmarkFavorite(fav.productId);
                      }}
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <FavoriteIcon sx={{ color: "#E53935" }} /> {/* ❤️ */}
                    </IconButton>
                  </Box>

                  {/* ✅ Card Content - Product Details */}
                  <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {fav.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${fav.price.toFixed(2)}
                    </Typography>
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
