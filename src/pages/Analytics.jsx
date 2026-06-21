import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import { fetchAppointments, fetchPendingPayments, fetchN8nExecutions } from '../services/api';

const Analytics = () => {
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
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const totalAppts = appointments.length;
  const arrivedAppts = appointments.filter(a => a.appointment_status === 'Arrived').length;
  const pendingRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  // We keep the chart static for visual purposes but with a dynamic label since real history isn't stored by month yet
  const chartHeight = 200;
  const mockChartData = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 65 },
    { label: 'Wed', value: 85 },
    { label: 'Thu', value: 55 },
    { label: 'Fri', value: 90 },
    { label: 'Sat', value: totalAppts * 10 }, // Scale slightly for visual effect
    { label: 'Sun', value: 30 },
  ];
  const maxVal = Math.max(...mockChartData.map(d => d.value));

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2>Clinic Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Total Appointments Logged" value={totalAppts} icon={<Calendar size={24} />} trend={0} />
        <KPICard title="Patients Arrived" value={arrivedAppts} icon={<Users size={24} />} trend={0} />
        <KPICard title="Pending Collection" value={`₹${pendingRevenue}`} icon={<TrendingUp size={24} />} trend={0} />
        <KPICard title="Automations Fired" value={n8nExecutions.length} icon={<Activity size={24} />} trend={0} />
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3>Activity Trend (Mock Representation)</h3>
        <div style={{ 
          height: `${chartHeight}px`, 
          marginTop: '2rem', 
          display: 'flex', 
          alignItems: 'flex-end',
          gap: '1rem',
          padding: '1rem 0'
        }}>
          {mockChartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '100%', 
                background: 'linear-gradient(180deg, var(--primary) 0%, rgba(56, 189, 248, 0.2) 100%)',
                height: `${(d.value / maxVal) * chartHeight}px`,
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease'
              }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
