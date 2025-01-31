import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  return (
    <>
      {/* Welcome Banner (Now placed right below the Navbar) */}
      {user && (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "rgba(139, 0, 0, 0.85)", // Deep red with transparency
            padding: "12px",
            textAlign: "center",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          🎉 Welcome, {user.fullName}! We’re glad to have you at Sakhya.
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)", // Adjusted to fit below navbar
          textAlign: "center",
          padding: "20px",
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/044/149/478/non_2x/a-row-of-colorful-fabrics-with-a-beaded-pattern-free-photo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Overlay for better text readability */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for contrast
            zIndex: -1,
          }}
        ></Box>

        {/* Brand Slogan */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            fontFamily: "'Playfair Display', serif",
            marginBottom: "10px",
          }}
        >
          Elevate Your Style
        </Typography>

        {/* New Caption */}
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          Discover the finest collection of Traditional & Western Fashion
        </Typography>

        {/* Shop Now Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#D2042D",
            fontWeight: "bold",
            fontSize: "18px",
            borderRadius: "8px",
            padding: "12px 24px",
            boxShadow: "2px 4px 10px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#B71C1C" },
          }}
          component={Link}
          to="/products"
        >
          Shop Now
        </Button>
      </Box>
    </>
  );
};

export default Home;
