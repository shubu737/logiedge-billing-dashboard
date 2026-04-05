// One row in the invoice items table
// Shows item name, code, quantity controls, unit price and total
// This is a DUMB component — receives everything via props

import React from 'react';
import { TableRow, TableCell, IconButton, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '../utils/billingUtils';

function ItemRow({ item, onQuantityChange, onRemove }) {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: 'action.hover' }, '&:last-child td': { borderBottom: 0 } }}>

      {/* Item name */}
      <TableCell>
        <Typography variant="body2" fontWeight="medium">{item.name}</Typography>
      </TableCell>

      {/* Item code */}
      <TableCell>
        <Typography variant="caption" color="text.secondary">{item.item_code}</Typography>
      </TableCell>

      {/* Quantity controls: minus, number, plus */}
      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>

          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, -1)}
            sx={{ bgcolor: 'error.main', color: 'white', width: 24, height: 24, '&:hover': { bgcolor: 'error.dark' } }}
          >
            <RemoveIcon sx={{ fontSize: 14 }} />
          </IconButton>

          <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 28, textAlign: 'center' }}>
            {item.quantity}
          </Typography>

          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, 1)}
            sx={{ bgcolor: 'success.main', color: 'white', width: 24, height: 24, '&:hover': { bgcolor: 'success.dark' } }}
          >
            <AddIcon sx={{ fontSize: 14 }} />
          </IconButton>

        </Box>
      </TableCell>

      {/* Unit price */}
      <TableCell align="right">
        <Typography variant="body2">{formatCurrency(item.price)}</Typography>
      </TableCell>

      {/* Line total = quantity x price */}
      <TableCell align="right">
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(item.quantity * item.price)}
        </Typography>
      </TableCell>

      {/* Delete button */}
      <TableCell align="center">
        <IconButton
          size="small"
          onClick={() => onRemove(item.id)}
          sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light' } }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </TableCell>

    </TableRow>
  );
}

export default ItemRow;
