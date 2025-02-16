import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "15px 0", // ✅ No margins, tight layout
        textAlign: "center",
        color: "white",
        backgroundColor: "#8B0000", // ✅ Same as Navbar
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} Sakhya. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
