// api/middleware/authMiddleware.js
//
// Two middleware functions:
//
//   verifyToken   — hard gate: request must have a valid JWT or it gets a 401.
//                   Use on routes that require login (e.g. POST /reservations).
//
//   optionalAuth  — soft gate: decodes the token if present, sets req.user,
//                   but never blocks the request if the token is missing.
//                   Use on routes that work for both guests and logged-in users
//                   (e.g. GET /reservations/:id which also accepts ?email=).

const jwt = require('jsonwebtoken');

/**
 * Middleware: request MUST include a valid Bearer token.
 * Sets req.user = JWT payload on success.
 * Returns 401 if the token is missing, expired, or tampered with.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid session. Please log in again.' });
  }
}

/**
 * Middleware: decodes a Bearer token if present, but never blocks the request.
 * req.user will be the JWT payload if a valid token was sent, or undefined.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // Token present but invalid — treat as unauthenticated, don't block.
      req.user = undefined;
    }
  }

  next();
}

module.exports = { verifyToken, optionalAuth };
