import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { fetchAppointments } from '../services/api';

const Appointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointments();
        setAppointmentsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const columns = ['Name', 'Date', 'Time', 'Service', 'Status'];
  
  const data = appointmentsData.map(app => ({
    name: app.patient_name || 'Walk-in',
    date: new Date(app.appointment_date).toLocaleDateString(),
    time: app.appointment_time,
    service: app.service || 'Consultation',
    status: <span className={`badge ${app.appointment_status === 'Active' ? 'info' : 'success'}`}>{app.appointment_status}</span>,
  }));

  const actions = [
    { label: 'View', type: 'secondary' },
    { label: 'Edit', type: 'secondary' },
    { label: 'Mark Arrived', type: 'primary' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="tabs" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary">Today</button>
          <button className="btn btn-secondary">Tomorrow</button>
          <button className="btn btn-secondary">This Week</button>
          <button className="btn btn-secondary">All</button>
        </div>
        <button className="btn btn-primary">New Appointment</button>
      </div>
      
      {loading ? (
        <div>Loading appointments...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}
    </div>
  );
};

export default Appointments;
