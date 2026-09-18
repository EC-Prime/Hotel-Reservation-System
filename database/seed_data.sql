-- ============================================================
-- Hotel Reservation System — Seed / Test Data (v2)
-- Run AFTER hotel_db.sql
-- 20 rooms across 3 floors — enough to demo filtering/search
-- without turning seed data into a chore.
-- ============================================================

USE hotel_reservation_system;

-- ------------------------------------------------------------
-- Default admin account
-- Username: admin | Password: Admin123!
-- Generate a REAL BCrypt hash before your first real commit:
--   String hash = BCrypt.hashpw("Admin123!", BCrypt.gensalt());
-- Never hand-type or commit a fake/placeholder hash as if it were real.
-- ------------------------------------------------------------
INSERT INTO users (username, password_hash, full_name, role) VALUES
('admin', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH', 'System Administrator', 'ADMIN'),
('reception1', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH', 'Front Desk User', 'RECEPTIONIST');

-- ------------------------------------------------------------
-- 20 rooms across 3 floors
-- ------------------------------------------------------------
INSERT INTO rooms (room_number, floor_number, room_type, price_per_night, capacity, status, description) VALUES
('101', 1, 'SINGLE', 750.00, 1, 'AVAILABLE', 'Cozy single room with city view'),
('102', 1, 'SINGLE', 750.00, 1, 'AVAILABLE', 'Cozy single room, garden facing'),
('103', 1, 'SINGLE', 750.00, 1, 'AVAILABLE', 'Compact single, quiet courtyard side'),
('104', 1, 'DOUBLE', 1200.00, 2, 'AVAILABLE', 'Double room with queen bed'),
('105', 1, 'DOUBLE', 1200.00, 2, 'MAINTENANCE', 'Double room, currently under maintenance'),
('106', 1, 'DOUBLE', 1200.00, 2, 'AVAILABLE', 'Double room near the lobby'),
('201', 2, 'DOUBLE', 1250.00, 2, 'AVAILABLE', 'Double room with balcony'),
('202', 2, 'DOUBLE', 1250.00, 2, 'AVAILABLE', 'Double room, city-facing'),
('203', 2, 'SUITE', 2200.00, 4, 'AVAILABLE', 'Executive suite with lounge area'),
('204', 2, 'SUITE', 2200.00, 4, 'AVAILABLE', 'Executive suite, corner unit'),
('205', 2, 'SINGLE', 800.00, 1, 'AVAILABLE', 'Single room, recently renovated'),
('206', 2, 'SINGLE', 800.00, 1, 'OCCUPIED', 'Single room, currently occupied'),
('301', 3, 'DELUXE', 3000.00, 2, 'AVAILABLE', 'Deluxe room with balcony and sea view'),
('302', 3, 'DELUXE', 3000.00, 2, 'AVAILABLE', 'Deluxe room, top-floor quiet end'),
('303', 3, 'SUITE', 2400.00, 4, 'AVAILABLE', 'Top-floor suite with panoramic view'),
('304', 3, 'SUITE', 2400.00, 4, 'MAINTENANCE', 'Top-floor suite, under renovation'),
('305', 3, 'DOUBLE', 1300.00, 2, 'AVAILABLE', 'Double room, top floor'),
('306', 3, 'DOUBLE', 1300.00, 2, 'AVAILABLE', 'Double room, top floor, quiet side'),
('307', 3, 'SINGLE', 850.00, 1, 'AVAILABLE', 'Single room, top floor'),
('308', 3, 'SINGLE', 850.00, 1, 'AVAILABLE', 'Single room, top floor, city view');

-- ------------------------------------------------------------
-- Sample reservation (simulated payment already "processed")
-- ------------------------------------------------------------
INSERT INTO reservations (room_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, total_price, payment_reference, status) VALUES
(9, 'Thabo Mokoena', 'thabo.mokoena@example.com', '0821234567', '2026-10-01', '2026-10-04', 2, 6600.00, 'SIM-8F2A91', 'CONFIRMED');

-- ------------------------------------------------------------
-- Example call to the new book_room() procedure (for testing):
--
-- CALL book_room(7, 'Test Guest', 'test@example.com', '0710000000',
--                 '2026-11-01', '2026-11-03', 2, 2500.00, 'SIM-TEST01',
--                 NULL, @res_id, @res_status);
-- SELECT @res_id, @res_status;
-- ------------------------------------------------------------