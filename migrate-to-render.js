const fs = require('fs');
const path = require('path');

// Backend environment file for Render
const backendEnv = `PORT=5000
MONGODB_URI=your-mongodb-uri
NODE_ENV=production
CLIENT_URL=https://codebyced.onrender.com
ALLOWED_ORIGINS=https://codebyced.com,https://codebyced.onrender.com`;

fs.writeFileSync(path.join(__dirname, 'backend', '.env.render.example'), backendEnv);
console.log('Created backend/.env.render.example');

// Frontend environment file for Render
const frontendEnv = `REACT_APP_API_URL=https://codebyced.onrender.com/api`;
fs.writeFileSync(path.join(__dirname, 'frontend', '.env.render.example'), frontendEnv);
console.log('Created frontend/.env.render.example');

