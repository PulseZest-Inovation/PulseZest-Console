import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../utils/firebaseConfig';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Hidden, useMediaQuery,
  createTheme, ThemeProvider, BottomNavigation, BottomNavigationAction, Box, CssBaseline, Button, Tooltip
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Work, Article, AccountBalance, Help, ExitToApp } from '@mui/icons-material';
import Ticket from "./Ticket";
import Logo from '../../../../assets/1.png';
import ActionButtons from './buttons/page';


const WebDevDetails = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('profile');
  const { userId } = useParams();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        try {
          const webDevDocRef = doc(collection(db, 'webDevelopment'), userId);
          const webDevDocSnap = await getDoc(webDevDocRef);

          if (webDevDocSnap.exists()) {
            setUserData(webDevDocSnap.data());
          } else {
            console.log('No matching document for Web Developer.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f44336',
      },
    },
  });

  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (isMobileView) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem
          button
          selected={currentSection === 'profile'}
          onClick={() => handleSectionChange('profile')}
        >
          <ListItemText primary="Profile Details" />
        </ListItem>
        <ListItem
          button
          selected={currentSection === 'project'}
          onClick={() => handleSectionChange('project')}
        >
          <ListItemText primary="Project Details" />
        </ListItem>
        <ListItem
          button
          selected={currentSection === 'help'}
          onClick={() => handleSectionChange('help')}
        >
          <ListItemText primary="Help & Security" />
        </ListItem>
        <ListItem
          button
          selected={currentSection === 'security'}
          onClick={() => handleSectionChange('security')}
        >
          <ListItemText primary="Security Details" />
        </ListItem>
        <ListItem
          button
          selected={currentSection === 'additional'}
          onClick={() => handleSectionChange('additional')}
        >
          <ListItemText primary="Additional Details" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <img src={Logo} alt="Logo" style={{ marginRight: 8, width: 44, height: 44 }} />
          <Typography variant="h4" component="h1">
            Welcome to Web Developer Dashboard!
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="h6">User Data:</Typography>
          <Typography>No user data found for Web Developer.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {isMobileView && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <img src={Logo} alt="Logo" style={{ marginRight: 8, width: 44, height: 44 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {userData.fullName} Dashboard
            </Typography>
            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                <ExitToApp />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Hidden smDown>
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            {drawer}
          </Drawer>
        </Hidden>

        {isMobileView && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            {drawer}
          </Drawer>
        )}

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Box sx={{ mt: 2 }}>
            {currentSection === 'profile' && (
              <>
                <Typography variant="h5" gutterBottom>Profile Details</Typography>
                <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom><strong>Full Name:</strong> {userData.fullName}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Email:</strong> {userData.email}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Phone Number:</strong> {userData.phoneNumber}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>User ID:</strong> {userData.userId}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>User Type:</strong> {userData.userType}</Typography>
             
                  
                </Box>

               

              </>
            )}

            {currentSection === 'project' && (
            <>
            <Box 
              sx={{ 
                height: isMobileView ? 'calc(100vh - 100px)' : 'auto', // Dynamic height for mobile
                overflowY: isMobileView ? 'scroll' : 'visible', // Scroll on mobile view
              }}
            >
              <Typography variant="h5" gutterBottom>Project Details</Typography>
              <Box 
                  sx={{ 
                      bgcolor: 'background.paper', 
                      boxShadow: 1, 
                      borderRadius: 1, 
                      p: 3,
                      minHeight: '100vh' ,
                      overflow: 'scroll'
                  }}
              >
                  <Typography variant="subtitle1" gutterBottom><strong>Website Name:</strong> {userData.websiteName}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Admin Domain:</strong> {userData.adminDomain}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Domain:</strong> {userData.domain}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Host:</strong> {userData.host}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Project Live:</strong> {userData.projectLive ? 'Yes' : 'No'}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Registration Date:</strong> {userData.registrationDate}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Purpose:</strong> {userData.purpose}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Reference:</strong> {userData.reference}</Typography>
              
                  <ActionButtons domain={userData.domain} adminDomain={userData.adminDomain} />
              </Box>
            </Box>
          </>
            )}

            {currentSection === 'security' && (
              <>
                <Typography variant="h5" gutterBottom>Security Details</Typography>
                <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom><strong>Password:</strong> {userData.password}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Confirm Password:</strong> {userData.confirmPassword}</Typography>
                </Box>
              </>
            )}

            {currentSection === 'additional' && (
              <>
                <Typography variant="h5" gutterBottom>Additional Details</Typography>
                <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom><strong>Description:</strong> {userData.description}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>Project Live Date:</strong> {userData.projectLiveDate || 'Not specified'}</Typography>
                  <Typography variant="subtitle1" gutterBottom><strong>User Profile:</strong> {userData.userProfile || 'Not specified'}</Typography>
                </Box>
              </>
            )}

            {currentSection === 'help' && (
              <>
                <Typography variant="h5" gutterBottom>Help & Security</Typography>
                <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1, p: 3 }}>
                  <Ticket userId={auth.currentUser?.uid} />
                </Box>
              </>
            )}
          </Box>
        </Box>

        {isMobileView && (
          <BottomNavigation
            value={currentSection}
            onChange={(event, newValue) => handleSectionChange(newValue)}
            showLabels={true}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 -3px 5px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            <BottomNavigationAction
              label="Profile"
              value="profile"
              icon={<AccountCircle />}
            />
            <BottomNavigationAction
              label="Project"
              value="project"
              icon={<Work />}
            />
            <BottomNavigationAction
              label="Help"
              value="help"
              icon={<Help />}
            />
            <BottomNavigationAction
              label="Security"
              value="security"
              icon={<Article />}
            />
            <BottomNavigationAction
              label="Additional"
              value="additional"
              icon={<AccountBalance />}
            />
          </BottomNavigation>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default WebDevDetails;
