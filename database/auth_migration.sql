-- ============================================================
-- Authentication Migration (v1)
-- Hotel Reservation System — Web Guest Auth
-- Group 1, Gauteng City College
--
-- HOW TO RUN:
--   Open MySQL Workbench, connect to your Aiven instance,
--   and run this entire file against hotel_reservation_system.
--
-- SAFE TO RUN on the existing database — it uses
--   IF NOT EXISTS / IF EXISTS guards throughout.
--   It does NOT touch the existing `users` table (Swing app).
-- ============================================================

USE hotel_reservation_system;

-- ------------------------------------------------------------
-- guest_users: web portal accounts (completely separate from
-- the internal `users` table used by the Swing desktop app).
-- Passwords stored as bcrypt hashes — NEVER plaintext.
-- ------------------------------------------------------------
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
);

-- ------------------------------------------------------------
-- Add guest_user_id FK to reservations (nullable — backwards
-- compatible). Old reservations stay as-is (NULL).
-- New web bookings by logged-in guests get linked here.
-- ON DELETE SET NULL: deleting an account does NOT delete
-- the reservation — historical data is preserved.
-- ------------------------------------------------------------
ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS guest_user_id INT NULL
        COMMENT 'FK to guest_users. NULL for pre-auth bookings or Swing-created reservations.'
        AFTER created_by,
    ADD CONSTRAINT fk_reservation_guest_user
        FOREIGN KEY (guest_user_id) REFERENCES guest_users(guest_user_id)
        ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reservations_guest_user ON reservations(guest_user_id);

-- Done. Verify with:
--   DESCRIBE guest_users;
--   SHOW COLUMNS FROM reservations LIKE 'guest_user_id';
