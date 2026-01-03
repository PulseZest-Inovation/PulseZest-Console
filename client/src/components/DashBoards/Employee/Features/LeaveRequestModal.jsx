import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const LeaveRequestModal = ({
  open,
  onClose,
  startDate,
  endDate,
  reason,
  setStartDate,
  setEndDate,
  setReason,
  onSubmit,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSubmit} variant="contained">
        Submit Request
      </Button>
    </DialogActions>
  </Dialog>
);

export default LeaveRequestModal;
