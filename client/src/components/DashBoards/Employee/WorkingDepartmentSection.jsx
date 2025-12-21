import React from "react";
import { Button, Typography } from "@mui/material";
import { Section, SectionTitle } from "./styles";
import ZodCountDisplay from "./Features/Zod/ZodCountDisplay";
import Roles from "./Features/Roles/roles";
import { auth } from "../../../utils/firebaseConfig";

const WorkingDepartmentSection = ({ userData, handleDepartmentClick }) => {
  return (
    <Section>
      <SectionTitle>Department & Role</SectionTitle>
      {userData.department && userData.department.length > 0 ? (
        userData.department.map((dept, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => handleDepartmentClick(dept)}
            style={{
              marginRight: "10px",
              marginBottom: "10px",
              textTransform: "none",
            }}
          >
            {dept}
          </Button>
        ))
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: "10px" }}
        >
          No department information available.
        </Typography>
      )}
      <ZodCountDisplay userId={auth.currentUser.uid} />
      <Roles />
    </Section>
  );
};

export default WorkingDepartmentSection;