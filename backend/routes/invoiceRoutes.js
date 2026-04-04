// invoiceRoutes.js
// Defines the URL paths for the invoice API.

const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createNewInvoice } = require('../controllers/invoiceController');

// GET /api/invoices — get recent invoices
router.get('/', getInvoices);

// GET /api/invoices/INVC123456 — get one invoice by ID
router.get('/:invoiceId', getInvoice);

// POST /api/invoices — create a new invoice
router.post('/', createNewInvoice);

module.exports = router;
