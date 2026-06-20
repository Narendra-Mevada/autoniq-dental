import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader />
        <main className="content-area animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
