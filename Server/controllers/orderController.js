const mongoose = require('mongoose');
const Order = require('../models/Order');

// In-memory fallback cache when MongoDB is offline
const memoryOrders = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Place a new food order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { items, customer, orderId: customOrderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const serviceCharge = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + tax + serviceCharge) * 100) / 100;

    const orderId =
      customOrderId ||
      `LUM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (isDbConnected()) {
      const order = await Order.create({
        orderId,
        items,
        subtotal,
        tax,
        serviceCharge,
        total,
        customer: customer || { name: 'Guest Diner', phone: '', address: '' },
        status: 'placed',
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } else {
      const order = {
        _id: `mem_${Date.now()}`,
        orderId,
        items,
        subtotal,
        tax,
        serviceCharge,
        total,
        customer: customer || { name: 'Guest Diner', phone: '', address: '' },
        status: 'placed',
        createdAt: new Date(),
      };
      memoryOrders.unshift(order);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (memory cache)',
        data: order,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by orderId or _id
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const order =
        (await Order.findOne({ orderId: req.params.id })) ||
        (await Order.findById(req.params.id));

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      return res.json({
        success: true,
        data: order,
      });
    } else {
      const order = memoryOrders.find(
        (o) => o.orderId === req.params.id || o._id === req.params.id
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      return res.json({
        success: true,
        data: order,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } else {
      return res.json({
        success: true,
        count: memoryOrders.length,
        data: memoryOrders,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Public (or Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'cooking', 'picked_up', 'near_you', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (isDbConnected()) {
      const order = await Order.findOneAndUpdate(
        { $or: [{ orderId: req.params.id }, { _id: req.params.id }] },
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      return res.json({
        success: true,
        message: 'Order status updated',
        data: order,
      });
    } else {
      const order = memoryOrders.find(
        (o) => o.orderId === req.params.id || o._id === req.params.id
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      order.status = status;
      return res.json({
        success: true,
        message: 'Order status updated',
        data: order,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
};
