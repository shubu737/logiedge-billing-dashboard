// StatCard.jsx
// A reusable card that shows one summary number on the Dashboard.
// Used for Total Invoices, Total Revenue and Active Customers.

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
      <CardContent sx={{ py: 3 }}>
        <Icon sx={{ fontSize: 40, color: color, mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" sx={{ color: color }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard;
