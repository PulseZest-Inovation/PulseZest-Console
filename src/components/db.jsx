import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';
import InternDashboard from '../components/DashBoards/Intern/InternDashboard';
import EmployeeDashboard from '../components/DashBoards/Employee/EmployeeDashboard';
import AppDevDashboard from '../components/DashBoards/AppDev/AppDevDashboard';
import WebDevDashboard from '../components/DashBoards/WebDev/WebDevDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          // Check internDetails collection
          const internDocRef = doc(collection(db, 'internDetails'), userId);
          const internDocSnap = await getDoc(internDocRef);

          if (internDocSnap.exists()) {
            setUserData(internDocSnap.data());
            setLoading(false);
            return;
          }

          // Check employeeDetails collection
          const employeeDocRef = doc(collection(db, 'employeeDetails'), userId);
          const employeeDocSnap = await getDoc(employeeDocRef);

          if (employeeDocSnap.exists()) {
            setUserData(employeeDocSnap.data());
            setLoading(false);
            return;
          }

          // Check appDevelopment collection
          const appDevDocRef = doc(collection(db, 'appDevelopment'), userId);
          const appDevDocSnap = await getDoc(appDevDocRef);

          if (appDevDocSnap.exists()) {
            setUserData(appDevDocSnap.data());
            setLoading(false);
            return;
          }

          // Check webDevelopment collection
          const webDevDocRef = doc(collection(db, 'webDevelopment'), userId);
          const webDevDocSnap = await getDoc(webDevDocRef);

          if (webDevDocSnap.exists()) {
            setUserData(webDevDocSnap.data());
            setLoading(false);
            return;
          }

          // If no matching document is found
          setLoading(false);

        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    // Redirect to login or show error message if user data not found
    navigate('/login', { replace: true });
    return null;
  }

  // Determine which dashboard component to render based on user data
  switch (userData.userType) {
    case 'intern':
      return <InternDashboard userData={userData} />;
    case 'employee':
      return <EmployeeDashboard userData={userData} />;
    case 'appDev':
      return <AppDevDashboard userData={userData} />;
    case 'webDev':
      return <WebDevDashboard userData={userData} />;
    default:
      return <div>No dashboard found for user type.</div>;
  }
};

export default Dashboard;