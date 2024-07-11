// import  { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import WorkIcon from '@mui/icons-material/Work';
// import PersonIcon from '@mui/icons-material/Person';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// const iconMap = {
//   'HR PROFILE': <PersonIcon />,
//   'DESIGNATION': <WorkIcon />,
//   'ADD EMPLOYEE': <AddBoxIcon />,
//   'LOGOUT': <ExitToAppIcon />,
// };

// const TemporaryDrawer = () => {
//   const [open, setOpen] = useState(false);

//   const toggleDrawer = (newOpen) => () => {
//     setOpen(newOpen);
//   };

//   const DrawerList = (
//     <Box
//       sx={{
//         width: 250,
//         backgroundColor: '#1976d2',
//         color: '#ffffff', 
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//       }}
//       role="presentation"
//       onClick={toggleDrawer(false)}
//     >
//          <Divider />
//       <List>
//         {['HR PROFILE', 'DESIGNATION', 'ADD EMPLOYEE', 'LOGOUT'].map((text) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton
//               component={Link}
//               to={
//                 text === 'DESIGNATION'
//                   ? '/designations'
//                   : text === 'ADD EMPLOYEE'
//                   ? '/post'
//                   : text === 'LOGOUT'
//                   ? '/logout'
//                   : text === 'HR PROFILE'
//                   ? '/profile'
//                   : '#'
//               }
//             >
//               <ListItemIcon>{iconMap[text] || <InboxIcon />}</ListItemIcon>
//               <ListItemText primary={text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
      
//     </Box>
//   );

//   return (
//     <div>
//       <Button onClick={toggleDrawer(true)}>Open drawer</Button>
//       <Drawer open={open} onClose={toggleDrawer(false)}>
//         {DrawerList}
//       </Drawer>
//     </div>
//   );
// };

// export default TemporaryDrawer;



import  { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Assume profileImage is the URL of the HR's profile picture
// const profileImage = sessionStorage.getItem('profileImage');

const iconMap = {
  'HR PROFILE': <PersonIcon />,
  'DESIGNATION': <WorkIcon />,
  'ADD EMPLOYEE': <AddBoxIcon />,
  'LOGOUT': <ExitToAppIcon />,
};

const TemporaryDrawer = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#1976d2',
        color: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >   
     
      <List>
      <Box sx={{ textAlign: 'center', py: 2 }}>
          <img
            src="https://lh3.googleusercontent.com/a/AEdFTp4ime4cxal8jxUM4wQyU8hYGiCAQHs56QSNVPPcRw=s96-c"
            alt="HR Profile"
            style={{ width: '80px', height: '80px', borderRadius: '50%' }}
          />
        </Box>
        {['HR PROFILE', 'DESIGNATION', 'ADD EMPLOYEE', 'LOGOUT'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={
                text === 'DESIGNATION'
                  ? '/designations'
                  : text === 'ADD EMPLOYEE'
                  ? '/post'
                  : text === 'LOGOUT'
                  ? '/logout'
                  : text === 'HR PROFILE'
                  ? '/profile'
                  : '#'
              }
            >
              <ListItemIcon>{iconMap[text] || <InboxIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default TemporaryDrawer;
