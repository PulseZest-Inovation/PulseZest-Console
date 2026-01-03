
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { emailTemplate } from "../emailTemplate";  

export const fetchHolidaysForYear = async (year) => {
  const holidaysRef = collection(db, "holidays");
  const querySnapshot = await getDocs(holidaysRef);
  const holidays = [];
  querySnapshot.forEach((docSnap) => {
    // docSnap.id is in yyyy-mm-dd format
    const [docYear, docMonth, docDay] = docSnap.id.split("-").map(Number);
    if (docYear === year) {
      holidays.push({
        id: docSnap.id,
        ...docSnap.data(),
        date: new Date(docYear, docMonth - 1, docDay),
      });
    }
  });
  // Sort holidays by date ascending
  holidays.sort((a, b) => a.date - b.date);
  return holidays;
};
  
export const getUsedHolidaysCount = async (userId) => {
  const attendanceCol = collection(db, "employeeDetails", userId, "attendance");
  const attendanceSnap = await getDocs(attendanceCol);
  let holidayCount = 0;
  attendanceSnap.forEach(doc => {
    const data = doc.data();
    if (data.attendance === "holiday") holidayCount++;
  });
  return holidayCount;
};

export const fetchAttendanceData = async (userId) => {
  const today = new Date();
  const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  const attendanceDocRef = doc(
    db,
    "employeeDetails",
    userId,
    "attendance",
    formattedDate
  );

  const snap = await getDoc(attendanceDocRef);

  if (snap.exists()) {
    return {
      marked: true,
      data: snap.data(),
    };
  }

  return {
    marked: false,
    data: { attendance: "absent" },
  };
};


export const markAttendance = async (attendanceStatus) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const userId = user.uid;
  const today = new Date();

  const formatDate = (date) =>
    `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

  const todayDate = formatDate(today);
  const todayRef = doc(db, "employeeDetails", userId, "attendance", todayDate);

  // Mark today as present/absent as requested
  await setDoc(todayRef, {
    attendance: attendanceStatus,
    timestamp: serverTimestamp(),
  });

  // If marking present, check for missing attendance in the past week (excluding holidays)
  if (attendanceStatus === "present") {
    // Get holidays for this year
    const holidays = await fetchHolidaysForYear(today.getFullYear());
    console.log("Holidays fetched for attendance check:", holidays);
    // Convert all holiday doc ids (yyyy-mm-dd) and holiday.date (Date object) to d-m-yyyy for matching
    const holidayDates = new Set(
      holidays.flatMap(h => {
        const [y, m, d] = h.id.split('-').map(Number);
        const idFormat = `${d}-${m}-${y}`;
        // Also add from Date object if available
        let dateFormat = '';
        if (h.date instanceof Date && !isNaN(h.date)) {
          dateFormat = `${h.date.getDate()}-${h.date.getMonth() + 1}-${h.date.getFullYear()}`;
        }
        return dateFormat && dateFormat !== idFormat ? [idFormat, dateFormat] : [idFormat];
      })
    );

    // First, mark all missing holidays in the past week
    for (let i = 1; i <= 7; i++) {
      const checkDay = new Date(today);
      checkDay.setDate(today.getDate() - i);
      const checkDateStr = formatDate(checkDay); // d-m-yyyy
      const checkRef = doc(db, "employeeDetails", userId, "attendance", checkDateStr);
      const checkSnap = await getDoc(checkRef);
      if (!checkSnap.exists() && holidayDates.has(checkDateStr)) {
        await setDoc(checkRef, {
          attendance: "holiday",
          timestamp: serverTimestamp(),
        });
      }
    }
    // Then, mark the first missing non-holiday day as absent
    for (let i = 1; i <= 7; i++) {
      const checkDay = new Date(today);
      checkDay.setDate(today.getDate() - i);
      const checkDateStr = formatDate(checkDay); // d-m-yyyy
      const checkRef = doc(db, "employeeDetails", userId, "attendance", checkDateStr);
      const checkSnap = await getDoc(checkRef);
      if (!checkSnap.exists() && !holidayDates.has(checkDateStr)) {
        await setDoc(checkRef, {
          attendance: "absent",
          timestamp: serverTimestamp(),
        });
        break;
      }
    }
  }
};

export const fetchEmployeeData = async (userId) => {
  const employeeDetailsDocRef = doc(db, "employeeDetails", userId);
  const employeeDetailsDocSnap = await getDoc(employeeDetailsDocRef);

  if (employeeDetailsDocSnap.exists()) {
    return employeeDetailsDocSnap.data();
  } else {
    throw new Error("No matching document for Employee.");
  }
};

export const requestLeave = async (dateRange, reason, userId) => {
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);
  const leaveRequestsRef = collection(db, "employeeDetails", userId, "leaveRequests");

  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const batch = [];
  dates.forEach((date) => {
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const docRef = doc(leaveRequestsRef, dateStr);
    batch.push(setDoc(docRef, {
      date,
      reason,
      status: "pending",
      requestedAt: serverTimestamp(),
    }));
  });

  await Promise.all(batch);

  const employeeData = await fetchEmployeeData(userId);
  const email = employeeData.email;
  const fullName = employeeData.fullName;

  const formattedStartDate = startDate.toLocaleDateString();
  const formattedEndDate = endDate.toLocaleDateString();

  const message = emailTemplate(fullName, formattedStartDate, formattedEndDate);

  await fetch('https://pulsezest.com/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: email,
      subject: "You have request for a leave",
      message: message
    })
  });
};

export const logout = async (navigate) => {
  try {
    await signOut(auth);
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const fetchLeaveRequests = async (userId) => {
  const leaveRequestsRef = collection(db, "employeeDetails", userId, "leaveRequests");
  const querySnapshot = await getDocs(leaveRequestsRef);
  const requests = [];
  querySnapshot.forEach((doc) => {
    requests.push({ id: doc.id, ...doc.data() });
  });
  return requests;
};

export const getApprovedLeavesCount = async (userId, year) => {
  const leaveRequestsRef = collection(db, "employeeDetails", userId, "leaveRequests");
  const q = query(leaveRequestsRef, where("status", "==", "approved"));
  const querySnapshot = await getDocs(q);
  let count = 0;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.date.toDate().getFullYear() === year) {
      count++;
    }
  });
  return count;
};

export const getAttendanceStats = async (userId, year) => {
  const attendanceRef = collection(db, "employeeDetails", userId, "attendance");
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  const q = query(attendanceRef, where("timestamp", ">=", startOfYear), where("timestamp", "<=", endOfYear));
  const querySnapshot = await getDocs(q);

  let presentCount = 0;
  let holidayCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let totalWorkingDays = 0;

  // Count all types from attendance collection
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.attendance === "present") {
      presentCount++;
      totalWorkingDays++;
    } else if (data.attendance === "holiday") {
      holidayCount++;
    } else if (data.attendance === "absent") {
      absentCount++;
      totalWorkingDays++;
    } else if (data.attendance === "leave") {
      leaveCount++;
    }
  });

  // totalWorkingDays = present + absent (leave aur holiday ko exclude kiya)

  return { present: presentCount, absent: absentCount, holiday: holidayCount, leave: leaveCount, totalWorkingDays: totalWorkingDays };
};


