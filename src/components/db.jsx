import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';
import InternDashboard from '../components/DashBoards/Intern/InternDashboard';
import EmployeeDashboard from '../components/DashBoards/Employee/EmployeeDashboard';
import AppDevDashboard from '../components/DashBoards/AppDev/AppDevDashboard';
import WebDevDashboard from '../components/DashBoards/WebDev/WebDevDashboard';
import SoftWareDashboard from '../components/DashBoards/softWare/softWare';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const collections = [
          'internDetails',
          'employeeDetails',
          'appDevelopment',
          'webDevelopment',
          'softwareDevelopment'
        ];

        try {
          for (const collectionName of collections) {
            const docRef = doc(collection(db, collectionName), userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUserData(docSnap.data());
              setLoading(false);
              return; // Exit the loop once data is found
            }
          }

          // No data found in any of the collections
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
    case 'software':
      return <SoftWareDashboard userData={userData} />;
    default:
      // If userType is not defined, handle appropriately
      return <div>No dashboard found for user type.</div>;
  }
};

export default Dashboard;
