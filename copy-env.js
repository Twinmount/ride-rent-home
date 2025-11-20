const fs = require('fs');
const path = require('path');

const [,, srcArg, destArg] = process.argv;
if (!srcArg || !destArg) {
  console.error('Usage: node copy-env.js <source> <destination>');
  process.exit(1);
}

const src = path.join(__dirname, srcArg);
const dest = path.join(__dirname, destArg);

try {
  fs.copyFileSync(src, dest);
  console.log(`Copied ${srcArg} to ${destArg}`);
} catch (err) {
  console.error(`Failed to copy ${srcArg} to ${destArg}:`, err);
  process.exit(1);
}