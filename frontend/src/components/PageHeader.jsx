// PageHeader.jsx
// Shows the title and subtitle at the top of every page.
// Keeps the page heading consistent across all pages.

import React from 'react';
import { Box, Typography } from '@mui/material';

function PageHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default PageHeader;
