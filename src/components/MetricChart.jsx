import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Helper to get start of week, month, year
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const MetricChart = ({ title, data, dateField, valueField, type = 'bar', color = '#3b82f6' }) => {
  const [timeframe, setTimeframe] = useState('weekly');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let grouped = {};

    data.forEach(item => {
      const dateVal = item[dateField];
      if (!dateVal) return;
      const d = new Date(dateVal);
      if (isNaN(d)) return;

      let key = '';
      if (timeframe === 'weekly') {
        // Only include data from the current week
        const startOfWeek = getStartOfWeek(now);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        if (d >= startOfWeek && d <= endOfWeek) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          key = days[d.getDay()];
        }
      } else if (timeframe === 'monthly') {
        // Only include data from the current year
        if (d.getFullYear() === now.getFullYear()) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          key = months[d.getMonth()];
        }
      } else if (timeframe === 'yearly') {
        key = d.getFullYear().toString();
      }

      if (key) {
        const val = valueField ? Number(item[valueField]) : 1;
        grouped[key] = (grouped[key] || 0) + val;
      }
    });

    // Ensure all days/months are present even if 0
    let finalData = [];
    if (timeframe === 'weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      finalData = days.map(day => ({ label: day, value: grouped[day] || 0 }));
    } else if (timeframe === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      finalData = months.map(month => ({ label: month, value: grouped[month] || 0 }));
    } else if (timeframe === 'yearly') {
      // For yearly, just use the years present in data, sorted
      const years = Object.keys(grouped).sort();
      // Ensure current year is there
      const currentYearStr = now.getFullYear().toString();
      if (!years.includes(currentYearStr)) years.push(currentYearStr);
      years.sort();
      finalData = years.map(year => ({ label: year, value: grouped[year] || 0 }));
    }

    return finalData;
  }, [data, timeframe, dateField, valueField]);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
          {['weekly', 'monthly', 'yearly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                background: timeframe === tf ? 'var(--primary)' : 'transparent',
                color: timeframe === tf ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textTransform: 'capitalize'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 250, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricChart;
