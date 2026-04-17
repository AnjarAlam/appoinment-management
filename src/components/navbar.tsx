'use client';

import { useState } from 'react';
import {
  Menu,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  Search,
  ChevronDown,
} from 'lucide-react';

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      className="h-16 border-b px-6 flex items-center justify-between transition-colors duration-300"
      style={{
        background: 'var(--surface-container)',
        borderColor: 'var(--outline)',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ background: 'transparent' }}
        >
          <Menu size={20} style={{ color: 'var(--on-surface)' }} />
        </button>

        {/* Search Bar */}
        <div
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: 'var(--surface-container-highest)' }}
        >
          <Search size={16} style={{ color: 'var(--on-surface-variant)' }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm outline-none"
            style={{
              color: 'var(--on-surface)',
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors relative"
            style={{ background: 'transparent' }}
          >
            <Bell size={20} style={{ color: 'var(--on-surface)' }} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: '#4b6554' }}
            />
          </button>

          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg p-4 space-y-3"
              style={{ background: 'var(--surface-container)' }}
            >
              <p
                className="text-xs font-semibold uppercase"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                Notifications
              </p>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-2 rounded hover:bg-opacity-5">
                  <p className="text-sm" style={{ color: 'var(--on-surface)' }}>
                    Notification {i}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    {5 + i * 10} minutes ago
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ background: 'transparent' }}
        >
          {isDarkMode ? (
            <Sun size={20} style={{ color: '#fbbf24' }} />
          ) : (
            <Moon size={20} style={{ color: '#4b6554' }} />
          )}
        </button>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ background: 'transparent' }}
          >
            <Settings size={20} style={{ color: 'var(--on-surface)' }} />
          </button>

          {isSettingsOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg p-2"
              style={{ background: 'var(--surface-container)' }}
            >
              <a
                href="#"
                className="block px-4 py-2 rounded hover:bg-opacity-5 text-sm"
                style={{ color: 'var(--on-surface)' }}
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 rounded hover:bg-opacity-5 text-sm"
                style={{ color: 'var(--on-surface)' }}
              >
                Profile
              </a>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4 pl-4 border-l" style={{ borderColor: 'var(--outline)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
            }}
          >
            A
          </div>
          <ChevronDown size={16} style={{ color: 'var(--on-surface-variant)' }} />
        </div>
      </div>
    </div>
  );
}
