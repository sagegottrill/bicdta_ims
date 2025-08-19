const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting custom build process...');

// Try to ensure vite binary exists and has permissions
const viteBinPath = path.join(__dirname, 'node_modules', '.bin', 'vite');
if (fs.existsSync(viteBinPath)) {
  try {
    fs.chmodSync(viteBinPath, 0o755);
    console.log('Set permissions on vite binary');
  } catch (e) {
    console.log('Could not set permissions:', e.message);
  }
}

// Try different build methods
const buildMethods = [
  'npx vite build',
  'node node_modules/vite/bin/vite.js build',
  './node_modules/.bin/vite build'
];

let buildSucceeded = false;

for (const method of buildMethods) {
  try {
    console.log(`Trying build method: ${method}`);
    execSync(method, { stdio: 'inherit', cwd: __dirname });
    console.log('Build succeeded!');
    buildSucceeded = true;
    break;
  } catch (error) {
    console.log(`Build method failed: ${error.message}`);
  }
}

if (!buildSucceeded) {
  console.error('All build methods failed');
  process.exit(1);
}
