import { loginWithGoogle } from "@/api/auth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, register, isAuthenticated, isAdmin, loginWithGoogleContext } =
    useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirectTo = new URLSearchParams(location.search).get("redirect");
    // If user is admin and no specific redirect is requested, go to admin dashboard
    if (isAdmin && !redirectTo) {
      return <Navigate to="/admin" />;
    }
    return <Navigate to={redirectTo || "/account"} />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let success = false;
      if (mode === "login") {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(
          formData.name,
          formData.email,
          formData.password
        );
      }
      if (success) {
        navigate("/");
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    try {
      const response = await loginWithGoogle(credentialResponse.credential);
      loginWithGoogleContext(response);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="ethnic-container py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-gray-200">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-serif mb-1">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Enter your email and password to login"
                  : "Enter your details to create an account"}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {mode === "login" && (
                    <div className="text-right">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-ethnic-purple hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ethnic-purple hover:bg-ethnic-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "login"
                        ? "Logging in..."
                        : "Creating account..."}
                    </>
                  ) : mode === "login" ? (
                    "Login"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Google Authentication Section */}
              <div className="mt-4 flex flex-col items-center">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      OR CONTINUE WITH
                    </span>
                  </div>
                </div>
                <div className="mt-4 w-full flex justify-center">
                  <div className="w-full max-w-sm">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {}}
                      useOneTap={false}
                      width="100%"
                      theme="filled_blue"
                      text={mode === "login" ? "continue_with" : "signup_with"}
                      shape="pill"
                      logo_alignment="center"
                      size="large"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                <Separator className="my-4" />

                {mode === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-ethnic-purple hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-ethnic-purple hover:underline font-medium"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
