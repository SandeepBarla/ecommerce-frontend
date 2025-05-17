import {
  Box,
  Button,
  CircularProgress,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { fetchProducts } from "../api/products";
import { ProductListResponse } from "../types/product/ProductListResponse";

const Home = () => {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflowX = "hidden"; // ✅ Prevent horizontal scrolling
    return () => {
      document.body.style.overflowX = "auto"; // Reset when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Slider Settings for Responsiveness
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3, // ✅ Default: 3 products at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/044/149/478/non_2x/a-row-of-colorful-fabrics-with-a-beaded-pattern-free-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ✅ Hero Section */}
      <Box
        sx={{
          height: { xs: "40vh", md: "40vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          width: "100vw",
        }}
      >
        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ Ensures text readability
            zIndex: 1,
          }}
        />

        {/* Caption */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            color: "white",
            padding: "20px",
            width: "90%",
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "24px", md: "36px" },
              marginBottom: "10px",
            }}
          >
            Elevate Your Style
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "14px", md: "18px" }, marginBottom: "20px" }}
          >
            Discover the finest collection of Traditional & Western Fashion
          </Typography>

          {/* Shop Now Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D2042D",
              fontWeight: "bold",
              fontSize: { xs: "14px", md: "18px" },
              borderRadius: "8px",
              padding: { xs: "8px 16px", md: "12px 24px" },
              boxShadow: "2px 4px 10px rgba(0,0,0,0.2)",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
            component={Link}
            to="/products"
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* ✅ Product Slider */}
      <Container
        sx={{
          textAlign: "center",
          maxWidth: "100vw",
          flex: 1, // ✅ Ensures content expands to fit space
        }}
      >
        {loading ? (
          <Slider {...sliderSettings}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ padding: "5px" }}>
                <Box
                  sx={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    textAlign: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    height: 350,
                    position: "relative", // ✅ Needed to center the loader
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation={false} // ❌ Turn off shimmer, we're using real loader
                    sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: "#fff" }} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        ) : error ? (
          <Typography sx={{ color: "red", mt: 3 }}>{error}</Typography>
        ) : (
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <Box key={product.id} sx={{ padding: "5px" }}>
                <Box
                  component={Link}
                  to={`/products/${product.id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      textAlign: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.15)", // ✅ Light transparency
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      sx={{
                        height: { xs: 350, md: 350 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={product.primaryImageUrl || "/placeholder.png"}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        )}
      </Container>
    </Box>
  );
};

export default Home;
