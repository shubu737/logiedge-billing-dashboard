// itemModel.js
// All database queries related to items are written here.
// Controllers call these functions instead of writing SQL directly.

const db = require('../db');

// Get only active items from the database sorted by name
// is_active = 1 means the item is available to add to an invoice
function getAllActiveItems() {
    return db.query('SELECT * FROM items WHERE is_active = 1 ORDER BY name ASC');
}

// Save a new item to the database
function createItem(item_code, name, price, is_active) {
    const sql = 'INSERT INTO items (item_code, name, price, is_active) VALUES (?, ?, ?, ?)';
    return db.query(sql, [item_code, name, price, is_active]);
}

module.exports = { getAllActiveItems, createItem };
