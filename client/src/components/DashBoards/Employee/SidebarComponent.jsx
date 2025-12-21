import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AccountCircle,
  Work,
  Article,
  AccountBalance,
  EventAvailable,
} from "@mui/icons-material";
import { Sidebar } from "./styles";

const SidebarComponent = ({ currentSection, handleSectionChange }) => {
  return (
    <Sidebar>
      <List component="nav">
        <ListItem
          button
          selected={currentSection === "attendance"}
          onClick={() => handleSectionChange("attendance")}
        >
          <ListItemIcon>
            <EventAvailable />
          </ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItem>

        <ListItem
          button
          selected={currentSection === "profile"}
          onClick={() => handleSectionChange("profile")}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          button
          selected={currentSection === "workingDepartment"}
          onClick={() => handleSectionChange("workingDepartment")}
        >
          <ListItemIcon>
            <Work />
          </ListItemIcon>
          <ListItemText primary="Department & Role" />
        </ListItem>

        <ListItem
          button
          selected={currentSection === "documents"}
          onClick={() => handleSectionChange("documents")}
        >
          <ListItemIcon>
            <Article />
          </ListItemIcon>
          <ListItemText primary="Documents" />
        </ListItem>

        <ListItem
          button
          selected={currentSection === "bank"}
          onClick={() => handleSectionChange("bank")}
        >
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText primary="Bank Details" />
        </ListItem>
      </List>
    </Sidebar>
  );
};

export default SidebarComponent;