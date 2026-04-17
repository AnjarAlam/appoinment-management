'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  MoreHorizontal,
} from 'lucide-react';

const appointments = [
  {
    id: 1,
    patient: 'Fatima Hussain',
    time: '10:00 AM',
    date: 'Mar 15, 2024',
    condition: 'General Check-up',
    status: 'confirmed',
    phone: '+92-300-1234567',
  },
  {
    id: 2,
    patient: 'Ali Khan',
    time: '11:30 AM',
    date: 'Mar 15, 2024',
    condition: 'Knee Pain',
    status: 'confirmed',
    phone: '+92-300-2345678',
  },
  {
    id: 3,
    patient: 'Zainab Ahmed',
    time: '2:00 PM',
    date: 'Mar 15, 2024',
    condition: 'Follow-up',
    status: 'pending',
    phone: '+92-300-3456789',
  },
  {
    id: 4,
    patient: 'Hassan Ali',
    time: '3:30 PM',
    date: 'Mar 15, 2024',
    condition: 'Diabetes Consultation',
    status: 'confirmed',
    phone: '+92-300-4567890',
  },
];

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <div className="light min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'doctor') {
    router.push('/dashboard');
    return null;
  }

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const htmlEl = document.documentElement;
    if (!isDarkMode) {
      htmlEl.classList.add('light');
    } else {
      htmlEl.classList.remove('light');
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div
        className="flex h-screen transition-colors duration-300"
        style={{ background: 'var(--surface)' }}
      >
        <AdminSidebar />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? (isCompact ? 'ml-20' : 'ml-56') : 'ml-0'
          }`}
        >
          <Navbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />

          <div className="flex-1 overflow-auto" style={{ background: 'var(--surface)' }}>
            <div className="p-8 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="display-lg mb-2" style={{ color: 'var(--on-surface)' }}>
                  Today's Appointments
                </h1>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  March 15, 2024 • 4 appointments scheduled
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Today', value: '4', icon: Calendar, color: '#4b6554' },
                  { label: 'Completed', value: '12', icon: CheckCircle, color: '#059669' },
                  { label: 'Pending', value: '1', icon: AlertCircle, color: '#f59e0b' },
                  { label: 'Total Patients', value: '342', icon: User, color: '#0891b2' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        {stat.label}
                      </p>
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                    <p className="headline-md font-bold" style={{ color: 'var(--on-surface)' }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Appointments List */}
              <div
                className="p-6 rounded-lg"
                style={{ background: 'var(--surface-container)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="title-md font-semibold" style={{ color: 'var(--on-surface)' }}>
                    Appointments Schedule
                  </h2>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                    }}
                  >
                    <Plus size={18} />
                    Add Appointment
                  </button>
                </div>

                {/* Search */}
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
                  style={{ background: 'var(--surface-container-highest)' }}
                >
                  <Search size={18} style={{ color: 'var(--on-surface-variant)' }} />
                  <input
                    type="text"
                    placeholder="Search patient or condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: 'var(--on-surface)' }}
                  />
                </div>

                {/* Appointments Cards */}
                <div className="space-y-3">
                  {filteredAppointments.map((apt, i) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-lg flex items-start justify-between group hover:bg-opacity-50 transition-colors"
                      style={{
                        background: apt.status === 'pending' ? 'rgba(245, 158, 11, 0.05)' : 'var(--surface-container-highest)',
                      }}
                    >
                      <div className="flex gap-4 flex-1">
                        {/* Time */}
                        <div className="flex flex-col items-center">
                          <Clock size={20} style={{ color: '#4b6554' }} className="mb-2" />
                          <span
                            className="text-sm font-semibold"
                            style={{ color: 'var(--on-surface)' }}
                          >
                            {apt.time}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                            {apt.patient}
                          </p>
                          <p className="text-sm mb-2" style={{ color: 'var(--on-surface-variant)' }}>
                            {apt.condition}
                          </p>
                          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {apt.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {apt.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: apt.status === 'confirmed' ? '#059669' : '#d97706',
                          }}
                        >
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                        <button
                          className="p-2 rounded hover:bg-opacity-10 opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: 'transparent' }}
                        >
                          <MoreHorizontal size={18} style={{ color: 'var(--on-surface-variant)' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  { title: 'Write Prescription', icon: FileText, action: 'Write new prescription' },
                  { title: 'Patient Records', icon: FileText, action: 'View medical history' },
                  { title: 'Add Notes', icon: FileText, action: 'Add consultation notes' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="p-4 rounded-lg text-left hover:scale-105 transition-transform"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <action.icon size={24} style={{ color: '#4b6554' }} className="mb-3" />
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>
                      {action.title}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {action.action}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
