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
                    image={product.primaryImageUrl || "/placeholder.png"}
                    alt={product.name}
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
