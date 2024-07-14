import { useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { logoutUser } from "../../store/logout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import GroupIcon from '@mui/icons-material/Group';
const iconMap = {
  "HR PROFILE": <PersonIcon />,
  DESIGNATION: <WorkIcon />,
  "ADD EMPLOYEE": <AddBoxIcon />,
  "LOG OUT": <ExitToAppIcon />,
  "EMPLOYEE": <GroupIcon />,
};

const TemporaryDrawer = () => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const user = useSelector((state) => state.hr);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  console.log(user, "side bar data");
  const DrawerList = (
    <Box
      sx={{
        width: 300,
        backgroundImage: "linear-gradient( to bottom right, #0693e3, #096dd9)",
        color: "#ffffff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: 3,
        transitionDuration: 800,
      }}
      role="presentation"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <List>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <img
            src={user.data.image_url}
            alt="HR Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "70%",
              border: "3px solid #ffffff",
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: "26px",
              color: "white",
              textTransform: "uppercase",
              marginBottom: "60px",
            }}
          >
            {user.data.username}
          </Typography>
        </Box>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleProfileClick}
            sx={{
              "&:hover": {
                backgroundColor: "#ffffff",
                color: "#000000",
                "& .MuiListItemIcon-root": {
                  color: "#000000",
                },
              },
            }}
          >
            <ListItemIcon>{iconMap["HR PROFILE"]}</ListItemIcon>
            <ListItemText primary="HR PROFILE" />
          </ListItemButton>
        </ListItem>

        {showProfile && (
          <Box sx={{ px: 2, py: 1, backgroundColor: "white" }}>
            <Typography
              variant="body1"
              sx={{ color: "black", textTransform: "capitalize" }}
            >
              Name: {user.data.username}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "black", textTransform: "capitalize" }}
            >
              Designation: {user.data.designation}
            </Typography>
            <Typography variant="body1" sx={{ color: "black" }}>
              Phone: {user.data.phone}
            </Typography>
            <Typography variant="body1" sx={{ color: "black" }}>
              Email: {user.data.email}
            </Typography>
          </Box>
        )}

        <List>
          {["DESIGNATION", "ADD EMPLOYEE", "EMPLOYEE"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  text === "DESIGNATION"
                    ? "/designations"
                    : text === "ADD EMPLOYEE"
                    ? "/post"
                    : text === "EMPLOYEE"
                    ? "/employeechart"
                    : "#"
                }
                sx={{
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "& .MuiListItemIcon-root": {
                      color: "#000000",
                    },
                  },
                }}
              >
                <ListItemIcon>{iconMap[text] || <InboxIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  "& .MuiListItemIcon-root": {
                    color: "#000000",
                  },
                },
              }}
            >
              <ListItemIcon>{iconMap["LOG OUT"]}</ListItemIcon>
              <ListItemText primary="LOG OUT" />
            </ListItemButton>
          </ListItem>
        </Box>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          border: "1px solid white",
          color: "white",
          "&:hover": {
            border: "1px solid white",
          },
        }}
      >
        <MenuIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default TemporaryDrawer;
