// itemController.js
// Handles the HTTP request and response for item related APIs.
// It calls the model to get data and sends the result back to the frontend.

const { getAllActiveItems, createItem } = require('../models/itemModel');

// GET /api/items
// Returns all active items sorted by name
async function getItems(req, res) {
    try {
        const [rows] = await getAllActiveItems();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /api/items
// Adds a new item to the database
async function addItem(req, res) {
    const { item_code, name, price, is_active } = req.body;

    if (!item_code || !name || !price) {
        return res.status(400).json({ error: 'Item code, name and price are required' });
    }

    try {
        const isActiveValue = is_active !== false ? 1 : 0;
        const [result] = await createItem(item_code, name, price, isActiveValue);
        res.status(201).json({ id: result.insertId, item_code, name, price, is_active });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getItems, addItem };
