import {
  Alert,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/users"; // ✅ Corrected API import
import { AuthContext } from "../../context/AuthContext"; // ✅ Import Auth Context
import { UserResponse } from "../../types/user/UserResponse"; // ✅ Corrected User Type

const AdminUserManagement = () => {
  // ✅ Renamed Component
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Redirect Non-Admin Users
  useEffect(() => {
    if (!authContext?.user || authContext.user.role !== "Admin") {
      navigate("/");
    }
  }, [authContext?.user, navigate]);

  // ✅ Fetch Users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Failed to fetch users. Please try again.");
      }
    };
    loadUsers();
  }, []);

  return (
    <Container>
      {/* Page Heading */}
      <Typography
        variant="h4"
        sx={{ mt: 4, mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        Manage Users
      </Typography>

      {/* ✅ Display Error if Users Fail to Load */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* ✅ Back Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin")}
      >
        🔙 Back to Admin Dashboard
      </Button>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Full Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users available.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {/* ✅ "View Orders" Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/admin/users/${user.id}/orders`)} // ✅ Corrected URL
                    >
                      View Orders
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminUserManagement;
