import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../../utils/firebaseConfig'; // Adjust the path as per your setup
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Card, CardContent, Typography, Button, Container, Grid } from '@mui/material';

const EmployeeConsole = ({ isStaff }) => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsCollectionRef = collection(db, 'tickets');
        const snapshot = await getDocs(ticketsCollectionRef);

        const ticketsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTickets(ticketsData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleChat = async (ticketId) => {
    try {
      const ticketDocRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketDocRef, { status: 'Accepted' });
      navigate(`/ticket/${ticketId}`, { state: { currentUser: 'staff' } }); // Navigate to dynamic route /ticket/:ticketId with currentUser as staff
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  return (
    <Container maxWidth="md" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', height: '100vh', overflowY: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>Client Support Management</Typography>
      {tickets.length === 0 ? (
        <Typography variant="body1" align="center">No tickets available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {tickets.map(ticket => (
            <Grid item xs={12} key={ticket.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom><strong>Subject:</strong> {ticket.subject}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Full Name:</strong> {ticket.fullName}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Email:</strong> {ticket.email}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Message:</strong> {ticket.message}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Priority:</strong> {ticket.priority}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Related Service:</strong> {ticket.relatedService}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Status:</strong> {ticket.status}</Typography>
                  <Typography variant="body2" color="textSecondary"><strong>Ticket Id:</strong> {ticket.ticketId}</Typography>

                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <Typography variant="body2" color="textSecondary"><strong>Attachments:</strong></Typography>
                      <ul style={{ paddingLeft: '20px' }}>
                        {ticket.attachments.map((attachment, index) => (
                          <li key={index} style={{ marginBottom: '10px' }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                              <Grid item>
                                <Button
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="contained"
                                  color="primary"
                                  style={{ textTransform: 'none', marginRight: '10px' }}
                                >
                                  View {attachment.name}
                                </Button>
                              </Grid>
                            </Grid>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!isStaff && (
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ textTransform: 'none', display: 'block', marginTop: '-60px', marginLeft: '700px' }}
                      onClick={() => handleChat(ticket.id)}
                    >
                      Chat
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EmployeeConsole;