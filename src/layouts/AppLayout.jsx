import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import clientConfig from '../config/clientConfig';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const themeVariables = {
    '--accent-primary': clientConfig.theme.primary,
    '--accent-secondary': clientConfig.theme.secondary,
    '--success': clientConfig.theme.success,
    '--warning': clientConfig.theme.warning,
    '--danger': clientConfig.theme.danger,
  };

  return (
    <div className="app-container" style={themeVariables}>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="main-content">
        <TopHeader toggleSidebar={toggleSidebar} />
        <main className="content-area animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
