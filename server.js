const express = require('express');
const path = require('path');
const backendApp = require('./backend/app');

const app = express();

// Use backend routes (must be before serving static files)
app.use('/', backendApp);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one of the backend routes, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 