const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const searchRoutes = require('./routes/searchRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const blogRoutes = require('./routes/blogRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const ideasRoutes = require('./routes/ideasRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const honorsRoutes = require('./routes/honorsRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://codebyced.com',
    'https://*.elevenlabs.io',
    'https://elevenlabs.io'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codebyceddb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/blog', blogRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/honors', honorsRoutes);
app.use('/api', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0'
  });
});

// 404 handler for undefined routes (only for API routes)
app.use('/api/*', (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handling middleware
app.use(errorHandler);

// Only start the server if this file is run directly, not if it's imported
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;