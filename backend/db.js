// db.js — MySQL connection pool
// Every model file just does: const db = require('../db')

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }
    connection.release();
    console.log('Connected to MySQL database');
});

// Export promise version for async/await queries
const promisePool = pool.promise();

// Export both query and getConnection so models can use transactions
module.exports = {
    query: (sql, params) => promisePool.query(sql, params),
    getConnection: () => promisePool.getConnection()
};
