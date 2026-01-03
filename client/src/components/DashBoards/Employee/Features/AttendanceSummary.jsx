import React from "react";
import { Card, CardContent, Typography, Box, Grid, Avatar, Tooltip, CircularProgress } from "@mui/material";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';


const AttendanceSummary = ({ approvedLeavesCount, attendanceStats }) => {
  const isLoading = !attendanceStats || typeof attendanceStats.present === 'undefined';
  return (
    <Card sx={{ mt: 3, mb: 2, boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
          Attendance, Holiday & Leave Summary
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Present Days">
                  <Avatar sx={{ bgcolor: '#43a047' }}>
                    <EventAvailableIcon />
                  </Avatar>
                </Tooltip>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Present Days</Typography>
                  <Typography variant="h6" fontWeight={700}>{attendanceStats.present}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Used Holidays">
                  <Avatar sx={{ bgcolor: '#f7971e' }}>
                    <BeachAccessIcon />
                  </Avatar>
                </Tooltip>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Used Holidays</Typography>
                  <Typography variant="h6" fontWeight={700}>{attendanceStats.holiday ?? 0}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Absent Days">
                  <Avatar sx={{ bgcolor: '#e53935' }}>
                    <CancelIcon />
                  </Avatar>
                </Tooltip>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Absent Days</Typography>
                  <Typography variant="h6" fontWeight={700}>{attendanceStats.absent}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Approved Leaves">
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <CheckCircleIcon />
                  </Avatar>
                </Tooltip>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Approved Leaves</Typography>
                  <Typography variant="h6" fontWeight={700}>{approvedLeavesCount}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceSummary;
