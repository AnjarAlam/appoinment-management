'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin-sidebar';
import { Bell, Calendar, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend }: any) => (
  <div
    className="p-6 rounded-lg transition-all hover:scale-105 duration-300"
    style={{ background: 'var(--surface-container)', color: 'var(--on-surface)' }}
  >
    <div className="flex items-start justify-between mb-4">
      <Icon size={24} style={{ color: '#4b6554' }} />
      {trend && <span className="text-sm font-medium" style={{ color: '#4b6554' }}>{trend}</span>}
    </div>
    <p className="label-md mb-2" style={{ color: 'var(--on-surface-variant)' }}>
      {label}
    </p>
    <p className="headline-md font-semibold">{value}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface)' }}>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const htmlEl = document.documentElement;
    if (isDarkMode) {
      htmlEl.classList.remove('dark');
      htmlEl.classList.add('light');
    } else {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div
        className="flex h-screen transition-colors duration-300"
        style={{ background: 'var(--surface)' }}
      >
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Simple Header */}
          <div
            className="h-16 border-b px-6 flex items-center justify-between"
            style={{ 
              borderColor: 'var(--outline-variant)',
              background: 'var(--surface-container-low)'
            }}
          >
            <div>
              <h2 className="headline-sm" style={{ color: 'var(--on-surface)' }}>
                Dashboard
              </h2>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'var(--surface-container)', color: 'var(--on-surface)' }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto" style={{ background: 'var(--surface)' }}>
            <div className="p-8 max-w-7xl">
              {/* Header */}
              <div className="mb-12">
                <p className="label-md mb-2" style={{ color: 'var(--on-surface-variant)' }}>
                  WELCOME BACK
                </p>
                <h1 className="display-lg mb-4" style={{ color: 'var(--on-surface)' }}>
                  {user.name}, {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </h1>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  Here's what's happening in your clinic today.
                </p>
              </div>

              {/* Stats Grid */}
              {user.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard label="Total Patients" value="1,284" icon={Users} trend="+12%" />
                  <StatCard label="Appointments Today" value="28" icon={Calendar} trend="+5" />
                  <StatCard label="Total Doctors" value="12" icon={TrendingUp} trend="+2" />
                  <StatCard label="Revenue (Month)" value="$45,231" icon={TrendingUp} trend="+18%" />
                </div>
              )}

              {user.role === 'doctor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard label="My Appointments" value="8" icon={Calendar} trend="Today" />
                  <StatCard label="Pending Prescriptions" value="12" icon={CheckCircle} trend="+3" />
                  <StatCard label="Patients Treated" value="342" icon={Users} trend="This month" />
                  <StatCard label="Avg. Consultation" value="35 min" icon={Clock} trend="-5 min" />
                </div>
              )}

              {user.role === 'receptionist' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard label="Appointments Booked" value="45" icon={Calendar} trend="+12%" />
                  <StatCard label="Pending Check-ups" value="7" icon={Clock} trend="Today" />
                  <StatCard label="Patients Registered" value="156" icon={Users} trend="+8" />
                  <StatCard label="Billing Pending" value="$2,340" icon={TrendingUp} trend="Due soon" />
                </div>
              )}

              {user.role === 'patient' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard label="Next Appointment" value="Mar 20, 2pm" icon={Calendar} trend="In 5 days" />
                  <StatCard label="Active Medicines" value="4" icon={TrendingUp} trend="Daily" />
                  <StatCard label="Therapy Sessions" value="6/12" icon={CheckCircle} trend="50%" />
                  <StatCard label="Medical Reports" value="3" icon={Bell} trend="Recent" />
                </div>
              )}

              {/* Recent Items Section */}
              <div
                className="p-6 rounded-lg"
                style={{ background: 'var(--surface-container)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="title-md font-semibold" style={{ color: 'var(--on-surface)' }}>
                      {user.role === 'admin' ? 'Recent Appointments' : 
                       user.role === 'doctor' ? 'Recent Patients' :
                       user.role === 'receptionist' ? 'Today\'s Schedule' :
                       'My Appointments'}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)' }}>
                      {user.role === 'admin' ? 'Latest clinic activity' : 
                       user.role === 'doctor' ? 'Your recent consultations' :
                       user.role === 'receptionist' ? 'Current schedule' :
                       'Your upcoming visits'}
                    </p>
                  </div>
                  <a
                    href={user.role === 'patient' ? '/appointments' : `/${user.role === 'admin' ? 'appointments' : 'appointments'}`}
                    className="text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: '#4b6554' }}
                  >
                    View All
                  </a>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg flex items-center justify-between"
                      style={{ background: 'var(--surface-container-highest)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                          style={{ background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)' }}
                        >
                          {i}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--on-surface)' }}>
                            {user.role === 'patient' ? `Dr. Smith - Consultation ${i}` : `Appointment #${i}`}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            Mar {15 + i}, 2:00 PM
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(75, 101, 84, 0.1)',
                          color: '#2d5a3d',
                        }}
                      >
                        Confirmed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
