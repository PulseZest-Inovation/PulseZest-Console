import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';

const ActionButtons = ({ domain, adminDomain }) => {
    const [loading, setLoading] = useState(true);

    const handleView = () => {
        window.open(domain, '_blank');
    };

    const handleEdit = () => {
        const iframe = document.getElementById('adminIframe');
        if (iframe) {
            iframe.src = adminDomain;
        }
    };

    const handleLoad = () => {
        setLoading(false); // Set loading to false when the iframe has loaded
    };

    return (
        <div>
            <Box display="flex" justifyContent="flex-start" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                    sx={{ marginRight: '8px' }}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleView}
                >
                    View
                </Button>


            </Box>

            <div className="min-h-screen flex items-center justify-center relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                )}
                <iframe
                    src="https://pulsezest.com/"
                    width="400"
                    height="600"
                    frameBorder="0"
                    className="shadow-lg border rounded-lg"
                    allow="microphone; camera"
                    onLoad={handleLoad}
                />
            </div>
        </div>
    );
};

export default ActionButtons;
