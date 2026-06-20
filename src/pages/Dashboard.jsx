import React from 'react';
import KPICard from '../components/KPICard';
import { dashboardStats, todayAppointments, newLeads, pendingPayments } from '../data/mockData';
import { Calendar, UserPlus, IndianRupee, Clock, MessageSquare, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <KPICard 
          title="Today's Appointments" 
          value={dashboardStats.todayAppointments} 
          icon={<Calendar size={24} />} 
          trend={12} 
        />
        <KPICard 
          title="Today's New Leads" 
          value={dashboardStats.newLeads} 
          icon={<UserPlus size={24} />} 
          trend={25} 
        />
        <KPICard 
          title="Revenue Collected" 
          value={dashboardStats.revenueCollected.toLocaleString()} 
          prefix="₹" 
          icon={<IndianRupee size={24} />} 
          trend={8} 
        />
        <KPICard 
          title="Pending Payments" 
          value={dashboardStats.pendingPayments.toLocaleString()} 
          prefix="₹" 
          icon={<Clock size={24} />} 
          trend={-5} 
          trendText="vs yesterday"
        />
        <KPICard 
          title="AI Conversations" 
          value={dashboardStats.aiConversations} 
          icon={<MessageSquare size={24} />} 
          trend={18} 
        />
        <KPICard 
          title="Staff Hours Saved" 
          value={dashboardStats.hoursSaved} 
          suffix="h" 
          icon={<Activity size={24} />} 
          trend={10} 
        />
      </div>

      {/* Main Widgets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Today's Appointments Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Today's Appointments</h3>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayAppointments.map(app => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>{app.time}</span>
                <span style={{ flex: 1, fontWeight: '500' }}>{app.name}</span>
                <span className="badge info">{app.service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Leads Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>New Leads</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {newLeads.map(lead => (
              <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lead.inquiry}</div>
                </div>
                <span className="badge warning">New</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payments Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Pending Payments</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingPayments.map(payment => (
              <div key={payment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontWeight: '500' }}>{payment.name}</span>
                <span style={{ fontWeight: '600', color: 'var(--danger)' }}>₹{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Impact Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-primary)' }}>Automation Impact</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Messages Handled</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{dashboardStats.messagesHandled}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Appointments Booked</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{dashboardStats.appointmentsBookedAI}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reminders Sent</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{dashboardStats.remindersSent}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Payments Recovered</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--success)' }}>₹{dashboardStats.paymentsRecovered.toLocaleString()}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
