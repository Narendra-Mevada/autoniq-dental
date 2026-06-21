import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import MetricChart from '../components/MetricChart';
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
          data={payments} 
          dateField="appointment_date" 
          valueField="amount" 
          type="line" 
          color="#10b981" 
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
    </div>
  );
};

export default Analytics;
