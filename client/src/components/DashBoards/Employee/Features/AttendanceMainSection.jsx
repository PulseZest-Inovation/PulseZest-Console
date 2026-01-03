import React from "react";
import { Typography, Button, Card, CardContent, Box, Avatar } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { SectionTitle, MarkButton } from "../styles";
import LeaveRequestModal from "./LeaveRequestModal";
import AttendanceSummary from "./AttendanceSummary";
import LeaveRequestsList from "./LeaveRequestsList";

const AttendanceMainSection = ({
  attendanceData,
  attendanceMarked,
  lastMarkedTime,
  handleMarkAttendance,
  openModal,
  handleOpenModal,
  handleCloseModal,
  startDate,
  endDate,
  reason,
  setStartDate,
  setEndDate,
  setReason,
  handleSubmitLeaveRequest,
  approvedLeavesCount,
  attendanceStats,
  leaveRequests,
}) => {
  return (
    <div
      style={{ flex: 1, minWidth: 0, width: '100%', maxWidth: 600 }}
      className="attendance-section-left"
    >

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <SectionTitle style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 1,
          color: '#1976d2',
          textShadow: '0 2px 8px #e3e3e3',
          margin: 0
        }}>
          Attendance
        </SectionTitle>
        <Button
          variant="contained"
          color="secondary"
          size="medium"
          sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 1 }}
          onClick={handleOpenModal}
        >
          Request Leave
        </Button>
      </Box>
      <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: attendanceData.attendance === 'present' ? '#43a047' : attendanceData.attendance === 'leave' ? '#1976d2' : attendanceData.attendance === 'absent' ? '#e53935' : '#bdbdbd', width: 48, height: 48 }}>
              {attendanceData.attendance === 'present' ? <CheckCircleIcon fontSize="large" /> : attendanceData.attendance === 'leave' ? <EventBusyIcon fontSize="large" /> : attendanceData.attendance === 'absent' ? <CancelIcon fontSize="large" /> : <EventBusyIcon fontSize="large" />}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Today's Attendance</Typography>
              <Typography variant="h6" fontWeight={700}>
                {attendanceData.attendance === 'present' && 'Present'}
                {attendanceData.attendance === 'leave' && 'On Leave'}
                {attendanceData.attendance === 'absent' && 'Absent'}
                {!attendanceData.attendance && 'Not marked yet'}
              </Typography>
              {attendanceMarked && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Marked Time:</strong>{" "}
                  {lastMarkedTime
                    ? `${lastMarkedTime.toLocaleDateString()} ${lastMarkedTime.toLocaleTimeString()}`
                    : "Not available"}
                </Typography>
              )}
            </Box>
          </Box>
          <Box display="flex" gap={2} mt={2}>
            {attendanceData.attendance !== "present" && (
              <MarkButton
                variant="contained"
                color="primary"
                onClick={() => handleMarkAttendance("present")}
              >
                Mark Present
              </MarkButton>
            )}
          </Box>
        </CardContent>
      </Card>

      <AttendanceSummary approvedLeavesCount={approvedLeavesCount} attendanceStats={attendanceStats} />

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Leave Requests
      </Typography>
      <LeaveRequestsList leaveRequests={leaveRequests} />

      <LeaveRequestModal
        open={openModal}
        onClose={handleCloseModal}
        startDate={startDate}
        endDate={endDate}
        reason={reason}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setReason={setReason}
        onSubmit={handleSubmitLeaveRequest}
      />
    </div>
  );
};

export default AttendanceMainSection;
