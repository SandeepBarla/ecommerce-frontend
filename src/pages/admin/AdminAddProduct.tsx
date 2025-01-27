import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, Product } from "../../api"; // ✅ Import API function
import { AuthContext } from "../../context/AuthContext"; // ✅ Import Auth Context

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [formData, setFormData] = useState<Product>({
    id: 0, // Not needed for new products, but required in TypeScript
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
  });

  const [error, setError] = useState<string | null>(null);

  // Redirect non-admin users
  if (!authContext?.user || authContext.user.role !== "Admin") {
    navigate("/");
  }

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(formData);
      navigate("/admin/products"); // Redirect after successful addition
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Add New Product
        </Typography>
      </Box>

      {/* ✅ Back to Admin Panel Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin")}
      >
        🔙 Back to Admin Dashboard
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Image URL"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Stock"
          name="stock"
          value={formData.stock}
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
          Add Product
        </Button>
      </form>
    </Container>
  );
};

export default AdminAddProduct;
