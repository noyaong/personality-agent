// Test environment variables
console.log('=== Environment Variables Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL (first 80 chars):', process.env.DATABASE_URL?.substring(0, 80));
console.log('DIRECT_URL (first 80 chars):', process.env.DIRECT_URL?.substring(0, 80));

// Try loading from different env files
const dotenv = require('dotenv');
const path = require('path');

console.log('\n=== Loading .env ===');
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 80));

console.log('\n=== Loading .env.local ===');
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 80));
