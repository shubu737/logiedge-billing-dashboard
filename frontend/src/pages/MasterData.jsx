import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography,
  TextField, Button, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Tabs, Tab
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';

import PageHeader from '../components/PageHeader';
import SnackbarAlert from '../components/SnackbarAlert';
import { getCustomers, addCustomer, getItems, addItem } from '../utils/api';
import { formatCurrency } from '../utils/billingUtils';


// Tab 1 — Add and list customers
function CustomersTab() {

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstRegistered, setGstRegistered] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      setSnack({ open: true, message: 'Failed to load customers', severity: 'error' });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setSnack({ open: true, message: 'Customer name is required', severity: 'error' });
      return;
    }
    try {
      await addCustomer({ name, email, phone, gst_registered: gstRegistered });
      setSnack({ open: true, message: 'Customer added successfully!', severity: 'success' });
      // Clear the form
      setName('');
      setEmail('');
      setPhone('');
      setGstRegistered(false);
      loadCustomers();
    } catch (err) {
      setSnack({ open: true, message: 'Failed to add customer', severity: 'error' });
    }
  }

  return (
    <Grid container spacing={3}>

      {/* Add Customer Form */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonAddIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Add Customer</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  id="gst"
                  checked={gstRegistered}
                  onChange={(e) => setGstRegistered(e.target.checked)}
                />
                <label htmlFor="gst">
                  <Typography variant="body2">GST Registered</Typography>
                </label>
              </Box>
              <Button type="submit" variant="contained" fullWidth>
                Add Customer
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Customers List */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              All Customers ({customers.length})
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>GST Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email || '—'}</TableCell>
                      <TableCell>{customer.phone || '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={customer.gst_registered ? 'GST Registered' : 'Non-GST'}
                          color={customer.gst_registered ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <SnackbarAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack({ ...snack, open: false })}
      />
    </Grid>
  );
}


// Tab 2 — Add and list items
function ItemsTab() {

  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (err) {
      setSnack({ open: true, message: 'Failed to load items', severity: 'error' });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!itemCode || !name || !price) {
      setSnack({ open: true, message: 'All fields are required', severity: 'error' });
      return;
    }
    try {
      await addItem({ item_code: itemCode, name, price: parseFloat(price), is_active: isActive });
      setSnack({ open: true, message: 'Item added successfully!', severity: 'success' });
      // Clear the form
      setItemCode('');
      setName('');
      setPrice('');
      setIsActive(true);
      loadItems();
    } catch (err) {
      setSnack({ open: true, message: 'Failed to add item', severity: 'error' });
    }
  }

  return (
    <Grid container spacing={3}>

      {/* Add Item Form */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AddBoxIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Add Item</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Item Code *"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                fullWidth
              />
              <TextField
                label="Item Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Price *"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label htmlFor="active">
                  <Typography variant="body2">Active Item</Typography>
                </label>
              </Box>
              <Button type="submit" variant="contained" fullWidth>
                Add Item
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Items List */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              All Items ({items.length})
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>{item.item_code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.is_active ? 'Active' : 'Inactive'}
                          color={item.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <SnackbarAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack({ ...snack, open: false })}
      />
    </Grid>
  );
}


// Main MasterData page — has two tabs: Customers and Items
function MasterData() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader title="Master Data" subtitle="Manage your customers and items" />

      <Tabs value={activeTab} onChange={(e, newTab) => setActiveTab(newTab)} sx={{ mb: 3 }}>
        <Tab label="Customers" />
        <Tab label="Items" />
      </Tabs>

      {activeTab === 0 && <CustomersTab />}
      {activeTab === 1 && <ItemsTab />}
    </Container>
  );
}

export default MasterData;
