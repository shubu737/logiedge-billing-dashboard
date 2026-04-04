// invoiceController.js
// Handles the HTTP request and response for invoice related APIs.
// It calls the model to get data and sends the result back to the frontend.
// TODO: add pagination for getInvoices when data grows large

const { getRecentInvoices, getInvoiceById, createInvoice } = require('../models/invoiceModel');
const { getAllCustomers } = require('../models/customerModel');
const { generateInvoiceId, calculateGST, calculateTotal } = require('../utils/billingUtils');


// GET /api/invoices
// Returns the 20 most recent invoices with customer name
async function getInvoices(req, res) {
    try {
        const [rows] = await getRecentInvoices();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// GET /api/invoices/:invoiceId
// Returns one invoice with all its line items
async function getInvoice(req, res) {
    const invoiceId = req.params.invoiceId;

    try {
        const [[invoiceRows], [itemRows]] = await getInvoiceById(invoiceId);

        // If no invoice found with that ID, return 404
        if (invoiceRows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Combine invoice details and its items into one response
        const invoice = invoiceRows[0];
        invoice.items = itemRows;

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// POST /api/invoices
// Creates a new invoice with GST logic applied
async function createNewInvoice(req, res) {
    const { customer_id, items } = req.body;

    // Basic validation
    if (!customer_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'customer_id and at least one item are required' });
    }

    try {
        // Find the customer to check if they are GST registered
        // Using == instead of === because customer_id from frontend may be string or number
        const [allCustomers] = await getAllCustomers();
        const customer = allCustomers.find(c => c.id == customer_id);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Calculate subtotal by adding up all items (quantity x price)
        let subtotal = 0;
        for (const item of items) {
            subtotal += item.quantity * item.price;
        }

        // Apply GST only if customer is NOT GST registered
        const gstAmount = calculateGST(subtotal, customer.gst_registered);
        const totalAmount = calculateTotal(subtotal, gstAmount);
        const gstApplied = !customer.gst_registered;

        // Generate a unique invoice ID like INVC123456
        const invoiceId = generateInvoiceId();

        // Save the invoice and all its items to the database
        const result = await createInvoice(
            invoiceId,
            customer_id,
            items,
            subtotal.toFixed(2),
            gstAmount,
            totalAmount,
            gstApplied
        );

        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { getInvoices, getInvoice, createNewInvoice };
