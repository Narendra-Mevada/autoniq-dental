import React from 'react';
import { HelpCircle, Phone, Mail, Globe } from 'lucide-react';

const Help = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <h2>Help & Support</h2>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          If you need any assistance with the Autoniq Dental dashboard, or if you encounter any technical issues, our support team is available to help you immediately.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0 }}>
              <Phone size={28} />
            </div>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Phone Support</p>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>+91 9313890981</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0 }}>
              <Mail size={28} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Email Support</p>
              <a href="mailto:narendramevada950@gmail.com" style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none', wordBreak: 'break-all' }}>narendramevada950@gmail.com</a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', gridColumn: '1 / -1' }}>
            <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
              <Globe size={28} />
            </div>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Website</p>
              <a href="https://autoniq.bcap.tech" target="_blank" rel="noopener noreferrer" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}>https://autoniq.bcap.tech</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
