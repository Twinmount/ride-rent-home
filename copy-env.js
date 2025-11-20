const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '.env.development');
const dest = path.join(__dirname, '.env.local');

try {
  fs.copyFileSync(src, dest);
  console.log(`Copied .env.development to .env.local`);
} catch (err) {
  console.error('Failed to copy .env.development to .env.local:', err);
  process.exit(1);
}