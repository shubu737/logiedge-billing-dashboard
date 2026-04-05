// Shows selected customer details: name, phone, email, GST status
// This is a DUMB component — it only displays what it receives via props

import React from 'react';
import { Box, Typography, Chip, Avatar, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

function CustomerCard({ customer }) {

  // If no customer is selected, show nothing
  if (!customer) return null;

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'primary.light', borderRadius: 2, bgcolor: '#f0f7ff' }}>

      {/* Customer name and avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {customer.name}
          </Typography>
          <Chip
            label={customer.gst_registered ? 'GST Registered — No GST Charged' : 'Non-GST — 18% GST Will Be Applied'}
            color={customer.gst_registered ? 'success' : 'warning'}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Phone number */}
      {customer.phone && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {customer.phone}
          </Typography>
        </Box>
      )}

      {/* Email address */}
      {customer.email && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {customer.email}
          </Typography>
        </Box>
      )}

    </Box>
  );
}

export default CustomerCard;
