import { Container, Typography, Box, Paper, useTheme } from "@mui/material";
import Footer from "./Footer";
import Header from "./index";
import { AppBar, Toolbar } from "@mui/material";
import TemporaryDrawer from "../pages/Home/SideBar";

const About = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box
          my={5}
          sx={{
            backgroundColor: isDarkMode ? "#000000" : "#b3e5fc",
            borderColor: isDarkMode ? "#ffffff" : "#000000",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            gutterBottom
          >
            MIND HIVE
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              backgroundColor: isDarkMode ? "#000000" : "#b3e5fc",
              borderRadius: "10px",
              color: isDarkMode ? "#ffffff" : "#000000",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              Mind Hive is a dynamic company specializing in Human Resource
              Management Systems (HRMS). Our mission is to streamline and
              optimize HR processes through innovative technology solutions,
              ensuring organizations can manage their human capital efficiently
              and effectively.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Core Services
            </Typography>
            <Typography variant="body1" paragraph>
              Mind Hive specializes in employee data management, efficient leave
              approval systems, and streamlined designations management.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Technological Edge
            </Typography>
            <Typography variant="body1" paragraph>
              Mind Hive leverages cutting-edge technologies such as artificial
              intelligence, machine learning, and cloud computing to provide
              robust and scalable HRMS solutions. Our systems are designed to be
              user-friendly, customizable, and secure, ensuring a seamless
              experience for HR professionals and employees alike.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Customer Commitment
            </Typography>
            <Typography variant="body1" paragraph>
              At Mind Hive, we are committed to delivering exceptional customer
              service. Our team of HR and IT experts work closely with clients
              to understand their unique needs and tailor our solutions
              accordingly. We provide continuous support and training to ensure
              our clients get the most out of our systems.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Vision
            </Typography>
            <Typography variant="body1" paragraph>
              To be a leader in the HRMS industry, empowering organizations to
              achieve their HR goals through innovative technology and
              exceptional service.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Mission
            </Typography>
            <Typography variant="body1" paragraph>
              To transform HR management by providing comprehensive,
              user-friendly, and scalable solutions that enhance the efficiency
              and effectiveness of HR departments globally.
            </Typography>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default About;
