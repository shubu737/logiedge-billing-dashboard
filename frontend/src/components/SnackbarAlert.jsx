// SnackbarAlert.jsx — reusable success/error notification popup
// Props: open, message, severity ('success' | 'error' | 'info'), onClose

import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarAlert = ({ open, message, severity = 'success', onClose }) => (
    <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>
);

export default SnackbarAlert;
