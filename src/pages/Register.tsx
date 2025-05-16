import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../api/auth"; // ✅ Ensure loginWithGoogle is imported
import { registerUser } from "../api/users";
import { AuthContext } from "../context/AuthContext";
import { UserRegisterRequest } from "../types/user/UserRequest";

const Register = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [formData, setFormData] = useState<UserRegisterRequest>({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!authContext) {
    return <Typography color="error">Auth context not available</Typography>;
  }

  const { login } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerUser(formData);
      login(response.token, response.role);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId.toString());

      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        setError("Google registration failed.");
        return;
      }

      const response = await loginWithGoogle(credentialResponse.credential);
      login(response.token, response.role);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId.toString());

      navigate("/");
    } catch (err) {
      setError("Google registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          marginTop: "50px",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Create an Account
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          Join us today for an amazing experience
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: "10px" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
            required
          />
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
              "Register"
            )}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        {/* ✅ Google Sign-up button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed")}
          width="100%"
        />

        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
