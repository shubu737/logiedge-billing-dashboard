-- =============================================================
-- LogiEdge Billing Dashboard — MySQL Database Schema
-- =============================================================
-- Usage: node setup.js   OR   paste into MySQL Workbench
-- =============================================================

CREATE DATABASE IF NOT EXISTS logiedge_billing
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE logiedge_billing;

-- Drop old tables in correct order (children first)
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS customers;

-- -------------------------------------------------------------
-- CUSTOMERS
-- gst_registered = 1 → no GST charged
-- gst_registered = 0 → 18% GST added
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    gst_registered  TINYINT(1)      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customers_name (name)
);

-- -------------------------------------------------------------
-- ITEMS
-- is_active = 0 means discontinued (hidden from UI)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    item_code   VARCHAR(20)     NOT NULL UNIQUE,
    name        VARCHAR(255)    NOT NULL,
    price       DECIMAL(10,2)   NOT NULL CHECK (price >= 0),
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_items_name (name)
);

-- -------------------------------------------------------------
-- INVOICES
-- invoice_id is the human-readable ID like INVC123456
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    invoice_id      VARCHAR(10)     NOT NULL UNIQUE,
    customer_id     INT             NOT NULL,
    subtotal        DECIMAL(10,2)   NOT NULL,
    gst_amount      DECIMAL(10,2)   NOT NULL DEFAULT 0,
    total_amount    DECIMAL(10,2)   NOT NULL,
    gst_applied     TINYINT(1)      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoices_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_invoices_customer_id (customer_id),
    INDEX idx_invoices_created_at  (created_at)
);

-- -------------------------------------------------------------
-- INVOICE ITEMS
-- price stored here so old invoices are not affected by price changes
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoice_items (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    invoice_id  VARCHAR(10)     NOT NULL,
    item_id     INT             NOT NULL,
    quantity    INT             NOT NULL CHECK (quantity > 0),
    price       DECIMAL(10,2)   NOT NULL,
    CONSTRAINT fk_invoice_items_invoice
        FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_invoice_items_item
        FOREIGN KEY (item_id) REFERENCES items(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_invoice_items_invoice_id (invoice_id)
);

-- =============================================================
-- SEED DATA
-- =============================================================

-- Item Master Data
INSERT IGNORE INTO items (item_code, name, price, is_active) VALUES
    ('IT00001', 'Laptop',       85000.00, 1),
    ('IT00002', 'LED Monitor',  13450.00, 1),
    ('IT00003', 'Pen Drive',      980.00, 1),
    ('IT00004', 'Mobile',       18900.00, 1),
    ('IT00005', 'Headphone',     2350.00, 0),
    ('IT00006', 'Bagpack',       1200.00, 1),
    ('IT00007', 'Powerbank',     1400.00, 1);

-- Sample Customers
INSERT IGNORE INTO customers (name, email, phone, gst_registered) VALUES
    ('Rahul Sharma',   'rahul@example.com',  '9876543210', 1),
    ('Priya Mehta',    'priya@example.com',  '9123456780', 0),
    ('Acme Corp',      'billing@acme.com',   '9988776655', 1),
    ('Ravi Logistics', 'ravi@logistics.com', '9001122334', 0),
    ('TechStart Pvt',  'info@techstart.com', '9445566778', 1);
