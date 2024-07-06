import React, { useState, useEffect } from 'react';
import { doc, setDoc, getFirestore, collection, getDocs, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';
import { Typography, Paper, Grid, Snackbar, Alert, Chip, IconButton, FormControl, InputLabel, TextField, Select, MenuItem, Button, Box, CircularProgress } from '@mui/material';
import { db } from '../../../../utils/firebaseConfig'; // Adjust path as per your project structure
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Ticket = ({ userId }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [relatedService, setRelatedService] = useState("None");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [submittedTickets, setSubmittedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUserData = async () => {
      const firestore = getFirestore();
      const userRef = doc(firestore, "webDevelopment", userId);

      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFullName(userData.fullName);
          setEmail(userData.email);
          if (userData.userType === "webDev") {
            setDepartment("WebDevelopment");
          } else {
            setDepartment(userData.department || "");
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    fetchSubmittedTickets();
  }, [userId]);

  const fetchSubmittedTickets = async () => {
    const firestore = getFirestore();
    const ticketsCollectionRef = collection(firestore, 'tickets');

    try {
      const snapshot = await getDocs(ticketsCollectionRef);
      const tickets = snapshot.docs.map(doc => doc.data());
      setSubmittedTickets(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true); // Show loader while submitting

    // Generate a random 6-digit ID for the ticket
    const ticketId = Math.floor(100000 + Math.random() * 900000);

    // Upload attachments to Firebase Storage
    const storage = getStorage();
    const attachmentUrls = [];

    try {
      for (const file of attachments) {
        const storageRef = ref(storage, `attachments/${ticketId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        attachmentUrls.push({ name: file.name, url: downloadUrl });
      }
    } catch (error) {
      console.error("Error uploading attachments:", error);
      setLoading(false); // Hide loader on error
      return;
    }

    // Save ticket details to Firebase Firestore
    const firestore = getFirestore();
    const ticketRef = doc(firestore, 'tickets', `${ticketId}`);
    const ticketData = {
      fullName,
      email,
      subject,
      department,
      relatedService,
      priority,
      message,
      attachments: attachmentUrls,
      status: "Open",
      ticketId
    };

    try {
      await setDoc(ticketRef, ticketData);
      setToastOpen(true);
      setSubject("");
      setRelatedService("None");
      setPriority("Medium");
      setMessage("");
      setAttachments([]);
      setTicketDetails(ticketData);
      setSubmittedTickets([...submittedTickets, ticketData]);
      setLoading(false); // Hide loader on success
      setTicketOpen(false); // Close ticket form after submission
    } catch (error) {
      console.error("Error adding document:", error);
      setLoading(false); // Hide loader on error
    }
  };

  const handleAttachmentChange = (event) => {
    const files = event.target.files;
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    const newAttachments = Array.from(files).filter(file => allowedTypes.includes(file.type));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const toggleTicketForm = () => {
    setTicketOpen(!ticketOpen);
    setTicketDetails(null);
  };

  const handleCloseForm = () => {
    setTicketOpen(false);
    setSubject("");
    setRelatedService("None");
    setPriority("Medium");
    setMessage("");
    setAttachments([]);
    setTicketDetails(null);
  };

  const handleChat = (ticketId) => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, width: '100%', mt: 2, mb: 2, maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>Open New Ticket</Typography>
      {(!ticketOpen && !ticketDetails) && (
        <Button onClick={toggleTicketForm} variant="contained" color="primary">Open Ticket</Button>
      )}
      {(ticketOpen || ticketDetails) && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Name</InputLabel>
                <TextField
                  value={fullName}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="dense"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Email Address</InputLabel>
                <TextField
                  value={email}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="dense"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Department</InputLabel>
                <TextField
                  value={department}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="dense"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel shrink>Related Service</InputLabel>
                <Select
                  value={relatedService}
                  onChange={(e) => setRelatedService(e.target.value)}
                  label="Related Service"
                  margin="dense"
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Service 1">Service 1</MenuItem>
                  <MenuItem value="Service 2">Service 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel shrink>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Priority"
                  margin="dense"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Message</Typography>
              <ReactQuill
                value={message}
                onChange={setMessage}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'font', 'size',
                  'bold', 'italic', 'underline', 'strike', 'blockquote',
                  'list', 'bullet', 'indent',
                ]}
                style={{ height: '200px' }}
              />
              <Grid container spacing={1} alignItems="center">
                {attachments.map((file, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={file.name}
                      onDelete={() => handleRemoveAttachment(index)}
                      color="primary"
                      variant="outlined"
                      deleteIcon={<ClearIcon />}
                      sx={{ zIndex: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
              <IconButton
                color="primary"
                component="label"
                sx={{ mt: 2 }}
              >
                <AttachFileIcon />
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleAttachmentChange}
                />
              </IconButton>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseForm}>Close</Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {submittedTickets.length > 0 && !ticketOpen && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" gutterBottom>Submitted Tickets</Typography>
          {submittedTickets.map((ticket, index) => (
            <Box key={index} sx={{ border: 1, borderColor: 'grey.300', p: 2, mt: 2 }}>
              <Typography variant="subtitle1">Subject: {ticket.subject}</Typography>
              <Typography variant="subtitle1">Related Service: {ticket.relatedService}</Typography>
              <Typography variant="subtitle1">Priority: {ticket.priority}</Typography>
              <Typography variant="subtitle1">Status: {ticket.status}</Typography>
              <Typography variant="subtitle1">Ticket ID: {ticket.ticketId}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, backgroundColor: ticket.status === "Open" ? "grey.500" : "primary.main" }}
                disabled={ticket.status === "Open"}
                onClick={() => handleChat(ticket.ticketId)}
              >
                Chat Ticket
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
          Ticket submitted successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Ticket;
