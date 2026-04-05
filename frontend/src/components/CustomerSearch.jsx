// CustomerSearch.jsx — dropdown to select a customer on the Billing page
// Props: customers (array), selectedCustomer, onCustomerSelect (function)

import React from 'react';
import { Box, TextField, MenuItem, Typography, Chip, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const CustomerSearch = ({ customers, selectedCustomer, onCustomerSelect }) => {
    const handleChange = (e) => {
        // Find the full customer object by ID and pass it up to the parent
        const customer = customers.find(c => c.id === parseInt(e.target.value));
        onCustomerSelect(customer || null);
    };

    return (
        <Box>
            <TextField
                select
                fullWidth
                label="Select Customer"
                value={selectedCustomer?.id || ''}
                onChange={handleChange}
                variant="outlined"
            >
                {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                <PersonIcon sx={{ fontSize: 14 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight="medium">
                                    {customer.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {customer.gst_registered ? 'GST Registered' : 'Non-GST'}
                                </Typography>
                            </Box>
                        </Box>
                    </MenuItem>
                ))}
            </TextField>

            {/* Show a chip below the dropdown once a customer is selected */}
            {selectedCustomer && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Chip label={selectedCustomer.name} color="primary" size="small" variant="outlined" />
                    <Chip
                        label={selectedCustomer.gst_registered ? 'GST Registered — No GST' : '18% GST will be applied'}
                        color={selectedCustomer.gst_registered ? 'success' : 'warning'}
                        size="small"
                        variant="outlined"
                    />
                </Box>
            )}
        </Box>
    );
};

export default CustomerSearch;
