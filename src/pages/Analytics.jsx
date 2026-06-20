import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const appointmentData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 19 },
    { name: 'Wed', appointments: 15 },
    { name: 'Thu', appointments: 22 },
    { name: 'Fri', appointments: 18 },
    { name: 'Sat', appointments: 25 },
    { name: 'Sun', appointments: 8 },
  ];

  const serviceData = [
    { name: 'RCT', value: 35 },
    { name: 'Cleaning', value: 45 },
    { name: 'Implants', value: 15 },
    { name: 'Braces', value: 20 },
    { name: 'Whitening', value: 25 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const leadFunnel = [
    { stage: 'Leads Received', count: 100 },
    { stage: 'Appointments Booked', count: 65 },
    { stage: 'Treatments Completed', count: 50 },
    { stage: 'Payments Received', count: 45 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Appointment Analytics */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Weekly Appointments</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="appointments" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Analytics */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Most Requested Services</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {serviceData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Funnel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Lead Conversion Funnel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          {leadFunnel.map((step, index) => (
            <div key={step.stage} style={{ 
              width: `${100 - (index * 15)}%`, 
              backgroundColor: `rgba(59, 130, 246, ${1 - (index * 0.15)})`,
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              fontWeight: '500'
            }}>
              <span>{step.stage}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{step.count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Analytics;
