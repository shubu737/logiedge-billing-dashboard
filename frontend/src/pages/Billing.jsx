// Billing.jsx
// Main billing page where invoices are created.
// TODO: add print invoice button after creation
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import CustomerSearch from '../components/CustomerSearch';
import CustomerCard from '../components/CustomerCard';
import ItemDialog from '../components/ItemDialog';
import InvoiceTable from '../components/InvoiceTable';
import InvoiceSummary from '../components/InvoiceSummary';
import SnackbarAlert from '../components/SnackbarAlert';
import PageHeader from '../components/PageHeader';

import { getCustomers, getItems, createInvoice } from '../utils/api';
import { calculateGST, calculateTotal } from '../utils/billingUtils';

// Billing is the SMART component.
// It fetches all data, holds all state, and passes data to smaller components.
function Billing() {

  // All the data this page needs
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  // What the user has selected so far
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  // UI state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Load customers and items when the page opens
  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await getCustomers();
        setCustomers(res.data);
      } catch (err) {
        setSnack({ open: true, message: 'Failed to load customers', severity: 'error' });
      }
    }

    async function loadItems() {
      try {
        const res = await getItems();
        setItems(res.data);
      } catch (err) {
        setSnack({ open: true, message: 'Failed to load items', severity: 'error' });
      }
    }

    loadCustomers();
    loadItems();
  }, []);

  // Show a success or error message at the bottom of the screen
  function showMessage(message, severity = 'success') {
    setSnack({ open: true, message, severity });
  }

  // When user picks an item from the popup dialog
  function handleAddItem(item) {
    const alreadyAdded = invoiceItems.find(i => i.id === item.id);

    if (alreadyAdded) {
      // Item is already in the list, just increase its quantity by 1
      setInvoiceItems(invoiceItems.map(i => {
        if (i.id === item.id) {
          return { ...i, quantity: i.quantity + 1 };
        }
        return i;
      }));
    } else {
      // New item, add it with quantity 1
      setInvoiceItems([...invoiceItems, { ...item, quantity: 1 }]);
    }
  }

  // When user clicks + or - on an item row
  function handleQuantityChange(itemId, change) {
    const updated = invoiceItems.map(i => {
      if (i.id === itemId) {
        return { ...i, quantity: i.quantity + change };
      }
      return i;
    });

    // Remove item if quantity goes to 0
    setInvoiceItems(updated.filter(i => i.quantity > 0));
  }

  // When user clicks the delete icon on an item row
  function handleRemoveItem(itemId) {
    setInvoiceItems(invoiceItems.filter(i => i.id !== itemId));
  }

  // Calculate totals based on selected customer and items
  const subtotal = invoiceItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const gstAmount = calculateGST(subtotal, selectedCustomer?.gst_registered);
  const total = calculateTotal(subtotal, gstAmount);

  // When user clicks Create Invoice
  async function handleCreateInvoice() {
    if (!selectedCustomer) {
      showMessage('Please select a customer', 'error');
      return;
    }
    if (invoiceItems.length === 0) {
      showMessage('Please add at least one item', 'error');
      return;
    }

    setLoading(true);
    try {
      await createInvoice({
        customer_id: selectedCustomer.id,
        items: invoiceItems.map(i => ({
          id: i.id,
          quantity: i.quantity,
          price: i.price
        }))
      });
      showMessage('Invoice created successfully!');
      // Reset the form
      setSelectedCustomer(null);
      setInvoiceItems([]);
    } catch (err) {
      showMessage('Failed to create invoice', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>

      <PageHeader
        title="Create Invoice"
        subtitle="Select a customer, add items and generate an invoice"
      />

      <Grid container spacing={3}>

        {/* Left side — customer selection and items list */}
        <Grid item xs={12} lg={8}>

          {/* Step 1: Select a customer */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Step 1 — Select Customer
              </Typography>

              {/* Dropdown to pick a customer */}
              <CustomerSearch
                customers={customers}
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
              />

              {/* Shows customer details after selection */}
              <CustomerCard customer={selectedCustomer} />
            </CardContent>
          </Card>

          {/* Step 2: Add items */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              disabled={!selectedCustomer}
            >
              Step 2 — Add Item
            </Button>
          </Box>

          {/* Show the items table once at least one item is added */}
          {invoiceItems.length > 0 && (
            <Card>
              <InvoiceTable
                invoiceItems={invoiceItems}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
              />
            </Card>
          )}

          {/* Show a hint if customer is selected but no items added yet */}
          {invoiceItems.length === 0 && selectedCustomer && (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography color="text.secondary">
                No items added yet. Click "Step 2 — Add Item" to start.
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Right side — billing summary and submit button */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>

            {/* Shows subtotal, GST and total */}
            <InvoiceSummary
              subtotal={subtotal}
              gstAmount={gstAmount}
              total={total}
              isGstRegistered={selectedCustomer?.gst_registered}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={handleCreateInvoice}
              disabled={!selectedCustomer || invoiceItems.length === 0 || loading}
            >
              {loading ? 'Creating Invoice...' : 'Create Invoice'}
            </Button>

          </Box>
        </Grid>
      </Grid>

      {/* Popup dialog to search and pick items */}
      <ItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        items={items}
        onItemSelect={handleAddItem}
      />

      {/* Success or error message at bottom right */}
      <SnackbarAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack({ ...snack, open: false })}
      />

    </Container>
  );
}

export default Billing;
