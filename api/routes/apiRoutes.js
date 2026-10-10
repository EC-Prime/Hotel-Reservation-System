// api/routes/apiRoutes.js  (v3)
//
// Maps URLs to controller functions. No real logic belongs in this file.

const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const roomController = require('../controllers/roomController');

router.get('/rooms', roomController.getRooms);
router.post('/reservations', reservationController.createReservation);
router.get('/reservations/:id', reservationController.getReservation);

module.exports = router;