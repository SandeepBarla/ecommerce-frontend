import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const mockAddresses = [
  {
    id: 1,
    name: "Venkat Sandeep Barla",
    label: "HOME",
    address:
      "5-121/1, Opposite to Anganwadi Kendram, Velampeta, Nadakuduru, Velampeta, Near Vignyana Jyothi Public School, East Godavari District, Andhra Pradesh - 533016",
    phone: "8639758462",
  },
  {
    id: 2,
    name: "Bhavana Betha",
    label: "HOME",
    address:
      "Varija Ashram, Dr NTR Beach Road, Mangamari Peta, Kapuluppada, Madhurawada, Andhra Pradesh - 530048",
    phone: "8186040870",
  },
  {
    id: 3,
    name: "Betha Bhavana",
    label: "WORK",
    address:
      "0, main street, nemalam, opp zphs school nemalam,, terlam mandal, near zphs nemalam, Vizianagaram District, Andhra Pradesh - 535126",
    phone: "8186040870",
  },
];

const Addresses: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuId, setMenuId] = React.useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

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
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 600, color: "white" }}
          >
            My Addresses
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 2, p: 2 }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            fontWeight: "bold",
            mb: 2,
            fontSize: 18,
            borderRadius: 2,
            boxShadow: 1,
            "&:hover": { bgcolor: "#115293" },
          }}
          fullWidth
        >
          Add a new address
        </Button>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block", fontWeight: 600, letterSpacing: 1 }}
        >
          {mockAddresses.length} SAVED ADDRESSES
        </Typography>
        <Grid container direction="column" spacing={2}>
          {mockAddresses.map((addr) => (
            <Grid item key={addr.id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  position: "relative",
                  bgcolor: "white",
                  boxShadow: 1,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle1" fontWeight={600} mr={1}>
                      {addr.name}
                    </Typography>
                    <Chip
                      label={addr.label}
                      size="small"
                      sx={{
                        bgcolor: "#FFD700",
                        color: "#8B0000",
                        fontWeight: 600,
                        ml: 0.5,
                      }}
                    />
                    <Box flexGrow={1} />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, addr.id)}
                      aria-label="address actions"
                      sx={{ color: "#8B0000" }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuId === addr.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                    </Menu>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {addr.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {addr.phone}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Addresses;
