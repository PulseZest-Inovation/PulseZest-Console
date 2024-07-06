import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';
import InternDashboard from '../components/DashBoards/Intern/InternDashboard';
import EmployeeDashboard from '../components/DashBoards/Employee/EmployeeDashboard';
import AppDevDashboard from '../components/DashBoards/AppDev/AppDevDashboard';
import WebDevDashboard from '../components/DashBoards/WebDev/WebDevDashboard';
import SoftWareDashboard from './DashBoards/softWare/softWare';
const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid; // Define userId here

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

           // Check webDevelopment collection
           const softWareDocRef = doc(collection(db, 'softwareDevelopment'), userId);
           const softWareDocSnap = await getDoc(softWareDocRef);
 
           if (softWareDocSnap.exists()) {
             setUserData(softWareDocSnap.data());
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

  const checkCollection = async (collectionName, userId) => { // userId should be passed as an argument here
    const docRef = doc(collection(db, collectionName), userId);
    const docSnap = await getDoc(docRef);
    return { exists: docSnap.exists(), data: docSnap.data() };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        const userId = auth.currentUser.uid; // Define userId here

        const checkAppDev = await checkCollection('appDevelopment', userId);
        const checkWebDev = await checkCollection('webDevelopment', userId);

        if (checkAppDev.exists) {
          setUserData(checkAppDev.data);
        } else if (checkWebDev.exists) {
          setUserData(checkWebDev.data);
        }
      }
    };

    fetchData();
  }, [userData]);

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
      case 'software':
        return <SoftWareDashboard userData={userData} />;
    default:
      // If userType is not defined, handle appropriately
      return <div>No dashboard found for user type.</div>;
  }
};

export default Dashboard;
