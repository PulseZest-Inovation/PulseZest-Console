import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  AccountCircle,
  Work,
  Article,
  AccountBalance,
  EventAvailable,
} from "@mui/icons-material";

const BottomNavComponent = ({ currentSection, handleSectionChange, theme }) => {
  return (
    <BottomNavigation
      value={currentSection}
      onChange={(event, newValue) => handleSectionChange(newValue)}
      showLabels={false}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 -3px 5px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <BottomNavigationAction
        label="Attendance"
        value="attendance"
        icon={<EventAvailable />}
        sx={{ minWidth: "auto", flex: 1 }}
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<AccountCircle />}
        sx={{ minWidth: "auto", flex: 1 }}
      />
      <BottomNavigationAction
        label="Department"
        value="workingDepartment"
        icon={<Work />}
        sx={{ minWidth: "auto", flex: 1 }}
      />
      <BottomNavigationAction
        label="Documents"
        value="documents"
        icon={<Article />}
        sx={{ minWidth: "auto", flex: 1 }}
      />
      <BottomNavigationAction
        label="Bank"
        value="bank"
        icon={<AccountBalance />}
        sx={{ minWidth: "auto", flex: 1 }}
      />
    </BottomNavigation>
  );
};

export default BottomNavComponent;