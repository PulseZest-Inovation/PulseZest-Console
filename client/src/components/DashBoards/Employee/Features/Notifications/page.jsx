import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, writeBatch, collection, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
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
  const isNewNotification = useRef(false); // Ref to track new notifications
  const [isSoundUnlocked, setIsSoundUnlocked] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const notificationsCollectionRef = collection(db, `employeeDetails/${userId}/notifications`);

      // Fetch initial notifications and check for 'notSeen' sound
      const fetchInitialNotifications = async () => {
        try {
          const querySnapshot = await getDocs(notificationsCollectionRef);
          const initialNotifications = [];

          querySnapshot.forEach((doc) => {
            const notification = { id: doc.id, ...doc.data() };
            initialNotifications.push(notification);

            if (!notification.seen && notification.sound === 'notSeen') {
              if (isSoundUnlocked) {
                notificationSound.current.play().catch(error => console.error('Error playing notification sound:', error));
              }
            }
          });

          setNotifications(initialNotifications);

          // Update unseen count
          const unseenNotifications = initialNotifications.filter(notification => !notification.seen && notification.sound === 'notSeen').length;
          setUnseenCount(unseenNotifications);

          isNewNotification.current = true; // Set flag to true after the first update
        } catch (error) {
          console.error('Error fetching initial notifications:', error);
        }
      };

      fetchInitialNotifications();

      // Real-time listener for notifications
      const unsubscribe = onSnapshot(notificationsCollectionRef, (querySnapshot) => {
        const updatedNotifications = [];

        querySnapshot.forEach((doc) => {
          const notification = { id: doc.id, ...doc.data() };
          updatedNotifications.push(notification);

          if (!notification.seen && notification.sound === 'notSeen') {
            if (isSoundUnlocked) {
              notificationSound.current.play().catch(error => console.error('Error playing notification sound:', error));
            }
          }
        });

        // Sort notifications by timestamp (newest first)
        updatedNotifications.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(updatedNotifications);

        // Update unseen count
        const unseenNotifications = updatedNotifications.filter(notification => !notification.seen && notification.sound === 'notSeen').length;
        setUnseenCount(unseenNotifications);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, [isSoundUnlocked]);

  useEffect(() => {
    const unlockSound = () => {
      setIsSoundUnlocked(true);
      document.removeEventListener('click', unlockSound);
    };
    document.addEventListener('click', unlockSound);

    return () => document.removeEventListener('click', unlockSound);
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
    isNewNotification.current = false; // Reset flag when user opens notifications

    // Update notifications status to 'seen' in the database
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const batch = writeBatch(db);

      notifications.forEach((notification) => {
        if (!notification.seen && notification.sound === 'notSeen') {
          const docRef = doc(db, `employeeDetails/${userId}/notifications`, notification.id);
          batch.update(docRef, { seen: true, sound: 'seen' });
        }
      });

      try {
        await batch.commit();
        setUnseenCount(0); // Reset unseen count after marking as seen
      } catch (error) {
        console.error('Error marking notifications as seen:', error);
      }
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
