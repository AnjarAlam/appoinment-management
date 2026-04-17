'use client';

import { Menu, Bell, Settings, Search, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Navbar({
  isSidebarOpen,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
}: NavbarProps) {
  return (
    <nav
      className="flex items-center justify-between px-6 py-4 sticky top-0 z-30 transition-all duration-300 shadow-sm"
      style={{
        background: 'var(--surface-container-low)',
        color: 'var(--on-surface)',
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="hover:opacity-70 p-2 rounded-lg transition-all duration-300 flex items-center justify-center"
          style={{
            color: 'var(--on-surface)',
            background: isDarkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(75, 101, 84, 0.06)',
          }}
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
        </button>

        {/* Search bar */}
        <div className="relative hidden md:flex items-center">
          <Search
            size={18}
            className="absolute left-3 transition-colors duration-300"
            style={{ color: 'var(--on-surface-variant)' }}
          />
          <input
            type="text"
            placeholder="Search analytics or hospitals..."
            className="pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all duration-300"
            style={{
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(75, 101, 84, 0.04)',
              color: 'var(--on-surface)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(75, 101, 84, 0.1)'}`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = `1px solid ${isDarkMode ? 'rgba(149, 212, 179, 0.4)' : 'rgba(75, 101, 84, 0.4)'}`;
              e.currentTarget.style.background = isDarkMode
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(75, 101, 84, 0.06)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(75, 101, 84, 0.1)'}`;
              e.currentTarget.style.background = isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(75, 101, 84, 0.04)';
            }}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: isDarkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(75, 101, 84, 0.06)',
            color: 'var(--on-surface)',
          }}
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Theme toggle */}
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />

        {/* Settings */}
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: isDarkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(75, 101, 84, 0.06)',
            color: 'var(--on-surface)',
          }}
          title="Settings"
        >
          <Settings size={18} />
        </button>

        {/* User avatar */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-110"
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #95d4b3 0%, #003f29 100%)'
              : 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
            color: '#f8faf9',
          }}
        >
          A
        </div>
      </div>
    </nav>
  );
}
