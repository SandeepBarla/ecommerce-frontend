import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, fetchProducts } from "../../api/products"; // ✅ Correct API import
import { AuthContext } from "../../context/AuthContext";
import { ProductResponse } from "../../types/product/ProductResponse"; // ✅ Use correct type

const AdminProductManagement = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // ✅ Redirect non-admin users
  useEffect(() => {
    if (!authContext?.user || authContext.user.role !== "Admin") {
      navigate("/");
    }
  }, [authContext?.user, navigate]);

  // ✅ Fetch Products with useCallback
  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      setError("Failed to load products. Please try again.");
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ✅ Handle Delete Confirmation Dialog
  const handleDeleteConfirmation = (productId: number) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  // ✅ Handle Delete Product
  const handleDeleteProduct = async () => {
    if (selectedProductId) {
      try {
        await deleteProduct(selectedProductId);
        setDeleteSuccess(true);
        loadProducts(); // Reload products after deletion
      } catch (error) {
        console.error("Failed to delete product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
    setDeleteDialogOpen(false);
  };

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{ mt: 4, mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        Manage Products
      </Typography>

      {/* ✅ Error Banner */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ✅ Success Banner for Deletion */}
      {deleteSuccess && (
        <Snackbar
          open={deleteSuccess}
          autoHideDuration={5000}
          onClose={() => setDeleteSuccess(false)}
        >
          <Alert
            severity="success"
            onClose={() => setDeleteSuccess(false)}
            sx={{ width: "100%" }}
          >
            Product deleted successfully!
          </Alert>
        </Snackbar>
      )}

      {/* ✅ Back to Dashboard Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin")}
      >
        🔙 Back to Admin Dashboard
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Image</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Price</b>
              </TableCell>
              <TableCell>
                <b>Stock</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width="50"
                    height="50"
                    style={{ borderRadius: "5px" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteConfirmation(product.id)}
                  >
                    🗑️ Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProductManagement;
