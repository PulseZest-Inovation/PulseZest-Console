import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { Section, SectionTitle, MarkButton } from "./styles";
import { requestLeave, fetchLeaveRequests, getApprovedLeavesCount, getAttendanceStats } from "../../../Services/employeeService";
import { auth } from "../../../utils/firebaseConfig";

const AttendanceSection = ({
  attendanceData,
  attendanceMarked,
  lastMarkedTime,
  handleMarkAttendance,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });

  useEffect(() => {
    const loadLeaveData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const requests = await fetchLeaveRequests(user.uid);
          setLeaveRequests(requests);
          const count = await getApprovedLeavesCount(user.uid, new Date().getFullYear());
          setApprovedLeavesCount(count);
          const stats = await getAttendanceStats(user.uid, new Date().getFullYear());
          setAttendanceStats(stats);
        } catch (error) {
          console.error("Error fetching leave data:", error);
        }
      }
    };
    loadLeaveData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleSubmitLeaveRequest = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      alert("Please select start and end dates and provide a reason.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      await requestLeave([new Date(startDate), new Date(endDate)], reason, user.uid);
      alert("Leave request submitted successfully!");
      handleCloseModal();
      // Refresh leave data
      const requests = await fetchLeaveRequests(user.uid);
      setLeaveRequests(requests);
      const count = await getApprovedLeavesCount(user.uid, new Date().getFullYear());
      setApprovedLeavesCount(count);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <Section>
      <SectionTitle>Attendance</SectionTitle>
      {attendanceData.attendance === "leave" ? (
        <Typography variant="body1" color="textSecondary">
          You are on leave today 😄.
        </Typography>
      ) : (
        <>
          <Typography variant="body1">
            <strong>Today's Attendance:</strong>{" "}
            {attendanceData.attendance || "Not marked yet"}
          </Typography>
          {attendanceMarked && (
            <Typography variant="body1">
              <strong>Last Marked Time:</strong>{" "}
              {lastMarkedTime
                ? `${lastMarkedTime.toLocaleDateString()} ${lastMarkedTime.toLocaleTimeString()}`
                : "Not available"}
            </Typography>
          )}
           <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {attendanceData.attendance !== "present" && (
                <MarkButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleMarkAttendance("present")}
                >
                  Mark Present
                </MarkButton>
              )}
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenModal}
              >
                Request Leave
              </Button>
            </div>
        </>
      )}

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Leave Summary
      </Typography>
      <Typography variant="body1">
        <strong>Approved Leaves This Year:</strong> {approvedLeavesCount}
      </Typography>

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Attendance Summary This Year
      </Typography>
      <Typography variant="body1">
        <strong>Present Days:</strong> {attendanceStats.present}
      </Typography>
      <Typography variant="body1">
        <strong>Absent Days:</strong> {attendanceStats.absent}
      </Typography>

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Leave Requests
      </Typography>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        <List>
          {leaveRequests.map((request) => (
            <ListItem key={request.id}>
              <ListItemText
                primary={`${request.date.toDate().toLocaleDateString()}`}
                secondary={`Reason: ${request.reason}`}
              />
              <Chip
                label={request.status}
                color={
                  request.status === "approved"
                    ? "success"
                    : request.status === "rejected"
                    ? "error"
                    : "default"
                }
              />
            </ListItem>
          ))}
        </List>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Request Leave</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            label="Reason for Leave"
            multiline
            rows={4}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmitLeaveRequest} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Section>
  );
};

export default AttendanceSection;