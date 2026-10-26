const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const { defaultCatalog } = require('./controllers/menuController');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lumiere_restaurant';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    await MenuItem.deleteMany({});
    console.log('Existing menu items removed.');

    await MenuItem.insertMany(defaultCatalog);
    console.log(`Successfully seeded ${defaultCatalog.length} menu items!`);

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
