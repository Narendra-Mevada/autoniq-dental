import React from 'react';
import { Phone, Mail, Globe, MessageSquare, ExternalLink } from 'lucide-react';
import clientConfig from '../config/clientConfig';

const Help = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <h2>Help & Support</h2>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h3>Get in Touch with Support</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          If you need any assistance with the {clientConfig.clinicName} dashboard, or if you encounter any technical issues, our support team is available to help you immediately.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <Phone size={24} />
            </div>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Call Us</p>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{clientConfig.supportPhone}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0 }}>
              <Mail size={28} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Email Support</p>
              <a href={`mailto:${clientConfig.supportEmail}`} style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none', wordBreak: 'break-all' }}>{clientConfig.supportEmail}</a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', gridColumn: '1 / -1' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <Globe size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Client Portal</p>
              <a href={clientConfig.supportPortal} target="_blank" rel="noopener noreferrer" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}>{clientConfig.supportPortal}</a>
            </div>
            <ExternalLink size={20} color="var(--text-secondary)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
