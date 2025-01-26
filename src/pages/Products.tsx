import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { getProducts, Product } from "../api";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography textAlign="center" sx={{ marginTop: "20px" }}>Loading products...</Typography>;
  }

  if (error) {
    return <Typography color="error" textAlign="center" sx={{ marginTop: "20px" }}>{error}</Typography>;
  }

  return (
    <Container sx={{ padding: "40px" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Our Collection
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: "10px" }}>
              <CardMedia component="img" height="200" image={product.imageUrl} alt={product.name} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Typography variant="h6" color="primary">₹{product.price}</Typography>
                <Button
                  component={Link}
                  to={`/products/${product.id}`} // ✅ Navigates to product details
                  variant="contained"
                  sx={{ marginTop: "10px", backgroundColor: "#8B0000" }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;