import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig";
import { signOut } from "firebase/auth";  
  
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
  const prevDay = new Date(today);
  prevDay.setDate(today.getDate() - 1);
  const prevDate = formatDate(prevDay);

  const todayRef = doc(db, "employeeDetails", userId, "attendance", todayDate);
  const prevRef = doc(db, "employeeDetails", userId, "attendance", prevDate);

  const prevSnap = await getDoc(prevRef);

  // 👉 Today attendance
  await setDoc(todayRef, {
    attendance: attendanceStatus,
    timestamp: serverTimestamp(),
  });

  // 👉 Agar present hai aur kal ka record nahi hai → absent mark karo
  if (attendanceStatus === "present" && !prevSnap.exists()) {
    await setDoc(prevRef, {
      attendance: "absent",
      timestamp: serverTimestamp(),
    });
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
  const today = new Date();
  const endDate = today < endOfYear ? today : endOfYear;

  const q = query(attendanceRef, where("timestamp", ">=", startOfYear), where("timestamp", "<=", endOfYear));
  const querySnapshot = await getDocs(q);

  let presentCount = 0;
  let absentCount = 0;

  // Calculate total days from start of year to endDate
  const totalDays = Math.floor((endDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  // Count present
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.attendance === "present") {
      presentCount++;
    }
  });

  // Absent is total days minus present (assuming unmarked days are absent)
  absentCount = totalDays - presentCount;

  return { present: presentCount, absent: absentCount };
};


