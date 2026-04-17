'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutGrid, Users, Calendar, Package, Users2, BarChart3, 
  ChevronLeft, ChevronRight, 
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('clinic-theme');
    if (savedTheme) setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const menuItems: { label: string; icon: any; href: string; ariaLabel?: string }[] = [
    { label: 'Dashboard', icon: LayoutGrid, href: '/admin/dashboard', ariaLabel: 'Open dashboard' },
    { label: 'Doctors', icon: Stethoscope , href: '/admin/doctors', ariaLabel: 'Manage doctors' },
    { label: 'Reception', icon: ClipboardList , href: '/admin/reception', ariaLabel: 'Reception desk' },
    { label: 'Patients', icon: Users, href: '/admin/patients', ariaLabel: 'Patient list' },
    { label: 'Appointments', icon: Calendar, href: '/admin/appointments', ariaLabel: 'Appointments' },
    { label: 'Inventory', icon: Package, href: '/admin/inventory', ariaLabel: 'Inventory and stock' },
    { label: 'Therapies', icon: BarChart3, href: '/admin/therapy', ariaLabel: 'Therapy plans' },
    { label: 'Staff', icon: Users2, href: '/admin/staff', ariaLabel: 'Staff management' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics', ariaLabel: 'Analytics and reports' },
  ];

  if (!isMounted) return null;

  return (
    <div className={`h-screen sticky top-0 left-0 z-50 flex flex-col border-r transition-all duration-300
      ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}
      ${isCollapsed ? 'w-20' : 'w-56'}`}>

      {/* Logo Header */}
      <div className={`p-4 border-b flex items-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="w-8 h-8 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          S
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <p className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">Sanctuary</p>
            <p className="text-[10px] text-emerald-600 font-medium -mt-1">AYURVEDIC CLINIC</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.ariaLabel ?? item.label}
              aria-label={item.ariaLabel ?? item.label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all group relative
                ${isActive 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : isDark 
                    ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : ''} />
              {!isCollapsed && <span>{item.label}</span>}

              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with Collapse Button */}
      <div className={`p-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-all
            ${isDark 
              ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
        >
          {isCollapsed ? (
            <>
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="text-sm">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}