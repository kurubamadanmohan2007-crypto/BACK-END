const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_resource_map';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(` Local MongoDB connection failed (${error.message}).`);
    console.log(` Starting embedded MongoDB Memory Server for immediate zero-config testing...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(` In-Memory MongoDB Connected at: ${memoryUri}`);
      console.log(` (Tip: You can set MONGODB_URI in backend/.env to connect to your MongoDB Atlas or local MongoDB instance)`);
      return conn;
    } catch (fallbackError) {
      console.error(` Failed to initialize fallback in-memory MongoDB: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

module.exports = connectDB;
