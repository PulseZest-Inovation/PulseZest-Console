import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db, storage } from '../utils/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  CssBaseline,
  Switch,
  Avatar,
  createTheme,
  ThemeProvider,
  Snackbar,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Send, AttachFile, Brightness4, Brightness7 } from '@mui/icons-material';

const ChatPage = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const currentUser = location.state?.currentUser || 'client'; // Default to 'client' if not provided
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const messagesCollectionRef = collection(db, 'tickets', ticketId, 'messages');
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    const typingDocRef = doc(db, 'tickets', ticketId, 'types', 'typing');
    const unsubscribeTyping = onSnapshot(typingDocRef, (doc) => {
      const typingData = doc.data();
      if (typingData && typingData.typingUser !== currentUser) {
        setTypingUser(typingData.typingUser);
      } else {
        setTypingUser(null);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, [ticketId, currentUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    if (!currentUser) {
      console.error('currentUser is undefined');
      return;
    }

    const messagesCollectionRef = collection(db, 'tickets', ticketId, 'messages');

    let fileUrl = null;
    if (file) {
      const storageRef = ref(storage, `messages/${ticketId}/${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);

      // Store message with file URL in Firestore
      await addDoc(messagesCollectionRef, {
        sender: currentUser,
        file: fileUrl,
        timestamp: serverTimestamp(),
      });
    } else {
      // Store text message in Firestore
      await addDoc(messagesCollectionRef, {
        sender: currentUser,
        message: newMessage,
        timestamp: serverTimestamp(),
      });
    }

    setNewMessage('');
    setFile(null);
    setOpenSnackbar(true); // Open snackbar when message is sent
  };

  const handleModeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setNewMessage(file.name);

    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setPreviewImage(reader.result);
          setOpenImageDialog(true);
        };
      } else {
        setPreviewImage(null); // Reset preview for non-image files
      }
    }
  };

  const handleTyping = (event) => {
    setNewMessage(event.target.value);

    setDoc(doc(db, 'tickets', ticketId, 'types', 'typing'), { typingUser: currentUser });

    setTimeout(() => {
      setDoc(doc(db, 'tickets', ticketId, 'types', 'typing'), { typingUser: null });
    }, 2000);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setPreviewImage(null);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default">
        <Toolbar>
          <Avatar alt="Chat User" src="/static/images/avatar/1.jpg" />
          <Typography variant="h6" noWrap style={{ flexGrow: 1, marginLeft: 10 }}>
            Chat for Ticket ID: {ticketId}
          </Typography>
          <Switch checked={darkMode} onChange={handleModeChange} icon={<Brightness7 />} checkedIcon={<Brightness4 />} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ padding: '20px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <List style={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((msg) => (
            <ListItem key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: currentUser === msg.sender ? 'flex-end' : 'flex-start' }}>
              <Box
                sx={{
                  bgcolor: currentUser === msg.sender ? 'primary.main' : 'background.paper',
                  color: currentUser === msg.sender ? 'primary.contrastText' : 'text.primary',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.message && (
                  <Typography variant="body2" component="p" style={{ marginBottom: '5px' }}>
                    {msg.message}
                  </Typography>
                )}
                {msg.file && msg.file.match(/\.(jpg|jpeg|png|gif)$/) && (
                  <img 
                    src={msg.file} 
                    alt="file" 
                    style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' }} 
                    onClick={() => { setPreviewImage(msg.file); setOpenImageDialog(true); }}
                  />
                )}
                {msg.file && msg.file.match(/\.(mp4|webm|ogg)$/) && (
                  <video 
                    controls 
                    style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' }} 
                  >
                    <source src={msg.file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {msg.file && msg.file.endsWith('.pdf') && (
                  <iframe
                    src={msg.file}
                    title="file"
                    style={{
                      width: '100%',
                      height: '500px',
                      border: 'none',
                      borderRadius: '10px',
                      marginTop: '5px',
                      backgroundColor: darkMode ? '#333' : '#fff',
                    }}
                  />
                )}
                <Typography variant="caption" display="block" style={{ textAlign: 'right', marginTop: '5px' }}>
                  {msg.sender === currentUser ? 'You' : msg.sender}
                </Typography>
              </Box>
            </ListItem>
          ))}
          {typingUser && (
            <ListItem style={{ display: 'flex', justifyContent: typingUser === currentUser ? 'flex-end' : 'flex-start' }}>
              <Typography variant="caption" style={{ fontStyle: 'italic' }}>
                {typingUser} is typing...
              </Typography>
            </ListItem>
          )}
        </List>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleTyping}
            style={{ marginRight: '10px' }}
          />
          <input
            accept="image/*,application/pdf,video/*"
            style={{ display: 'none' }}
            id="file-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-input">
            <IconButton color="primary" component="span" style={{ marginRight: '10px' }}>
              <AttachFile />
            </IconButton>
          </label>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Send />}
            type="submit"
          >
            Send
          </Button>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="File uploaded"
        />
        <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
          <DialogContent>
            {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%', borderRadius: '10px' }} />}
          </DialogContent>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default ChatPage;
