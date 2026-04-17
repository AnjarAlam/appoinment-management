'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Edit2, Save, Camera } from 'lucide-react';

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Fatima Hussain',
    age: '32',
    email: 'fatima@email.com',
    phone: '+92-300-1234567',
    bloodType: 'O+',
    allergies: 'None reported',
    medicalHistory: 'Mild arthritis',
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const htmlEl = document.documentElement;
    if (!isDarkMode) {
      htmlEl.classList.add('light');
    } else {
      htmlEl.classList.remove('light');
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const InputField = ({ label, value, field }: any) => (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--on-surface)' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        disabled={!isEditing}
        className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
        style={{
          background: 'var(--surface-container-highest)',
          color: 'var(--on-surface)',
          border: '1px solid var(--outline)',
          opacity: isEditing ? 1 : 0.7,
        }}
      />
    </div>
  );

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
            <div className="p-8 max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="display-lg" style={{ color: 'var(--on-surface)' }}>
                  My Profile
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 text-white"
                  style={{
                    background: isEditing
                      ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                      : 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                  }}
                >
                  {isEditing ? (
                    <>
                      <Save size={18} />
                      Save Profile
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {/* Profile Card */}
              <div
                className="p-8 rounded-lg mb-8"
                style={{ background: 'var(--surface-container)' }}
              >
                {/* Avatar */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                      }}
                    >
                      FH
                    </div>
                    {isEditing && (
                      <button
                        className="absolute bottom-0 right-0 p-2 rounded-full text-white transition-opacity hover:opacity-90"
                        style={{
                          background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                        }}
                      >
                        <Camera size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Fields */}
                <InputField label="Full Name" value={profile.name} field="name" />
                <InputField label="Age" value={profile.age} field="age" />
                <InputField label="Email" value={profile.email} field="email" />
                <InputField label="Phone" value={profile.phone} field="phone" />
                <InputField label="Blood Type" value={profile.bloodType} field="bloodType" />
                <InputField label="Allergies" value={profile.allergies} field="allergies" />
                <InputField label="Medical History" value={profile.medicalHistory} field="medicalHistory" />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Visits', value: '12' },
                  { label: 'Active Medicines', value: '4' },
                  { label: 'Therapy Progress', value: '50%' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg text-center"
                    style={{ background: 'var(--surface-container)' }}
                  >
                    <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {stat.label}
                    </p>
                    <p className="headline-md font-bold" style={{ color: 'var(--on-surface)' }}>
                      {stat.value}
                    </p>
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
