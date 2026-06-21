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
      SELECT a.*, COALESCE(p.name, a.patient_name) as patient_name, COALESCE(p.phone, a.phone) as phone
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      ORDER BY a.appointment_date DESC
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
      SELECT a.id, COALESCE(p.name, a.patient_name) as patient_name, a.amount, a.payment_status, a.appointment_date
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.payment_status = 'Pending' AND a.treatment_status = 'Done'
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Appointment Status
app.put('/api/db/appointments/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE appointments SET appointment_status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Lead Status
app.put('/api/db/leads/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE leads SET lead_status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark Payment as Paid
app.put('/api/db/payments/:id', async (req, res) => {
  try {
    await pool.query('UPDATE appointments SET payment_status = $1 WHERE id = $2', ['Paid', req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create New Appointment
app.post('/api/db/appointments', async (req, res) => {
  try {
    const { patient_name, phone, appointment_date, appointment_time, service } = req.body;
    
    let patientRes = await pool.query('SELECT id FROM patients WHERE name = $1 LIMIT 1', [patient_name]);
    let patient_id = null;
    if (patientRes.rows.length > 0) {
      patient_id = patientRes.rows[0].id;
    }

    if (!patient_id) {
       const newPatient = await pool.query('INSERT INTO patients (name, phone) VALUES ($1, $2) RETURNING id', [patient_name, phone || 'Unknown']);
       patient_id = newPatient.rows[0].id;
    }

    await pool.query(
      'INSERT INTO appointments (patient_id, patient_name, phone, appointment_date, appointment_time, service) VALUES ($1, $2, $3, $4, $5, $6)', 
      [patient_id, patient_name, phone || 'Unknown', appointment_date, appointment_time, service]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Appointment Details
app.put('/api/db/appointments/details/:id', async (req, res) => {
  try {
    const { patient_name, appointment_date, appointment_time, service } = req.body;
    
    await pool.query(
      'UPDATE appointments SET appointment_date = $1, appointment_time = $2, service = $3, patient_name = $4 WHERE id = $5', 
      [appointment_date, appointment_time, service, patient_name, req.params.id]
    );

    // Update patient name if we have a patient_id linked
    const appt = await pool.query('SELECT patient_id FROM appointments WHERE id = $1', [req.params.id]);
    if (appt.rows.length > 0 && appt.rows[0].patient_id && patient_name) {
       await pool.query('UPDATE patients SET name = $1 WHERE id = $2', [patient_name, appt.rows[0].patient_id]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Treatment Status & Amount
app.put('/api/db/treatments/:id', async (req, res) => {
  try {
    const { status, amount } = req.body;
    await pool.query(
      'UPDATE appointments SET treatment_status = $1, amount = $2 WHERE id = $3',
      [status, amount, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Arrived Patients Queue (For Patients tab)
app.get('/api/db/patients/queue', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, COALESCE(p.name, a.patient_name) as patient_name, COALESCE(p.phone, a.phone) as phone
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.appointment_status = 'Arrived' AND a.treatment_status != 'Done'
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
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
