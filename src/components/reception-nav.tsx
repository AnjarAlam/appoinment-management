'use client';

import { useEffect, useState } from 'react';
import { Search, Bell, Moon, Sun, Settings, User, LogOut, Users } from 'lucide-react';

export default function ReceptionNav() {
  const [isDark, setIsDark] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('clinic-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(true);
      localStorage.setItem('clinic-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('clinic-theme', newTheme ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDark: newTheme } }));

    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`h-16 flex items-center justify-between px-6 border-b sticky top-0 z-50 transition-all duration-300 backdrop-blur-md
      ${isDark 
        ? 'bg-slate-950/95 border-slate-800' 
        : 'bg-white/95 border-slate-200'}`}>
      
      {/* Left - Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
          <Users size={20} className="text-white" />
        </div>
        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Reception
        </h1>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative group">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search appointments, patients, or doctors..."
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none transition-all duration-200
              ${isDark 
                ? 'bg-slate-900 border border-slate-700 focus:border-blue-600 text-slate-100 placeholder-slate-500' 
                : 'bg-slate-100 border border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-500'
              }`}
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <button className={`relative p-3 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 group`}>
          <Bell size={20} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-950"></span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-3 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={20} className="text-amber-400" />
          ) : (
            <Moon size={20} className="text-slate-600" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-inner">
              RE
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Reception Staff</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5\">Desk Assistant</p>
            </div>
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className={`absolute right-0 mt-3 w-64 rounded-3xl shadow-xl py-2 z-50 border transition-all
              ${isDark 
                ? 'bg-slate-900 border-slate-700' 
                : 'bg-white border-slate-200'}`}>
              
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="font-medium text-slate-900 dark:text-white">Reception Staff</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">reception@clinicnetwork.com</p>
              </div>

              <a href="#" className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <User size={18} /> My Profile
              </a>
              <a href="#" className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Settings size={18} /> Settings
              </a>

              <hr className={`my-1 border-slate-200 dark:border-slate-700`} />

              <a href="/login" className={`flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors`}>
                <LogOut size={18} /> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
