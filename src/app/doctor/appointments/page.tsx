'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: number;
  patientName: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'completed' | 'pending' | 'active' | 'cancelled';
  vitals?: {
    weight: string;
    bp: string;
    sugarLevel: string;
  };
}

export default function DoctorAppointments() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      appointmentDate: '2026-04-16',
      appointmentTime: '09:00 AM',
      reason: 'Hypertension checkup',
      status: 'active',
      vitals: { weight: '72.5', bp: '130/85', sugarLevel: '95' },
    },
    {
      id: 2,
      patientName: 'Anjali Patel',
      phone: '+91 99876 54321',
      appointmentDate: '2026-04-16',
      appointmentTime: '10:30 AM',
      reason: 'Follow-up consultation',
      status: 'pending',
      vitals: { weight: '65.0', bp: '120/80', sugarLevel: '92' },
    },
    {
      id: 3,
      patientName: 'Amit Desai',
      phone: '+91 97654 32109',
      appointmentDate: '2026-04-16',
      appointmentTime: '11:45 AM',
      reason: 'Initial assessment',
      status: 'pending',
      vitals: { weight: '78.3', bp: '125/82', sugarLevel: '98' },
    },
    {
      id: 4,
      patientName: 'Neha Singh',
      phone: '+91 96543 21098',
      appointmentDate: '2026-04-16',
      appointmentTime: '02:00 PM',
      reason: 'Diabetes management',
      status: 'pending',
      vitals: { weight: '68.2', bp: '118/78', sugarLevel: '115' },
    },
    {
      id: 5,
      patientName: 'Priya Sharma',
      phone: '+91 95432 10987',
      appointmentDate: '2026-04-15',
      appointmentTime: '03:00 PM',
      reason: 'General checkup',
      status: 'completed',
    },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-emerald-100 dark:bg-emerald-900', text: 'text-emerald-800 dark:text-emerald-300', label: 'Active', icon: '●' };
      case 'pending':
        return { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', label: 'Pending', icon: '⏱' };
      case 'completed':
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', label: 'Completed', icon: '✓' };
      case 'cancelled':
        return { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', label: 'Cancelled', icon: '✕' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', label: 'Unknown', icon: '?' };
    }
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen`}>
      <div className="max-w-7xl mx-auto p-4 space-y-4">

        {/* HEADER */}
        <div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            My Appointments
          </h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-xs mt-1`}>Manage and view all patient appointments</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-3">
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <p className="text-xs text-slate-500">Total Appointments</p>
            <p className={`text-xl font-semibold mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{appointments.length}</p>
          </div>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <p className="text-xs text-slate-500">Active Today</p>
            <p className={`text-xl font-semibold mt-1 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{appointments.filter(a => a.status === 'active').length}</p>
          </div>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <p className="text-xs text-slate-500">Pending</p>
            <p className={`text-xl font-semibold mt-1 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{appointments.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <p className="text-xs text-slate-500">Completed</p>
            <p className={`text-xl font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{appointments.filter(a => a.status === 'completed').length}</p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              className={`w-full pl-10 pr-3 py-1.5 rounded-lg text-sm outline-none transition ${isDark ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500' : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:ring-1 focus:ring-blue-500'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-3 py-1.5 rounded-lg text-sm outline-none transition ${isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className={`rounded-lg border overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Patient</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Date & Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Reason</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Vitals</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => {
                  const statusBadge = getStatusBadge(apt.status);
                  return (
                    <tr key={apt.id} className={`${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} border-b transition`}>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-500">{apt.patientName}</p>
                            <p className="text-[11px] text-slate-500">{apt.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{apt.appointmentDate}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-[11px] text-slate-500">{apt.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">{apt.reason}</td>
                      <td className="px-3 py-2 text-center">
                        {apt.vitals ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-[11px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                              BP: {apt.vitals.bp}
                            </span>
                            <span className="text-[11px] bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                              Sugar: {apt.vitals.sugarLevel}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {apt.status === 'active' || apt.status === 'pending' ? (
                          <Link href={`/doctor/diagnosis?patientId=${apt.id}&patientName=${apt.patientName}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
                            Diagnose <ArrowRight size={12} />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-500">View</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
