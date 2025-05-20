import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Profile Information",
    icon: <AccountCircleIcon />,
    path: "/account/profile",
  },
  {
    label: "Manage Addresses",
    icon: <HomeWorkIcon />,
    path: "/account/addresses",
  },
  {
    label: "My Orders",
    icon: <ShoppingBagIcon />,
    path: "/account/orders",
  },
];

const drawerWidth = 260;

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width:900px)");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "white",
              borderRight: "1px solid #eee",
              pt: 3,
            },
          }}
          open
        >
          <Box sx={{ px: 3, mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Hello,
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              Sandeep Barla
            </Typography>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem
                component="button"
                key={item.label}
                aria-current={
                  location.pathname.startsWith(item.path) ? "page" : undefined
                }
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 1,
                  bgcolor: location.pathname.startsWith(item.path)
                    ? "#f0f4ff"
                    : "inherit",
                  color: location.pathname.startsWith(item.path)
                    ? "#1976d2"
                    : "inherit",
                  fontWeight: location.pathname.startsWith(item.path)
                    ? 700
                    : 500,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname.startsWith(item.path)
                      ? "#1976d2"
                      : "#888",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 4 },
          maxWidth: isDesktop ? `calc(100vw - ${drawerWidth}px)` : "100vw",
          mx: "auto",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AccountLayout;
