import {
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
import { fetchUsers } from "../../api"; // ✅ Import API function
import { AuthContext, User } from "../../context/AuthContext"; // ✅ Import Auth Context

const AdminUsers = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);

  // Redirect non-admin users
  useEffect(() => {
    if (!authContext?.user || authContext.user.role !== "Admin") {
      navigate("/");
    }
  }, [authContext?.user, navigate]);

  // Fetch Users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
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
              </TableCell>{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {/* ✅ "View Orders" Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/orders/users/${user.id}`)}
                  >
                    View Orders
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminUsers;
