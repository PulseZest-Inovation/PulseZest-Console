import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

const IframePage = () => {
    const location = useLocation();
    const { state } = location;

    if (!state || !state.url) {
        return <div>No URL provided</div>;
    }

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="100vh" 
            width="100vw"
            sx={{
                overflow: 'hidden',
                backgroundColor: '#f0f0f0', // Give a subtle background color for better appearance
            }}
        >
            <Box 
                sx={{
                    width: '100%',
                    height: '100vh',
                   
                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for better appearance
                    borderRadius: '20px', // Slight rounding to simulate phone edges
                    overflow: 'hidden',
                }}
            >
                <iframe
                    src={state.url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 'none' }}
                    allow="microphone; camera"
                />
            </Box>
        </Box>
    );
};

export default IframePage;
