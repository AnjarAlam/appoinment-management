'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader,
  Eye,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useAppointmentStore } from '@/store/appointment_store_api';

export default function AppointmentsPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { appointments, totalItems, totalPages, loading, error, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, statusFilter, fetchAppointments]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      SCHEDULED: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-800',
      COMPLETED: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-800',
      CANCELLED: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-800',
      NO_SHOW: isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.PENDING;
  };

  const stats = [
    { title: 'Total Appointments', value: totalItems.toString(), icon: Calendar, color: 'blue' },
    { title: 'This Month', value: (totalItems * 0.3).toFixed(0), icon: Clock, color: 'emerald' },
    { title: 'Completed', value: Math.floor(totalItems * 0.6).toString(), icon: CheckCircle2, color: 'green' },
    { title: 'Pending', value: Math.floor(totalItems * 0.2).toString(), icon: AlertCircle, color: 'amber' },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-4 md:p-6`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ALERTS */}
        {successMsg && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Appointments
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage all patient appointments
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold transition">
            <Plus size={18} /> New Appointment
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600',
              emerald: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
              green: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600',
              amber: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600',
            }[stat.color];

            return (
              <div
                key={i}
                className={`rounded-lg p-4 border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center mb-3`}>
                  <Icon size={20} />
                </div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* SEARCH & FILTERS */}
        <div className={`rounded-lg border p-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search by patient name or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
                }`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white'
                  : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
              }`}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className={`rounded-lg border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Appointments ({totalItems})
            </h2>
            {loading && <Loader size={18} className="animate-spin text-purple-600" />}
          </div>

          {!loading && appointments.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar size={32} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No appointments found
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Patient
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Date & Time
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Doctor
                      </th>
                      <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Status
                      </th>
                      <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className={`border-b transition hover:${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        <td className={`py-3 px-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                          <div className="font-medium">{apt.patientName || 'Unknown'}</div>
                          <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                            {apt.patientId}
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} /> {apt.appointmentDate}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={14} /> {apt.appointmentTime}
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {apt.doctorName || 'Unassigned'}
                        </td>
                        <td className={`py-3 px-4`}>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewingAppointment(apt)}
                              className={`p-2 rounded transition ${
                                isDark ? 'hover:bg-slate-700 text-blue-400' : 'hover:bg-slate-100 text-blue-600'
                              }`}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className={`p-2 rounded transition ${
                                isDark ? 'hover:bg-slate-700 text-amber-400' : 'hover:bg-slate-100 text-amber-600'
                              }`}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className={`p-2 rounded transition ${
                                isDark ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-slate-100 text-red-600'
                              }`}
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

              {/* PAGINATION */}
              <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition ${
                      currentPage === 1
                        ? isDark
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition ${
                      currentPage === totalPages
                        ? isDark
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Appointment Details
              </h3>
              <button
                onClick={() => setViewingAppointment(null)}
                className={`p-1 rounded transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Patient Name
                </p>
                <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{viewingAppointment.patientName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Date
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{viewingAppointment.appointmentDate}</p>
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Time
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{viewingAppointment.appointmentTime}</p>
                </div>
              </div>

              <div>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Doctor
                </p>
                <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{viewingAppointment.doctorName}</p>
              </div>

              <div>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Status
                </p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewingAppointment.status)}`}>
                  {viewingAppointment.status}
                </span>
              </div>

              {viewingAppointment.symptoms && (
                <div>
                  <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Symptoms
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{viewingAppointment.symptoms}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setViewingAppointment(null)}
                className={`flex-1 px-4 py-2 rounded-lg border font-semibold transition ${
                  isDark
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-900'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
