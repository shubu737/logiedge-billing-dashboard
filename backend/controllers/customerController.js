// customerController.js
// Handles the HTTP request and response for customer related APIs.
// It calls the model to get data and sends the result back to the frontend.

const { getAllCustomers, createCustomer } = require('../models/customerModel');

// GET /api/customers
// Returns all customers sorted by name
async function getCustomers(req, res) {
    try {
        const [rows] = await getAllCustomers();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /api/customers
// Adds a new customer to the database
async function addCustomer(req, res) {
    const { name, email, phone, gst_registered } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Customer name is required' });
    }

    try {
        const [result] = await createCustomer(name, email, phone, gst_registered || false);
        res.status(201).json({ id: result.insertId, name, email, phone, gst_registered });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getCustomers, addCustomer };
