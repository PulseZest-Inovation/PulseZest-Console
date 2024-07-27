import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';
import Logo from '../../../assets/2.png'; // Ensure this path is correct

const styles = {
  container: {
    maxWidth: '90%',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#121212',
    borderRadius: '12px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    animation: 'fadeIn 1s ease-in-out',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: '15px',
    width: '50px',
    height: '50px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e91e63',
    color: '#fff',
    padding: '10px 25px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#ad1457',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    animation: 'slideIn 1s ease-in-out',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  userCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    textAlign: 'center',
  },
  userCardHover: {
    transform: 'scale(1.05)',
  },
  profilePicture: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  profilePictureImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  userDetailsH2: {
    fontSize: '22px',
    marginBottom: '10px',
  },
  userDetailsP: {
    margin: '5px 0',
  },
  viewButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.3s ease',
  },
  viewButtonHover: {
    backgroundColor: '#388e3c',
  },
  additionalData: { 
    backgroundColor: '#1e1e1e',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    animation: 'fadeIn 1s ease-in-out',
  },
  dataItem: { 
    padding: '10px 0',
    borderBottom: '1px solid #333',
  },
  loadingScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#fff',
    animation: 'fadeIn 1s ease-in-out',
  },
  '@global': {
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    '@keyframes slideIn': {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    '::-webkit-scrollbar': {
      width: '10px',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '10px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
};

const InternDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonHover, setButtonHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);

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
      <div style={styles.loadingScreen}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }

          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={Logo} alt="Logo" style={styles.logo} />
            <h1 style={styles.title}>Welcome to Intern Dashboard!</h1>
          </div>
          <button
            style={buttonHover ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>
        <main style={styles.mainContent}>
          <div
            style={cardHover ? { ...styles.userCard, ...styles.userCardHover } : styles.userCard}
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            <div style={styles.profilePicture}>
              <img src={userData?.passportPhotoUrl || 'https://via.placeholder.com/120'} alt="User" style={styles.profilePictureImg} />
            </div>
            <h2 style={styles.userDetailsH2}>User Profile</h2>
            <p style={styles.userDetailsP}><strong>Name:</strong> {userData?.fullName || 'Not Available'}</p>
            <p style={styles.userDetailsP}><strong>Email:</strong> {userData?.email || 'Not Available'}</p>
            <p style={styles.userDetailsP}><strong>Date of Registration:</strong> {userData?.dateOfRegistration || 'Not Available'}</p>
            <p style={styles.userDetailsP}><strong>Phone Number:</strong> {userData?.phoneNumber || 'Not Available'}</p>
            <p style={styles.userDetailsP}><strong>Qualification:</strong> {userData?.qualification || 'Not Available'}</p>
            {userData?.resumeURL && (
              <button
                style={buttonHover ? { ...styles.viewButton, ...styles.viewButtonHover } : styles.viewButton}
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                onClick={() => window.open(userData.resumeURL, '_blank')}
              >
                View Resume
              </button>
            )}
          </div>
          {/* Additional user data display */}
          <div style={styles.additionalData}>
            {Object.keys(userData || {}).map((key) => (
              <div key={key} style={styles.dataItem}>
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
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={Logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.title}>Welcome to Intern Dashboard!</h1>
        </div>
        <button
          style={buttonHover ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <main style={styles.mainContent}>
        <div
          style={cardHover ? { ...styles.userCard, ...styles.userCardHover } : styles.userCard}
          onMouseEnter={() => setCardHover(true)}
          onMouseLeave={() => setCardHover(false)}
        >
          <div style={styles.profilePicture}>
            <img src={userData.passportPhotoUrl || 'https://via.placeholder.com/120'} alt="User" style={styles.profilePictureImg} />
          </div>
          <h2 style={styles.userDetailsH2}>User Profile</h2>
          <p style={styles.userDetailsP}><strong>Name:</strong> {userData.fullName}</p>
          <p style={styles.userDetailsP}><strong>Email:</strong> {userData.email}</p>
          <p style={styles.userDetailsP}><strong>Date of Registration:</strong> {userData.dateOfRegistration}</p>
          <p style={styles.userDetailsP}><strong>Phone Number:</strong> {userData.phoneNumber}</p>
          <p style={styles.userDetailsP}><strong>Qualification:</strong> {userData.qualification}</p>
        </div>

        <div style={styles.additionalData}>
          <div style={styles.dataItem}><strong>Internship Months:</strong> {userData.internshipMonths}</div>
          <div style={styles.dataItem}><strong>Usertype:</strong> {userData.userType}</div>
        </div>

        <div style={styles.additionalData}>
          <strong>Passport Photo:</strong>
          {userData.passportPhotoUrl && (
            <button
              style={buttonHover ? { ...styles.viewButton, ...styles.viewButtonHover } : styles.viewButton}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              onClick={() => window.open(userData.passportPhotoUrl, '_blank')}
            >
              View Passport Photo
            </button>
          )}
        </div>
        <div style={styles.additionalData}>
          <strong>Resume:</strong>
          {userData.resumeURL && (
            <button
              style={buttonHover ? { ...styles.viewButton, ...styles.viewButtonHover } : styles.viewButton}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              onClick={() => window.open(userData.resumeURL, '_blank')}
            >
              View Resume
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default InternDashboard;