import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db, storage } from '../utils/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Typography, Container, TextField, Button, List, ListItem, Box, IconButton, AppBar, Toolbar, CssBaseline, Switch, Avatar, createTheme, ThemeProvider, Dialog, DialogContent,CircularProgress  } from '@mui/material';
import { Send, AttachFile, Brightness4, Brightness7, Check } from '@mui/icons-material';
import styled from 'styled-components';
import AvatarImage from '../assets/2.png'; // Update with your avatar image path

const ChatPage = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const currentUser = location.state?.currentUser || 'client'; // Default to 'client' if not provided
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

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

      // Update read status for received messages
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().sender !== currentUser && !doc.data().read) {
          updateDoc(doc.ref, { read: true });
        }
      });
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

    setUploading(true);

    const messagesCollectionRef = collection(db, 'tickets', ticketId, 'messages');

    try {
      if (file) {
        const storageRef = ref(storage, `attachments/${ticketId}/messages/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(snapshot.ref);

        // Store message with file URL in Firestore
        await addDoc(messagesCollectionRef, {
          sender: currentUser,
          file: fileUrl,
          timestamp: serverTimestamp(),
          read: false,
        });

      } else {
        // Store text message in Firestore
        await addDoc(messagesCollectionRef, {
          sender: currentUser,
          message: newMessage,
          timestamp: serverTimestamp(),
          read: false,
        });
      }

      setNewMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleModeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
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

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setPreviewImage(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default">
        <Toolbar>
          <Avatar alt="Chat User" src={AvatarImage} />
          <Typography variant="h6" noWrap style={{ flexGrow: 1, marginLeft: 10 }}>
            Chat for Ticket ID: {ticketId}
          </Typography>
          <Switch checked={darkMode} onChange={handleModeChange} icon={<Brightness7 />} checkedIcon={<Brightness4 />} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ padding: '20px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: darkMode ? '#333' : '#fff' }}>
        <List style={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((msg) => (
            <ListItem key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: currentUser === msg.sender ? 'flex-end' : 'flex-start' }}>
              <MessageBox isOwnMessage={currentUser === msg.sender} theme={theme} darkMode={darkMode}>
                {msg.message && (
                  <Typography variant="body2" component="p" style={{ marginBottom: '5px' }}>
                    {msg.message}
                  </Typography>
                )}
                {msg.file && (
                  <>
                    {msg.file.startsWith('data:image') && (
                      <img
                        src={msg.file}
                        alt="file"
                        style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' }}
                        onClick={() => { setPreviewImage(msg.file); setOpenImageDialog(true); }}
                      />
                    )}
                    {msg.file.startsWith('video/') && (
                      <video controls style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' }}>
                        <source src={msg.file} type={msg.file.split('.').pop()} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {msg.file.startsWith('application/pdf') && (
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
                  </>
                )}
                <Typography variant="caption" display="block" style={{ textAlign: 'right', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                  {msg.sender === currentUser ? 'You' : msg.sender}
                  {msg.sender === currentUser && (
                    <Check style={{ marginLeft: '5px', color: msg.read ? 'blue' : 'grey' }} />
                  )}
                </Typography>
              </MessageBox>
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
            accept="image/*,video/*,.pdf"
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
          <Button variant="contained" color="primary" endIcon={<Send />} type="submit">
            {uploading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>
        <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
          <DialogContent>{previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%', borderRadius: '10px' }} />}</DialogContent>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

// Create a styled component for Message box
const MessageBox = styled(Box)`
  background-color: ${({ isOwnMessage, theme, darkMode }) =>
    isOwnMessage ? (darkMode ? theme.palette.primary.dark : theme.palette.primary.main) : darkMode ? theme.palette.background.default : theme.palette.background.paper};
  color: ${({ isOwnMessage, theme, darkMode }) =>
    isOwnMessage ? theme.palette.primary.contrastText : theme.palette.text.primary};
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-break: break-word;
`;

export default ChatPage;

