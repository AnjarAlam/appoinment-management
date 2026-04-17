'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Phone, MapPin, Calendar } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  time: string;
  date: string;
  phone: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export default function ReceptionAppointments() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      doctorName: 'Dr. Priya Sharma',
      time: '10:00 AM',
      date: '2026-04-15',
      phone: '+91 98765 43210',
      status: 'confirmed',
    },
    {
      id: 2,
      patientName: 'Anjali Patel',
      doctorName: 'Dr. Vikram Singh',
      time: '10:30 AM',
      date: '2026-04-15',
      phone: '+91 99876 54321',
      status: 'confirmed',
    },
    {
      id: 3,
      patientName: 'Amit Desai',
      doctorName: 'Dr. Priya Sharma',
      time: '11:00 AM',
      date: '2026-04-15',
      phone: '+91 97654 32109',
      status: 'pending',
    },
    {
      id: 4,
      patientName: 'Neha Singh',
      doctorName: 'Dr. Vikram Singh',
      time: '02:00 PM',
      date: '2026-04-15',
      phone: '+91 96543 21098',
      status: 'confirmed',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    time: '',
    date: '',
    phone: '',
    status: 'pending' as const,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClick = () => {
    setFormData({
      patientName: '',
      doctorName: '',
      time: '',
      date: '',
      phone: '',
      status: 'pending',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (apt: Appointment) => {
    setFormData({
      patientName: apt.patientName,
      doctorName: apt.doctorName,
      time: apt.time,
      date: apt.date,
      phone: apt.phone,
      status: apt.status,
    });
    setEditingId(apt.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const handleSubmit = () => {
    if (editingId) {
      setAppointments(appointments.map((apt) =>
        apt.id === editingId ? { ...apt, ...formData } : apt
      ));
    } else {
      setAppointments([...appointments, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className={`flex-1 overflow-auto transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`p-6`}>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Appointments
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage and schedule patient appointments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all
                ${isDark
                  ? 'bg-slate-800 border border-slate-700 focus:border-blue-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-500'
                }`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-medium focus:outline-none transition-all
              ${isDark
                ? 'bg-slate-800 border border-slate-700 text-slate-100'
                : 'bg-white border border-slate-200 text-slate-900'
              }`}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Add Appointment
          </button>
        </div>

        {/* Appointments Table */}
        <div className={`rounded-3xl border overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-950 border-slate-800'
            : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <th className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Patient Name
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Doctor
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Date & Time
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Phone
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Status
                  </th>
                  <th className={`px-4 py-3 text-center text-xs font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
                {filteredAppointments.map((apt, idx) => (
                  <tr key={apt.id} className={`${
                    idx % 2 === 0
                      ? isDark ? 'bg-slate-950' : 'bg-slate-50'
                      : isDark ? 'bg-slate-900/50' : 'bg-white'
                  } hover:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-all`}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {apt.patientName}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {apt.doctorName}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {apt.date} {apt.time}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {apt.phone}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(apt.status)}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(apt)}
                          className="p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-all text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-all text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`rounded-3xl shadow-2xl p-6 w-96 border transition-all ${
            isDark
              ? 'bg-slate-950 border-slate-800'
              : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {editingId ? 'Edit Appointment' : 'New Appointment'}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="text"
                placeholder="Doctor Name"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${isDark
                    ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
