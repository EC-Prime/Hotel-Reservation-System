// api/routes/apiRoutes.js
//
// This file's job: map URLs to controller functions. Almost no logic here
// on purpose — if you're writing real logic in this file, it belongs in a
// controller or service instead.

const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');

router.post('/reservations', reservationController.createReservation);

module.exports = router;