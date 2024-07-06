import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';
import {
  CircularProgress, Box, Dialog,DialogTitle,DialogContent, DialogActions,Typography, Button, Avatar, List, ListItem, ListItemIcon, ListItemText,
  Divider, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme,
} from '@mui/material';
import {
  AccountCircle, Work, Article, AccountBalance, EventAvailable, Logout
} from '@mui/icons-material';
import companyLogo from '../../../assets/2.png';
import {
  Container, Header, TitleContainer, CompanyLogo, Main, Sidebar, Content, Section, SectionTitle,
  DataItem, ViewButton, MarkButton
} from './styles';
import {
  IconButton, Table, TableBody, TableCell, TableContainer, TableRow
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ZodCountDisplay from "./Features/ZodCountDisplay";
import { Close } from '@mui/icons-material';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [lastMarkedTime, setLastMarkedTime] = useState(null);
  const [currentSection, setCurrentSection] = useState('attendance');
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showIfscCode, setShowIfscCode] = useState(false);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          const employeeDetailsDocRef = doc(db, 'employeeDetails', userId);
          const employeeDetailsDocSnap = await getDoc(employeeDetailsDocRef);

          if (employeeDetailsDocSnap.exists()) {
            const userData = employeeDetailsDocSnap.data();
            setUserData(userData);
            fetchAttendanceData(userId);
          } else {
            console.log('No matching document for Employee.');
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

  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (now > endOfDay && !attendanceMarked) {
      markAttendance('absent');
    }
  }, [attendanceMarked]);

  const fetchAttendanceData = async (userId) => {
    const today = new Date();
    const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    const attendanceDocRef = doc(
      db,
      `employeeDetails/${userId}/attendance`,
      formattedDate
    );
    const attendanceDocSnap = await getDoc(attendanceDocRef);

    if (attendanceDocSnap.exists()) {
      setAttendanceData(attendanceDocSnap.data());
      setAttendanceMarked(true);
    } else {
      setAttendanceData({ attendance: 'absent' });
      setAttendanceMarked(false);
    }
  };

  const markAttendance = async (attendanceStatus) => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const today = new Date();
      const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

      const attendanceDocRef = doc(
        db,
        `employeeDetails/${userId}/attendance`,
        formattedDate
      );

      try {
        const prevDay = new Date(today);
        prevDay.setDate(today.getDate() - 1);

        const prevFormattedDate = `${prevDay.getDate()}-${prevDay.getMonth() + 1}-${prevDay.getFullYear()}`;
        const prevAttendanceDocRef = doc(
          db,
          `employeeDetails/${userId}/attendance`,
          prevFormattedDate
        );
        const prevAttendanceDocSnap = await getDoc(prevAttendanceDocRef);

        await setDoc(attendanceDocRef, {
          attendance: attendanceStatus,
          timestamp: serverTimestamp(),
        });

        setAttendanceData({ attendance: attendanceStatus });
        setAttendanceMarked(true);
        setLastMarkedTime(today);

        if (attendanceStatus === 'present' && prevAttendanceDocSnap.exists()) {
          // Do nothing if previous day is already marked
        } else if (
          attendanceStatus === 'present' &&
          !prevAttendanceDocSnap.exists()
        ) {
          await setDoc(prevAttendanceDocRef, {
            attendance: 'absent',
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error marking attendance:', error);
      }
    }
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleDepartmentClick = (dept) => {
    console.log(`Clicked department: ${dept}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const handleToggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  const handleToggleIfscCode = () => {
    setShowIfscCode(!showIfscCode);
  };

  const handleViewFile = (fileUrl) => {
    setDialogImageUrl(fileUrl);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogImageUrl('');
  };



  const ContentSection = () => {
    switch (currentSection) {
      case 'profile':
        return (
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 260px)', paddingRight: '15px', paddingBottom: '80px' }}>
            <div style={{ marginBottom: '30px' }}>
              <Avatar src={userData.passportPhotoUrl} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
            </div>
            <TableContainer style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Name:</strong></TableCell>
                    <TableCell>{userData.fullName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Email:</strong></TableCell>
                    <TableCell>{userData.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Address:</strong></TableCell>
                    <TableCell>{userData.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Phone:</strong></TableCell>
                    <TableCell>{userData.phoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Alternative Phone No:</strong></TableCell>
                    <TableCell>{userData.alternativePhoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Microsoft Teams Id:</strong></TableCell>
                    <TableCell>{userData.teamsId}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      case 'workingDepartment':
        return (
          <Section>
            <SectionTitle>Department & Role</SectionTitle>
            {userData.department && userData.department.length > 0 ? (
              userData.department.map((dept, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => handleDepartmentClick(dept)}
                  style={{ marginRight: '10px', marginBottom: '10px', textTransform: 'none' }}
                >
                  {dept}
                </Button>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                No department information available.
              </Typography>
            )}
            <ZodCountDisplay userId={auth.currentUser.uid} /> {/* Pass userId here */}
          </Section>

        );
      case 'documents':
        return (
          <Section>
          <SectionTitle>Documents</SectionTitle>
          {userData.passportPhotoUrl && (
            <DataItem>
              <Typography variant="body1">
                <strong>Passport Size Photo:</strong>
              </Typography>
              <Box sx={{ display: 'block', alignItems: 'center', marginTop: '8px' }}>
                <ViewButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewFile(userData.passportPhotoUrl)}
                >
                  View
                </ViewButton>
              </Box>
            </DataItem>
          )}
          {userData.resumeUrl && (
            <DataItem>
              <Typography variant="body1">
                <strong>Resume:</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <ViewButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewFile(userData.resumeUrl)}
                >
                  View
                </ViewButton>
              </Box>
            </DataItem>
          )}
          {userData.aadharCardUrl && (
            <DataItem>
              <Typography variant="body1">
                <strong>Aadhar Card:</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <ViewButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewFile(userData.aadharCardUrl)}
                >
                  View
                </ViewButton>
              </Box>
            </DataItem>
          )}
          {userData.panCardUrl && (
            <DataItem>
              <Typography variant="body1">
                <strong>Pan Card:</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <ViewButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewFile(userData.panCardUrl)}
                >
                  View
                </ViewButton>
              </Box>
            </DataItem>
          )}
    
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <img src={dialogImageUrl} alt="Document" style={{ width: '100%' }} />
            </DialogContent>
            <DialogActions>
             
            </DialogActions>
          </Dialog>
        </Section>
        );
      case 'bank':
        return (
          <Section>
            <SectionTitle>Bank Details</SectionTitle>
            <DataItem>
              <Typography variant="body1">
                <strong>Bank Name:</strong> {userData.bankName}
              </Typography>
            </DataItem>
            <DataItem>
              <Typography variant="body1">
                <strong>Account Holder Name:</strong> {userData.accountHolderName}
              </Typography>
            </DataItem>
            <DataItem>
              <Typography variant="body1">
                <strong>Account Number:</strong> {showAccountNumber ? userData.bankAccountNumber : '************'}
              </Typography>
              <IconButton onClick={handleToggleAccountNumber}>
                {showAccountNumber ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </DataItem>
            <DataItem>
              <Typography variant="body1">
                <strong>IFSC Code:</strong> {showIfscCode ? userData.ifscCode : '********'}
              </Typography>
              <IconButton onClick={handleToggleIfscCode}>
                {showIfscCode ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </DataItem>
          </Section>
        );
      case 'attendance':
        return (
          <Section>
            <SectionTitle>Attendance</SectionTitle>
            {attendanceData.attendance === 'leave' ? (
              <Typography variant="body1" color="textSecondary" >
                You are on leave today 😄.
              </Typography>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>Today's Attendance:</strong>{' '}
                  {attendanceData.attendance || 'Not marked yet'}
                </Typography>
                {attendanceMarked && (
                  <Typography variant="body1">
                    <strong>Last Marked Time:</strong>{' '}
                    {lastMarkedTime
                      ? `${lastMarkedTime.toLocaleDateString()} ${lastMarkedTime.toLocaleTimeString()}`
                      : 'Not available'}
                  </Typography>
                )}
                {!attendanceMarked && (
                  <MarkButton
                    variant="contained"
                    color="primary"
                    onClick={() => markAttendance('present')}
                  >
                    Mark Present
                  </MarkButton>
                )}
              </>
            )}
          </Section>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',  // Ensures it covers the entire viewport height
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5">No user data found for Employee.</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleContainer>
          <Typography variant="h4">Welcome to PulseZest!</Typography>
          <CompanyLogo src={companyLogo} alt="Company Logo" />
        </TitleContainer>
        <Button
          startIcon={<Logout />}
          variant="contained"
          color="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>
      <Main>
        {!isMobileView && (
          <>
            <Sidebar>
              <List component="nav">
                <ListItem
                  button
                  selected={currentSection === 'profile'}
                  onClick={() => handleSectionChange('profile')}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem
                  button
                  selected={currentSection === 'workingDepartment'}
                  onClick={() => handleSectionChange('workingDepartment')}
                >
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText primary="Department & Role" />
                </ListItem>
                <ListItem
                  button
                  selected={currentSection === 'documents'}
                  onClick={() => handleSectionChange('documents')}
                >
                  <ListItemIcon>
                    <Article />
                  </ListItemIcon>
                  <ListItemText primary="Documents" />
                </ListItem>
                <ListItem
                  button
                  selected={currentSection === 'bank'}
                  onClick={() => handleSectionChange('bank')}
                >
                  <ListItemIcon>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText primary="Bank Details" />
                </ListItem>
                <ListItem
                  button
                  selected={currentSection === 'attendance'}
                  onClick={() => handleSectionChange('attendance')}
                >
                  <ListItemIcon>
                    <EventAvailable />
                  </ListItemIcon>
                  <ListItemText primary="Attendance" />
                </ListItem>
              </List>
            </Sidebar>
            <Divider orientation="vertical" flexItem />
          </>
        )}
        <Content>
          <ContentSection />
        </Content>
      </Main>
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
            label="Attendance"
            value="attendance"
            icon={<EventAvailable />}
            sx={{ minWidth: 'auto', flex: 1 }}
          />
          <BottomNavigationAction
            label="Profile"
            value="profile"
            icon={<AccountCircle />}
            sx={{ minWidth: 'auto', flex: 1 }}
          />
          <BottomNavigationAction
            label="Department"
            value="workingDepartment"
            icon={<Work />}
            sx={{ minWidth: 'auto', flex: 1 }}
          />
          <BottomNavigationAction
            label="Documents"
            value="documents"
            icon={<Article />}
            sx={{ minWidth: 'auto', flex: 1 }}
          />
          <BottomNavigationAction
            label="Bank"
            value="bank"
            icon={<AccountBalance />}
            sx={{ minWidth: 'auto', flex: 1 }}
          />
        </BottomNavigation>

      )}
    </Container>
  );
};

export default EmployeeDashboard;
