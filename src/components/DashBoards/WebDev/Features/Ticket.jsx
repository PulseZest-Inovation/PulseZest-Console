import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';
import { Typography, Paper, Grid, Chip, IconButton, FormControl, InputLabel, TextField, Select, MenuItem, Button, Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { db, storage } from '../../../../utils/firebaseConfig'; // Adjust path as per your project structure
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ticket = ({ userId }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [relatedService, setRelatedService] = useState("None");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [submittedTickets, setSubmittedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "webDevelopment", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFullName(userData.fullName);
          setEmail(userData.email);
          setDepartment(userData.userType === "webDev" ? "WebDevelopment" : userData.department || "");
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (department) {
      fetchSubmittedTickets(department);
    }
  }, [department]);

  const fetchSubmittedTickets = async (dept) => {
    if (!dept) return;

    try {
      const ticketsCollectionRef = collection(db, 'tickets');
      const snapshot = await getDocs(ticketsCollectionRef);

      if (snapshot.empty) {
        console.log('No tickets found in Firestore.');
        setSubmittedTickets([]);
        return;
      }

      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filteredTickets = tickets.filter(ticket => ticket.department === dept && ticket.userId === userId);
      setSubmittedTickets(filteredTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const ticketId = Math.floor(100000 + Math.random() * 900000);
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
      setLoading(false);
      return;
    }

    const ticketData = {
      userId, // Save userId with ticket data
      fullName,
      email,
      subject,
      department,
      relatedService,
      priority,
      message,
      attachments: attachmentUrls,
      status: "Open",
      ticketId,
    };

    try {
      await setDoc(doc(db, 'tickets', `${ticketId}`), ticketData);

      await fetch('https://pz-api-system.pulsezest.com/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });

      toast.success("Ticket submitted successfully!");
      setSubject("");
      setRelatedService("None");
      setPriority("Medium");
      setMessage("");
      setAttachments([]);
      setTicketDetails(ticketData);
      setSubmittedTickets([...submittedTickets, ticketData]);
      setLoading(false);
      setTicketOpen(false);
    } catch (error) {
      console.error("Error adding document or submitting email:", error);
      setLoading(false);
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
    <Paper elevation={3} sx={{ p: 3, maxWidth: isMobile ? '100%' : '1000px', width: '100%', mt: 2, mb: 2, maxHeight: '60vh', overflow: 'auto' }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>Open New Ticket</Typography>
      {(!ticketOpen && !ticketDetails) && (
        <Button onClick={toggleTicketForm} variant="contained" color="primary">Open Ticket</Button>
      )}
      {(ticketOpen || ticketDetails) && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Name</InputLabel>
                <TextField
                  id="name"
                  value={fullName}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="dense"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Email Address</InputLabel>
                <TextField
                  id="email"
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
              <FormControl fullWidth>
                <InputLabel shrink>Department</InputLabel>
                <TextField
                  id="department"
                  value={department}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="dense"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Related Service</InputLabel>
                <Select
                  value={relatedService}
                  onChange={(e) => setRelatedService(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Service1">Service 1</MenuItem>
                  <MenuItem value="Service2">Service 2</MenuItem>
                  <MenuItem value="Service3">Service 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>Message</Typography>
              <ReactQuill value={message} onChange={setMessage} />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <label htmlFor="attachments">
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,video/mp4"
                    onChange={handleAttachmentChange}
                    style={{ display: 'none' }}
                  />
                  <Button component="span" startIcon={<AttachFileIcon />}>
                    Add Attachments
                  </Button>
                </label>
                <Box display="flex" flexWrap="wrap">
                  {attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleRemoveAttachment(index)}
                      sx={{ m: 0.5 }}
                      deleteIcon={<ClearIcon />}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={handleCloseForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit Ticket"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
      {!ticketOpen && submittedTickets.length > 0 && (
        <>
          <Typography variant="h4" gutterBottom>Submitted Tickets</Typography>
          {submittedTickets.map((ticket) => (
            <Box key={ticket.ticketId} mt={2} p={2} border="1px solid #ccc" borderRadius="4px">
              <Typography variant="h6">Ticket ID: {ticket.ticketId}</Typography>
              <Typography variant="body1">Subject: {ticket.subject}</Typography>
              <Typography variant="body1">Department: {ticket.department}</Typography>
              <Typography variant="body1">Priority: {ticket.priority}</Typography>
              <Typography variant="body1">Status: {ticket.status}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleChat(ticket.ticketId)}
              >
                Chat
              </Button>
            </Box>
          ))}
        </>
      )}
    </Paper>
  );
};

export default Ticket;
