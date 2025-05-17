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
import { loginUser, loginWithGoogle } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext"; // ✅ Import global loading context
import { UserLoginRequest } from "../types/user/UserRequest";

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { setLoading } = useLoading(); // ✅ Global loading control

  const [formData, setFormData] = useState<UserLoginRequest>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

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
    setLocalLoading(true);
    setLoading(true); // ✅ Show full-screen loader

    try {
      const response = await loginUser(formData);
      login(response.token, response.role);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId.toString());

      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLocalLoading(false);
      setLoading(false); // ✅ Hide loader
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    setLoading(true); // ✅ Full-screen loader during Google login

    try {
      if (!credentialResponse.credential) {
        setError("Google login failed. Try again.");
        setLoading(false);
        return;
      }

      const response = await loginWithGoogle(credentialResponse.credential);
      login(response.token, response.role);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId.toString());

      navigate("/");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false); // ✅ Always hide loader
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
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          Please login to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: "10px" }}>
            {error}
          </Alert>
        )}

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
            disabled={localLoading}
          >
            {localLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            setError("Google login was unsuccessful. Please try again.");
          }}
          width="100%"
        />

        <Typography sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
