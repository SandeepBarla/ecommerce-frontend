import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, Product, updateProduct } from "../../api";
import { AuthContext } from "../../context/AuthContext";

const AdminEditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [formData, setFormData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authContext?.user || authContext.user.role !== "Admin") {
      navigate("/");
    }

    if (id) {
      getProductById(Number(id))
        .then((product) => {
          setFormData(product);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          setError("Failed to load product data.");
          setLoading(false);
        });
    } else {
      setError("Invalid product ID.");
      setLoading(false);
    }
  }, [id, authContext?.user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await updateProduct(formData.id, formData);
        setSuccessMessage("Product updated successfully!");
        setTimeout(() => navigate("/admin/products"), 2000);
      } catch (err) {
        setError("Failed to update product. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Edit Product
        </Typography>
      </Box>

      {/* ✅ Back Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin/products")}
      >
        🔙 Back to Manage Products
      </Button>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
          <Typography>Loading product...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : formData ? (
        <>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData?.description}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Price"
              name="price"
              value={formData?.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData?.imageUrl}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Stock"
              name="stock"
              value={formData?.stock}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Update Product
            </Button>
          </form>
        </>
      ) : (
        <Alert severity="error">Product not found.</Alert>
      )}
    </Container>
  );
};

export default AdminEditProduct;
