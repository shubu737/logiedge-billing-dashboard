// BillingSummary.jsx — shows subtotal, GST and final total on the Billing page
// Props: subtotal, gstAmount, total, isGstRegistered

import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Chip } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { formatCurrency } from '../utils/billingUtils';

const SummaryRow = ({ label, value, bold }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={bold ? 'bold' : 'medium'}>{value}</Typography>
    </Box>
);

const BillingSummary = ({ subtotal, gstAmount, total, isGstRegistered }) => (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">Invoice Summary</Typography>
            </Box>

            {/* GST status badge */}
            <Chip
                label={isGstRegistered ? 'GST Registered — No GST Charged' : '18% GST Applied'}
                color={isGstRegistered ? 'success' : 'warning'}
                size="small"
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <SummaryRow label="Subtotal"  value={formatCurrency(subtotal)} />
                <SummaryRow label="GST (18%)" value={formatCurrency(gstAmount)} />
                <Divider />

                {/* Total highlighted in primary color */}
                <Box sx={{
                    display: 'flex', justifyContent: 'space-between',
                    bgcolor: 'primary.main', color: 'white',
                    p: 2, borderRadius: 1
                }}>
                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                    <Typography variant="h6" fontWeight="bold">{formatCurrency(total)}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default BillingSummary;
