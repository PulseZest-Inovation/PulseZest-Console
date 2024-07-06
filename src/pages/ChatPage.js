import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db } from '../utils/firebaseConfig'; // Adjust the path as per your setup
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Typography, Container, TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';

const ChatPage = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const currentUser = location.state?.currentUser || 'client'; // Default to 'client' if not provided
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return; // Guard against undefined currentUser

    const chatsCollectionRef = collection(db, 'messages', ticketId, 'chats');
    const q = query(chatsCollectionRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [ticketId, currentUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    if (!currentUser) {
      console.error("currentUser is undefined");
      return;
    }

    const chatsCollectionRef = collection(db, 'messages', ticketId, 'chats');

    await addDoc(chatsCollectionRef, {
      sender: currentUser,
      message: newMessage,
      timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  return (
    <Container maxWidth="md" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', height: '100vh', overflowY: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>Chat for Ticket ID: {ticketId}</Typography>
      <List>
        {messages.map((msg) => (
          <ListItem key={msg.id} alignItems="flex-start" style={{ justifyContent: currentUser === msg.sender ? 'flex-end' : 'flex-start' }}>
            <Paper style={{ padding: '10px', backgroundColor: currentUser === msg.sender ? '#e0f7fa' : '#f1f1f1', maxWidth: '70%' }}>
              <ListItemText
                primary={msg.sender === 'client' ? 'Client' : 'Staff'}
                secondary={msg.message}
              />
            </Paper>
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ marginTop: '20px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        style={{ marginTop: '10px' }}
      >
        Send
      </Button>
    </Container>
  );
};

export default ChatPage;