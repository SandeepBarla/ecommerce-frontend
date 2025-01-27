import { Box, Button, Container, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ Import Auth Context

const AdminDashboard = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Redirect non-admin users
  useEffect(() => {
    if (!authContext?.user || authContext.user.role !== "Admin") {
      navigate("/");
    }
  }, [authContext?.user, navigate]);

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{ mt: 4, mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        Admin Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/products")}
        >
          View All Products
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/products/new")}
        >
          Add New Product
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/admin/users")}
        >
          View All Users
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => navigate("/admin/orders")}
        >
          View All Orders
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
