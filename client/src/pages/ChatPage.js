import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db, storage, auth } from '../utils/firebaseConfig'; // Import auth from firebase config
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Typography, Container, TextField, Button, List, ListItem, Box, IconButton, AppBar, Toolbar, CssBaseline, Switch, Avatar, createTheme, ThemeProvider, Dialog, DialogContent, CircularProgress } from '@mui/material';
import { Send, AttachFile, Brightness4, Brightness7, Check, Close } from '@mui/icons-material';
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
  const [fileUploading, setFileUploading] = useState(false); // New state for file uploading
  const [fileName, setFileName] = useState(''); // New state for file name
  const [darkMode, setDarkMode] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [chatClosed, setChatClosed] = useState(false); // New state for chat closed
  const [isClient, setIsClient] = useState(false); // New state to check if the user is a client

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const checkClientStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const { uid } = user;
      const appDevDoc = await getDoc(doc(db, 'appDevelopment', uid));
      const webDevDoc = await getDoc(doc(db, 'webDevelopment', uid));

      if (appDevDoc.exists() || webDevDoc.exists()) {
        setIsClient(true);
      } else {
        setIsClient(false);
      }
    };

    checkClientStatus();
  }, []);

  useEffect(() => {
    const fetchChatStatus = async () => {
      const chatDocRef = doc(db, 'tickets', ticketId);
      const chatDocSnapshot = await getDoc(chatDocRef);
      if (chatDocSnapshot.exists()) {
        const { chatClosed } = chatDocSnapshot.data();
        setChatClosed(chatClosed || false);
      }
    };

    fetchChatStatus();
  }, [ticketId]);

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
        setFileUploading(true); // Set file uploading state
        const storageRef = ref(storage, `attachments/${ticketId}/messages/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(snapshot.ref);

        // Store message with file URL in Firestore
        await addDoc(messagesCollectionRef, {
          sender: currentUser,
          file: fileUrl,
          fileType: file.type,
          timestamp: serverTimestamp(),
          read: false,
        });
        setFileUploading(false); // Reset file uploading state
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
      setFileName(''); // Reset file name
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
    setFileName(selectedFile.name); // Set file name

    if (selectedFile && selectedFile.type && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setPreviewImage(reader.result);
        setOpenImageDialog(true);
      };
    } else {
      setPreviewImage(null); // Reset preview for non-image files
    }
  };

  const handleTyping = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    } else {
      setNewMessage(event.target.value);
      setDoc(doc(db, 'tickets', ticketId, 'types', 'typing'), { typingUser: currentUser });

      setTimeout(() => {
        setDoc(doc(db, 'tickets', ticketId, 'types', 'typing'), { typingUser: null });
      }, 2000);
    }
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setPreviewImage(null);
  };

  const formatMessage = (message) => {
    // Replace bold markers with <strong> tags
    return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const toggleChatClosed = async () => {
    try {
      // Fetch chat details from Firestore
      const ticketDocRef = doc(db, 'tickets', ticketId);
      const ticketDocSnapshot = await getDoc(ticketDocRef);
  
      if (ticketDocSnapshot.exists()) {
        const ticketData = ticketDocSnapshot.data();
        const {
          email,
          message,
          priority,
          relatedService,
          subject,
        } = ticketData;
  
        // Prepare the data to send to the API
        const apiData = {
          ticketId,
          email,
          subject,
          priority,
          relatedService,
          message,
        };
  
        // Send the data to the API
        const response = await fetch('https://pz-api-system.pulsezest.com/api/close-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Update the Firestore document to close the chat
        await updateDoc(ticketDocRef, { chatClosed: true });
        setChatClosed(true);
      } else {
        console.error('Ticket document not found');
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
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
          {!isClient && !chatClosed && (
            <Button variant="contained" color="secondary" onClick={toggleChatClosed} startIcon={<Close />}>
              Close Chat
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ padding: '20px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: darkMode ? '#333' : '#fff' }}>
        <List style={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((msg) => (
            <ListItem key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: currentUser === msg.sender ? 'flex-end' : 'flex-start' }}>
              <MessageBox isOwnMessage={currentUser === msg.sender} theme={theme} darkMode={darkMode}>
                {msg.message && (
                  <Typography
                    variant="body2"
                    component="p"
                    style={{ marginBottom: '5px' }}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
                  />
                )}
                {msg.file && (
                  <FilePreview>
                    {msg.fileType && msg.fileType.startsWith('image/') && (
                      <ChatImage
                        src={msg.file}
                        alt="file"
                        onClick={() => { setPreviewImage(msg.file); setOpenImageDialog(true); }}
                      />
                    )}
                    {msg.fileType && msg.fileType.startsWith('video/') && (
                      <video controls style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' }}>
                        <source src={msg.file} type={msg.file.split('.').pop()} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {msg.fileType === 'application/pdf' && (
                      <iframe
                        src={msg.file}
                        title="file"
                        style={{ width: '100%', height: '500px', border: 'none', borderRadius: '10px', marginTop: '5px', backgroundColor: darkMode ? '#333' : '#fff' }}
                      />
                    )}
                  </FilePreview>
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
        {!chatClosed ? (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleTyping}
              multiline
              minRows={2}
              style={{ marginRight: '10px' }}
            />
            {fileName && (
              <Typography variant="body2" style={{ marginRight: '10px' }}>
                {fileName}
              </Typography>
            )}
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
              {uploading ? <CircularProgress size={24} style={{ color: 'orange' }} /> : 'Send'}
            </Button>
          </Box>
        ) : (
          <Typography color="error" variant="body1">Chat is closed. You can only read messages.</Typography>
        )}
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
    isOwnMessage ? (darkMode ? theme.palette.primary.dark : theme.palette.primary.main) : (darkMode ? theme.palette.background.default : theme.palette.background.paper)};
  color: ${({ isOwnMessage, theme }) =>
    isOwnMessage ? theme.palette.primary.contrastText : theme.palette.text.primary};
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) => (isOwnMessage ? 'flex-end' : 'flex-start')};

  // Add styles for small, medium, and large screens
  @media (max-width: 600px) {
    max-width: 90%;
  }
  @media (min-width: 600px) and (max-width: 1200px) {
    max-width: 80%;
  }
  @media (min-width: 1200px) {
    max-width: 70%;
  }
`;

const FilePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 5px;
  
  // Add these styles to ensure the image box maintains a square aspect ratio
  width: 200px; // Adjust the size as needed
  height: 200px; // Adjust the size as needed
  overflow: hidden; // Hide overflow to ensure square aspect ratio

  @media (max-width: 600px) {
    width: 150px; 
    height: 150px;
  }
  @media (min-width: 600px) and (max-width: 1200px) {
    width: 175px; 
    height: 175px;
  }
`;

const ChatImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  object-fit: cover; // Ensure the image covers the box while maintaining its aspect ratio
  
  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
  }
  @media (min-width: 600px) and (max-width: 1200px) {
    width: 100%;
    height: 100%;
  }
`;

export default ChatPage;