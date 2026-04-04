// invoiceModel.js — all database queries related to invoices

const db = require('../db');

// Get recent invoices with customer name joined
function getRecentInvoices() {
    const sql = `
        SELECT
            i.id,
            i.invoice_id,
            c.name        AS customer_name,
            i.total_amount,
            i.gst_applied,
            i.created_at
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        ORDER BY i.created_at DESC
        LIMIT 20
    `;
    return db.query(sql);
}

// Get a single invoice by invoice_id with all its line items
function getInvoiceById(invoice_id) {
    const invoiceSql = `
        SELECT i.*, c.name AS customer_name, c.email AS customer_email,
               c.phone AS customer_phone, c.gst_registered
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        WHERE i.invoice_id = ?
    `;
    const itemsSql = `
        SELECT ii.quantity, ii.price,
               ii.quantity * ii.price AS line_total,
               it.name AS item_name, it.item_code
        FROM invoice_items ii
        JOIN items it ON ii.item_id = it.id
        WHERE ii.invoice_id = ?
    `;
    return Promise.all([
        db.query(invoiceSql, [invoice_id]),
        db.query(itemsSql, [invoice_id])
    ]);
}

// Save a new invoice using a transaction
// Either everything saves or nothing does
async function createInvoice(invoice_id, customer_id, items, subtotal, gst_amount, total_amount, gst_applied) {

    // Get a single connection from the pool for the transaction
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Insert the invoice header row
        const invoiceSql = `
            INSERT INTO invoices (invoice_id, customer_id, subtotal, gst_amount, total_amount, gst_applied)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(invoiceSql, [
            invoice_id, customer_id, subtotal, gst_amount, total_amount, gst_applied ? 1 : 0
        ]);

        // Insert each line item linked to this invoice
        for (const item of items) {
            await connection.execute(
                'INSERT INTO invoice_items (invoice_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
                [invoice_id, item.id, item.quantity, item.price]
            );
        }

        // Save everything
        await connection.commit();
        return { invoice_id };

    } catch (err) {
        // If anything fails, undo everything
        await connection.rollback();
        throw err;
    } finally {
        // Always return connection back to pool
        connection.release();
    }
}

module.exports = { getRecentInvoices, getInvoiceById, createInvoice };
