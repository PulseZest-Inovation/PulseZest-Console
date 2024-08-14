import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ domain, adminDomain }) => {
    const navigate = useNavigate();

    const handleView = () => {
        window.open(domain, '_blank');
    };

    const handleEdit = () => {
        navigate('/db/project-management', { state: { url: adminDomain } });
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
        </div>
    );
};

export default ActionButtons;
