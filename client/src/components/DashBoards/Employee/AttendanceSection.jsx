import React from "react";
import { Typography, Button } from "@mui/material";
import { Section, SectionTitle, MarkButton } from "./styles";

const AttendanceSection = ({
  attendanceData,
  attendanceMarked,
  lastMarkedTime,
  handleMarkAttendance,
}) => {
  return (
    <Section>
      <SectionTitle>Attendance</SectionTitle>
      {attendanceData.attendance === "leave" ? (
        <Typography variant="body1" color="textSecondary">
          You are on leave today 😄.
        </Typography>
      ) : (
        <>
          <Typography variant="body1">
            <strong>Today's Attendance:</strong>{" "}
            {attendanceData.attendance || "Not marked yet"}
          </Typography>
          {attendanceMarked && (
            <Typography variant="body1">
              <strong>Last Marked Time:</strong>{" "}
              {lastMarkedTime
                ? `${lastMarkedTime.toLocaleDateString()} ${lastMarkedTime.toLocaleTimeString()}`
                : "Not available"}
            </Typography>
          )}
          {!attendanceMarked && (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <MarkButton
                variant="contained"
                color="primary"
                onClick={() => handleMarkAttendance("present")}
              >
                Mark Present
              </MarkButton>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleMarkAttendance("leave")}
              >
                Request Leave
              </Button>
            </div>
          )}
        </>
      )}
    </Section>
  );
};

export default AttendanceSection;