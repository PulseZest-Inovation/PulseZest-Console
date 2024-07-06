import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../utils/firebaseConfig';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Hidden, useMediaQuery, createTheme, ThemeProvider, BottomNavigation, BottomNavigationAction, Box, CssBaseline, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Work, Article, AccountBalance, Help } from '@mui/icons-material';
import Ticket from "./Ticket";


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

  const theme = createTheme(); // Create a theme instance
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile view

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (isMobileView) {
      setMobileOpen(false); // Close sidebar on mobile after selecting a section
    }
  };

  const drawer = (
    <div>
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
        <ListItem button onClick={() => handleSectionChange('help')}>
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
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Web Developer Dashboard!</h1>
          <button
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>
        <main style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>User Data:</h2>
            <p>No user data found for Web Developer.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply global styles */}
      <Box sx={{ display: 'flex' }}>
        {/* Desktop Sidebar */}
        <Hidden mdDown>
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': { width: 240 },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Hidden>

        {/* Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar position="static">
            <Toolbar>
              {isMobileView && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Web Developer Dashboard
              </Typography>
              {/* Render Logout Button in Header only on Desktop */}
              {!isMobileView && (
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  <Typography variant="button">Logout</Typography>
                </IconButton>
              )}
            </Toolbar>
          </AppBar>

          {/* Mobile Sidebar */}
          {isMobileView && (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: 240 },
              }}
            >
              {drawer}
            </Drawer>
          )}

          <div>
            {currentSection === 'help' && (
              <>
                <Ticket userId={auth.currentUser?.uid} />
              </>
            )}
          </div>

          {/* Main Content */}
          <Box sx={{ mt: 3, p: 3, bgcolor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {currentSection === 'profile' && 'Profile Details'}
              {currentSection === 'project' && 'Project Details'}
              {currentSection === 'security' && 'Security Details'}
              {currentSection === 'additional' && 'Additional Details'}
            </Typography>

            <Box sx={{ bgcolor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', p: 3, borderRadius: '4px' }}>
              {currentSection === 'profile' && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Full Name:</strong> {userData.fullName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Email:</strong> {userData.email}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Phone Number:</strong> {userData.phoneNumber}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>User ID:</strong> {userData.userId}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>User Type:</strong> {userData.userType}
                  </Typography>
                </>
              )}

              {currentSection === 'project' && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Website Name:</strong> {userData.websiteName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Custom Domain:</strong> {userData.customDomain}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Domain:</strong> {userData.domain}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Host:</strong> {userData.host}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Project Live:</strong> {userData.projectLive ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Registration Date:</strong> {userData.registrationDate}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Purpose:</strong> {userData.purpose}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Reference:</strong> {userData.reference}
                  </Typography>
                </>
              )}



              {currentSection === 'security' && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Password:</strong> {userData.password}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Confirm Password:</strong> {userData.confirmPassword}
                  </Typography>
                </>
              )}

              {currentSection === 'additional' && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Description:</strong> {userData.description}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Project Live Date:</strong> {userData.projectLiveDate || 'Not specified'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>User Profile:</strong> {userData.userProfile || 'Not specified'}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Bottom Navigation for Mobile */}
          {isMobileView && (
            <BottomNavigation
              value={currentSection}
              onChange={(event, newValue) => handleSectionChange(newValue)}
              showLabels={false}
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 -3px 5px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'flex-start' // Align items to the left
              }}
            >
              <BottomNavigationAction
                label="Profile"
                value="profile"
                icon={<AccountCircle />}
                sx={{ minWidth: 'auto', flex: 1 }}
              />
              <BottomNavigationAction
                label="Project"
                value="project"
                icon={<Work />}
                sx={{ minWidth: 'auto', flex: 1 }}
              />
              <BottomNavigationAction
                label="Help"
                value="help"
                icon={<Help />}
                sx={{ minWidth: 'auto', flex: 1 }}
              />
              <BottomNavigationAction
                label="Security"
                value="security"
                icon={<Article />}
                sx={{ minWidth: 'auto', flex: 1 }}
              />
              <BottomNavigationAction
                label="Additional"
                value="additional"
                icon={<AccountBalance />}
                sx={{ minWidth: 'auto', flex: 1 }}
              />
            </BottomNavigation>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default WebDevDetails;
