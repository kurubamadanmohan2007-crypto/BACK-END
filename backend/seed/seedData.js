const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('../models/Resource');
const sampleResources = require('./sampleData');

dotenv.config();

const seedDB = async (autoExit = true) => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_resource_map';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log(' Connected to MongoDB for seeding...');
    }

    // Clear existing resources
    await Resource.deleteMany({});
    console.log(' Cleared existing resources');

    // Insert sample resources
    const inserted = await Resource.insertMany(sampleResources);
    console.log(` Successfully seeded ${inserted.length} community resources!`);

    if (autoExit) {
      await mongoose.disconnect();
      console.log(' MongoDB disconnected after seeding.');
      process.exit(0);
    }
  } catch (error) {
    console.error(' Error seeding database:', error.message);
    if (autoExit) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB(true);
}

module.exports = seedDB;
