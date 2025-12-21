import React, { useState } from "react";
import { Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Section, SectionTitle, DataItem } from "./styles";

const BankSection = ({ userData }) => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showIfscCode, setShowIfscCode] = useState(false);

  const handleToggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  const handleToggleIfscCode = () => {
    setShowIfscCode(!showIfscCode);
  };

  return (
    <Section>
      <SectionTitle>Bank Details</SectionTitle>
      <DataItem>
        <Typography variant="body1">
          <strong>Bank Name:</strong> {userData.bankName}
        </Typography>
      </DataItem>
      <DataItem>
        <Typography variant="body1">
          <strong>Account Holder Name:</strong> {userData.accountHolderName}
        </Typography>
      </DataItem>
      <DataItem>
        <Typography variant="body1">
          <strong>Account Number:</strong>{" "}
          {showAccountNumber ? userData.bankAccountNumber : "************"}
        </Typography>
        <IconButton onClick={handleToggleAccountNumber}>
          {showAccountNumber ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </DataItem>
      <DataItem>
        <Typography variant="body1">
          <strong>IFSC Code:</strong>{" "}
          {showIfscCode ? userData.ifscCode : "********"}
        </Typography>
        <IconButton onClick={handleToggleIfscCode}>
          {showIfscCode ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </DataItem>
    </Section>
  );
};

export default BankSection;