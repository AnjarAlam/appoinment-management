'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Navbar } from '@/components/navbar';
import { Settings as SettingsIcon, Save, Bell, Lock, Eye } from 'lucide-react';

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [clinicName, setClinicName] = useState('Ayurveda Wellness Clinic');
  const [email, setEmail] = useState('clinic@ayurveda.com');
  const [phone, setPhone] = useState('+92-300-1234567');
  const [address, setAddress] = useState('123 Health St, Wellness City');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const htmlEl = document.documentElement;
    if (!isDarkMode) {
      htmlEl.classList.add('light');
    } else {
      htmlEl.classList.remove('light');
    }
  };

  const InputField = ({ label, value, onChange, type = 'text' }: any) => (
    <div className="mb-6">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--on-surface)' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
        style={{
          background: 'var(--surface-container-highest)',
          color: 'var(--on-surface)',
          border: '1px solid var(--outline)',
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
            <div className="p-8 max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <SettingsIcon size={32} style={{ color: '#4b6554' }} />
                  <h1 className="display-lg" style={{ color: 'var(--on-surface)' }}>
                    Settings
                  </h1>
                </div>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)' }}>
                  Manage clinic configuration and preferences
                </p>
              </div>

              {/* Settings Sections */}
              <div className="space-y-6">
                {/* Clinic Information */}
                <div
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <h2 className="title-md font-semibold mb-6" style={{ color: 'var(--on-surface)' }}>
                    Clinic Information
                  </h2>
                  <InputField
                    label="Clinic Name"
                    value={clinicName}
                    onChange={(e: any) => setClinicName(e.target.value)}
                  />
                  <InputField
                    label="Email Address"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    type="email"
                  />
                  <InputField
                    label="Phone Number"
                    value={phone}
                    onChange={(e: any) => setPhone(e.target.value)}
                    type="tel"
                  />
                  <InputField
                    label="Address"
                    value={address}
                    onChange={(e: any) => setAddress(e.target.value)}
                  />
                </div>

                {/* Notification Settings */}
                <div
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Bell size={20} style={{ color: '#4b6554' }} />
                    <h2 className="title-md font-semibold" style={{ color: 'var(--on-surface)' }}>
                      Notifications
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'Appointment Reminders', desc: 'Send reminders to patients before appointments' },
                      { title: 'Email Notifications', desc: 'Receive email for important clinic events' },
                      { title: 'SMS Alerts', desc: 'Get SMS alerts for urgent messages' },
                      { title: 'Report Digests', desc: 'Receive weekly performance reports' },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: 'var(--surface-container-highest)' }}
                      >
                        <div>
                          <p className="font-medium" style={{ color: 'var(--on-surface)' }}>
                            {notif.title}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            {notif.desc}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#4b6554' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Settings */}
                <div
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--surface-container)' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Lock size={20} style={{ color: '#4b6554' }} />
                    <h2 className="title-md font-semibold" style={{ color: 'var(--on-surface)' }}>
                      Security
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <button
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-colors"
                      style={{
                        background: 'var(--surface-container-highest)',
                        color: 'var(--on-surface)',
                      }}
                    >
                      Change Password
                    </button>
                    <button
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-colors"
                      style={{
                        background: 'var(--surface-container-highest)',
                        color: 'var(--on-surface)',
                      }}
                    >
                      Two-Factor Authentication
                    </button>
                    <button
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-colors"
                      style={{
                        background: 'var(--surface-container-highest)',
                        color: 'var(--on-surface)',
                      }}
                    >
                      View Login History
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  className="w-full px-6 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, #4b6554 0%, #3f5948 100%)',
                  }}
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
