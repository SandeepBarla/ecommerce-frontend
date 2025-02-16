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
import { fetchProducts } from "../api/products"; // ✅ Correct import
import { ProductResponse } from "../types/product/ProductResponse";

const Products = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
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
            <Box
              component={Link}
              to={`/products/${product.id}`}
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
                component={Link}
                to={`/products/${product.id}`}
                sx={{
                  maxWidth: 300,
                  height: "100%", // ✅ Ensure all cards have equal height
                  borderRadius: "10px",
                  overflow: "hidden", // Ensures image scaling doesn't overflow
                  display: "flex",
                  flexDirection: "column", // Ensures uniform layout
                  justifyContent: "space-between", // Keeps content aligned
                  textDecoration: "none",
                  backgroundColor: "white",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", // Default shadow
                  "&:hover": {
                    transform: "scale(1.05)", // Slight zoom effect
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", // Enhanced shadow effect
                    cursor: "pointer",
                  },
                }}
              >
                {/* ✅ Image Container with Fixed Height */}
                <Box
                  sx={{
                    height: 300, // ✅ Fix image container height
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden", // Prevents overflow while maintaining aspect ratio
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // ✅ Ensures full image is shown without cropping
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </Box>

                {/* ✅ Card Content - Product Details */}
                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
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
