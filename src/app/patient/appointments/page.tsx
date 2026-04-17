'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Plus, Calendar, Clock, User, MapPin, CheckCircle, X } from 'lucide-react';

const patientAppointments = [
  { id: 1, doctor: 'Dr. Ahmed Khan', date: 'Mar 20, 2024', time: '2:00 PM', type: 'Check-up', status: 'upcoming', location: 'Clinic A' },
  { id: 2, doctor: 'Dr. Sarah Ahmed', date: 'Mar 27, 2024', time: '3:30 PM', type: 'Follow-up', status: 'upcoming', location: 'Clinic B' },
  { id: 3, doctor: 'Dr. Ahmed Khan', date: 'Mar 13, 2024', time: '11:00 AM', type: 'Check-up', status: 'completed', location: 'Clinic A' },
];

export default function PatientAppointmentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const htmlEl = document.documentElement;
    if (!isDarkMode) {
      htmlEl.classList.add('light');
    } else {
      htmlEl.classList.remove('light');
    }
  };

  const upcomingCount = patientAppointments.filter(a => a.status === 'upcoming').length;
  const completedCount = patientAppointments.filter(a => a.status === 'completed').length;

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
                <div className="flex items-center justify-between mb-2">
                  <h1 className="display-lg" style={{ color: 'var(--on-surface)' }}>
                    My Appointments
                  </h1>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                    }}
                  >
                    <Plus size={20} />
                    Book Appointment
                  </button>
                </div>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  View and manage your appointments
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Upcoming', value: upcomingCount.toString(), color: '#4b6554' },
                  { label: 'Completed', value: completedCount.toString(), color: '#059669' },
                  { label: 'Cancelled', value: '0', color: '#dc2626' },
                  { label: 'Total', value: patientAppointments.length.toString(), color: '#0891b2' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg text-center"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {stat.label}
                    </p>
                    <p className="headline-md font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Appointments List */}
              <div className="space-y-4">
                {patientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>
                          {apt.doctor}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                          {apt.type}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                        style={{
                          background: apt.status === 'upcoming' ? 'rgba(75, 101, 84, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: apt.status === 'upcoming' ? '#2d5a3d' : '#059669',
                        }}
                      >
                        {apt.status === 'upcoming' && <Calendar size={14} />}
                        {apt.status === 'completed' && <CheckCircle size={14} />}
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                        <Calendar size={16} />
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                        <Clock size={16} />
                        {apt.time}
                      </div>
                      <div className="flex items-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                        <MapPin size={16} />
                        {apt.location}
                      </div>
                    </div>

                    {apt.status === 'upcoming' && (
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                          style={{
                            background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                          }}
                        >
                          Reschedule
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium"
                          style={{
                            background: 'rgba(220, 38, 38, 0.1)',
                            color: '#dc2626',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
