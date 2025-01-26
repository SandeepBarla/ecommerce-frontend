import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, RegisterData } from "../api";
import { AuthContext } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [formData, setFormData] = useState<RegisterData>({
    fullName: "",  // ✅ Updated field name to match backend
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  if (!authContext) {
    return <Typography color="error">Auth context not available</Typography>;
  }

  const { login } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      login(response.token);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" fontWeight="bold">Register</Typography>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" required />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
      </form>
    </Container>
  );
};

export default Register;