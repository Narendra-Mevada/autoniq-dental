const API_URL = 'http://51.21.93.215:3000/api';

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

export const updateAppointmentStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/db/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update appointment');
  return res.json();
};

export const updateLeadStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/db/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update lead');
  return res.json();
};

export const updatePaymentStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/db/payments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update payment');
  return res.json();
};

export const createAppointment = async (data) => {
  const res = await fetch(`${API_URL}/db/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create appointment');
  return res.json();
};

export const updateAppointmentDetails = async (id, data) => {
  const res = await fetch(`${API_URL}/db/appointments/details/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update appointment details');
  return res.json();
};
