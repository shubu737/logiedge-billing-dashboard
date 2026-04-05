// api.js
// All backend API calls are written here in one place.
// If the backend URL changes, we only update BASE_URL here.
// Every page imports functions from this file instead of writing fetch/axios directly.

import axios from 'axios';

// The base URL of our backend server
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create one axios instance that all functions will use
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Get all customers from the backend
export function getCustomers() {
    return api.get('/customers');
}

// Add a new customer
export function addCustomer(customerData) {
    return api.post('/customers', customerData);
}

// Get all active items from the backend
export function getItems() {
    return api.get('/items');
}

// Add a new item
export function addItem(itemData) {
    return api.post('/items', itemData);
}

// Get recent invoices list
export function getInvoices() {
    return api.get('/invoices');
}

// Get one invoice by its ID like INVC123456
export function getInvoiceById(invoiceId) {
    return api.get('/invoices/' + invoiceId);
}

// Create a new invoice
export function createInvoice(invoiceData) {
    return api.post('/invoices', invoiceData);
}
