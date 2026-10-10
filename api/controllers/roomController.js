// api/controllers/roomController.js
//
// HTTP layer for rooms. Calls roomService and shapes the response.
// Never talks to the database directly.

const roomService = require('../services/roomService');

/**
 * GET /api/rooms
 * Optional query params: floor, type, checkIn, checkOut
 * e.g. /api/rooms?floor=2&type=suite&checkIn=2026-11-01&checkOut=2026-11-03
 */
async function getRooms(req, res) {
  const { floor, type, checkIn, checkOut } = req.query;

  // Dates only make sense as a pair, and checkOut must be after checkIn.
  if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
    return res.status(400).json({ error: 'Provide both checkIn and checkOut, or neither.' });
  }
  if (checkIn && checkOut && checkOut <= checkIn) {
    return res.status(400).json({ error: 'checkOut must be after checkIn.' });
  }

  try {
    const rooms = await roomService.getRooms({ floor, type, checkIn, checkOut });
    return res.status(200).json(rooms);
  } catch (err) {
    console.error('getRooms failed:', err.message);
    return res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
}

module.exports = { getRooms };