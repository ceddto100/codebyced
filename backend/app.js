// /backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

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
const servicesRoutes = require('./routes/servicesRoutes');

// --- NEW: Stripe routes ---
const stripeWebhook = require('./routes/stripeWebhook'); // uses express.raw inside
const stripeRoutes = require('./routes/stripeRoutes');   // create sessions, milestones, portal

const app = express();

/* ---------- CORS (ALLOWED_ORIGINS) ---------- */
const defaultOrigins = [
  'http://localhost:3000',
  'https://codebyced.com',
  'https://codebyced.onrender.com',
  'https://*.elevenlabs.io',
  'https://elevenlabs.io'
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

/* ---------- STRIPE WEBHOOK (must be BEFORE express.json) ---------- */
// This route expects the raw body so Stripe can verify the signature.
// The stripeWebhook module exports [express.raw(...), handler]
app.post('/api/stripe/webhook', ...stripeWebhook);

/* ---------- Normal body parsing for the rest ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- MongoDB ---------- */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codebyceddb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

/* ---------- Routes ---------- */
app.use('/api/blog', blogRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/honors', honorsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api', searchRoutes);

// --- NEW: Stripe app routes (sessions, milestones, portal) ---
app.use('/api/stripe', stripeRoutes);

/* ---------- Health ---------- */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0'
  });
});

/* ---------- 404 for API ---------- */
app.use('/api/*', (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

/* ---------- Central error handler ---------- */
app.use(errorHandler);

/* ---------- Server ---------- */
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
