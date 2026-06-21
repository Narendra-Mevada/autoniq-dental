import React, { useState, useEffect } from 'react';
import { Calendar, UserPlus, IndianRupee, Clock, MessageSquare, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import MetricChart from '../components/MetricChart';
import DataTable from '../components/DataTable';
import clientConfig from '../config/clientConfig';
import { fetchAppointments, fetchPendingPayments, fetchN8nExecutions } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [n8nExecutions, setN8nExecutions] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [appRes, payRes, n8nRes] = await Promise.allSettled([
          fetchAppointments(),
          fetchPendingPayments(),
          fetchN8nExecutions()
        ]);
        
        if (appRes.status === 'fulfilled') setAppointments(appRes.value);
        if (payRes.status === 'fulfilled') setPayments(payRes.value);
        
        if (n8nRes.status === 'fulfilled') {
          const n8nData = n8nRes.value;
          if (n8nData.data && Array.isArray(n8nData.data)) {
            setN8nExecutions(n8nData.data);
          } else if (Array.isArray(n8nData)) {
            setN8nExecutions(n8nData);
          }
        } else {
          console.error('Failed to fetch n8n data:', n8nRes.reason);
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
  const now = new Date();
  const todaysAppointments = appointments
    .filter(a => new Date(a.appointment_date).toDateString() === today)
    .sort((a, b) => {
      const dateA = new Date(`${a.appointment_date.split('T')[0]}T${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date.split('T')[0]}T${b.appointment_time}`);
      if (isNaN(dateA) || isNaN(dateB)) {
        return new Date(a.appointment_date) - new Date(b.appointment_date);
      }
      return Math.abs(dateA - now) - Math.abs(dateB - now);
    });
  const pendingRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const completedPayments = appointments.filter(a => a.payment_status === 'Paid');
  const completedRevenue = completedPayments.reduce((sum, a) => sum + Number(a.amount || 0), 0);

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
    name: l.workflowName || `${clientConfig.clinicName} Workflow`,
    status: <span className={`badge ${l.status?.toLowerCase() === 'success' ? 'success' : 'warning'}`}>{l.status}</span>
  }));

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Today's Appointments" value={todaysAppointments.length} icon={<Calendar size={24} />} trend={0} />
        <KPICard title="Revenue Generated" value={`₹${completedRevenue}`} icon={<IndianRupee size={24} />} trend={0} />
        <KPICard title="Pending Payments" value={`₹${pendingRevenue}`} icon={<Clock size={24} />} trend={0} />
        <KPICard title="AI Automations Run" value={n8nExecutions.length} icon={<MessageSquare size={24} />} trend={0} />
        <KPICard title="Total Appts Logged" value={appointments.length} icon={<Activity size={24} />} trend={0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <MetricChart 
          title="Appointments Logged" 
          data={appointments} 
          dateField="appointment_date" 
          type="bar" 
          color="#3b82f6" 
        />
        <MetricChart 
          title="Revenue Generated" 
          data={completedPayments} 
          dateField="appointment_date" 
          valueField="amount" 
          type="line" 
          color="#10b981" 
          defaultTimeframe="monthly"
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <MetricChart 
            title="Automations Fired" 
            data={n8nExecutions} 
            dateField="startedAt" 
            type="bar" 
            color="#8b5cf6" 
          />
        </div>
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
