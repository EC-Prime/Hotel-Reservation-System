// api/config/db.js
//
// This file's ONE job: create a connection pool to the Aiven MySQL database,
// and hand it out to the rest of the API (controllers/services) to use.
// Nothing else in the API should ever create its own separate connection —
// everyone shares this one pool.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');

const certPath = process.env.DB_SSL_CERT_PATH
  ? path.resolve(__dirname, '..', process.env.DB_SSL_CERT_PATH)
  : path.resolve(__dirname, '../certs/ca.pem');

const pool = mysql.createPool({
  host: process.env.DB_HOST,             // e.g. hotel-reservation-db-xxxx.aivencloud.com
  port: process.env.DB_PORT,             // e.g. 16659 (Aiven's random port, not 3306)
  user: process.env.DB_USER,             // avnadmin
  password: process.env.DB_PASSWORD,     // from Aiven's Overview page
  database: process.env.DB_NAME,         // hotel_reservation_system
  ssl: {
    ca: fs.readFileSync(certPath)
  },
  waitForConnections: true,
  connectionLimit: 10,                   // max simultaneous connections in the pool
  queueLimit: 0                          // 0 = unlimited queued requests, don't reject under load
});

// A quick self-test — runs once when the server starts, NOT on every request.
// This is what tells you immediately if the connection is broken, instead of
// finding out later when a booking silently fails.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to Aiven MySQL successfully');
    conn.release(); // give the connection back to the pool, don't close the pool itself
  } catch (err) {
    console.error('❌ Could not connect to the database:', err.message);
  }
}

testConnection();

module.exports = pool;