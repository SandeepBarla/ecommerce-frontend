import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu"; // ✅ Mobile Menu Icon

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!authContext) return null;

  const { user, logout } = authContext;

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#8B0000", padding: "10px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Brand Name */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Sakhya
        </Typography>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/cart">Cart</Button>
          <Button color="inherit" component={Link} to="/orders">Orders</Button>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        </Box>

        {/* Mobile Navigation Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem component={Link} to="/products" onClick={handleMenuClose}>Products</MenuItem>
            <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>Cart</MenuItem>
            <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>Orders</MenuItem>
            {!user ? (
              <>
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
                <MenuItem component={Link} to="/register" onClick={handleMenuClose}>Register</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>
              </>
            )}
            <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>Dashboard</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;