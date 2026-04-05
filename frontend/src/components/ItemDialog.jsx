// ItemDialog.jsx — popup dialog to search and select an item to add to the invoice
// Props: open, onClose, items (array), onItemSelect (function)

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, List, ListItem, ListItemButton,
    ListItemAvatar, ListItemText, Avatar, Typography,
    Box, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import { formatCurrency } from '../utils/billingUtils';

const ItemDialog = ({ open, onClose, items, onItemSelect }) => {
    const [searchTerm, setSearchTerm]   = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    // Re-filter whenever the search term or items list changes
    useEffect(() => {
        setFilteredItems(
            items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.item_code.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, items]);

    // Reset search when dialog closes
    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}>

            <DialogTitle>
                <Typography variant="h6" fontWeight="bold">Add Item to Invoice</Typography>
                <Typography variant="body2" color="text.secondary">
                    Search by item name or code
                </Typography>
            </DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus fullWidth margin="dense"
                    label="Search Items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        )
                    }}
                    sx={{ mb: 1 }}
                />

                <List sx={{ maxHeight: 380, overflow: 'auto' }}>
                    {filteredItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <InventoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {searchTerm ? 'No items match your search' : 'No items available'}
                            </Typography>
                        </Box>
                    ) : (
                        filteredItems.map((item) => (
                            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => { onItemSelect(item); handleClose(); }}
                                    sx={{
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <InventoryIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {item.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.item_code}
                                                </Typography>
                                                <Typography variant="caption" color="primary.main" fontWeight="bold">
                                                    {formatCurrency(item.price)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} variant="outlined">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ItemDialog;
