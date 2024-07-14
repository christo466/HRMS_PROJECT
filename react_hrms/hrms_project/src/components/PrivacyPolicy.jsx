import Header from './index'; 
import Footer from './Footer'; 
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  && {
    min-height: 78vh; 
    display: flex;
    flex-direction: column;
    padding-top: 70px;
  }
`;

const StyledPaper = styled(Paper)`
  && {
    padding: 16px;
    margin-bottom: 20px;
    flex-grow: 1; 
  }
`;

const PrivacyPolicy = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <StyledContainer>
        <div className="flex-container">
          <StyledPaper elevation={3}>
            <Typography variant="h4" sx={{ color: '#000000' }}>
              Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ color: '#000000' }}>
              Effective Date: 14-07-2024
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#000000' }}>
              Welcome to Mind Hive Privacy Policy. At Mind Hive, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [www.mindhive.com], including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the Site). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#000000' }}>
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the Last Updated date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Site after the date such revised Privacy Policy is posted.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#000000' }}>
              <strong>Collection of Information</strong>
              <br />
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              <ul>
                <li>Personal Data</li>
                <li>Non-Personal Information</li>
              </ul>
            </Typography>
           
          </StyledPaper>
        </div>
      
      </StyledContainer>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;








