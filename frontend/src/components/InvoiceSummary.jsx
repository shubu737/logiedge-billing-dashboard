// Shows the billing breakdown: subtotal, GST and final total
// This is a DUMB component — it only displays what it receives via props

import React from 'react';
import { Card, CardContent, Box, Typography, Divider, Chip } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { formatCurrency } from '../utils/billingUtils';

function InvoiceSummary({ subtotal, gstAmount, total, isGstRegistered }) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ReceiptLongIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">Invoice Summary</Typography>
        </Box>

        {/* GST status badge */}
        <Chip
          label={isGstRegistered ? 'GST Registered — No GST Charged' : '18% GST Applied'}
          color={isGstRegistered ? 'success' : 'warning'}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Subtotal row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" color="text.secondary">Subtotal</Typography>
          <Typography variant="body1" fontWeight="medium">{formatCurrency(subtotal)}</Typography>
        </Box>

        {/* GST row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" color="text.secondary">GST (18%)</Typography>
          <Typography variant="body1" fontWeight="medium">{formatCurrency(gstAmount)}</Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Total — highlighted in blue */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          borderRadius: 1
        }}>
          <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
          <Typography variant="h6" fontWeight="bold">{formatCurrency(total)}</Typography>
        </Box>

      </CardContent>
    </Card>
  );
}

export default InvoiceSummary;
