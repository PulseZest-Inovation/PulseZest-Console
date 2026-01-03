import React from "react";
import { List, ListItem, ListItemText, Chip, Card, CardContent, Typography, Box, CircularProgress, Avatar } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';


const LeaveRequestsList = ({ leaveRequests }) => {
  if (!leaveRequests) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
        <CircularProgress size={32} />
      </Box>
    );
  }
  if (leaveRequests.length === 0) {
    return (
      <Card sx={{ mt: 1, mb: 1, boxShadow: 1, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            No leave requests found.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Box sx={{ maxHeight: "300px", overflowY: "auto", mt: 1 }}>
      <List>
        {leaveRequests.map((request) => {
          let icon, chipColor;
          if (request.status === "approved") {
            icon = <CheckCircleIcon sx={{ color: 'green' }} />;
            chipColor = "success";
          } else if (request.status === "rejected") {
            icon = <CancelIcon sx={{ color: 'red' }} />;
            chipColor = "error";
          } else {
            icon = <HourglassEmptyIcon sx={{ color: '#f7971e' }} />;
            chipColor = "warning";
          }
          return (
            <ListItem key={request.id} sx={{ borderBottom: '1px solid #eee' }}>
              <Avatar sx={{ bgcolor: 'transparent', mr: 2 }}>
                {icon}
              </Avatar>
              <ListItemText
                primary={request.date && request.date.toDate ? request.date.toDate().toLocaleDateString() : request.id}
                secondary={<>
                  <Typography variant="body2" color="text.secondary">Reason: {request.reason}</Typography>
                </>}
              />
              <Chip
                label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                color={chipColor}
                sx={{ fontWeight: 600 }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default LeaveRequestsList;
