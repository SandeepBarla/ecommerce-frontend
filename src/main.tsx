import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { LoadingProvider } from "./context/LoadingContext"; // ✅ Import loading provider
import "./index.css";

// ✅ Load Google Client ID from .env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <LoadingProvider>
          {" "}
          {/* ✅ Global loader wrapper */}
          <App />
        </LoadingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
