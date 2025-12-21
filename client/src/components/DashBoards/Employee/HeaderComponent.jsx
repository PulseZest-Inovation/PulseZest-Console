import React from "react";
import { Typography, Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import companyLogo from "../../../assets/2.png";
import { Header, TitleContainer, CompanyLogo } from "./styles";
import Notification from "./Features/Notifications/page";

const HeaderComponent = ({ handleLogout }) => {
  return (
    <Header>
      <TitleContainer>
        <Typography variant="h4">Welcome to PulseZest!</Typography>
        <CompanyLogo src={companyLogo} alt="Company Logo" />
      </TitleContainer>

      <Notification />

      <Button
        startIcon={<Logout />}
        variant="contained"
        color="secondary"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Header>
  );
};

export default HeaderComponent;