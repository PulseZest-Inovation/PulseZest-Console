import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';

const InternDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          const internDetailsDocRef = doc(collection(db, 'internDetails'), userId);
          const internDetailsDocSnap = await getDoc(internDetailsDocRef);

          if (internDetailsDocSnap.exists()) {
            setUserData(internDetailsDocSnap.data());
          } else {
            console.log('No matching document for Intern.');
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Intern Dashboard!</h1>
          <button
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>
        <main style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '60vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginRight: '20px' }}>
              <img src={userData?.passportPhotoUrl || 'https://via.placeholder.com/100'} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>User Profile</h2>
              <p style={{ margin: '5px 0' }}><strong>Name:</strong> {userData?.fullName || 'Not Available'}</p>
              <p style={{ margin: '5px 0' }}><strong>Email:</strong> {userData?.email || 'Not Available'}</p>
              <p style={{ margin: '5px 0' }}><strong>Date of Registration:</strong> {userData?.dateOfRegistration || 'Not Available'}</p>
              <p style={{ margin: '5px 0' }}><strong>Phone Number:</strong> {userData?.phoneNumber || 'Not Available'}</p>
              <p style={{ margin: '5px 0' }}><strong>Qualification:</strong> {userData?.qualification || 'Not Available'}</p>
              {/* Add more fields as per your data structure */}
              {userData?.resumeURL && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    style={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                    }}
                    onClick={() => window.open(userData.resumeURL, '_blank')}
                  >
                    View Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional user data display */}
          <div style={{ backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '4px' }}>
            {Object.keys(userData || {}).map((key) => (
              <div key={key} style={{ marginBottom: '10px' }}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {userData[key]}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Display userData once loaded
  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Intern Dashboard!</h1>
        <button
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <main style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '60vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginRight: '20px' }}>
            <img src={userData.passportPhotoUrl || 'https://via.placeholder.com/100'} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>User Profile</h2>
            <p style={{ margin: '5px 0' }}><strong>Name:</strong> {userData.fullName}</p>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {userData.email}</p>
            <p style={{ margin: '5px 0' }}><strong>Date of Registration:</strong> {userData.dateOfRegistration}</p>
            <p style={{ margin: '5px 0' }}><strong>Phone Number:</strong> {userData.phoneNumber}</p>
            <p style={{ margin: '5px 0' }}><strong>Qualification:</strong> {userData.qualification}</p>
          
              
           
          </div>
        </div>

        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Department</h2>
        <p style={{ margin: '5px 0' }}><strong>Internship Months:</strong> {userData.internshipMonths}</p>
        <p style={{ margin: '5px 0' }}><strong>Usertype:</strong> {userData.userType}</p>

        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Documents</h2>
        <div style={{ margin: '5px 0' }}>
          <strong>Passport Photo:</strong>
          {userData.passportPhotoUrl && (
            <div style={{ marginTop: '10px' }}>
              <button
                style={{
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => window.open(userData.passportPhotoUrl, '_blank')}
              >
                View Passport Photo
              </button>
            </div>
          )}
        </div>
        <div style={{ margin: '5px 0' }}>
          <strong>Resume:</strong>
          {userData.resumeURL && (
            <div style={{ marginTop: '10px' }}>
              <button
                style={{
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => window.open(userData.resumeURL, '_blank')}
              >
                View Resume
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InternDashboard;
