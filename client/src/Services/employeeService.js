import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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

export const logout = async (navigate) => {
  try {
    await signOut(auth);
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};


