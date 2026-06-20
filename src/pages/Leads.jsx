import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import KPICard from '../components/KPICard';
import { fetchLeads, updateLeadStatus } from '../services/api';
import { UserPlus, Target, Users, XCircle } from 'lucide-react';

const Leads = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLeads = async () => {
    try {
      const data = await fetchLeads();
      setLeadsData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    let newStatus = 'Contacted';
    if (currentStatus === 'Contacted') newStatus = 'Appointment Booked';
    if (currentStatus === 'Appointment Booked') newStatus = 'Lost';

    try {
      await updateLeadStatus(id, newStatus);
      loadLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = ['Name', 'Phone', 'Inquiry', 'Date', 'Status', 'Source'];
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'New': return 'warning';
      case 'Contacted': return 'info';
      case 'Appointment Booked': return 'success';
      case 'Lost': return 'danger';
      default: return 'info';
    }
  };

  const data = leadsData.map(l => ({
    _id: l.id,
    _status: l.lead_status, // hidden fields
    name: <span style={{ fontWeight: '600' }}>{l.patient_name}</span>,
    phone: l.phone,
    inquiry: l.inquiry,
    date: new Date(l.created_at).toLocaleDateString(),
    status: <span className={`badge ${getStatusBadge(l.lead_status)}`}>{l.lead_status}</span>,
    source: l.source
  }));

  const actions = [
    { label: 'View', type: 'secondary', onClick: (row) => alert(`Viewing details for lead: ${row.name.props.children}`) },
    { label: 'Update Status', type: 'primary', onClick: (row) => handleUpdateStatus(row._id, row._status) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Total Leads" value={leadsData.length} icon={<Users size={24} />} trend={15} />
        <KPICard title="Conversion %" value={leadsData.length > 0 ? Math.round((leadsData.filter(l => l.lead_status === 'Appointment Booked').length / leadsData.length) * 100) : 0} suffix="%" icon={<Target size={24} />} trend={5} />
        <KPICard title="Booked Leads" value={leadsData.filter(l => l.lead_status === 'Appointment Booked').length} icon={<UserPlus size={24} />} trend={8} />
        <KPICard title="Lost Leads" value={leadsData.filter(l => l.lead_status === 'Lost').length} icon={<XCircle size={24} />} trend={-2} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <h2>Lead Pipeline</h2>
      </div>
      
      {loading ? (
        <div>Loading leads...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}
    </div>
  );
};

export default Leads;
