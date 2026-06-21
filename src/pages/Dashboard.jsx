import React, { useState, useEffect } from 'react';
import { Calendar, UserPlus, IndianRupee, Clock, MessageSquare, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import { fetchAppointments, fetchPendingPayments, fetchN8nExecutions } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [n8nExecutions, setN8nExecutions] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [appData, payData, n8nData] = await Promise.all([
          fetchAppointments(),
          fetchPendingPayments(),
          fetchN8nExecutions()
        ]);
        setAppointments(appData);
        setPayments(payData);
        if (n8nData.data && Array.isArray(n8nData.data)) {
          setN8nExecutions(n8nData.data);
        } else if (Array.isArray(n8nData)) {
          setN8nExecutions(n8nData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(a => new Date(a.appointment_date).toDateString() === today);
  const pendingRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Simplified recent lists
  const recentAppointments = todaysAppointments.slice(0, 3).map(a => ({
    name: a.patient_name || a.name || 'Walk-in',
    time: a.appointment_time,
    service: <span className="badge info">{a.service}</span>
  }));

  const recentPayments = payments.slice(0, 3).map(p => ({
    name: p.patient_name,
    amount: <span style={{ color: 'var(--danger)' }}>₹{p.amount}</span>
  }));

  const recentLeads = n8nExecutions.slice(0, 3).map(l => ({
    name: l.workflowName || 'N8N Workflow',
    status: <span className="badge warning">{l.status}</span>
  }));

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Today's Appointments" value={todaysAppointments.length} icon={<Calendar size={24} />} trend={0} />
        <KPICard title="Pending Payments" value={`₹${pendingRevenue}`} icon={<Clock size={24} />} trend={0} />
        <KPICard title="AI Automations Run" value={n8nExecutions.length} icon={<MessageSquare size={24} />} trend={0} />
        <KPICard title="Total Appts Logged" value={appointments.length} icon={<Activity size={24} />} trend={0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>Today's Appointments</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentAppointments.length === 0 ? <p>No appointments today.</p> : recentAppointments.map((apt, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: 'var(--primary)', marginRight: '1rem', fontWeight: '500' }}>{apt.time}</span>
                  <span>{apt.name}</span>
                </div>
                {apt.service}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Recent AI Automations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {recentLeads.length === 0 ? <p>No executions.</p> : recentLeads.map((lead, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span>{lead.name}</span>
                {lead.status}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Pending Payments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
             {recentPayments.length === 0 ? <p>No pending payments.</p> : recentPayments.map((pay, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span>{pay.name}</span>
                {pay.amount}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
