import React, { useState, useEffect } from 'react';
import { Users, Target, UserCheck, UserMinus } from 'lucide-react';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import { fetchLeads } from '../services/api';

const Leads = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLeads();
        setLeadsData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const columns = ['Name', 'Phone', 'Inquiry', 'Date', 'Status'];

  const data = leadsData.map(lead => ({
    name: lead.name || lead.patient_name || 'Unknown',
    phone: lead.phone,
    inquiry: lead.inquiry_type || lead.inquiry,
    date: new Date(lead.created_at || new Date()).toLocaleDateString(),
    status: <span className={`badge ${lead.status === 'New' ? 'warning' : 'info'}`}>{lead.status || lead.lead_status}</span>,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lead Pipeline</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Total Leads" value={leadsData.length} icon={<Users size={24} />} trend={0} />
        <KPICard title="Conversion %" value={`${leadsData.length > 0 ? Math.round((leadsData.filter(l => l.status === 'Booked' || l.lead_status === 'Appointment Booked').length / leadsData.length) * 100) : 0}%`} icon={<Target size={24} />} trend={0} />
      </div>

      {loading ? (
        <div>Loading leads...</div>
      ) : leadsData.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No leads found. Please configure your Autoniq workflow to insert new leads into the database!
        </div>
      ) : (
        <DataTable columns={columns} data={data} actions={[]} />
      )}
    </div>
  );
};

export default Leads;
