import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { fetchPatientsQueue, updateTreatmentStatus } from '../services/api';
import { UserPlus, Activity, ShieldCheck, Clock } from 'lucide-react';
import KPICard from '../components/KPICard';

const Patients = () => {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const loadQueue = async () => {
    try {
      const data = await fetchPatientsQueue();
      setQueueData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const columns = ['Patient Name', 'Phone', 'Service', 'Appointment Time', 'Status'];

  const data = queueData.map(p => ({
    _raw: p,
    name: <span style={{ fontWeight: '600' }}>{p.patient_name}</span>,
    phone: p.phone,
    service: p.service,
    time: p.appointment_time,
    status: <span className="badge info">In Waiting Room</span>
  }));

  const actions = [
    { label: 'Start Treatment', type: 'primary', onClick: (row) => openModal(row._raw) }
  ];

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
        <h2>Treatment Queue</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Waiting Room" value={queueData.length} icon={<Clock size={24} />} trend={0} />
        <KPICard title="Treatments Done Today" value={0} icon={<Activity size={24} />} trend={0} />
      </div>

      {loading ? (
        <div>Loading patient queue...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : queueData.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No patients currently waiting. When an appointment is marked as "Arrived", it will appear here.
        </div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}

      {/* Treatment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Complete Treatment"
      >
        {selectedPatient && (
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const amount = formData.get('amount');

            try {
              await updateTreatmentStatus(selectedPatient.id, 'Done', amount);
              loadQueue();
              closeModal();
            } catch (err) {
              alert('Error saving treatment: ' + err.message);
            }
          }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Patient: <strong style={{ color: 'var(--text-primary)' }}>{selectedPatient.patient_name}</strong></p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Service: <strong style={{ color: 'var(--text-primary)' }}>{selectedPatient.service}</strong></p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Treatment Notes (Optional)</label>
              <textarea name="notes" rows="3" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Enter any notes about the procedure..."></textarea>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Invoice Amount (₹)</label>
              <input name="amount" type="number" style={inputStyle} defaultValue="0" min="0" required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">Mark Done & Send to Billing</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Patients;
