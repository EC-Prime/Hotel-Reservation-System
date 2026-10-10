// api/controllers/reservationController.js  (v2)
//
// HTTP layer for reservations. Enforces the rules in docs/validation-spec.md,
// works out the price itself, then hands the booking to bookingService.

const crypto = require('crypto');
const bookingService = require('../services/bookingService');
const reservationService = require('../services/reservationService');
const roomService = require('../services/roomService');
const emailService = require('../services/emailService');

const MAX_NIGHTS = 30;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRealDate(str) {
  if (!DATE_RE.test(str)) return false;
  const d = new Date(str + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === str;
}

function todayLocal() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nightsBetween(checkIn, checkOut) {
  return Math.round((new Date(checkOut + 'T00:00:00Z') - new Date(checkIn + 'T00:00:00Z')) / 86400000);
}

/**
 * POST /api/reservations
 * Body: roomId, guestName, guestEmail, guestPhone?, checkIn, checkOut, numGuests, paymentReference?
 * Note: totalPrice is NOT accepted from the client. It's calculated here.
 */
async function createReservation(req, res) {
  const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut } = req.body;
  const numGuests = Number(req.body.numGuests || 1);

  // --- Validation (docs/validation-spec.md) ---
  if (!roomId || !guestName || !guestEmail || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required booking details.' });
  }
  if (!EMAIL_RE.test(guestEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!isRealDate(checkIn) || !isRealDate(checkOut)) {
    return res.status(400).json({ error: 'Dates must be real dates in YYYY-MM-DD format.' });
  }
  if (checkIn < todayLocal()) {
    return res.status(400).json({ error: 'Check-in cannot be in the past.' });
  }
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return res.status(400).json({ error: 'Check-out must be after check-in.' });
  }
  if (nights > MAX_NIGHTS) {
    return res.status(400).json({ error: `Maximum stay is ${MAX_NIGHTS} nights.` });
  }
  if (!Number.isInteger(numGuests) || numGuests < 1) {
    return res.status(400).json({ error: 'Number of guests must be at least 1.' });
  }

  try {
    const room = await roomService.getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found.' });
    }
    if (room.status === 'MAINTENANCE') {
      return res.status(409).json({ status: 'ROOM_UNAVAILABLE', message: 'This room is not available for booking.' });
    }
    if (numGuests > room.capacity) {
      return res.status(400).json({ error: `This room sleeps at most ${room.capacity} guest(s).` });
    }

    const totalPrice = nights * room.pricePerNight;
    const paymentReference =
      req.body.paymentReference || 'SIM-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    const result = await bookingService.book({
      roomId: room.roomId,
      guestName: String(guestName).trim(),
      guestEmail: String(guestEmail).trim(),
      guestPhone: guestPhone ? String(guestPhone).trim() : null,
      checkIn,
      checkOut,
      numGuests,
      totalPrice,
      paymentReference,
      createdBy: null // guest self-service
    });

    if (result.status === 'CONFIRMED') {
      // Fire and forget: the email service catches its own errors, and the
      // guest shouldn't wait on Gmail before seeing their confirmation.
      emailService.sendConfirmationEmail({
        guestName,
        guestEmail,
        reservationId: result.reservationId,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        checkIn,
        checkOut,
        totalPrice,
        paymentReference
      });

      return res.status(201).json({
        reservationId: result.reservationId,
        status: result.status,
        totalPrice,
        paymentReference
      });
    }

    if (result.status === 'ROOM_UNAVAILABLE') {
      return res.status(409).json({
        status: result.status,
        message: 'These dates are no longer available for this room.'
      });
    }

    return res.status(500).json({ status: 'ERROR', message: 'Something went wrong, please try again.' });
  } catch (err) {
    console.error('createReservation failed:', err.message);
    return res.status(500).json({ status: 'ERROR', message: 'Something went wrong, please try again.' });
  }
}

/**
 * GET /api/reservations/:id?email=guest@example.com
 * For confirmation.html. The email must match the booking.
 */
async function getReservation(req, res) {
  const { email } = req.query;
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1 || !email) {
    return res.status(400).json({ error: 'A reservation id and email are required.' });
  }

  try {
    const reservation = await reservationService.getReservation(id, email);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    return res.status(200).json(reservation);
  } catch (err) {
    console.error('getReservation failed:', err.message);
    return res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
}

module.exports = { createReservation, getReservation };