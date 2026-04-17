'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Download, Calendar, FileText } from 'lucide-react';

const medicalHistory = [
  {
    id: 1,
    date: 'Mar 10, 2024',
    doctor: 'Dr. Ahmed Khan',
    diagnosis: 'Chronic Arthritis',
    notes: 'Patient showing improvement with therapy. Continue current treatment plan.',
    documents: ['Report.pdf', 'X-Ray.pdf'],
  },
  {
    id: 2,
    date: 'Feb 28, 2024',
    doctor: 'Dr. Sarah Ahmed',
    diagnosis: 'General Check-up',
    notes: 'All vitals normal. Blood pressure and sugar levels stable.',
    documents: ['Checkup-Report.pdf'],
  },
  {
    id: 3,
    date: 'Feb 15, 2024',
    doctor: 'Dr. Ahmed Khan',
    diagnosis: 'Initial Consultation',
    notes: 'Patient presenting with joint pain and stiffness. Recommended Abhyanga and dietary changes.',
    documents: ['Consultation-Notes.pdf', 'Prescription.pdf'],
  },
];

export default function PatientMedicalHistoryPage() {
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
                  Medical History
                </h1>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  Complete record of your consultations and treatments
                </p>
              </div>

              {/* Medical Records */}
              <div className="space-y-6">
                {medicalHistory.map((record, i) => (
                  <div
                    key={record.id}
                    className="p-6 rounded-lg"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    {/* Timeline */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: '#4b6554' }}
                        />
                        {i < medicalHistory.length - 1 && (
                          <div
                            className="w-0.5 h-12 mt-2"
                            style={{ background: 'var(--outline)' }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                              {record.diagnosis}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                              {record.doctor}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            <Calendar size={14} />
                            {record.date}
                          </div>
                        </div>

                        {/* Notes */}
                        <p
                          className="text-sm mb-4 p-3 rounded-lg"
                          style={{
                            background: 'var(--surface-container-highest)',
                            color: 'var(--on-surface)',
                          }}
                        >
                          {record.notes}
                        </p>

                        {/* Documents */}
                        {record.documents.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-2" style={{ color: 'var(--on-surface-variant)' }}>
                              Attachments:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {record.documents.map((doc, j) => (
                                <button
                                  key={j}
                                  className="flex items-center gap-1 px-3 py-2 rounded text-xs font-medium transition-colors hover:opacity-80"
                                  style={{
                                    background: 'rgba(75, 101, 84, 0.1)',
                                    color: '#4b6554',
                                  }}
                                >
                                  <FileText size={14} />
                                  {doc}
                                  <Download size={12} />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
