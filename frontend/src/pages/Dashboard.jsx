import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography,
  Box, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Chip, IconButton
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';

import StatCard from '../components/StatCard';
import SearchBar from '../components/SearchBar';
import PageHeader from '../components/PageHeader';

import { getInvoices } from '../utils/api';
import { formatCurrency } from '../utils/billingUtils';

// Dashboard is a SMART component.
// It fetches invoice data and passes it to smaller display components.
function Dashboard() {

  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load invoices when the page opens
  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    try {
      const res = await getInvoices();
      setInvoices(res.data);
    } catch (err) {
      console.error('Failed to load invoices:', err.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate summary numbers from the invoices list
  const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
  const totalCustomers = new Set(invoices.map(inv => inv.customer_name)).size;

  // Filter invoices based on what the user typed in the search box
  const filteredInvoices = invoices.filter(inv => {
    const term = searchTerm.toLowerCase();
    return (
      inv.invoice_id.toLowerCase().includes(term) ||
      inv.customer_name.toLowerCase().includes(term)
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>

      <PageHeader title="Dashboard" subtitle="Overview of your billing activity" />

      <Grid container spacing={3}>

        {/* Summary cards at the top */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={ReceiptIcon}
            label="Total Invoices"
            value={invoices.length}
            color="primary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={TrendingUpIcon}
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            color="success.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={PeopleIcon}
            label="Active Customers"
            value={totalCustomers}
            color="warning.main"
          />
        </Grid>

        {/* Recent invoices list */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Recent Invoices</Typography>
                <IconButton size="small" onClick={loadInvoices} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Box>

              <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                {invoices.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No invoices yet
                  </Typography>
                ) : (
                  invoices.slice(0, 8).map((inv) => (
                    <ListItem key={inv.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ReceiptIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="medium">
                              {inv.invoice_id}
                            </Typography>
                            <Chip
                              label={formatCurrency(inv.total_amount)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {inv.gst_applied === 1 && (
                              <Chip label="GST" size="small" color="warning" variant="outlined" />
                            )}
                          </Box>
                        }
                        secondary={`${inv.customer_name} • ${new Date(inv.created_at).toLocaleDateString('en-IN')}`}
                      />
                    </ListItem>
                  ))
                )}
              </List>

            </CardContent>
          </Card>
        </Grid>

        {/* Invoice search */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Search Invoice
              </Typography>

              {/* Reusable search input component */}
              <Box sx={{ mb: 2 }}>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by Invoice ID or Customer Name..."
                />
              </Box>

              <List sx={{ maxHeight: 280, overflow: 'auto' }}>
                {filteredInvoices.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    {searchTerm ? 'No invoices found' : 'Type to search invoices'}
                  </Typography>
                ) : (
                  filteredInvoices.slice(0, 10).map((inv) => (
                    <ListItem key={inv.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <ReceiptIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {inv.invoice_id}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              {inv.customer_name}
                            </Typography>
                            <Typography variant="caption" fontWeight="bold" color="primary.main">
                              {formatCurrency(inv.total_amount)}
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
    </Container>
  );
}

export default Dashboard;
