const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Please provide reservation date'],
    },
    time: {
      type: String, // Format: HH:mm (e.g., '19:00')
      required: [true, 'Please provide reservation time'],
    },
    guests: {
      type: String,
      required: [true, 'Please provide number of guests'],
      default: '2',
    },
    name: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    requests: {
      type: String,
      default: '',
    },
    tableId: {
      type: String,
      required: [true, 'Please select a table'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
