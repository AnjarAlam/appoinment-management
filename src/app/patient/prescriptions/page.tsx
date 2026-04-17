'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Pill, Download, Printer } from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    date: 'Mar 10, 2024',
    doctor: 'Dr. Ahmed Khan',
    medicines: [
      { name: 'Ashwagandha', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
      { name: 'Triphala', dosage: '1 tsp', frequency: 'Once at night', duration: 'Ongoing' },
      { name: 'Brahmi Oil', dosage: 'As needed', frequency: 'For massage', duration: 'Ongoing' },
    ],
    status: 'active',
  },
  {
    id: 2,
    date: 'Feb 28, 2024',
    doctor: 'Dr. Sarah Ahmed',
    medicines: [
      { name: 'Neem Capsules', dosage: '400mg', frequency: 'Once daily', duration: '15 days' },
      { name: 'Ginger Tea', dosage: '1 cup', frequency: 'Twice daily', duration: 'Ongoing' },
    ],
    status: 'completed',
  },
];

export default function PatientPrescriptionsPage() {
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
            <div className="p-8 max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="display-lg mb-2" style={{ color: 'var(--on-surface)' }}>
                  My Prescriptions
                </h1>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  View all your active and past prescriptions
                </p>
              </div>

              {/* Prescriptions */}
              <div className="space-y-6">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>
                          {prescription.doctor}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                          {prescription.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: prescription.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: prescription.status === 'active' ? '#059669' : '#6b7280',
                          }}
                        >
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Medicines Table */}
                    <div className="mb-6 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--outline)' }}>
                            {['Medicine', 'Dosage', 'Frequency', 'Duration'].map((h) => (
                              <th
                                key={h}
                                className="px-4 py-2 text-left text-xs font-semibold"
                                style={{ color: 'var(--on-surface-variant)' }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {prescription.medicines.map((med, i) => (
                            <tr
                              key={i}
                              style={{
                                borderBottom: i < prescription.medicines.length - 1 ? '1px solid var(--outline)' : 'none',
                              }}
                            >
                              <td className="px-4 py-3 font-medium" style={{ color: 'var(--on-surface)' }}>
                                {med.name}
                              </td>
                              <td className="px-4 py-3" style={{ color: 'var(--on-surface-variant)' }}>
                                {med.dosage}
                              </td>
                              <td className="px-4 py-3" style={{ color: 'var(--on-surface-variant)' }}>
                                {med.frequency}
                              </td>
                              <td className="px-4 py-3" style={{ color: 'var(--on-surface-variant)' }}>
                                {med.duration}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                        style={{
                          background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                        }}
                      >
                        <Download size={16} />
                        Download PDF
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                          background: 'var(--surface-container-highest)',
                          color: 'var(--on-surface)',
                        }}
                      >
                        <Printer size={16} />
                        Print
                      </button>
                    </div>
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
