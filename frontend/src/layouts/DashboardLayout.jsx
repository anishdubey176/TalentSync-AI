import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Force login state to true since we are on a protected layout
    if (localStorage.getItem('ts_is_logged_in') !== 'true') {
      localStorage.setItem('ts_is_logged_in', 'true');
      window.dispatchEvent(new Event('profile_updated'));
    }

    const handleToggle = () => {
      setSidebarOpen(prev => !prev);
    };
    
    const handleClose = () => {
      setSidebarOpen(false);
    };

    window.addEventListener('toggle_sidebar', handleToggle);
    window.addEventListener('close_sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle_sidebar', handleToggle);
      window.removeEventListener('close_sidebar', handleClose);
    };
  }, []);

  return (
    <div className="flex h-full w-full min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Sidebar - Desktop (always visible) and Mobile (Slide-over drawer) */}
      <div className={`
        fixed inset-y-16 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Backdrop overlay for mobile screen drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-16 transition-opacity"
        />
      )}
      
      {/* Content pane */}
      <main className="flex-1 lg:pl-64 p-4 md:p-8 w-full overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
