const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to clean
const pathsToClean = [
  './node_modules',
  './package-lock.json',
  './frontend/node_modules',
  './frontend/package-lock.json',
  './backend/node_modules',
  './backend/package-lock.json',
  './frontend/build'
];

console.log('🧹 Cleaning up...');

// Delete each path
pathsToClean.forEach(pathToClean => {
  const fullPath = path.join(__dirname, pathToClean);
  
  if (fs.existsSync(fullPath)) {
    console.log(`Removing: ${pathToClean}`);
    
    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        // Use rimraf for directories (more reliable than fs.rmdirSync)
        execSync(`npx rimraf "${fullPath}"`);
      } else {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error(`Error removing ${pathToClean}:`, err.message);
    }
  } else {
    console.log(`Skipping (not found): ${pathToClean}`);
  }
});

console.log('\n🔄 Reinstalling dependencies...');

// Install dependencies
try {
  console.log('\nInstalling root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\nInstalling backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('\nInstalling frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  console.log('\n✅ All dependencies reinstalled successfully!');
} catch (err) {
  console.error('\n❌ Error reinstalling dependencies:', err.message);
  process.exit(1);
} 