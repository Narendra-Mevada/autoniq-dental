import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import KPICard from '../components/KPICard';
import { fetchPendingPayments, updatePaymentStatus } from '../services/api';
import { IndianRupee, Clock, Activity, CheckCircle2 } from 'lucide-react';

const Payments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPayments = async () => {
    try {
      const data = await fetchPendingPayments();
      setPaymentsData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleMarkPaid = async (id) => {
    try {
      await updatePaymentStatus(id, 'Paid');
      loadPayments();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = ['Appointment ID', 'Patient', 'Amount', 'Status'];
  
  const totalPending = paymentsData.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const data = paymentsData.map(p => ({
    _id: p.id, // hidden field
    id: p.id,
    patient: <span style={{ fontWeight: '600' }}>{p.patient_name}</span>,
    amount: `₹${p.amount}`,
    status: <span className="badge warning">{p.payment_status}</span>
  }));

  const actions = [
    { label: 'Mark Paid', type: 'primary', onClick: (row) => handleMarkPaid(row._id) },
    { label: 'Mark Partial', type: 'secondary', onClick: (row) => alert(`Mark partial for Appt ID: ${row.id}`) },
    { label: 'Send Reminder', type: 'secondary', onClick: (row) => alert(`Reminder sent to ${row.patient.props.children}!`) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <KPICard title="Total Collected" value={18500} prefix="₹" icon={<IndianRupee size={24} />} trend={12} />
        <KPICard title="Pending Amount" value={totalPending.toLocaleString()} prefix="₹" icon={<Clock size={24} />} trend={-4} />
        <KPICard title="Recovered By Automation" value={12500} prefix="₹" icon={<Activity size={24} />} trend={8} />
        <KPICard title="Recovery Rate" value={68} suffix="%" icon={<CheckCircle2 size={24} />} trend={3} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <h2>Pending Payments</h2>
      </div>
      
      {loading ? (
        <div>Loading payments...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}
    </div>
  );
};

export default Payments;
