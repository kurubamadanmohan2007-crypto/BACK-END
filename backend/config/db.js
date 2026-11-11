const mongoose = require('mongoose');

let cachedPromise = null;
let memoryServerInstance = null;

const connectDB = async () => {
  // If already connected, return existing connection
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection attempt is already in flight, reuse it
  if (cachedPromise) {
    return cachedPromise;
  }

  const connectLogic = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_resource_map';

    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(` MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      if (process.env.VERCEL) {
        console.warn(` MongoDB error: ${error.message}`);
        throw new Error(`MongoDB connection failed: ${error.message}. Please configure MONGODB_URI in Vercel.`);
      }

      console.log(` Local MongoDB daemon not active (${error.message}).`);

      // Ensure only ONE MongoMemoryServer is ever instantiated
      if (!memoryServerInstance) {
        console.log(` Initializing embedded in-memory MongoDB engine...`);
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
      }

      const memoryUri = memoryServerInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(` In-Memory MongoDB Connected at: ${memoryUri}`);
      return conn;
    }
  };

  cachedPromise = connectLogic().catch((err) => {
    cachedPromise = null; // Reset so retry is possible
    throw err;
  });

  return cachedPromise;
};

module.exports = connectDB;
