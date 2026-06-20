import React from 'react';

const Settings = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      
      {/* Clinic Information */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Clinic Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Clinic Name</label>
            <input type="text" defaultValue="Autoniq Dental Care" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phone</label>
            <input type="text" defaultValue="+91 98765 43210" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Address</label>
            <input type="text" defaultValue="123 Dental Street, Health City" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)' }} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Save Changes</button>
      </div>

      {/* WhatsApp & Integrations */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>WhatsApp Settings</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: '600' }}>Connected Number</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>+91 98765 43210</div>
          </div>
          <span className="badge success">Connected</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: '600' }}>n8n Webhook Status</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Receiving events</div>
          </div>
          <span className="badge success">Active</span>
        </div>
      </div>

    </div>
  );
};

export default Settings;
