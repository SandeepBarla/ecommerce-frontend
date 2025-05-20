import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Link as MuiLink,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockUser = {
  firstName: "Sandeep",
  lastName: "Barla",
  mobile: "+918639758462",
  email: "barlavenkatsandeep@gmail.com",
  avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=man",
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(mockUser.firstName);
  const [lastName, setLastName] = useState(mockUser.lastName);

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#8B0000" }} elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ color: "white" }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <FacebookIcon sx={{ color: "#FFD700", fontSize: 32 }} />
        </Toolbar>
      </AppBar>
      <Box sx={{ bgcolor: "#3366cc", minHeight: 180, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 100,
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={mockUser.avatarUrl}
              sx={{
                width: 110,
                height: 110,
                border: "4px solid white",
                bgcolor: "#eee",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "white",
                boxShadow: 1,
                p: 0.5,
                border: "1px solid #ddd",
              }}
              size="small"
            >
              <EditIcon fontSize="small" sx={{ color: "#3366cc" }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ height: 80 }} />
      </Box>
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 8,
          p: 2,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Button
            variant="text"
            sx={{ color: "#3366cc", fontWeight: "bold", fontSize: 18 }}
          >
            SUBMIT
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            Mobile Number
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {mockUser.mobile}
            </Typography>
            <MuiLink
              component="button"
              underline="none"
              sx={{ color: "#3366cc", fontWeight: 600, fontSize: 15 }}
            >
              Update
            </MuiLink>
          </Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            Email ID
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {mockUser.email}
            </Typography>
            <MuiLink
              component="button"
              underline="none"
              sx={{ color: "#3366cc", fontWeight: 600, fontSize: 15 }}
            >
              Update
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
