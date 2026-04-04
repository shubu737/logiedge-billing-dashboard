// customerRoutes.js
// Defines the URL paths for the customer API.

const express = require('express');
const router = express.Router();
const { getCustomers, addCustomer } = require('../controllers/customerController');

// GET /api/customers — get all customers
router.get('/', getCustomers);

// POST /api/customers — add a new customer
router.post('/', addCustomer);

module.exports = router;
