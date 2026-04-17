'use client';

import { useEffect, useState } from 'react';
import { Search, Award, Users, Clock, Mail, Phone } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  experience: number;
  availability: string;
  status: 'available' | 'busy' | 'offline';
}

export default function ReceptionDoctors() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Ayurvedic Internal Medicine',
      email: 'priya@clinic.com',
      phone: '+91 98765 43210',
      experience: 12,
      availability: 'Mon - Fri, 10 AM - 6 PM',
      status: 'available',
    },
    {
      id: 2,
      name: 'Dr. Vikram Singh',
      specialty: 'Panchakarma Specialist',
      email: 'vikram@clinic.com',
      phone: '+91 99876 54321',
      experience: 15,
      availability: 'Tue - Sat, 12 PM - 8 PM',
      status: 'available',
    },
    {
      id: 3,
      name: 'Dr. Neha Desai',
      specialty: 'Women\'s Health',
      email: 'neha@clinic.com',
      phone: '+91 97654 32109',
      experience: 8,
      availability: 'Mon - Thu, 2 PM - 7 PM',
      status: 'busy',
    },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' };
      case 'busy':
        return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' };
      case 'offline':
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400' };
    }
  };

  return (
    <div className={`flex-1 overflow-auto transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`p-6`}>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Doctor Directory
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            View doctor availability and schedule appointments
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all
                ${isDark
                  ? 'bg-slate-800 border border-slate-700 focus:border-blue-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-500'
                }`}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => {
            const statusColor = getStatusColor(doctor.status);
            return (
              <div
                key={doctor.id}
                className={`rounded-2xl border p-5 transition-all hover:shadow-lg ${
                  isDark
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {doctor.name.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {doctor.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${statusColor.bg} ${statusColor.text}`}>
                    {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                  </span>
                </div>

                {/* Experience Badge */}
                <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <Award size={14} className="text-blue-600" />
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {doctor.experience} years experience
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Mail size={14} />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Phone size={14} />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Clock size={14} />
                    <span>{doctor.availability}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className={`w-full py-2 rounded-lg text-sm font-semibold transition-all
                  ${isDark
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  Schedule Appointment
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
