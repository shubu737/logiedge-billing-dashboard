// setup.js — run ONCE to create all tables and seed data
// Usage: node setup.js

require('dotenv').config();
const mysql = require('mysql2');
const fs    = require('fs');

const db = mysql.createConnection({
    host:               process.env.DB_HOST,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    multipleStatements: true   // needed to run the whole schema file at once
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL');

    const schema = fs.readFileSync(__dirname + '/schema.sql', 'utf8');

    db.query(schema, (err) => {
        if (err) {
            console.error('Schema setup failed:', err.message);
        } else {
            console.log('Database and tables created successfully');
            console.log('Seed data inserted');
        }
        db.end();
    });
});
