import React, { useState, useEffect } from 'react';
import clientConfig from '../config/clientConfig';
import { fetchSettings, updateSettings } from '../services/api';

const Settings = () => {
  const [formData, setFormData] = useState({
    clinic_name: '',
    phone: '',
    email: '',
    address: '',
    opening_time: '',
    closing_time: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        if (data && Object.keys(data).length > 0) {
          setFormData({
            clinic_name: data.clinic_name || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            opening_time: data.opening_time || '',
            closing_time: data.closing_time || ''
          });
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateSettings(formData);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading settings...</div>;
  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      
      {/* Clinic Information */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Clinic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Clinic Name</label>
            <input type="text" name="clinic_name" value={formData.clinic_name} onChange={handleChange} className="input-field" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" autoComplete="off" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Opening Time</label>
            <input type="time" name="opening_time" value={formData.opening_time} onChange={handleChange} className="input-field" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Closing Time</label>
            <input type="time" name="closing_time" value={formData.closing_time} onChange={handleChange} className="input-field" />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span style={{ color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)', fontSize: '0.875rem' }}>{message}</span>}
        </div>
      </div>

      {/* WhatsApp & Integrations */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>WhatsApp Settings</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: '600' }}>Connected Number</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{formData.phone || '+91 98765 43210'}</div>
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
