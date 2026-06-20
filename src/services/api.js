const API_URL = 'http://localhost:3000/api';

export const fetchPatients = async () => {
  const res = await fetch(`${API_URL}/db/patients`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
};

export const fetchAppointments = async () => {
  const res = await fetch(`${API_URL}/db/appointments`);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
};

export const fetchLeads = async () => {
  const res = await fetch(`${API_URL}/db/leads`);
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
};

export const fetchPendingPayments = async () => {
  const res = await fetch(`${API_URL}/db/payments/pending`);
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
};

export const fetchN8nExecutions = async () => {
  const res = await fetch(`${API_URL}/n8n/executions`);
  if (!res.ok) throw new Error('Failed to fetch n8n executions');
  return res.json();
};
