import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Creating clinic_settings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clinic_settings (
          id SERIAL PRIMARY KEY,
          clinic_name VARCHAR(200),
          phone VARCHAR(20),
          email VARCHAR(150),
          address TEXT,
          opening_time TIME,
          closing_time TIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default if empty
    const res = await pool.query('SELECT COUNT(*) FROM clinic_settings');
    if (parseInt(res.rows[0].count) === 0) {
      console.log('Inserting default clinic settings...');
      await pool.query(`
        INSERT INTO clinic_settings (clinic_name, phone, email, address, opening_time, closing_time)
        VALUES ('Autoniq Dental Care', '+91 98765 43210', 'contact@autoniq.com', '123 Health Ave, Medical District', '09:00:00', '18:00:00')
      `);
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
