const mongoose = require('mongoose');

// Disable command buffering when disconnected to prevent queries from hanging
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lumiere_restaurant';
    console.log(`Connecting to MongoDB at: ${mongoURI}`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.warn(`ℹ️ Server will continue in resilient mode. Set MONGO_URI in Server/.env to connect to MongoDB Atlas or local MongoDB.`);
    return false;
  }
};

module.exports = connectDB;
