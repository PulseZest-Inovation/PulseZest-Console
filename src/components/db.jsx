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
          // Attempt to fetch from each collection in sequence
          const collectionsToCheck = ['internDetails', 'employeeDetails', 'appDevelopment', 'webDevelopment'];
          let userDataFound = null;

          for (const collectionName of collectionsToCheck) {
            const docRef = doc(collection(db, collectionName), userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              userDataFound = docSnap.data();
              break; // Exit loop if data is found
            }
          }

          if (userDataFound) {
            setUserData(userDataFound);
          } else {
            console.log('No matching document found for user.');
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  // Render loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle case where userData is null or undefined
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
