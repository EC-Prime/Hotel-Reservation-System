-- ============================================================
-- Hotel Reservation System — Database Schema (v2)
-- Group 1, Gauteng City College — Final Year Project
-- Owner: Emmanuel (Technical Lead / System Architect)
--
-- CHANGELOG from v1:
--   - rooms: added floor_number (supports 18-24 room scale w/ filtering)
--   - reservations: added payment_reference (simulated payment, no gateway)
--   - added book_room() stored procedure: single source of truth for
--     concurrency-safe booking, called from BOTH the Node API and the
--     Swing app so neither write path can double-book a room.
-- ============================================================

CREATE DATABASE IF NOT EXISTS hotel_reservation_system;
USE hotel_reservation_system;

-- ------------------------------------------------------------
-- users: internal staff accounts (Swing app login, RBAC)
-- Passwords stored as BCrypt hashes — never plaintext.
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(50) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,       -- BCrypt hash
    full_name      VARCHAR(100) NOT NULL,
    role           ENUM('ADMIN', 'RECEPTIONIST') NOT NULL DEFAULT 'RECEPTIONIST',
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- rooms: room inventory shown on both the guest site and
-- the Swing RoomManagementView.
-- floor_number added to support a realistic 18-24 room scale
-- with meaningful filtering in the UI.
-- ------------------------------------------------------------
CREATE TABLE rooms (
    room_id         INT AUTO_INCREMENT PRIMARY KEY,
    room_number     VARCHAR(10) NOT NULL UNIQUE,
    floor_number    INT NOT NULL DEFAULT 1,
    room_type       ENUM('SINGLE', 'DOUBLE', 'SUITE', 'DELUXE') NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity        INT NOT NULL DEFAULT 1,
    status          ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    description     TEXT,
    image_url       VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- reservations: created from the guest web portal (booking.html)
-- and managed from ReservationListView in the Swing app.
-- payment_reference: simulated payment proof (no real gateway) —
-- generated client-side/API-side as a fake confirmation code once
-- the mock card-details form passes validation.
-- ------------------------------------------------------------
CREATE TABLE reservations (
    reservation_id   INT AUTO_INCREMENT PRIMARY KEY,
    room_id          INT NOT NULL,
    guest_name       VARCHAR(100) NOT NULL,
    guest_email      VARCHAR(100) NOT NULL,
    guest_phone      VARCHAR(20),
    check_in_date    DATE NOT NULL,
    check_out_date   DATE NOT NULL,
    num_guests       INT NOT NULL DEFAULT 1,
    total_price      DECIMAL(10,2) NOT NULL,
    payment_reference VARCHAR(50) NULL,          -- simulated payment code, e.g. 'SIM-8F2A91'
    status           ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')
                     NOT NULL DEFAULT 'PENDING',
    created_by       INT NULL,                 -- staff user_id if booked/modified at front desk, NULL if self-service
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservation_room FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    CONSTRAINT fk_reservation_user FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date)
);

-- ------------------------------------------------------------
-- audit_log: DB audit trail (Themba & Grace — security spec)
-- ------------------------------------------------------------
CREATE TABLE audit_log (
    log_id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NULL,
    action         VARCHAR(50) NOT NULL,        -- e.g. 'CREATE_RESERVATION', 'UPDATE_ROOM', 'LOGIN'
    table_name     VARCHAR(50) NOT NULL,
    record_id      INT,
    details        TEXT,
    ip_address     VARCHAR(45),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ------------------------------------------------------------
-- Indexes for common lookups
-- ------------------------------------------------------------
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_room ON reservations(room_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_floor ON rooms(floor_number);
CREATE INDEX idx_audit_user ON audit_log(user_id);

-- ============================================================
-- book_room(): SINGLE SOURCE OF TRUTH for booking a room.
--
-- Call this from BOTH write paths:
--   - Node API:   CALL book_room(?, ?, ?, ?, ?, ?, ?, ?, @out_id, @out_status);
--   - Swing/JDBC: CallableStatement to the same procedure.
--
-- It locks the room's existing reservations for the requested date
-- range (SELECT ... FOR UPDATE) inside a transaction, checks for any
-- overlapping CONFIRMED/CHECKED_IN booking, and only inserts if the
-- room is actually free. This is what prevents the guest website and
-- the front-desk app from double-booking the same room, even if two
-- people book at the exact same second.
-- ============================================================
DELIMITER $$

CREATE PROCEDURE book_room(
    IN p_room_id          INT,
    IN p_guest_name       VARCHAR(100),
    IN p_guest_email      VARCHAR(100),
    IN p_guest_phone      VARCHAR(20),
    IN p_check_in         DATE,
    IN p_check_out        DATE,
    IN p_num_guests       INT,
    IN p_total_price      DECIMAL(10,2),
    IN p_payment_reference VARCHAR(50),
    IN p_created_by       INT,               -- NULL if self-service from the website
    OUT p_reservation_id  INT,
    OUT p_result_status   VARCHAR(20)        -- 'CONFIRMED' or 'ROOM_UNAVAILABLE'
)
BEGIN
    DECLARE v_conflict_count INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_status = 'ERROR';
        SET p_reservation_id = NULL;
    END;

    START TRANSACTION;

    -- Lock any existing active reservations for this room that overlap
    -- the requested date range, so a concurrent call has to wait here.
    SELECT COUNT(*) INTO v_conflict_count
    FROM reservations
    WHERE room_id = p_room_id
      AND status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
      AND check_in_date < p_check_out
      AND check_out_date > p_check_in
    FOR UPDATE;

    IF v_conflict_count > 0 THEN
        ROLLBACK;
        SET p_result_status = 'ROOM_UNAVAILABLE';
        SET p_reservation_id = NULL;
    ELSE
        INSERT INTO reservations (
            room_id, guest_name, guest_email, guest_phone,
            check_in_date, check_out_date, num_guests,
            total_price, payment_reference, status, created_by
        ) VALUES (
            p_room_id, p_guest_name, p_guest_email, p_guest_phone,
            p_check_in, p_check_out, p_num_guests,
            p_total_price, p_payment_reference, 'CONFIRMED', p_created_by
        );

        SET p_reservation_id = LAST_INSERT_ID();
        SET p_result_status = 'CONFIRMED';
        COMMIT;
    END IF;
END$$

DELIMITER ;