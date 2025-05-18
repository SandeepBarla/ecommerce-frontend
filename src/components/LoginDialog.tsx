import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { loginUser, loginWithGoogle } from "../api/auth";
import { registerUser } from "../api/users";
import { AuthContext } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import {
  UserLoginRequest,
  UserRegisterRequest,
} from "../types/user/UserRequest";

const SlideUp = (props: React.ComponentProps<typeof Slide>) => (
  <Slide direction="up" {...props} />
);

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const authContext = useContext(AuthContext);
  const { setLoading } = useLoading();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<
    UserLoginRequest | UserRegisterRequest
  >({
    email: "",
    password: "",
    ...(mode === "register" ? { fullName: "" } : {}),
  });
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  if (!authContext) return null;
  const { login } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);
    setLoading(true);
    try {
      if (mode === "login") {
        const response = await loginUser(formData as UserLoginRequest);
        login(response.token, response.role);
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userId", response.userId.toString());
      } else {
        const response = await registerUser(formData as UserRegisterRequest);
        login(response.token, response.role);
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userId", response.userId.toString());
      }
      onClose();
    } catch {
      setError(
        mode === "login"
          ? "Invalid email or password. Please try again."
          : "Registration failed. Please try again."
      );
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setError(null);
    setLoading(true);
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
      onClose();
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when dialog opens or mode changes
  React.useEffect(() => {
    setFormData({
      email: "",
      password: "",
      ...(mode === "register" ? { fullName: "" } : {}),
    });
    setError(null);
    setLocalLoading(false);
  }, [open, mode]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          borderRadius: { xs: "18px 18px 0 0", sm: 3 },
          pb: 2,
          pt: 0,
          m: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 2, pt: 0, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            {mode === "login" ? "Log in to your account" : "Create an account"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {mode === "login"
              ? "Access your favorites, cart, and more."
              : "Join us for a personalized shopping experience!"}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            {mode === "register" && (
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={(formData as UserRegisterRequest).fullName || ""}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              type="email"
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
              sx={{ mt: 2, mb: 1.5, borderRadius: 2, fontWeight: "bold" }}
              disabled={localLoading}
            >
              {localLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Register"
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
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                  }}
                  onClick={() => setMode("register")}
                >
                  Register here
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                  }}
                  onClick={() => setMode("login")}
                >
                  Login here
                </Button>
              </>
            )}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
