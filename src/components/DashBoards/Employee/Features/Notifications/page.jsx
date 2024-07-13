import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, writeBatch, collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../../../utils/firebaseConfig';
import {
  IconButton, Typography, Badge, Menu, MenuItem, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import { Notifications } from '@mui/icons-material';
import bellSound from '../Notifications/bell.wav'; // Import the sound file correctly

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const notificationSound = useRef(new Audio(bellSound));

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const notificationsCollectionRef = collection(db, `employeeDetails/${userId}/notifications`);

      // Real-time listener for notifications
      const unsubscribe = onSnapshot(notificationsCollectionRef, (querySnapshot) => {
        const notificationsData = [];
        querySnapshot.forEach((doc) => {
          const notification = { id: doc.id, ...doc.data() };
          notificationsData.push(notification);
        });
        // Sort notifications by timestamp (newest first)
        notificationsData.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(notificationsData);

        // Update unseen count
        const unseenNotifications = notificationsData.filter(notification => !notification.seen).length;
        setUnseenCount(unseenNotifications);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleOpenNotifications = async (event) => {
    setAnchorEl(event.currentTarget);
    
    if (unseenCount > 0) {
      notificationSound.current.play().catch(error => console.error('Error playing notification sound:', error));
    }

    // Update notifications status to 'seen' in the database
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const batch = writeBatch(db);

      notifications.forEach((notification) => {
        if (!notification.seen) {
          const docRef = doc(db, `employeeDetails/${userId}/notifications`, notification.id);
          batch.update(docRef, { seen: true });
        }
      });

      await batch.commit();
    }
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" px={2}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Your other header elements can go here */}
       
      </Box>
      <Box>
        <IconButton
          color="inherit"
          onClick={handleOpenNotifications}
          sx={{ ml: 'auto' }}
        >
          <Badge badgeContent={unseenCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNotifications}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            style: {
              maxHeight: '400px',
              width: '300px',
            }
          }}
        >
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Notification Icon">
                        <Notifications />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {new Date(notification.timestamp?.toDate()).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </div>
              ))
            ) : (
              <MenuItem>No notifications</MenuItem>
            )}
          </List>
        </Menu>
      </Box>
    </Box>
  );
};

export default Notification;
