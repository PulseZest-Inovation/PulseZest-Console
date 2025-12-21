import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Section, SectionTitle, DataItem, ViewButton } from "./styles";

const DocumentsSection = ({ userData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState("");

  const handleViewFile = (fileUrl) => {
    setDialogImageUrl(fileUrl);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogImageUrl("");
  };

  return (
    <Section>
      <SectionTitle>Documents</SectionTitle>
      {userData.passportPhotoUrl && (
        <DataItem>
          <Typography variant="body1">
            <strong>Passport Size Photo:</strong>
          </Typography>
          <Box
            sx={{
              display: "block",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <ViewButton
              variant="contained"
              color="primary"
              onClick={() => handleViewFile(userData.passportPhotoUrl)}
            >
              View
            </ViewButton>
          </Box>
        </DataItem>
      )}
      {userData.resumeUrl && (
        <DataItem>
          <Typography variant="body1">
            <strong>Resume:</strong>
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <ViewButton
              variant="contained"
              color="primary"
              onClick={() => handleViewFile(userData.resumeUrl)}
            >
              View
            </ViewButton>
          </Box>
        </DataItem>
      )}
      {userData.aadharCardUrl && (
        <DataItem>
          <Typography variant="body1">
            <strong>Aadhar Card:</strong>
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <ViewButton
              variant="contained"
              color="primary"
              onClick={() => handleViewFile(userData.aadharCardUrl)}
            >
              View
            </ViewButton>
          </Box>
        </DataItem>
      )}
      {userData.panCardUrl && (
        <DataItem>
          <Typography variant="body1">
            <strong>Pan Card:</strong>
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <ViewButton
              variant="contained"
              color="primary"
              onClick={() => handleViewFile(userData.panCardUrl)}
            >
              View
            </ViewButton>
          </Box>
        </DataItem>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <img
            src={dialogImageUrl}
            alt="Document"
            style={{ width: "100%" }}
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Section>
  );
};

export default DocumentsSection;