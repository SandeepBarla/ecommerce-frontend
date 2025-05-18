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
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/products";
import { ProductListResponse } from "../types/product/ProductListResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
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
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={6} sm={4} md={3}>
            <Box
              component={Link}
              to={`/products/${product.id}`}
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
                    {product.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#222", fontSize: "1.08rem" }}
                    >
                      ₹{product.price.toFixed(2)}
                    </Typography>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "#888",
                          ml: 0.5,
                          fontSize: "0.98rem",
                        }}
                      >
                        ₹{product.oldPrice.toFixed(2)}
                      </Typography>
                    )}
                    {product.oldPrice && product.oldPrice > product.price && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#E57300",
                          fontWeight: 600,
                          ml: 0.5,
                          fontSize: "0.98rem",
                        }}
                      >
                        (
                        {Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100
                        )}
                        % OFF)
                      </Typography>
                    )}
                    <Box sx={{ flex: 1 }} />
                    <FavoriteBorderIcon
                      className="product-fav-icon"
                      sx={{ color: "#888", fontSize: 22, ml: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
