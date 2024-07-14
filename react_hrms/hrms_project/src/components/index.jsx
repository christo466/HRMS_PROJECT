import  { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from "../context/ThemeContext";

const pages = ["designations", "About"];

function ResponsiveAppBar() {
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState("");

  const handleCloseNavMenu = (page) => {
    setActivePage(page);
  };

  return (
    
       <Container maxWidth="xl" sx={{backgroundImage: "linear-gradient( to bottom right, #0693e3, #096dd9)"}}>
        <Toolbar disableGutters>
          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home"
            sx={{
              mr: 2,
              padding:'10px',
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              '&:hover': {
                color: '#000000',
                backgroundColor: 'primary.main',
              },
            }}
          >
            MIND HIVE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                component={Link}
                to={`/${page.replace(/\s+/g, "").toLowerCase()}`}
                sx={{
                          my: 2,
                          color: "white",
                          display: "block",
                          backgroundColor:
                            activePage === page ? "primary.main" : "transparent",
                          "&:hover": {
                            color: "black",
                            backgroundColor: "primary.main",
                          },
                        }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box
            component="img"
            src="/images/logo.svg" 
            alt="Mind Hive Logo"
            sx={{ height: 40, mr: 2 }}
          />
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </Container>
   
  );
}

export default ResponsiveAppBar;
