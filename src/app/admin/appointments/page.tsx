'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, CheckCircle, Clock, X, 
  Edit2, Trash2, Filter 
} from 'lucide-react';

const initialAppointments = [
  { 
    id: 1, 
    patient: 'Fatima Hussain', 
    doctor: 'Dr. Ahmed Khan', 
    date: 'Mar 15', 
    time: '10:00 AM', 
    status: 'confirmed' as const, 
    type: 'Check-up' 
  },
  { 
    id: 2, 
    patient: 'Ali Khan', 
    doctor: 'Dr. Ahmed Khan', 
    date: 'Mar 15', 
    time: '11:30 AM', 
    status: 'confirmed' as const, 
    type: 'Follow-up' 
  },
  { 
    id: 3, 
    patient: 'Zainab Ahmed', 
    doctor: 'Dr. Sarah Ahmed', 
    date: 'Mar 15', 
    time: '2:00 PM', 
    status: 'pending' as const, 
    type: 'Consultation' 
  },
  { 
    id: 4, 
    patient: 'Hassan Ali', 
    doctor: 'Dr. Ahmed Khan', 
    date: 'Mar 16', 
    time: '3:30 PM', 
    status: 'confirmed' as const, 
    type: 'Check-up' 
  },
  { 
    id: 5, 
    patient: 'Maryam Ali', 
    doctor: 'Dr. Sarah Ahmed', 
    date: 'Mar 16', 
    time: '4:00 PM', 
    status: 'cancelled' as const, 
    type: 'Therapy' 
  },
];

type Appointment = typeof initialAppointments[0];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = 
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { 
      label: 'Total', 
      value: appointments.length, 
      color: 'text-slate-700 dark:text-slate-300' 
    },
    { 
      label: 'Confirmed', 
      value: appointments.filter(a => a.status === 'confirmed').length, 
      color: 'text-emerald-600 dark:text-emerald-400' 
    },
    { 
      label: 'Pending', 
      value: appointments.filter(a => a.status === 'pending').length, 
      color: 'text-amber-600 dark:text-amber-400' 
    },
    { 
      label: 'Cancelled', 
      value: appointments.filter(a => a.status === 'cancelled').length, 
      color: 'text-rose-600 dark:text-rose-400' 
    },
  ];

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
            <CheckCircle size={14} />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
            <Clock size={14} />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full text-xs font-medium">
            <X size={14} />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Calendar size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Appointments</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">Manage patient schedules and status</p>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl font-medium transition shadow-sm">
            <Plus size={16} />
            New Appointment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4"
            >
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className={`text-3xl font-semibold mt-2 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl text-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base text-slate-900 dark:text-white">Appointment Schedule</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {filteredAppointments.length} appointments found
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition flex items-center gap-2 text-sm">
                Export CSV
              </button>
              <button className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition text-sm">
                Bulk Actions
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Doctor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr 
                      key={apt.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium text-slate-900 dark:text-white text-sm">
                        {apt.patient}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {apt.doctor}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {apt.type}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">
                        <div className="text-sm">{apt.date}</div>
                        <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">{apt.time}</div>
                      </td>
                      <td className="px-6 py-3">
                        {getStatusBadge(apt.status)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition text-slate-600 dark:text-slate-400">
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-2xl transition">
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}