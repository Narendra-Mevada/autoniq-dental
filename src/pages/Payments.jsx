import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { fetchPendingPayments, updatePaymentStatus } from '../services/api';

const Payments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

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

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const columns = ['Patient', 'Amount', 'Status'];

  const data = paymentsData.map(p => ({
    _raw: p,
    patient: p.patient_name,
    amount: `₹${p.amount}`,
    status: <span className="badge warning">Pending</span>
  }));

  const actions = [
    { label: 'Mark Paid', type: 'primary', onClick: (row) => openModal(row._raw) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Pending Billing</h2>
      </div>

      {loading ? (
        <div>Loading pending payments...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
      ) : paymentsData.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No pending payments. When a treatment is marked "Done", it will appear here for billing.
        </div>
      ) : (
        <DataTable columns={columns} data={data} actions={actions} />
      )}

      {/* Payment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Collect Payment"
      >
        {selectedPayment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Patient: <strong style={{ color: 'var(--text-primary)' }}>{selectedPayment.patient_name}</strong></p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Due: <strong style={{ color: 'var(--success)' }}>₹{selectedPayment.amount}</strong></p>
            </div>
            
            <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to mark this invoice as Paid?</p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={async () => {
                try {
                  await updatePaymentStatus(selectedPayment.id, 'Paid');
                  loadPayments();
                  closeModal();
                } catch (err) {
                  alert('Error updating payment: ' + err.message);
                }
              }}>Confirm Payment Received</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
