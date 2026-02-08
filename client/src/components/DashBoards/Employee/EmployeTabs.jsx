import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ProfileSection from "./ProfileSection";
import EmployeePayslip from "./EmployeePayslip";
// import PaySlipSection from "./PaySlipSection"; // future

export default function EmployeeTabs({ userData }) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      {/* ===== Tabs Header ===== */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Profile" />
        <Tab label="PaySlip" />
      </Tabs>

      {/* ===== Tab Content ===== */}
      {tab === 0 && <ProfileSection userData={userData} />}

      {tab === 1 && (<EmployeePayslip userId={userData.userId} />)}
    </Box>
  );
}
