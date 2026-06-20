import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Postgres Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// API Endpoints for DB

// 1. Get Patients
app.get('/api/db/patients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             COUNT(a.id) as total_visits,
             MAX(a.appointment_date) as last_visit,
             SUM(CASE WHEN a.payment_status = 'Pending' THEN a.amount ELSE 0 END) as pending_amount
      FROM patients p
      LEFT JOIN appointments a ON p.id = a.patient_id
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Appointments
app.get('/api/db/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.name as patient_name, p.phone
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Leads
app.get('/api/db/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Pending Payments
app.get('/api/db/payments/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, p.name as patient_name, a.amount, a.payment_status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.payment_status = 'Pending' AND a.amount > 0
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Proxy n8n API
app.get('/api/n8n/executions', (req, res) => {
  const targetUrl = 'https://n8n.bcap.tech/api/v1/executions?limit=50';
  
  https.get(targetUrl, {
      headers: {
          'accept': 'application/json',
          'X-N8N-API-KEY': process.env.N8N_API_KEY || ''
      }
  }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
  }).on('error', (e) => {
      res.status(500).json({ error: e.message });
  });
});

// Serve Vite build in production
app.use(express.static(join(__dirname, 'dist')));

// Fallback to index.html for React Router
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Test DB Connection before starting
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️ Server starting without database connection...');
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
  
  app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 DASHBOARD API SERVER RUNNING`);
    console.log(`=========================================`);
    console.log(`\n👉 API Endpoints listening on http://localhost:${PORT}/api`);
  });
});
