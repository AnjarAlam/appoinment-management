'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import {
  Calendar,
  Pill,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  User,
  Plus,
  Heart,
  Zap,
} from 'lucide-react';

const appointmentData = [
  {
    id: 1,
    doctor: 'Dr. Ahmed Khan',
    date: 'Mar 20, 2024',
    time: '2:00 PM',
    type: 'General Check-up',
    status: 'upcoming',
  },
  {
    id: 2,
    doctor: 'Dr. Sarah Ahmed',
    date: 'Mar 27, 2024',
    time: '3:30 PM',
    type: 'Follow-up',
    status: 'upcoming',
  },
  {
    id: 3,
    doctor: 'Dr. Ahmed Khan',
    date: 'Mar 13, 2024',
    time: '11:00 AM',
    type: 'General Check-up',
    status: 'completed',
  },
];

const prescriptions = [
  { id: 1, medicine: 'Ashwagandha', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
  { id: 2, medicine: 'Triphala', dosage: '1 tsp', frequency: 'Once at night', duration: 'Ongoing' },
  { id: 3, medicine: 'Brahmi Oil', dosage: 'As needed', frequency: 'For massage', duration: 'Ongoing' },
  { id: 4, medicine: 'Neem Capsules', dosage: '1 capsule', frequency: 'Once daily', duration: '15 days' },
];

const therapyPlans = [
  {
    id: 1,
    name: 'Abhyanga Therapy',
    description: 'Ayurvedic oil massage',
    sessions: '6/12',
    nextSession: 'Mar 18, 2024',
  },
  {
    id: 2,
    name: 'Shirodhara',
    description: 'Forehead oil therapy',
    sessions: '3/8',
    nextSession: 'Mar 22, 2024',
  },
  {
    id: 3,
    name: 'Panchakarma',
    description: 'Detoxification therapy',
    sessions: '2/5',
    nextSession: 'Mar 25, 2024',
  },
];

export default function PatientDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (isLoading) return <div className="light min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'patient') {
    router.push('/dashboard');
    return null;
  }

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
                  Your Health Dashboard
                </h1>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  Track your appointments, medicines, and therapy progress
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Next Appointment', value: 'Mar 20', icon: Calendar, color: '#4b6554' },
                  { label: 'Active Medicines', value: '4', icon: Pill, color: '#0891b2' },
                  { label: 'Therapy Sessions', value: '6/12', icon: Heart, color: '#dc2626' },
                  { label: 'Health Score', value: '82%', icon: Zap, color: '#f59e0b' },
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

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Appointments */}
                <div
                  className="lg:col-span-2 p-6 rounded-lg"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="title-md font-semibold" style={{ color: 'var(--on-surface)' }}>
                      Upcoming Appointments
                    </h2>
                    <button
                      className="text-sm font-medium hover:opacity-70 transition-opacity"
                      style={{ color: '#4b6554' }}
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {appointmentData
                      .filter((apt) => apt.status === 'upcoming')
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 rounded-lg"
                          style={{
                            background: 'var(--surface-container-highest)',
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                                {apt.doctor}
                              </p>
                              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                                {apt.type}
                              </p>
                            </div>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: 'rgba(75, 101, 84, 0.1)',
                                color: '#2d5a3d',
                              }}
                            >
                              Upcoming
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <button
                    className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                    }}
                  >
                    <Plus size={18} className="inline mr-2" />
                    Book New Appointment
                  </button>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <div
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--on-surface)' }}>
                      Quick Access
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Download Reports', icon: FileText },
                        { label: 'My Prescriptions', icon: Pill },
                        { label: 'Therapy Plans', icon: Heart },
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors"
                          style={{
                            background: 'var(--surface-container-highest)',
                            color: 'var(--on-surface)',
                          }}
                        >
                          <item.icon size={16} style={{ color: '#4b6554' }} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--on-surface)' }}>
                      Health Metrics
                    </h3>
                    {[
                      { label: 'Doshas Balance', value: 'Good' },
                      { label: 'Digestion', value: 'Normal' },
                      { label: 'Sleep Quality', value: 'Good' },
                    ].map((metric, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2"
                        style={{
                          borderBottom: i < 2 ? '1px solid var(--outline)' : 'none',
                        }}
                      >
                        <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                          {metric.label}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--on-surface)' }}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prescriptions & Therapies */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Active Medicines */}
                <div
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <h2 className="title-md font-semibold mb-6" style={{ color: 'var(--on-surface)' }}>
                    Active Medicines
                  </h2>
                  <div className="space-y-3">
                    {prescriptions.map((med) => (
                      <div
                        key={med.id}
                        className="p-4 rounded-lg"
                        style={{ background: 'var(--surface-container-highest)' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                              {med.medicine}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                              {med.dosage} • {med.frequency}
                            </p>
                          </div>
                          <Pill size={20} style={{ color: '#0891b2' }} />
                        </div>
                        <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                          Duration: {med.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Therapy Progress */}
                <div
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <h2 className="title-md font-semibold mb-6" style={{ color: 'var(--on-surface)' }}>
                    Therapy Progress
                  </h2>
                  <div className="space-y-3">
                    {therapyPlans.map((therapy) => (
                      <div
                        key={therapy.id}
                        className="p-4 rounded-lg"
                        style={{ background: 'var(--surface-container-highest)' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                              {therapy.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                              {therapy.description}
                            </p>
                          </div>
                          <span className="text-xs font-semibold" style={{ color: '#4b6554' }}>
                            {therapy.sessions}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(parseInt(therapy.sessions.split('/')[0]) / parseInt(therapy.sessions.split('/')[1])) * 100}%`,
                              background: 'linear-gradient(90deg, #4b6554 0%, #3f5948 100%)',
                            }}
                          />
                        </div>
                        <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                          Next: {therapy.nextSession}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
