// api/services/bookingService.js
//
// This file's ONE job: call the book_room() stored procedure and hand back
// a clean result. It does NOT contain any booking logic itself — the actual
// overlap-checking and locking lives in the database (database/hotel_db.sql).
// This is deliberate: the Swing app calls the exact same procedure via
// swing/src/services/BookingService.java, so there's exactly one place
// where "is this room actually free" gets decided.

const pool = require('../config/db');

/**
 * Attempt to book a room.
 * @param {Object} details
 * @param {number} details.roomId
 * @param {string} details.guestName
 * @param {string} details.guestEmail
 * @param {string} details.guestPhone
 * @param {string} details.checkIn        - 'YYYY-MM-DD'
 * @param {string} details.checkOut       - 'YYYY-MM-DD'
 * @param {number} details.numGuests
 * @param {number} details.totalPrice
 * @param {string} details.paymentReference - e.g. 'SIM-8F2A91'
 * @param {number|null} [details.createdBy]    - staff user_id, or null if self-service
 * @param {number|null} [details.guestUserId]  - guest_users.guest_user_id from JWT, or null
 * @returns {Promise<{reservationId: number|null, status: 'CONFIRMED'|'ROOM_UNAVAILABLE'|'ERROR'}>}
 */
async function book(details) {
  const {
    roomId,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    numGuests,
    totalPrice,
    paymentReference,
    createdBy   = null,
    guestUserId = null
  } = details;

  const connection = await pool.getConnection();

  try {
    // Call the stored procedure. The 10 "?" marks are the IN parameters;
    // the two "@..." are OUT parameters the procedure fills in.
    await connection.query(
      `CALL book_room(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @res_id, @res_status)`,
      [
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        numGuests,
        totalPrice,
        paymentReference,
        createdBy
      ]
    );

    // Read back the two OUT parameters the procedure just set.
    const [[result]] = await connection.query(
      `SELECT @res_id AS reservationId, @res_status AS status`
    );

    // If a logged-in guest made this booking, link it to their account.
    // We do this AFTER the stored procedure to avoid changing the procedure
    // (which is also called by the Swing app via JDBC).
    if (result.reservationId && result.status === 'CONFIRMED' && guestUserId) {
      await connection.query(
        'UPDATE reservations SET guest_user_id = ? WHERE reservation_id = ?',
        [guestUserId, result.reservationId]
      );
    }

    return {
      reservationId: result.reservationId,
      status: result.status // 'CONFIRMED' or 'ROOM_UNAVAILABLE'
    };
  } catch (err) {
    // Something genuinely broke (bad connection, malformed data, etc.) —
    // not a normal "room unavailable" outcome, a real error.
    console.error('bookingService.book() failed:', err.message);
    return { reservationId: null, status: 'ERROR' };
  } finally {
    connection.release(); // always give the connection back, even on error
  }
}

module.exports = { book };