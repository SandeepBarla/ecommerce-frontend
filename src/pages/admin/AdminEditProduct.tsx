// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useCallback, useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchProductById, updateProduct } from "../../api/products"; // ✅ Correct API import
// import { AuthContext } from "../../context/AuthContext";
// import { ProductResponse } from "../../types/product/ProductResponse"; // ✅ Use correct type
// import { ProductUpsertRequest } from "../../types/product/ProductUpsertRequest"; // ✅ Upsert request type

// const AdminEditProduct = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const authContext = useContext(AuthContext);
//   const [formData, setFormData] = useState<ProductUpsertRequest | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // ✅ Redirect non-admin users
//   useEffect(() => {
//     if (!authContext?.user || authContext.user.role !== "Admin") {
//       navigate("/");
//     }
//   }, [authContext?.user, navigate]);

//   // ✅ Fetch Product Data
//   const fetchProduct = useCallback(async () => {
//     if (!id) {
//       setError("Invalid product ID.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const product: ProductResponse = await fetchProductById(Number(id));
//       setFormData({
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         imageUrl: product.imageUrl,
//         stock: product.stock,
//       });
//     } catch (err) {
//       console.error("Error fetching product:", err);
//       setError("Failed to load product data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchProduct();
//   }, [fetchProduct]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (formData) {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!id || !formData) return;

//     try {
//       await updateProduct(Number(id), formData);
//       setSuccessMessage("Product updated successfully!");
//       setTimeout(() => navigate("/admin/products"), 2000);
//     } catch (err) {
//       console.error("Error updating product:", err);
//       setError("Failed to update product. Please try again.");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h4" fontWeight="bold">
//           Edit Product
//         </Typography>
//       </Box>

//       {/* ✅ Back Button */}
//       <Button
//         variant="contained"
//         color="secondary"
//         sx={{ mb: 2 }}
//         onClick={() => navigate("/admin/products")}
//       >
//         🔙 Back to Manage Products
//       </Button>

//       {loading ? (
//         <Box sx={{ textAlign: "center", mt: 3 }}>
//           <CircularProgress />
//           <Typography>Loading product...</Typography>
//         </Box>
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : formData ? (
//         <>
//           {successMessage && <Alert severity="success">{successMessage}</Alert>}

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               margin="normal"
//               required
//             />
//             <TextField
//               fullWidth
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               margin="normal"
//               required
//             />
//             <TextField
//               fullWidth
//               type="number"
//               label="Price"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               margin="normal"
//               required
//             />
//             <TextField
//               fullWidth
//               label="Image URL"
//               name="imageUrl"
//               value={formData.imageUrl}
//               onChange={handleChange}
//               margin="normal"
//               required
//             />
//             <TextField
//               fullWidth
//               type="number"
//               label="Stock"
//               name="stock"
//               value={formData.stock}
//               onChange={handleChange}
//               margin="normal"
//               required
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Update Product
//             </Button>
//           </form>
//         </>
//       ) : (
//         <Alert severity="error">Product not found.</Alert>
//       )}
//     </Container>
//   );
// };

// export default AdminEditProduct;
