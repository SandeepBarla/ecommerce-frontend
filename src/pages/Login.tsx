import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; // ✅ Corrected import
import { AuthContext } from "../context/AuthContext";
import { UserLoginRequest } from "../types/user/UserRequest"; // ✅ Import correct type

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [formData, setFormData] = useState<UserLoginRequest>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // ✅ Loading state

  if (!authContext) {
    return <Typography color="error">Auth context not available</Typography>;
  }

  const { login } = authContext;

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ✅ Show loading indicator

    try {
      const response = await loginUser(formData);
      login(response.token, response.role); // ✅ Store token & role in context
      localStorage.setItem("token", response.token); // ✅ Store token securely
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId.toString());

      navigate("/"); // ✅ Redirect after successful login
    } catch (err) {
      console.error("Error logging in user:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false); // ✅ Stop loading indicator
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Login
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}{" "}
      {/* ✅ Show error */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
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
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Container>
  );
};

export default Login;
