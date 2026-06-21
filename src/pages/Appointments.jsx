import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { fetchAppointments, updateAppointmentStatus, createAppointment, updateAppointmentDetails } from '../services/api';

const Appointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('new'); // 'new', 'edit', 'view'
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      loadAppointments(); 
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (type, appointment = null) => {
    setModalType(type);
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const columns = ['Name', 'Date', 'Time', 'Service', 'Status'];
  
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
    return true;
  });

  const now = new Date();
  const sortedData = filteredData.sort((a, b) => {
    // Attempt to combine date and time. If time is just "HH:MM:SS" or "HH:MM", it parses cleanly.
    const dateA = new Date(`${a.appointment_date.split('T')[0]}T${a.appointment_time}`);
    const dateB = new Date(`${b.appointment_date.split('T')[0]}T${b.appointment_time}`);
    
    // If invalid date fallback to just date comparison
    if (isNaN(dateA) || isNaN(dateB)) {
      return new Date(a.appointment_date) - new Date(b.appointment_date);
    }
    
    return Math.abs(dateA - now) - Math.abs(dateB - now);
  });

  const data = sortedData.map(app => ({
    _raw: app, // Pass full object for editing
    _id: app.id,
    name: app.patient_name || app.name || 'Walk-in',
    date: new Date(app.appointment_date).toLocaleDateString(),
    time: app.appointment_time,
    service: app.service || 'Consultation',
    status: <span className={`badge ${app.appointment_status === 'Active' ? 'info' : (app.appointment_status === 'Arrived' ? 'success' : 'warning')}`}>{app.appointment_status}</span>,
  }));

  const actions = [
    { label: 'View', type: 'secondary', onClick: (row) => openModal('view', row._raw) },
    { label: 'Edit', type: 'secondary', onClick: (row) => openModal('edit', row._raw) },
    { label: 'Mark Arrived', type: 'primary', onClick: (row) => handleMarkArrived(row._id) }
  ];

  // Common input style
  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)',
    width: '100%'
  };

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
        <button className="btn btn-primary" onClick={() => openModal('new')}>New Appointment</button>
      </div>
      
      {loading ? (
        <div>Loading appointments...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}

      {/* Dynamic Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalType === 'new' ? 'New Appointment' : modalType === 'edit' ? 'Edit Appointment' : 'Appointment Details'}
      >
        {modalType === 'view' && selectedAppointment ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>Patient Name:</strong> {selectedAppointment.patient_name || 'Walk-in'}</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> {selectedAppointment.phone || 'N/A'}</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Service:</strong> {selectedAppointment.service}</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Date:</strong> {new Date(selectedAppointment.appointment_date).toLocaleDateString()}</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Time:</strong> {selectedAppointment.appointment_time}</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Status:</strong> {selectedAppointment.appointment_status}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
               <button className="btn btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        ) : (
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const appointmentData = {
              patient_name: formData.get('patient_name'),
              phone: formData.get('phone'),
              appointment_date: formData.get('date'),
              appointment_time: formData.get('time'),
              service: formData.get('service')
            };

            try {
              if (modalType === 'new') {
                await createAppointment(appointmentData);
              } else {
                await updateAppointmentDetails(selectedAppointment.id, appointmentData);
              }
              loadAppointments();
              closeModal();
            } catch (err) {
              alert('Error saving appointment: ' + err.message);
            }
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Patient Name</label>
              <input name="patient_name" type="text" style={inputStyle} defaultValue={selectedAppointment?.patient_name || ''} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Contact Number</label>
              <input name="phone" type="tel" style={inputStyle} defaultValue={selectedAppointment?.phone || ''} required={modalType === 'new'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Date</label>
                <input name="date" type="date" style={inputStyle} defaultValue={selectedAppointment ? new Date(selectedAppointment.appointment_date).toISOString().split('T')[0] : ''} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Time</label>
                <input name="time" type="time" style={inputStyle} defaultValue={selectedAppointment?.appointment_time || ''} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Service</label>
              <select name="service" style={inputStyle} defaultValue={selectedAppointment?.service || 'Consultation'}>
                <option value="Consultation">Consultation</option>
                <option value="Teeth Cleaning & Scaling">Teeth Cleaning & Scaling</option>
                <option value="Root Canal Treatment (RCT)">Root Canal Treatment (RCT)</option>
                <option value="Tooth Extraction">Tooth Extraction</option>
                <option value="Dental Implants">Dental Implants</option>
                <option value="Braces / Orthodontics">Braces / Orthodontics</option>
                <option value="Teeth Whitening">Teeth Whitening</option>
                <option value="Dentures">Dentures</option>
                <option value="Crowns & Bridges">Crowns & Bridges</option>
                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Appointment</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Appointments;
