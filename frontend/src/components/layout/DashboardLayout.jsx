import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-ivory-bg)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div 
        className="main-layout-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'all 0.3s ease'
        }}
      >
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Page Content Viewport */}
        <main 
          style={{
            flex: 1,
            padding: 'var(--space-xl)',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
          className="dashboard-main-content"
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 961px) {
          .main-layout-wrapper {
            margin-left: var(--sidebar-width);
          }
        }
        @media (max-width: 640px) {
          .dashboard-main-content {
            padding: var(--space-md) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
