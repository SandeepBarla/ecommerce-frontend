import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../../components/layout/AccountLayout";
import Profile from "./Profile";

const sections = [
  {
    title: "Your Profile",
    description: "View and edit your personal details.",
    route: "/account/profile",
  },
  {
    title: "Your Addresses",
    description: "Manage your saved addresses.",
    route: "/account/addresses",
  },
  {
    title: "Your Orders",
    description: "See your order history.",
    route: "/account/orders",
  },
];

const Account: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width:900px)");

  if (isDesktop) {
    // On desktop, show the Profile page by default
    return (
      <AccountLayout>
        <Profile />
      </AccountLayout>
    );
  }

  // On mobile, show the card navigation
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Account
      </Typography>
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={4} key={section.title}>
            <Card>
              <CardActionArea onClick={() => navigate(section.route)}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Account;
