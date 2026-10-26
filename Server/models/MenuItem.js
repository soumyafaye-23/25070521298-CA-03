const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide dish name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide dish description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide dish price'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['Appetizers', 'Mains', 'Desserts', 'Breads'],
    },
    image: {
      type: String,
      required: [true, 'Please provide image path or URL'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
