import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

var config = {
  user: process.env.DB_USER, 
  database: process.env.DATABASE, 
  password: '', 
  host: process.env.HOST, 
  port: process.env.DB_PORT, 
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
};
const pool = new Pool(config);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

export default pool;