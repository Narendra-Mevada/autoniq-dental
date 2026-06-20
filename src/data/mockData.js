export const dashboardStats = {
  todayAppointments: 12,
  newLeads: 7,
  revenueCollected: 18500,
  pendingPayments: 24000,
  aiConversations: 58,
  hoursSaved: 3.5,
  messagesHandled: 127,
  appointmentsBookedAI: 14,
  remindersSent: 31,
  paymentsRecovered: 12500
};

export const todayAppointments = [
  { id: 1, time: '09:00', name: 'Rahul', service: 'RCT', status: 'Active' },
  { id: 2, time: '11:00', name: 'Priya', service: 'Cleaning', status: 'Completed' },
  { id: 3, time: '14:00', name: 'Amit', service: 'Whitening', status: 'Active' }
];

export const newLeads = [
  { id: 1, name: 'Rahul', inquiry: 'Implant Inquiry', status: 'New', phone: '9876543210', date: '2026-06-20' },
  { id: 2, name: 'Priya', inquiry: 'Braces Inquiry', status: 'Contacted', phone: '9876543211', date: '2026-06-20' },
  { id: 3, name: 'Amit', inquiry: 'Cleaning Inquiry', status: 'Appointment Booked', phone: '9876543212', date: '2026-06-19' }
];

export const pendingPayments = [
  { id: 1, name: 'Rahul', amount: 5000, status: 'Pending' },
  { id: 2, name: 'Amit', amount: 3500, status: 'Pending' },
  { id: 3, name: 'Priya', amount: 2500, status: 'Pending' }
];

export const patients = [
  { id: 1, name: 'Rahul', phone: '9876543210', lastVisit: '2026-06-20', totalVisits: 3, pendingAmount: 0, lastTreatment: 'RCT' },
  { id: 2, name: 'Priya', phone: '9876543211', lastVisit: '2026-05-15', totalVisits: 2, pendingAmount: 2500, lastTreatment: 'Cleaning' },
  { id: 3, name: 'Amit', phone: '9876543212', lastVisit: '2026-06-10', totalVisits: 1, pendingAmount: 3500, lastTreatment: 'Whitening' }
];

export const activityLogs = [
  { id: 1, time: '10:00', message: 'Appointment Booked', type: 'appointment' },
  { id: 2, time: '10:15', message: 'Reminder Sent', type: 'reminder' },
  { id: 3, time: '10:20', message: 'New Lead', type: 'lead' },
  { id: 4, time: '11:00', message: 'Payment Reminder', type: 'payment' },
  { id: 5, time: '11:30', message: 'Payment Received', type: 'payment' }
];
