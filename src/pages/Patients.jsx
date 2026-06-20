import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { fetchPatients } from '../services/api';

const Patients = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatientsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const columns = ['Name', 'Phone', 'Last Visit', 'Total Visits', 'Pending Amount', 'Last Treatment'];
  
  const data = patientsData.map(p => ({
    name: <span style={{ fontWeight: '600' }}>{p.name}</span>,
    phone: p.phone,
    lastVisit: p.last_visit ? new Date(p.last_visit).toLocaleDateString() : 'N/A',
    totalVisits: p.total_visits || 0,
    pendingAmount: <span style={{ color: Number(p.pending_amount) > 0 ? 'var(--danger)' : 'var(--success)' }}>₹{p.pending_amount || 0}</span>,
    lastTreatment: <span className="badge info">{p.notes || 'General'}</span>
  }));

  const actions = [
    { label: 'View Profile', type: 'secondary' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Patient Directory</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search patients..." 
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary)'
            }} 
          />
          <button className="btn btn-primary">Add Patient</button>
        </div>
      </div>
      
      {loading ? (
        <div>Loading patients from database...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}
    </div>
  );
};

export default Patients;
