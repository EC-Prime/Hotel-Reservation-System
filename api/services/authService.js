// api/services/authService.js
//
// All database queries related to guest_users live here.
// Controllers call these functions; nothing here does HTTP logic.

const pool = require('../config/db');

/**
 * Find a guest user by email (case-insensitive).
 * Returns the full row (including password_hash) so the controller
 * can run bcrypt.compare(). Never return password_hash to the client.
 *
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
async function findGuestByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM guest_users WHERE email = ? LIMIT 1',
    [email.trim().toLowerCase()]
  );
  return rows[0] || null;
}

/**
 * Find a guest user by their primary key.
 * Used by GET /api/auth/me to return profile data.
 *
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function findGuestById(id) {
  const [rows] = await pool.query(
    'SELECT guest_user_id, full_name, email, phone, is_active, created_at FROM guest_users WHERE guest_user_id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Insert a new guest_user row.
 * password_hash must already be a bcrypt hash — this function
 * never sees the plaintext password.
 *
 * @param {{ fullName: string, email: string, phone?: string, passwordHash: string }} data
 * @returns {Promise<number>} the new guest_user_id
 */
async function createGuest({ fullName, email, phone, passwordHash }) {
  const [result] = await pool.query(
    `INSERT INTO guest_users (full_name, email, phone, password_hash)
     VALUES (?, ?, ?, ?)`,
    [
      fullName.trim(),
      email.trim().toLowerCase(),
      phone ? phone.trim() : null,
      passwordHash
    ]
  );
  return result.insertId;
}

/**
 * Check whether an email is already registered.
 * Used during signup to give a clear duplicate-email error
 * before even attempting bcrypt hashing.
 *
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function emailExists(email) {
  const [rows] = await pool.query(
    'SELECT 1 FROM guest_users WHERE email = ? LIMIT 1',
    [email.trim().toLowerCase()]
  );
  return rows.length > 0;
}

module.exports = { findGuestByEmail, findGuestById, createGuest, emailExists };
