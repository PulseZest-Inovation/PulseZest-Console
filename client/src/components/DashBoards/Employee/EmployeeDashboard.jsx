import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../utils/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import {
  CircularProgress,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Container, Main, Content } from "./styles";
import {
  fetchAttendanceData,
  markAttendance,
  fetchEmployeeData,
  logout,
} from "../../../Services/employeeService";
import ProfileSection from "./ProfileSection";
import WorkingDepartmentSection from "./WorkingDepartmentSection";
import DocumentsSection from "./DocumentsSection";
import BankSection from "./BankSection";
import AttendanceSection from "./AttendanceSection";
import HeaderComponent from "./HeaderComponent";
import SidebarComponent from "./SidebarComponent";
import BottomNavComponent from "./BottomNavComponent";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [lastMarkedTime, setLastMarkedTime] = useState(null);
  const [currentSection, setCurrentSection] = useState("attendance");
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    
  
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          const userData = await fetchEmployeeData(userId);
          setUserData(userData);
          console.log("Employee user ID:", userData.userId);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      const today = new Date();
      const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const attendanceDocRef = doc(db, "employeeDetails", userData.userId, "attendance", formattedDate);

      const unsubscribe = onSnapshot(attendanceDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setAttendanceData(docSnap.data());
          setAttendanceMarked(true);
        } else {
          setAttendanceData({ attendance: "absent" });
          setAttendanceMarked(false);
        }
      });

      return unsubscribe; // Cleanup listener on unmount or userData change
    }
  }, [userData]);

  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (now > endOfDay && !attendanceMarked) {
      handleMarkAttendance("absent");
    }
  }, [attendanceMarked]);

  const handleMarkAttendance = async (status) => {
    try {
      const result = await markAttendance(status);

      setAttendanceData({ attendance: result.attendance });
      setAttendanceMarked(true);
      setLastMarkedTime(result.markedAt);
    } catch (error) {
      console.error(error);
    }
  };
 

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleDepartmentClick = (dept) => {
    if (dept === "Web Developer") {
      navigate("/employee-support");
    } else if (dept === "Android Developer") {
      navigate("/employee-support");
    } else {
      console.log(`Clicked department: ${dept}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(navigate);
    } catch (error) {
      // Error already logged in service
    }
  };

  const ContentSection = () => {
    switch (currentSection) {
      case "profile":
        return <ProfileSection userData={userData} />;
      case "workingDepartment":
        return (
          <WorkingDepartmentSection
            userData={userData}
            handleDepartmentClick={handleDepartmentClick}
          />
        );
      case "documents":
        return <DocumentsSection userData={userData} />;
      case "bank":
        return <BankSection userData={userData} />;
      case "attendance":
        return (
          <AttendanceSection
            attendanceData={attendanceData}
            attendanceMarked={attendanceMarked}
            lastMarkedTime={lastMarkedTime}
            handleMarkAttendance={handleMarkAttendance}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Ensures it covers the entire viewport height
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5">No user data found for Employee.</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderComponent handleLogout={handleLogout} />
      <Main>
        {!isMobileView && (
          <>
            <SidebarComponent
              currentSection={currentSection}
              handleSectionChange={handleSectionChange}
            />
            <Divider orientation="vertical" flexItem />
          </>
        )}
        <Content>
          <ContentSection />
        </Content>
      </Main>
      {isMobileView && (
        <BottomNavComponent
          currentSection={currentSection}
          handleSectionChange={handleSectionChange}
          theme={theme}
        />
      )}
    </Container>
  );
};

export default EmployeeDashboard;
