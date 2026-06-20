import React from 'react';
import { activityLogs } from '../data/mockData';
import { Calendar, Bell, UserPlus, IndianRupee } from 'lucide-react';

const ActivityLogs = () => {
  const getIcon = (type) => {
    switch(type) {
      case 'appointment': return <Calendar size={20} className="text-accent-primary" />;
      case 'reminder': return <Bell size={20} className="text-warning" />;
      case 'lead': return <UserPlus size={20} className="text-success" />;
      case 'payment': return <IndianRupee size={20} className="text-danger" />;
      default: return <Bell size={20} />;
    }
  };

  const getBackgroundColor = (type) => {
    switch(type) {
      case 'appointment': return 'rgba(59, 130, 246, 0.1)';
      case 'reminder': return 'rgba(245, 158, 11, 0.1)';
      case 'lead': return 'rgba(16, 185, 129, 0.1)';
      case 'payment': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Real-Time Activity Logs</h2>
        <div className="tabs" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary">Today</button>
          <button className="btn btn-secondary">This Week</button>
          <button className="btn btn-secondary">All</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activityLogs.map(log => (
          <div key={log.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1rem', 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: getBackgroundColor(log.type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)'
            }}>
              {getIcon(log.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600' }}>{log.message}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>System Event</div>
            </div>
            <div style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
              {log.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;
