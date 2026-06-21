import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { fetchN8nExecutions } from '../services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchN8nExecutions();
        if (data.data && Array.isArray(data.data)) {
           setLogs(data.data);
        } else if (Array.isArray(data)) {
           setLogs(data);
        }
      } catch (err) {
        console.error('Error fetching logs', err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2>Activity Logs</h2>
      
      {loading ? (
        <div>Loading activity logs...</div>
      ) : logs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No system activity found.
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ 
                display: 'flex', 
                gap: '1rem', 
                padding: '1rem', 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  background: 'rgba(56, 189, 248, 0.1)', 
                  padding: '0.5rem', 
                  borderRadius: '50%',
                  color: 'var(--primary)'
                }}>
                  <Activity size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>
                    Workflow: {log.workflowName} executed
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Status: <span style={{ color: log.status === 'success' ? 'var(--success)' : 'var(--warning)' }}>{log.status}</span>
                  </p>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(log.startedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
