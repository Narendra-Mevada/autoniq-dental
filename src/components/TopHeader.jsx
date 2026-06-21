import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import './TopHeader.css';

const TopHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        
        <div className="notification-wrapper" ref={dropdownRef}>
          <button 
            className="theme-toggle" 
            aria-label="Notifications"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllAsRead}>Mark all read</button>
                )}
              </div>
              <div className="dropdown-content">
                {notifications.length === 0 ? (
                  <p className="no-notifications">No notifications yet.</p>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="notif-title">{notif.title}</div>
                      <div className="notif-message">{notif.message}</div>
                      {notif.data && (
                        <div className="notif-details">
                          <span>👤 {notif.data.patient_name || 'Walk-in'}</span>
                          <span>📞 {notif.data.phone || 'N/A'}</span>
                          <span>🩺 {notif.data.service}</span>
                        </div>
                      )}
                      <div className="notif-time">{new Date(notif.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
