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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <iframe
                src={state.url}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 'none' }}
                allow="microphone; camera"
            />
        </Box>
    );
};

export default IframePage;
