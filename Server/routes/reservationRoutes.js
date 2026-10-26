const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  getReservedTables,
  getReservationById,
  cancelReservation,
} = require('../controllers/reservationController');

router.get('/tables', getReservedTables);

router.route('/')
  .get(getReservations)
  .post(createReservation);

router.route('/:id')
  .get(getReservationById);

router.patch('/:id/cancel', cancelReservation);

module.exports = router;
