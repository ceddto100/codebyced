const cors = require('cors');

/**
 * Configure CORS based on environment
 */
const configureCors = () => {
  const whitelist = [
    // Development
    'http://localhost:3000',
    
    // Production
    'https://codebyced.com'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if the origin is in the whitelist
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // Cache preflight requests for 24 hours
  };
  
  return cors(corsOptions);
};

module.exports = configureCors;