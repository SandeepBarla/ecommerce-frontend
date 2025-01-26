import { Container, Typography, Button, Box } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
        backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/044/149/478/non_2x/a-row-of-colorful-fabrics-with-a-beaded-pattern-free-photo.jpg')", // Use a high-quality background image
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
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for better contrast
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
      >
        Shop Now
      </Button>
    </Box>
  );
};

export default Home;