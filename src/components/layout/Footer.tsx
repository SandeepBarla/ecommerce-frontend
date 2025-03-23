import InstagramIcon from "@mui/icons-material/Instagram";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        color: "white",
        background: "linear-gradient(90deg, #8B0000, #a80000)",
        fontSize: "0.95rem",
      }}
    >
      <span style={{ fontWeight: 500 }}>
        © {new Date().getFullYear()} Sakhya
      </span>
      <span style={{ color: "#dddddd" }}>|</span>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <InstagramIcon fontSize="small" />
        <a
          href="https://www.instagram.com/sakhya_official/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "white",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#FFD700")}
          onMouseOut={(e) => (e.currentTarget.style.color = "white")}
        >
          @sakhya_official
        </a>
      </Box>
    </Box>
  );
};

export default Footer;
