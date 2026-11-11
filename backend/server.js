const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Resource = require('./models/Resource');
const sampleResources = require('./seed/sampleData');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Ensure database is connected for requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error on request:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please check MONGODB_URI.',
      error: err.message,
    });
  }
});

// API Routes
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Local Resource Map Backend API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Server & Database for standard Node process
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty or updated
    const resourceCount = await Resource.countDocuments();
    if (resourceCount < sampleResources.length) {
      console.log(`⚡ Updating database with ${sampleResources.length} community resources...`);
      await Resource.deleteMany({});
      await Resource.insertMany(sampleResources);
      console.log(`✅ Loaded ${sampleResources.length} sample community resources into database.`);
    } else {
      console.log(`ℹ️ Database currently contains ${resourceCount} community resources.`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Local Resource Map Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

if (require.main === module && !process.env.VERCEL) {
  startServer();
}

module.exports = app;
