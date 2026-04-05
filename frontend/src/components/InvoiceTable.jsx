// Table that shows all items added to the current invoice
// Uses ItemRow for each row
// This is a DUMB component — receives everything via props

import React from 'react';
import {
  Box, Typography, Chip,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import ItemRow from './ItemRow';

function InvoiceTable({ invoiceItems, onQuantityChange, onRemoveItem }) {
  return (
    <Box sx={{ p: 2 }}>

      {/* Header with item count */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Typography variant="h6" fontWeight="bold">Invoice Items</Typography>
        <Chip
          label={`${invoiceItems.length} item${invoiceItems.length !== 1 ? 's' : ''}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Remove</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Each row is a separate ItemRow component */}
            {invoiceItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemoveItem}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
}

export default InvoiceTable;
