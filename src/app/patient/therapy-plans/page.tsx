'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const therapyPlans = [
  {
    id: 1,
    name: 'Abhyanga Therapy',
    description: 'Full body oil massage',
    sessions: '6/12',
    percentage: 50,
    nextSession: 'Mar 18, 2024',
    price: '$500',
    duration: '60 mins per session',
  },
  {
    id: 2,
    name: 'Shirodhara',
    description: 'Forehead oil therapy',
    sessions: '3/8',
    percentage: 38,
    nextSession: 'Mar 22, 2024',
    price: '$400',
    duration: '45 mins per session',
  },
  {
    id: 3,
    name: 'Panchakarma',
    description: 'Detoxification therapy',
    sessions: '2/5',
    percentage: 40,
    nextSession: 'Mar 25, 2024',
    price: '$800',
    duration: '90 mins per session',
  },
];

export default function PatientTherapyPlansPage() {
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
                  My Therapy Plans
                </h1>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  Track your ongoing therapy sessions and progress
                </p>
              </div>

              {/* Therapy Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapyPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--on-surface)' }}>
                        {plan.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        {plan.description}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="mb-4 p-4 rounded-lg" style={{ background: 'var(--surface-container-highest)' }}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>
                          Progress
                        </span>
                        <span className="text-sm font-bold" style={{ color: '#4b6554' }}>
                          {plan.sessions}
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: 'var(--surface-container)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${plan.percentage}%`,
                            background: 'linear-gradient(90deg, #4b6554 0%, #3f5948 100%)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex items-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                        <Clock size={16} />
                        {plan.duration}
                      </div>
                      <div className="flex items-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                        <Calendar size={16} />
                        Next: {plan.nextSession}
                      </div>
                      <div style={{ color: 'var(--on-surface)' }} className="font-medium">
                        {plan.price}
                      </div>
                    </div>

                    <button
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                      }}
                    >
                      View Details
                    </button>
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
