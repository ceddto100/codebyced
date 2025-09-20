// /backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

/* ---------- Routes & middleware ---------- */
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./middleware/errorHandler');

const blogRoutes = require('./routes/blogRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const ideasRoutes = require('./routes/ideasRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const honorsRoutes = require('./routes/honorsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');

// Stripe
const stripeWebhook = require('./routes/stripeWebhook'); // exports either [express.raw(...), handler] OR a single handler
const stripeRoutes = require('./routes/stripeRoutes');   // create sessions, subscriptions, portal, etc.

const app = express();

/* ---------- CORS (ALLOWED_ORIGINS) ---------- */
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://codebyced.com',
  'https://www.codebyced.com',
  'https://codebyced.onrender.com',
  'https://api.codebyced.com'
];

const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowList = [...new Set([...defaultOrigins, ...envOrigins])];

const isAllowedOrigin = (origin) => {
  // Allow non-browser requests (e.g., curl, Stripe)
  if (!origin) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (!/^https?:$/.test(protocol)) return false;

    // Exact allowlist
    if (allowList.includes(origin)) return true;

    // Wildcard: *.elevenlabs.io
    if (/^([a-z0-9-]+\.)*elevenlabs\.io$/i.test(hostname)) return true;

    return false;
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
}));

// Preflight helper
app.options('*', cors());

/* ---------- STRIPE WEBHOOK (must be BEFORE express.json) ---------- */
function mountStripeWebhook(path, mod) {
  if (Array.isArray(mod)) {
    app.post(path, ...mod);
  } else if (mod && typeof mod === 'function') {
    app.post(path, mod);
  } else if (mod && mod.raw && mod.handler) {
    app.post(path, mod.raw, mod.handler);
  } else {
    throw new Error('Unsupported stripeWebhook export shape');
  }
}
mountStripeWebhook('/api/stripe/webhook', stripeWebhook);

/* ---------- Normal body parsing for the rest ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- MongoDB ---------- */
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codebyceddb';
mongoose.connect(mongoUri)
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

// Stripe app routes
app.use('/api/stripe', stripeRoutes);

/* ---------- Health ---------- */
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', version: '1.0.0' });
});

/* ---------- 404 for API ---------- */
app.use(/^\/api\//, (req, _res, next) => {
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
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

module.exports = app;

