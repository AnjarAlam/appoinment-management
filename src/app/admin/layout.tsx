"use client";

import { useEffect } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import AdminNavbar from '@/components/admin-navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Ensure default theme is dark unless explicitly set
    const saved = localStorage.getItem('clinic-theme');
    const isDark = saved ? saved === 'dark' : true;
    if (!saved) localStorage.setItem('clinic-theme', 'dark');

    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    // Broadcast to components that listen for themeChange
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDark } }));
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        {children}
      </div>
    </div>
  );
}
