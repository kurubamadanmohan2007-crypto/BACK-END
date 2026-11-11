const mongoose = require('mongoose');

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    // Wait briefly for connection
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (mongoose.connection.readyState >= 1) return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_resource_map';

  isConnecting = true;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnecting = false;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnecting = false;
    console.warn(` Local/Remote MongoDB connection failed: ${error.message}`);

    // If running on Vercel serverless, do not attempt to download mongodb-memory-server binaries
    if (process.env.VERCEL) {
      console.warn(' Running in Vercel Serverless environment. Please set MONGODB_URI in Vercel Project Settings > Environment Variables.');
      throw new Error(`MongoDB connection failed: ${error.message}. Please configure MONGODB_URI in Vercel.`);
    }

    console.log(` Starting embedded MongoDB Memory Server for local zero-config testing...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(` In-Memory MongoDB Connected at: ${memoryUri}`);
      return conn;
    } catch (fallbackError) {
      console.error(` Fallback failed: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

module.exports = connectDB;
