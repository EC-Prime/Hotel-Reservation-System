// api/controllers/reservationController.js
//
// This file's job: handle the HTTP side of a booking request.
// It does NOT talk to the database directly — it calls bookingService.js
// and translates whatever comes back into a proper HTTP response.

const bookingService = require('../services/bookingService');

/**
 * POST /api/reservations
 * Expects a JSON body matching docs/validation-spec.md
 */
async function createReservation(req, res) {
  const {
    roomId,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    numGuests,
    totalPrice,
    paymentReference
  } = req.body;

  // Basic shape check — this is NOT the full validation contract (that's
  // enforced client-side too, per docs/validation-spec.md), just a guard
  // against obviously malformed requests reaching the database layer at all.
  if (!roomId || !guestName || !guestEmail || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required booking details.' });
  }

  const result = await bookingService.book({
    roomId,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    numGuests,
    totalPrice,
    paymentReference,
    createdBy: null // this endpoint is for guest/self-service bookings
  });

  if (result.status === 'CONFIRMED') {
    return res.status(201).json({
      reservationId: result.reservationId,
      status: result.status
    });
  }

  if (result.status === 'ROOM_UNAVAILABLE') {
    return res.status(409).json({
      status: result.status,
      message: 'These dates are no longer available for this room.'
    });
  }

  // status === 'ERROR' — never send raw error details to the client
  return res.status(500).json({
    status: 'ERROR',
    message: 'Something went wrong, please try again.'
  });
}

module.exports = { createReservation };