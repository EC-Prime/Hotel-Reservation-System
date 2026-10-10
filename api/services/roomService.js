// api/services/roomService.js  (v2: adds getRoomById at the bottom)
//
// Reads rooms from the database. Read-only: nothing here changes data.

const pool = require('../config/db');

const VALID_TYPES = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];

function mapRoom(row) {
  return {
    roomId: row.room_id,
    roomNumber: row.room_number,
    floorNumber: row.floor_number,
    roomType: row.room_type,
    pricePerNight: Number(row.price_per_night),
    capacity: row.capacity,
    status: row.status,
    description: row.description,
    available: Boolean(row.available)
  };
}

/**
 * @param {Object} filters
 * @param {number} [filters.floor]
 * @param {string} [filters.type]      - SINGLE | DOUBLE | SUITE | DELUXE
 * @param {string} [filters.checkIn]   - 'YYYY-MM-DD' (needs checkOut too)
 * @param {string} [filters.checkOut]  - 'YYYY-MM-DD'
 */
async function getRooms(filters = {}) {
  const { floor, type, checkIn, checkOut } = filters;
  const params = [];

  let availabilitySql;
  if (checkIn && checkOut) {
    availabilitySql = `(r.status <> 'MAINTENANCE' AND NOT EXISTS (
        SELECT 1 FROM reservations x
        WHERE x.room_id = r.room_id
          AND x.status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
          AND x.check_in_date < ?
          AND x.check_out_date > ?
      ))`;
    params.push(checkOut, checkIn);
  } else {
    availabilitySql = `(r.status = 'AVAILABLE')`;
  }

  let sql = `
    SELECT r.room_id, r.room_number, r.floor_number, r.room_type,
           r.price_per_night, r.capacity, r.status, r.description,
           ${availabilitySql} AS available
    FROM rooms r
    WHERE 1 = 1`;

  if (floor) {
    sql += ' AND r.floor_number = ?';
    params.push(Number(floor));
  }
  if (type && VALID_TYPES.includes(type.toUpperCase())) {
    sql += ' AND r.room_type = ?';
    params.push(type.toUpperCase());
  }

  sql += ' ORDER BY r.room_number';

  const [rows] = await pool.query(sql, params);
  return rows.map(mapRoom);
}

/**
 * One room by id, or null if it doesn't exist.
 * Used by the booking flow to check capacity/status and to work out the
 * price on the server, so a guest can't send their own total.
 */
async function getRoomById(roomId) {
  const [rows] = await pool.query(
    `SELECT room_id, room_number, floor_number, room_type, price_per_night,
            capacity, status, description, 0 AS available
     FROM rooms WHERE room_id = ?`,
    [roomId]
  );
  return rows.length ? mapRoom(rows[0]) : null;
}

module.exports = { getRooms, getRoomById };