// DashboardCards.jsx — shows stats and recent invoices on the dashboard

import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box,
    TextField, InputAdornment, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, Chip, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import StatCard from './StatCard';
import { getInvoices } from '../utils/api';

const DashboardCards = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchInvoices(); }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error('Failed to fetch invoices:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Derived stats — calculated from the invoices list
    const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    const uniqueCustomers = new Set(invoices.map(inv => inv.customer_name)).size;
    const avgInvoiceValue = totalRevenue / Math.max(invoices.length, 1);

    const filteredInvoices = invoices.filter(inv =>
        inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3}>
                {/* Stat Cards — each uses the reusable StatCard component */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={ReceiptIcon} value={invoices.length} label="Total Invoices" color="primary.main" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={TrendingUpIcon} value={`₹${totalRevenue.toFixed(2)}`} label="Total Revenue" color="success.main" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={PeopleIcon} value={uniqueCustomers} label="Active Customers" color="warning.main" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={RefreshIcon} value={`₹${avgInvoiceValue.toFixed(2)}`} label="Avg Invoice Value" color="info.main" />
                </Grid>

                {/* Recent Invoices */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">Recent Invoices</Typography>
                                <IconButton size="small" onClick={fetchInvoices} disabled={loading}>
                                    <RefreshIcon />
                                </IconButton>
                            </Box>

                            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {invoices.slice(0, 5).length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        No invoices yet
                                    </Typography>
                                ) : (
                                    invoices.slice(0, 5).map((invoice) => (
                                        <ListItem key={invoice.id} sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <ReceiptIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" fontWeight="medium">{invoice.id}</Typography>
                                                        <Chip label={`₹${parseFloat(invoice.total_amount).toFixed(2)}`} size="small" color="primary" variant="outlined" />
                                                    </Box>
                                                }
                                                secondary={`${invoice.customer_name} • ${new Date(invoice.created_at).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Invoice Search */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Invoice Search</Typography>

                            <TextField
                                fullWidth
                                placeholder="Search by invoice ID or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 2 }}
                            />

                            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {filteredInvoices.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        {searchTerm ? 'No invoices found' : 'Start typing to search invoices'}
                                    </Typography>
                                ) : (
                                    filteredInvoices.slice(0, 10).map((invoice) => (
                                        <ListItem key={invoice.id} sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    <ReceiptIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="body2" fontWeight="medium">{invoice.id}</Typography>}
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" color="text.secondary">{invoice.customer_name}</Typography>
                                                        <Typography variant="caption" fontWeight="medium" color="primary.main">
                                                            ₹{parseFloat(invoice.total_amount).toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardCards;
