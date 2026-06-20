import React, { useState, useEffect } from 'react';
import { Users, Target } from 'lucide-react';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import { fetchN8nExecutions } from '../services/api';

const Leads = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchN8nExecutions();
        // Extract real execution data
        if (data.data && data.data.result) {
           setLeadsData(data.data.result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const columns = ['N8N Workflow', 'Started At', 'Status', 'Execution ID'];

  const data = leadsData.map(lead => ({
    name: lead.workflowName || 'Unknown Workflow',
    date: new Date(lead.startedAt).toLocaleString(),
    status: <span className={`badge ${lead.status === 'success' ? 'success' : (lead.status === 'running' ? 'info' : 'warning')}`}>{lead.status}</span>,
    id: lead.id
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lead Pipeline (from n8n Automations)</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Total Automations" value={leadsData.length} icon={<Users size={24} />} trend={0} />
        <KPICard title="Success Rate" value={`${leadsData.length > 0 ? Math.round((leadsData.filter(l => l.status === 'success').length / leadsData.length) * 100) : 0}%`} icon={<Target size={24} />} trend={0} />
      </div>

      {loading ? (
        <div>Loading n8n automations...</div>
      ) : leadsData.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No n8n executions found. Make sure your n8n workflow is active!
        </div>
      ) : (
        <DataTable columns={columns} data={data} actions={[]} />
      )}
    </div>
  );
};

export default Leads;
