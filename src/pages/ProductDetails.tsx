import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Box, CircularProgress } from "@mui/material";
import { getProductById, Product } from "../api";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getProductById(Number(id))
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch product details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (error) return <Typography color="error" textAlign="center" sx={{ marginTop: "20px" }}>{error}</Typography>;

  return (
    <Container sx={{ padding: "40px", textAlign: "center" }}>
      {product && (
        <>
          <Box sx={{ maxWidth: "600px", margin: "0 auto" }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: "100%", borderRadius: "10px" }} />
          </Box>

          <Typography variant="h3" fontWeight="bold" sx={{ marginTop: "20px" }}>
            {product.name}
          </Typography>
          <Typography variant="h6" sx={{ color: "gray", marginTop: "10px" }}>
            {product.description}
          </Typography>
          <Typography variant="h4" sx={{ color: "#8B0000", marginTop: "15px" }}>
            ₹{product.price}
          </Typography>

          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              backgroundColor: "#8B0000",
              fontWeight: "bold",
              fontSize: "18px",
              borderRadius: "8px",
            }}
          >
            Add to Cart
          </Button>
        </>
      )}
    </Container>
  );
};

export default ProductDetails;