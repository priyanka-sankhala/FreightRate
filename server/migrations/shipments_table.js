import pool from '../db.js';

const migrate = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`

CREATE TABLE IF NOT EXISTS freight_rates (
  id SERIAL PRIMARY KEY,
  origin_port TEXT,
  destination_port TEXT,
  container_type TEXT,
  ocean_freight_rate NUMERIC,
  carrier TEXT,
  service TEXT,
  commodity TEXT,
  effective_date DATE,
  expire_date DATE,
  remarks TEXT,
  si_cut DATE,
  etd DATE,
  eta DATE,
  transit_time TEXT,
  validity TEXT,
  agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
    `);

    await client.query('COMMIT');
    console.log('Migration ran successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed', err);
  } finally {
    client.release();
  }
};

migrate();
