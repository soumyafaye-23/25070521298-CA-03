const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');

// In-memory fallback cache when MongoDB is offline
const memoryReservations = [
  {
    reservationId: 'RES-DEMO-001',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: '2',
    name: 'Sample Guest',
    phone: '+1 555 123 4567',
    email: 'guest@example.com',
    requests: 'Window table',
    tableId: 'T2',
    status: 'confirmed',
    createdAt: new Date(),
  },
  {
    reservationId: 'RES-DEMO-002',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: '4',
    name: 'Reserved Table',
    phone: '+1 555 987 6543',
    email: '',
    requests: '',
    tableId: 'T6',
    status: 'confirmed',
    createdAt: new Date(),
  },
];

// Helper to check MongoDB readiness
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Create a new table reservation
// @route   POST /api/reservations
// @access  Public
const createReservation = async (req, res, next) => {
  try {
    const { date, time, guests, name, phone, email, requests, tableId } = req.body;

    if (!date || !time || !name || !phone || !tableId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: date, time, name, phone, and tableId',
      });
    }

    const reservationId = `RES-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    if (isDbConnected()) {
      const existing = await Reservation.findOne({
        date,
        time,
        tableId,
        status: { $ne: 'cancelled' },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Table ${tableId} is already reserved for ${date} at ${time}. Please select another table or time slot.`,
        });
      }

      const reservation = await Reservation.create({
        reservationId,
        date,
        time,
        guests: guests || '2',
        name,
        phone,
        email: email || '',
        requests: requests || '',
        tableId,
        status: 'confirmed',
      });

      return res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        data: reservation,
      });
    } else {
      // In-memory fallback
      const existing = memoryReservations.find(
        (r) => r.date === date && r.time === time && r.tableId === tableId && r.status !== 'cancelled'
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Table ${tableId} is already reserved for ${date} at ${time}. Please select another table or time slot.`,
        });
      }

      const reservation = {
        reservationId,
        date,
        time,
        guests: guests || '2',
        name,
        phone,
        email: email || '',
        requests: requests || '',
        tableId,
        status: 'confirmed',
        createdAt: new Date(),
      };
      memoryReservations.unshift(reservation);

      return res.status(201).json({
        success: true,
        message: 'Reservation created successfully (memory cache)',
        data: reservation,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Public
const getReservations = async (req, res, next) => {
  try {
    const { date, phone } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (date) filter.date = date;
      if (phone) filter.phone = phone;

      const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: reservations.length,
        data: reservations,
      });
    } else {
      let results = [...memoryReservations];
      if (date) results = results.filter((r) => r.date === date);
      if (phone) results = results.filter((r) => r.phone === phone);
      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get reserved table IDs for a specific date & time
// @route   GET /api/reservations/tables
// @access  Public
const getReservedTables = async (req, res, next) => {
  try {
    const { date, time } = req.query;

    if (isDbConnected()) {
      const filter = { status: { $ne: 'cancelled' } };
      if (date) filter.date = date;
      if (time) filter.time = time;

      const reservations = await Reservation.find(filter).select('tableId date time');
      const reservedTableIds = [...new Set(reservations.map((r) => r.tableId))];

      return res.json({
        success: true,
        date: date || 'all',
        time: time || 'all',
        reservedTables: reservedTableIds,
      });
    } else {
      let filtered = memoryReservations.filter((r) => r.status !== 'cancelled');
      if (date) filtered = filtered.filter((r) => r.date === date);
      if (time) filtered = filtered.filter((r) => r.time === time);
      const reservedTableIds = [...new Set(filtered.map((r) => r.tableId))];

      return res.json({
        success: true,
        date: date || 'all',
        time: time || 'all',
        reservedTables: reservedTableIds,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Public
const getReservationById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const reservation =
        (await Reservation.findOne({ reservationId: req.params.id })) ||
        (await Reservation.findById(req.params.id));

      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      return res.json({ success: true, data: reservation });
    } else {
      const reservation = memoryReservations.find(
        (r) => r.reservationId === req.params.id || r._id === req.params.id
      );
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }
      return res.json({ success: true, data: reservation });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel reservation
// @route   PATCH /api/reservations/:id/cancel
// @access  Public
const cancelReservation = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const reservation = await Reservation.findOneAndUpdate(
        { $or: [{ reservationId: req.params.id }, { _id: req.params.id }] },
        { status: 'cancelled' },
        { new: true }
      );

      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      return res.json({ success: true, message: 'Reservation cancelled', data: reservation });
    } else {
      const reservation = memoryReservations.find(
        (r) => r.reservationId === req.params.id || r._id === req.params.id
      );
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }
      reservation.status = 'cancelled';
      return res.json({ success: true, message: 'Reservation cancelled', data: reservation });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservedTables,
  getReservationById,
  cancelReservation,
};
