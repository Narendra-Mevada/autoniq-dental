import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  UserPlus, 
  CreditCard, 
  BarChart3, 
  Activity, 
  HelpCircle 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard /> },
    { name: 'Appointments', path: '/appointments', icon: <CalendarDays /> },
    { name: 'Patients', path: '/patients', icon: <Users /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 /> },
    { name: 'Activity Logs', path: '/logs', icon: <Activity /> },
    { name: 'Help Support', path: '/help', icon: <HelpCircle /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="Autoniq Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          Autoniq Dental
        </div>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
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
