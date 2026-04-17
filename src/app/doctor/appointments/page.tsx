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
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-600', label: 'Active', icon: '🔴' };
      case 'pending':
        return { bg: 'bg-blue-500/20', text: 'text-blue-600', label: 'Pending', icon: '⏱' };
      case 'completed':
        return { bg: 'bg-slate-500/20', text: 'text-slate-600', label: 'Completed', icon: '✓' };
      case 'cancelled':
        return { bg: 'bg-red-500/20', text: 'text-red-600', label: 'Cancelled', icon: '✕' };
      default:
        return { bg: 'bg-slate-500/20', text: 'text-slate-600', label: 'Unknown', icon: '?' };
    }
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            My Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and view all patient appointments
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Total Appointments</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {appointments.length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Active Today</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {appointments.filter(a => a.status === 'active').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Pending</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Completed</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {appointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl outline-none transition ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-600'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-600'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-xl outline-none transition ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Reason</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Vitals</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => {
                  const statusBadge = getStatusBadge(apt.status);
                  return (
                    <tr
                      key={apt.id}
                      className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{apt.patientName}</p>
                            <p className="text-xs text-slate-500">{apt.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          <span>{apt.appointmentDate}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={14} className="text-slate-500" />
                          <span className="text-xs text-slate-500">{apt.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{apt.reason}</td>
                      <td className="px-6 py-4 text-center">
                        {apt.vitals ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded">
                              BP: {apt.vitals.bp}
                            </span>
                            <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
                              Sugar: {apt.vitals.sugarLevel}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {apt.status === 'active' || apt.status === 'pending' ? (
                          <Link
                            href={`/doctor/diagnosis?patientId=${apt.id}&patientName=${apt.patientName}`}
                            className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                          >
                            Diagnose <ArrowRight size={14} />
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
