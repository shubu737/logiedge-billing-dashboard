// server.js — main entry point for the backend
// Registers all middleware and routes, then starts the server.

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const itemRoutes     = require('./routes/itemRoutes');
const invoiceRoutes  = require('./routes/invoiceRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // allow all origins in development
app.use(express.json());                              // parse JSON request bodies

// --- Routes ---
// All customer endpoints live under /api/customers
app.use('/api/customers', customerRoutes);

// All item endpoints live under /api/items
app.use('/api/items', itemRoutes);

// All invoice endpoints live under /api/invoices
app.use('/api/invoices', invoiceRoutes);

// --- Health check — useful to confirm server is running ---
app.get('/health', (req, res) => res.json({ status: 'OK', port: PORT }));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
