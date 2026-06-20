import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { fetchAppointments, updateAppointmentStatus } from '../services/api';

const Appointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

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

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleMarkArrived = async (id) => {
    try {
      await updateAppointmentStatus(id, 'Arrived');
      loadAppointments(); // reload data to show updated status
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = ['Name', 'Date', 'Time', 'Service', 'Status'];
  
  // Filter Data based on Tab
  const filteredData = appointmentsData.filter(app => {
    const appDate = new Date(app.appointment_date).toDateString();
    const todayDate = new Date().toDateString();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toDateString();

    if (activeTab === 'Today') return appDate === todayDate;
    if (activeTab === 'Tomorrow') return appDate === tomorrowDate;
    if (activeTab === 'This Week') {
      const diff = new Date(app.appointment_date) - new Date();
      return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
    }
    return true; // 'All'
  });

  const data = filteredData.map(app => ({
    _id: app.id, // hidden field for actions
    name: app.patient_name || app.name || 'Walk-in',
    date: new Date(app.appointment_date).toLocaleDateString(),
    time: app.appointment_time,
    service: app.service || 'Consultation',
    status: <span className={`badge ${app.appointment_status === 'Active' ? 'info' : (app.appointment_status === 'Arrived' ? 'success' : 'warning')}`}>{app.appointment_status}</span>,
  }));

  const actions = [
    { label: 'View', type: 'secondary', onClick: (row) => alert(`Opening View Modal for ${row.name}`) },
    { label: 'Edit', type: 'secondary', onClick: (row) => alert(`Opening Edit Modal for ${row.name}`) },
    { label: 'Mark Arrived', type: 'primary', onClick: (row) => handleMarkArrived(row._id) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="tabs" style={{ display: 'flex', gap: '0.5rem' }}>
          {['Today', 'Tomorrow', 'This Week', 'All'].map(tab => (
            <button 
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => alert('Opening New Appointment Modal...')}>New Appointment</button>
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
