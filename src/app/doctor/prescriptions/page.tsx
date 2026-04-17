'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Plus, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    patient: 'Fatima Hussain',
    date: 'Mar 10, 2024',
    medicines: ['Ashwagandha', 'Triphala', 'Brahmi Oil'],
    status: 'active',
  },
  {
    id: 2,
    patient: 'Ali Khan',
    date: 'Mar 8, 2024',
    medicines: ['Neem Capsules', 'Turmeric', 'Ginger'],
    status: 'active',
  },
  {
    id: 3,
    patient: 'Zainab Ahmed',
    date: 'Mar 5, 2024',
    medicines: ['Brahmi', 'Ashwagandha'],
    status: 'completed',
  },
];

export default function PrescriptionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.patient.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div className="flex items-center justify-between mb-2">
                  <h1 className="display-lg" style={{ color: 'var(--on-surface)' }}>
                    Prescriptions
                  </h1>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                    }}
                  >
                    <Plus size={20} />
                    New Prescription
                  </button>
                </div>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  Create and manage patient prescriptions
                </p>
              </div>

              {/* Search */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg mb-6 max-w-md"
                style={{ background: 'var(--surface-container-highest)' }}
              >
                <Search size={18} style={{ color: 'var(--on-surface-variant)' }} />
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: 'var(--on-surface)' }}
                />
              </div>

              {/* Prescriptions */}
              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                          {prescription.patient}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                          {prescription.date}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                        style={{
                          background: prescription.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                          color: prescription.status === 'active' ? '#059669' : '#6b7280',
                        }}
                      >
                        {prescription.status === 'active' && <CheckCircle size={14} />}
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2" style={{ color: 'var(--on-surface-variant)' }}>
                        Medicines:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {prescription.medicines.map((med, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs"
                            style={{
                              background: 'var(--surface-container-highest)',
                              color: 'var(--on-surface)',
                            }}
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
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
