'use client';

import SuperAdminNavbar from '@/components/super-admin-navbar';
import SuperAdminSidebar from '@/components/super-admin-sidebar';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SuperAdminSidebar />
      <div className="flex flex-col flex-1">
        <SuperAdminNavbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
