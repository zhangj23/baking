const { Pool } = require('pg');

// Enable SSL for RDS connections (detected by amazonaws.com in URL)
const isRDS = process.env.DATABASE_URL?.includes('amazonaws.com');
const sslConfig = isRDS || process.env.NODE_ENV === 'production' 
  ? { rejectUnauthorized: false } 
  : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

// Test connection
pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};


