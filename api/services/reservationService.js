// api/services/reservationService.js
//
// Read-only lookups for reservations. (Creating bookings is bookingService.js.)

const pool = require('../config/db');

/**
 * Fetch one reservation, but only if the email matches the one on the booking.
 * Reservation ids are sequential (1, 2, 3...), so without the email check
 * anyone could walk through them and read other guests' details.
 *
 * Returns null when there is no match (wrong id OR wrong email, we don't say which).
 */
async function getReservation(reservationId, email) {
  const [rows] = await pool.query(
    `SELECT r.reservation_id,
            r.guest_name,
            r.guest_email,
            DATE_FORMAT(r.check_in_date,  '%Y-%m-%d') AS check_in_date,
            DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
            r.num_guests,
            r.total_price,
            r.payment_reference,
            r.status,
            rm.room_number,
            rm.room_type
     FROM reservations r
     JOIN rooms rm ON rm.room_id = r.room_id
     WHERE r.reservation_id = ? AND LOWER(r.guest_email) = LOWER(?)`,
    [reservationId, email]
  );

  if (!rows.length) return null;

  const row = rows[0];
  return {
    reservationId: row.reservation_id,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    checkIn: row.check_in_date,
    checkOut: row.check_out_date,
    numGuests: row.num_guests,
    totalPrice: Number(row.total_price),
    paymentReference: row.payment_reference,
    status: row.status,
    roomNumber: row.room_number,
    roomType: row.room_type
  };
}

/**
 * Fetch all reservations belonging to a guest user (by user ID or email).
 * Used by the My Account / Profile page.
 */
async function getReservationsForUser(guestUserId, email) {
  const [rows] = await pool.query(
    `SELECT r.reservation_id,
            r.guest_name,
            r.guest_email,
            DATE_FORMAT(r.check_in_date,  '%Y-%m-%d') AS check_in_date,
            DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
            r.num_guests,
            r.total_price,
            r.payment_reference,
            r.status,
            rm.room_id,
            rm.room_number,
            rm.room_type,
            rm.image_url
     FROM reservations r
     JOIN rooms rm ON rm.room_id = r.room_id
     WHERE r.guest_user_id = ? OR LOWER(r.guest_email) = LOWER(?)
     ORDER BY r.check_in_date DESC, r.reservation_id DESC`,
    [guestUserId, email]
  );

  return rows.map(row => ({
    reservationId: row.reservation_id,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    checkIn: row.check_in_date,
    checkOut: row.check_out_date,
    numGuests: row.num_guests,
    totalPrice: Number(row.total_price),
    paymentReference: row.payment_reference,
    status: row.status,
    roomId: row.room_id,
    roomNumber: row.room_number,
    roomType: row.room_type,
    image: row.image_url
  }));
}

module.exports = { getReservation, getReservationsForUser };