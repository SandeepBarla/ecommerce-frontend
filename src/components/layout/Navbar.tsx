import MenuIcon from "@mui/icons-material/Menu"; // ✅ Mobile Menu Icon
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // ✅ Ensure `authContext` always exists before usage
  if (!authContext) {
    return (
      <AppBar
        position="static"
        sx={{ backgroundColor: "#8B0000", padding: "10px" }}
      >
        <Toolbar>
          <Typography variant="h6" color="white">
            Loading...
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  const { user, logout } = authContext;
  const isAdmin = user?.role === "Admin";

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#8B0000", padding: "10px" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* ✅ Brand Name */}
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

        {/* ✅ Desktop Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            Cart
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Orders
          </Button>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
          {/* ✅ Show Admin Dashboard only for Admin users */}
          {isAdmin && (
            <Button color="inherit" component={Link} to="/admin">
              Admin Dashboard
            </Button>
          )}
        </Box>

        {/* ✅ Mobile Navigation Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="mobile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={Link} to="/products" onClick={handleMenuClose}>
              Products
            </MenuItem>
            <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>
              Cart
            </MenuItem>
            <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
              Orders
            </MenuItem>
            {!user ? (
              <>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleMenuClose}
                >
                  Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/register"
                  onClick={handleMenuClose}
                >
                  Register
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    logout(); // ✅ Close menu before logout
                  }}
                >
                  Logout
                </MenuItem>
              </>
            )}
            {/* ✅ Show Admin Dashboard only for Admin users */}
            {isAdmin && (
              <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                Admin Dashboard
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
