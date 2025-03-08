import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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

  // ✅ Button Styling (Highlight active page & hover effect)
  const getButtonStyles = (path: string) => ({
    color: location.pathname === path ? "#FFD700" : "white",
    fontWeight: location.pathname === path ? "bold" : "normal",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  });

  // ✅ Handle Mobile Drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // ✅ Mobile Menu Items
  const menuItems = [
    { text: "Products", icon: <StorefrontIcon />, path: "/products" },
    ...(user
      ? [
          { text: "Cart", icon: <ShoppingCartIcon />, path: "/cart" },
          { text: "Favourites", icon: <FavoriteIcon />, path: "/favorites" },
          { text: "Account", icon: <AccountCircleIcon />, path: "/account" },
        ]
      : [
          { text: "Login", icon: <LoginIcon />, path: "/login" },
          { text: "Register", icon: <HowToRegIcon />, path: "/register" },
        ]),
    ...(isAdmin
      ? [
          {
            text: "Admin Dashboard",
            icon: <AdminPanelSettingsIcon />,
            path: "/admin",
          },
        ]
      : []),
  ];

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#8B0000", padding: "10px" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* ✅ Mobile Menu Icon & Brand Name - Aligned to Left */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
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
          </Box>

          {/* ✅ Icons on Right in Mobile View */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton component={Link} to="/products" sx={{ color: "white" }}>
              <StorefrontIcon />
            </IconButton>
            {user ? (
              <>
                <IconButton component={Link} to="/cart" sx={{ color: "white" }}>
                  <ShoppingCartIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/favorites"
                  sx={{ color: "white" }}
                >
                  <FavoriteIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  component={Link}
                  to="/login"
                  sx={{ color: "white" }}
                >
                  <LoginIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/register"
                  sx={{ color: "white" }}
                >
                  <HowToRegIcon />
                </IconButton>
              </>
            )}
          </Box>

          {/* ✅ Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {menuItems.map(({ text, icon, path }) => (
              <Button
                key={text}
                component={Link}
                to={path}
                sx={getButtonStyles(path)}
              >
                {icon}
                <Typography sx={{ marginLeft: "5px" }}>{text}</Typography>
              </Button>
            ))}
            {user && (
              <Button onClick={logout} sx={getButtonStyles("/logout")}>
                <LogoutIcon sx={{ marginRight: "5px" }} />
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Mobile Full-Screen Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100vw",
            height: "100vh",
            background: "linear-gradient(to bottom, #8B0000, #4B0000)",
            color: "white",
          },
        }}
      >
        {/* ✅ Mobile Menu Header with Close Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
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
            onClick={handleDrawerToggle}
          >
            Sakhya
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* ✅ Mobile Menu Items */}
        <List sx={{ paddingX: 4 }}>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={path}
                onClick={handleDrawerToggle}
                sx={{
                  padding: "12px",
                  borderRadius: "8px",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#FFD700",
                    color: "#4B0000",
                    fontWeight: "bold",
                  },
                }}
                selected={location.pathname === path}
              >
                <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          {/* ✅ Logout Button - Styled Separately */}
          {user && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleDrawerToggle();
                  logout();
                }}
                sx={{
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "10px",
                  color: "#FFD700",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#FFD700" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
