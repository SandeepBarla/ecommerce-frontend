import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AlertCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { loginWithGoogle } from "../api/auth";
import { registerUser } from "../api/users";
import {
  UserLoginRequest,
  UserRegisterRequest,
} from "../types/user/UserRequest";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const { login, loginWithGoogleContext } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<
    UserLoginRequest | UserRegisterRequest
  >({
    email: "",
    password: "",
    ...(mode === "register" ? { fullName: "" } : {}),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success("Successfully logged in!");
          onClose();
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        await registerUser(formData as UserRegisterRequest);
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success("Account created successfully!");
          onClose();
        } else {
          setError(
            "Registration succeeded but login failed. Please try logging in manually."
          );
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage =
        mode === "login"
          ? "Invalid email or password. Please try again."
          : "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
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
        throw new Error("No credential received");
      }

      const response = await loginWithGoogle(credentialResponse.credential);
      await loginWithGoogleContext(response);
      onClose();
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = "Google sign-in failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
    setLoading(false);
  }, [open, mode]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-serif">
              {mode === "login" ? "Welcome back" : "Create account"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Access your favorites, cart, and more."
                : "Join us for a personalized shopping experience!"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={(formData as UserRegisterRequest).fullName || ""}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError("Google sign-in failed. Please try again.");
                  toast.error("Google sign-in failed. Please try again.");
                }}
                useOneTap={false}
                size="large"
                width="100%"
                theme="filled_blue"
                text="signin_with"
                shape="pill"
                logo_alignment="center"
              />
            </div>

            <div className="text-center text-sm">
              <Separator className="my-4" />
              <span className="text-muted-foreground">
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-ethnic-purple hover:text-ethnic-purple/80 font-medium hover:underline"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
