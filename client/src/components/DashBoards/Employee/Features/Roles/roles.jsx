import React, { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { db } from '../../../../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const colorPalettes = {
  Web: ['#FF5733', '#33FF57', '#3357FF', '#F733FF', '#FF33A1', '#33FFC7', '#F7FF33', '#FF9C33', '#33FF9C', '#9C33FF'],
  App: ['#FF5733', '#FF9C33', '#F7FF33', '#33FF57', '#33FFC7', '#3357FF', '#FF33A1', '#9C33FF', '#33FF9C', '#F733FF'],
  Server: ['#33D4FF', '#D4FF33', '#FF5733', '#33FF57', '#3357FF', '#F733FF', '#FF33A1', '#33FFC7', '#F7FF33', '#FF9C33']
};

const getDistinctColor = (category, index) => {
  return colorPalettes[category][index % colorPalettes[category].length];
};

const Role = () => {
  const [roles, setRoles] = useState({ Web: [], App: [], Server: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFullStackNinja, setHasFullStackNinja] = useState(false);
  const [roleColors, setRoleColors] = useState({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is currently signed in.');
        }

        const uid = user.uid;
        const employeeRolesRef = doc(db, `employeeDetails/${uid}/manage/employeeRoles`);
        const docSnap = await getDoc(employeeRolesRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const rolesArrays = [data.Web, data.App, data.Server];

          let allRoles = { Web: [], App: [], Server: [] };
          let colors = {};
          
          rolesArrays.forEach((rolesArray, index) => {
            const category = ['Web', 'App', 'Server'][index];
            if (Array.isArray(rolesArray)) {
              allRoles[category] = rolesArray;
              rolesArray.forEach((role, roleIndex) => {
                if (!colors[role]) {
                  colors[role] = getDistinctColor(category, roleIndex);
                }
              });
              if (rolesArray.includes('Full Stack Ninja')) {
                setHasFullStackNinja(true);
              }
            }
          });

          setRoles(allRoles);
          setRoleColors(colors);
        } else {
          console.log('No such document!');
          setRoles({ Web: [], App: [], Server: [] });
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#3627fe',
  };

  const categoriesContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px', // Adjust gap for smaller screens
  };

  const categoryStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '150px',
  };

  const categoryTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const roleListStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  };

  const roleItemStyle = (color) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color,
    color: '#000',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    position: 'relative',
  });

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    left: '-15px',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const fullStackNinjaStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#ff0000',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div style={categoriesContainerStyle}>
          {Object.keys(roles).map((category) => (
            roles[category].length > 0 && (
              <div key={category} style={categoryStyle}>
                <div style={categoryTitleStyle}>{category} Roles</div>
                <div style={roleListStyle}>
                  {roles[category].map((role, index) => (
                    <div
                      key={index}
                      style={roleItemStyle(roleColors[role])}
                    >
                      <div style={dotStyle}></div>
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          {hasFullStackNinja && (
            <div style={fullStackNinjaStyle}>
             PZ-ROLES 🧑‍💻
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Role;
