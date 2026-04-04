// customerModel.js
// All database queries related to customers are written here.
// Controllers call these functions instead of writing SQL directly.

const db = require('../db');

// Get all customers from the database sorted by name
function getAllCustomers() {
    return db.query('SELECT * FROM customers ORDER BY name ASC');
}

// Save a new customer to the database
function createCustomer(name, email, phone, gst_registered) {
    const sql = 'INSERT INTO customers (name, email, phone, gst_registered) VALUES (?, ?, ?, ?)';
    return db.query(sql, [name, email, phone, gst_registered]);
}

module.exports = { getAllCustomers, createCustomer };
