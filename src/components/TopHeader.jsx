import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './TopHeader.css';

const TopHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.charAt(1).toUpperCase() + path.slice(2);
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">{getPageTitle()}</h1>
        <div className="live-sync">
          <div className="live-indicator"></div>
          Live Sync
        </div>
      </div>
      
      <div className="header-right">
        <div className="datetime">
          {currentTime.toLocaleString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
        <button className="theme-toggle" aria-label="Notifications">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
