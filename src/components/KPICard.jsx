import React from 'react';

const KPICard = ({ title, value, icon, trend, prefix = '', suffix = '', trendText }) => {
  return (
    <article className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.875rem' }}>
          {title}
        </span>
        <div style={{ color: 'var(--accent-primary)', opacity: 0.8 }}>
          {icon}
        </div>
      </div>
      
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {prefix}{value}{suffix}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{trendText || 'vs last month'}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default KPICard;
