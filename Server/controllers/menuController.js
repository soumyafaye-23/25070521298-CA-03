const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Default initial catalog
const defaultCatalog = [
  {
    id: '1',
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry served with fried bread.',
    price: 350,
    category: 'Mains',
    image: '/images/Chole-Bhature-01.jpg',
    featured: true,
  },
  {
    id: '2',
    name: 'Maharashtrian Bhindi Masala',
    description: 'Okra stir-fried with spices and coconut.',
    price: 280,
    category: 'Mains',
    image: '/images/Maharashtrian-style-Bhindi-Masala-1.jpg',
  },
  {
    id: '3',
    name: 'Palak Paneer Bhurji',
    description: 'Scrambled cottage cheese with spinach and spices.',
    price: 380,
    category: 'Mains',
    image: '/images/Palak-Paneer-Bhurji-MOP-New.webp',
  },
  {
    id: '4',
    name: 'Paneer Lababdar',
    description: 'Cottage cheese cubes in a creamy tomato gravy.',
    price: 400,
    category: 'Mains',
    image: '/images/Paneer_Lababdar.webp',
    featured: true,
  },
  {
    id: '5',
    name: 'Shrikhand',
    description: 'Sweetened strained yogurt flavored with saffron and cardamom.',
    price: 150,
    category: 'Desserts',
    image: '/images/Shrikhand-Featured.jpg',
  },
  {
    id: '6',
    name: 'Cabbage Manchurian',
    description: 'Crispy cabbage balls tossed in a spicy sauce.',
    price: 220,
    category: 'Appetizers',
    image: '/images/cabbage_manchurian_dry.webp',
  },
  {
    id: '7',
    name: 'Ice Cream',
    description: 'Classic vanilla ice cream.',
    price: 120,
    category: 'Desserts',
    image: '/images/ice cream.jpg',
  },
  {
    id: '8',
    name: 'Naan Roti',
    description: 'Leavened flatbread baked in a clay oven.',
    price: 60,
    category: 'Breads',
    image: '/images/nan roti.jpg',
  },
  {
    id: '9',
    name: 'Paneer Bhurji',
    description: 'Spiced scrambled cottage cheese.',
    price: 360,
    category: 'Mains',
    image: '/images/paneer bhurji.jpg',
  },
  {
    id: '10',
    name: 'Pav Bhaji',
    description: 'Spicy vegetable mash served with buttered bread rolls.',
    price: 250,
    category: 'Mains',
    image: '/images/pav bhaji.jpg',
    featured: true,
  },
  {
    id: '11',
    name: 'Tandoori Roti',
    description: 'Whole wheat flatbread baked in a clay oven.',
    price: 40,
    category: 'Breads',
    image: '/images/tanduri roti.webp',
  },
  {
    id: '12',
    name: 'Veg Crispy',
    description: 'Crispy fried vegetables tossed in sauces.',
    price: 240,
    category: 'Appetizers',
    image: '/images/veg crispy.webp',
  },
];

// In-memory catalog store
let memoryCatalog = [...defaultCatalog];

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (featured !== undefined) {
        filter.featured = featured === 'true';
      }

      let items = await MenuItem.find(filter).sort({ createdAt: -1 });

      // Auto-seed if database collection is empty
      if (items.length === 0 && Object.keys(filter).length === 0) {
        await MenuItem.insertMany(defaultCatalog);
        items = await MenuItem.find(filter);
      }

      return res.json({
        success: true,
        count: items.length,
        data: items,
      });
    } else {
      let filtered = [...memoryCatalog];
      if (category && category !== 'All') {
        filtered = filtered.filter((i) => i.category === category);
      }
      if (featured !== undefined) {
        filtered = filtered.filter((i) => i.featured === (featured === 'true'));
      }
      return res.json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const item = await MenuItem.findOne({ id: req.params.id }) || await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      return res.json({ success: true, data: item });
    } else {
      const item = memoryCatalog.find((i) => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Public (or Admin)
const createMenuItem = async (req, res, next) => {
  try {
    const { id, name, description, price, category, image, featured } = req.body;
    const newItem = {
      id: id || `item_${Date.now()}`,
      name,
      description,
      price: Number(price),
      category,
      image,
      featured: !!featured,
    };

    if (isDbConnected()) {
      const item = await MenuItem.create(newItem);
      return res.status(201).json({ success: true, data: item });
    } else {
      memoryCatalog.unshift(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Public (or Admin)
const updateMenuItem = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const item = await MenuItem.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      return res.json({ success: true, data: item });
    } else {
      const idx = memoryCatalog.findIndex((i) => i.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      memoryCatalog[idx] = { ...memoryCatalog[idx], ...req.body };
      return res.json({ success: true, data: memoryCatalog[idx] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Public (or Admin)
const deleteMenuItem = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const item = await MenuItem.findOneAndDelete({ id: req.params.id });
      if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      return res.json({ success: true, message: 'Menu item deleted successfully' });
    } else {
      const idx = memoryCatalog.findIndex((i) => i.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
      memoryCatalog.splice(idx, 1);
      return res.json({ success: true, message: 'Menu item deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  defaultCatalog,
};
