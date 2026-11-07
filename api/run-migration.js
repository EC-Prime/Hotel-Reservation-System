// api/run-migration.js
// Runs database/auth_migration.sql directly through your Node.js database connection.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const fs = require('fs');
const pool = require('./config/db');

async function runMigration() {
  console.log('Connecting to database and running migration...');

  try {
    const conn = await pool.getConnection();

    // 1. Create guest_users table
    console.log('Creating guest_users table if it does not exist...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS guest_users (
        guest_user_id  INT AUTO_INCREMENT PRIMARY KEY,
        full_name      VARCHAR(100)  NOT NULL,
        email          VARCHAR(150)  NOT NULL UNIQUE,
        phone          VARCHAR(20)   NULL,
        password_hash  VARCHAR(255)  NOT NULL,
        is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
        created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_guest_users_email (email)
      )
    `);
    console.log('✅ guest_users table is ready.');

    // 2. Check if guest_user_id column already exists on reservations
    const [cols] = await conn.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'reservations'
        AND COLUMN_NAME = 'guest_user_id'
    `);

    if (cols.length === 0) {
      console.log('Adding guest_user_id column to reservations table...');
      await conn.query(`
        ALTER TABLE reservations
          ADD COLUMN guest_user_id INT NULL AFTER created_by
      `);
      console.log('✅ Added guest_user_id column.');

      console.log('Adding foreign key constraint...');
      try {
        await conn.query(`
          ALTER TABLE reservations
            ADD CONSTRAINT fk_reservation_guest_user
              FOREIGN KEY (guest_user_id) REFERENCES guest_users(guest_user_id)
              ON DELETE SET NULL
        `);
        console.log('✅ Added foreign key constraint.');
      } catch (fkErr) {
        console.log('Note on FK constraint:', fkErr.message);
      }
    } else {
      console.log('ℹ️ guest_user_id column already exists on reservations table.');
    }

    conn.release();
    console.log('\n🎉 Database migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigration();
