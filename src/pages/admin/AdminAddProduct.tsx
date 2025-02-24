// import {
//   Alert,
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createProduct } from "../../api/products"; // ✅ Correct API import
// import { AuthContext } from "../../context/AuthContext";
// import { ProductUpsertRequest } from "../../types/product/ProductUpsertRequest"; // ✅ Use correct type

// const AdminAddProduct = () => {
//   const navigate = useNavigate();
//   const authContext = useContext(AuthContext);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const [formData, setFormData] = useState<ProductUpsertRequest>({
//     name: "",
//     description: "",
//     price: 0,
//     imageUrl: "",
//     stock: 0,
//   });

//   // ✅ Redirect non-admin users safely inside useEffect (Fix hook issue)
//   if (!authContext?.user || authContext.user.role !== "Admin") {
//     navigate("/");
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await createProduct(formData);
//       setSuccessMessage("Product added successfully!");
//       setTimeout(() => navigate("/admin/products"), 2000);
//     } catch (err) {
//       console.error("Error creating product:", err);
//       setError("Failed to add product. Please try again.");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ textAlign: "center", mt: 5 }}>
//         <Typography variant="h4" fontWeight="bold">
//           Add New Product
//         </Typography>
//       </Box>

//       {/* ✅ Success & Error Messages */}
//       {successMessage && <Alert severity="success">{successMessage}</Alert>}
//       {error && <Alert severity="error">{error}</Alert>}

//       {/* ✅ Back to Admin Panel Button */}
//       <Button
//         variant="contained"
//         color="secondary"
//         sx={{ mb: 2 }}
//         onClick={() => navigate("/admin")}
//       >
//         🔙 Back to Admin Dashboard
//       </Button>

//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           label="Description"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           type="number"
//           label="Price"
//           name="price"
//           value={formData.price}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           label="Image URL"
//           name="imageUrl"
//           value={formData.imageUrl}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           type="number"
//           label="Stock"
//           name="stock"
//           value={formData.stock}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Add Product
//         </Button>
//       </form>
//     </Container>
//   );
// };

const AdminAddProduct = () => {
  return <div>Add Product</div>;
};

export default AdminAddProduct;
