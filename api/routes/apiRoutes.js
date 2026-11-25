// api/routes/apiRoutes.js  (v4 — with authentication)
//
// Maps URLs to controller functions. No real logic belongs in this file.
//
// Auth middleware:
//   verifyToken  — blocks unauthenticated requests (401)
//   optionalAuth — decodes token if present, never blocks

const express = require('express');
const router  = express.Router();

const reservationController = require('../controllers/reservationController');
const roomController        = require('../controllers/roomController');
const authController        = require('../controllers/authController');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');

// ------------------------------------------------------------------
// Public auth routes — no token required
// ------------------------------------------------------------------
router.post('/auth/signup',          authController.signup);
router.post('/auth/login',           authController.login);
router.post('/auth/logout',          authController.logout);
router.post('/auth/forgot-password', authController.forgotPassword);

// Protected auth route — valid JWT required
router.get('/auth/me', verifyToken, authController.me);

// ------------------------------------------------------------------
// Room availability — public
// ------------------------------------------------------------------
router.get('/rooms', roomController.getRooms);
router.post('/contact', reservationController.sendContactInquiry);

// ------------------------------------------------------------------
// Reservations
//   POST — requires login (guests must have an account to book)
//   GET /my-bookings — requires login (returns user's bookings)
//   GET /:id — dual access: JWT OR email+id query param (optionalAuth)
// ------------------------------------------------------------------
router.post('/reservations',                        verifyToken,   reservationController.createReservation);
router.get('/reservations/my-bookings',             verifyToken,   reservationController.getMyReservations);
router.get('/reservations/:id',                     optionalAuth,  reservationController.getReservation);
router.post('/reservations/:id/resend-email',                      reservationController.resendConfirmationEmail);

module.exports = router;
