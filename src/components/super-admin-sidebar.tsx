'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutGrid, Building2, Users, UserCog, BarChart3,
  ChevronLeft, ChevronRight, Crown, Network
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SuperAdminSidebar() {
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
    { label: 'Dashboard', icon: LayoutGrid, href: '/super-admin/dashboard', ariaLabel: 'Super admin dashboard' },
    { label: 'Hospitals', icon: Building2, href: '/super-admin/hospital', ariaLabel: 'Manage hospitals' },
    { label: 'Admins', icon: Users, href: '/super-admin/admin', ariaLabel: 'Manage admins' },
    { label: 'Assignments', icon: UserCog, href: '/super-admin/assignments', ariaLabel: 'Admin assignments' },
    { label: 'Network', icon: Network, href: '/super-admin/network', ariaLabel: 'Hospital network' },
    { label: 'Analytics', icon: BarChart3, href: '/super-admin/analytics', ariaLabel: 'System analytics' },
  ];

  if (!isMounted) return null;

  return (
    <div className={`h-screen sticky top-0 left-0 z-50 flex flex-col border-r transition-all duration-300
      ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}
      ${isCollapsed ? 'w-20' : 'w-56'}`}>

      {/* Logo Header */}
      <div className={`p-4 border-b flex items-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          <Crown size={18} />
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <p className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">Super Admin</p>
            <p className="text-[10px] text-purple-600 font-medium -mt-1">SYSTEM CONTROL</p>
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
                  ? 'bg-purple-600 text-white shadow-md' 
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
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
