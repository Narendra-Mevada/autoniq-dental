import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import clientConfig from '../config/clientConfig';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  UserPlus, 
  CreditCard, 
  BarChart3, 
  Activity, 
  HelpCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard /> },
    { name: 'Appointments', path: '/appointments', icon: <CalendarDays /> },
    { name: 'Patients', path: '/patients', icon: <Users /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard /> },
    { name: 'Activity Logs', path: '/logs', icon: <Activity /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { name: 'Help Support', path: '/help', icon: <HelpCircle /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt={`${clientConfig.clinicName} Logo`} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          {clientConfig.clinicName}
        </div>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
