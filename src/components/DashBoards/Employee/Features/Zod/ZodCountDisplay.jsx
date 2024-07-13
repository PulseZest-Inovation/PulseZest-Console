import React, { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../utils/firebaseConfig';
import { Typography, CircularProgress, Button, Box } from '@mui/material';
import Confetti from 'react-dom-confetti';
import confettiSound from './confetti.wav';  // Make sure to provide the correct path to your sound file
import { fontSize } from '@mui/system';

const ZodCountDisplay = ({ userId }) => {
  const [zodCount, setZodCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('seen');
  const [confettiActive, setConfettiActive] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const audioRef = useRef(new Audio(confettiSound));

  useEffect(() => {
    const zodCountDocRef = doc(db, 'employeeDetails', userId, 'manage', userId);

    const unsubscribe = onSnapshot(zodCountDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const zodCountData = docSnapshot.data();
        const zodCountValue = zodCountData.zodCount || 0;
        const currentStatus = zodCountData.status || 'seen';

        setZodCount(zodCountValue);
        setStatus(currentStatus);
      } else {
        console.log('No matching document for Zod counts.');
        setZodCount(0);
        setStatus('seen');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (status === 'notSeen') {
      setConfettiActive(true);
      setShowThankYou(true);
      audioRef.current.play();

      // Stop confetti and sound after 1 minute
      const timer = setTimeout(() => {
        setConfettiActive(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;  // Reset the audio to the start
      }, 60000);

      return () => clearTimeout(timer); // Clean up the timer
    } else {
      setConfettiActive(false);
      setShowThankYou(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;  // Reset the audio to the start
    }
  }, [status]);

  const updateStatusInFirestore = async (newStatus) => {
    try {
      const zodCountDocRef = doc(db, 'employeeDetails', userId, 'manage', userId);
      await updateDoc(zodCountDocRef, { status: newStatus });
      console.log('Status updated to', newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleThankYouButtonClick = async () => {
    // User clicks 'Acknowledge' button, update status to 'seen' and hide thank you message
    await updateStatusInFirestore('seen');
    setShowThankYou(false);
    setConfettiActive(false); // Stop confetti when button is clicked
    audioRef.current.pause();
    audioRef.current.currentTime = 0;  // Reset the audio to the start
  };

  if (loading) {
    return <CircularProgress />;
  }

  const confettiConfig = {
  angle: "360",
  spread: "313",
  startVelocity: "67",
  elementCount: 70,
  dragFriction: 0.12,
  duration: "8200",
  stagger: "6",
  width: "17px",
  height: "14px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <div>
      {zodCount !== null ? (
        <Typography align='center'   variant="h3">Zod⚡Count: {zodCount} 🏆</Typography>
      ) : (
        <Typography variant="body1">No Zod count available.</Typography>
      )}
      {status === 'notSeen' && (
        <>
          <Confetti active={confettiActive} config={confettiConfig} />
          {showThankYou && (
            <Box
              sx={{
                mt: 3, // Margin top to avoid overlapping with confetti
              }}
            >
              <Typography variant="h5" gutterBottom>
                Thank You Admin 😁
              </Typography>
              <Button variant="contained" color="primary" onClick={handleThankYouButtonClick}>
                Acknowledge
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default ZodCountDisplay;