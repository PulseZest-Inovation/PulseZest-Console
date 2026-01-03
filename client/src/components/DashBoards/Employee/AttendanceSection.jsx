import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
} from "@mui/material";
import { Section } from "./styles";
import { requestLeave, fetchLeaveRequests, getApprovedLeavesCount, getAttendanceStats } from "../../../Services/employeeService";
import { auth } from "../../../utils/firebaseConfig";
import {  getUsedHolidaysCount, fetchHolidaysForYear } from "../../../Services/employeeService";
import AttendanceMainSection from "./Features/AttendanceMainSection";
import HolidayList from "./Features/HolidayList";


const AttendanceSection = ({
  attendanceData,
  attendanceMarked,
  lastMarkedTime,
  handleMarkAttendance,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(undefined);
  const [attendanceStats, setAttendanceStats] = useState(undefined);
  const [holidays, setHolidays] = useState([]);
  const [usedHolidays, setUsedHolidays] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      const year = new Date().getFullYear();
      if (user) {
        try {
          const requests = await fetchLeaveRequests(user.uid);
          setLeaveRequests(requests);
          setApprovedLeavesCount(undefined);
          setAttendanceStats(undefined);
          const count = await getApprovedLeavesCount(user.uid, year);
          setApprovedLeavesCount(count);
          const stats = await getAttendanceStats(user.uid, year);
          setAttendanceStats(stats);
          // Count used holidays from attendance collection (service function)
          const holidayCount = await getUsedHolidaysCount(user.uid);
          setUsedHolidays(holidayCount);
        } catch (error) {
          console.error("Error fetching leave data:", error);
        }
      }
      try {
        const holidaysList = await fetchHolidaysForYear(year);
        setHolidays(holidaysList);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    loadData();
  }, []);


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleSubmitLeaveRequest = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      alert("Please select start and end dates and provide a reason.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      await requestLeave([new Date(startDate), new Date(endDate)], reason, user.uid);
      alert("Leave request submitted successfully!");
      handleCloseModal();
      // Refresh leave data
      const requests = await fetchLeaveRequests(user.uid);
      setLeaveRequests(requests);
      const count = await getApprovedLeavesCount(user.uid, new Date().getFullYear());
      setApprovedLeavesCount(count);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <Section>
      <div
        style={{
          display: 'flex',
          gap: 32,
          alignItems: 'flex-start',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        className="attendance-section-flex"
      >
        {/* Left Side: Attendance, Leave, Summary */}
        <AttendanceMainSection
          attendanceData={attendanceData}
          attendanceMarked={attendanceMarked}
          lastMarkedTime={lastMarkedTime}
          handleMarkAttendance={handleMarkAttendance}
          openModal={openModal}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          startDate={startDate}
          endDate={endDate}
          reason={reason}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setReason={setReason}
          handleSubmitLeaveRequest={handleSubmitLeaveRequest}
          approvedLeavesCount={approvedLeavesCount}
          attendanceStats={attendanceStats}
          leaveRequests={leaveRequests}
        />
        {/* Right Side: Holiday List */}
        <div
          style={{ flex: 1, minWidth: 0, width: '100%', maxWidth: 600, marginTop: 24 }}
          className="attendance-section-right"
        >
          <Typography variant="h6" style={{ marginTop: "0px" }}>
            Holiday List ({new Date().getFullYear()})
          </Typography>
          <HolidayList holidays={holidays} />
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .attendance-section-flex {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .attendance-section-left, .attendance-section-right {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </Section>
  );
};

export default AttendanceSection;