'use client';

import { useEffect, useState } from 'react';
import { Search, Send, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';

interface PatientQueue {
  id: number;
  patientName: string;
  patientPhone: string;
  appointmentTime: string;
  testsCompleted: boolean;
  vitals: {
    weight: string;
    bp: string;
    sugarLevel: string;
  };
  notes: string;
  status: 'ready-for-doctor' | 'sent-to-doctor' | 'with-doctor';
}

export default function PatientQueue() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ready-for-doctor');
  const [patients, setPatients] = useState<PatientQueue[]>([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      patientPhone: '+91 98765 43210',
      appointmentTime: '10:00 AM',
      testsCompleted: true,
      vitals: {
        weight: '72.5',
        bp: '120/80',
        sugarLevel: '95',
      },
      notes: 'Normal vitals, ready for doctor',
      status: 'ready-for-doctor',
    },
    {
      id: 2,
      patientName: 'Anjali Patel',
      patientPhone: '+91 99876 54321',
      appointmentTime: '10:30 AM',
      testsCompleted: true,
      vitals: {
        weight: '65.0',
        bp: '118/78',
        sugarLevel: '92',
      },
      notes: 'All tests completed',
      status: 'sent-to-doctor',
    },
    {
      id: 3,
      patientName: 'Amit Desai',
      patientPhone: '+91 97654 32109',
      appointmentTime: '11:00 AM',
      testsCompleted: true,
      vitals: {
        weight: '78.3',
        bp: '125/82',
        sugarLevel: '98',
      },
      notes: 'Slightly elevated BP, monitoring',
      status: 'with-doctor',
    },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendToDoctor = (id: number) => {
    setPatients(patients.map(p =>
      p.id === id ? { ...p, status: 'sent-to-doctor' as const } : p
    ));
  };

  const handleMarkWithDoctor = (id: number) => {
    setPatients(patients.map(p =>
      p.id === id ? { ...p, status: 'with-doctor' as const } : p
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready-for-doctor':
        return { bg: 'bg-blue-500/20', text: 'text-blue-600', label: 'Ready for Doctor', icon: AlertCircle };
      case 'sent-to-doctor':
        return { bg: 'bg-amber-500/20', text: 'text-amber-600', label: 'Sent to Doctor', icon: Clock };
      case 'with-doctor':
        return { bg: 'bg-purple-500/20', text: 'text-purple-600', label: 'With Doctor', icon: CheckCircle };
      default:
        return { bg: 'bg-slate-500/20', text: 'text-slate-600', label: 'Unknown', icon: AlertCircle };
    }
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Patient Queue & Doctor Assignment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage patient flow: From pre-medical tests to doctor consultation
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Ready for Doctor</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {patients.filter(p => p.status === 'ready-for-doctor').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Sent to Doctor</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {patients.filter(p => p.status === 'sent-to-doctor').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">With Doctor</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {patients.filter(p => p.status === 'with-doctor').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Total Patients</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {patients.length}
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
            <option value="ready-for-doctor">Ready for Doctor</option>
            <option value="sent-to-doctor">Sent to Doctor</option>
            <option value="with-doctor">With Doctor</option>
          </select>
        </div>

        {/* PATIENT QUEUE TABLE */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Appointment Time</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Weight</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">BP</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Sugar</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Notes</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const statusBadge = getStatusBadge(patient.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <tr
                      key={patient.id}
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
                            <p className="text-sm font-medium">{patient.patientName}</p>
                            <p className="text-xs text-slate-500">{patient.patientPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{patient.appointmentTime}</td>
                      <td className="px-6 py-4 text-sm text-center font-medium">{patient.vitals.weight} kg</td>
                      <td className="px-6 py-4 text-sm text-center font-medium">{patient.vitals.bp}</td>
                      <td className="px-6 py-4 text-sm text-center font-medium">{patient.vitals.sugarLevel} mg/dL</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{patient.notes}</td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                          <StatusIcon size={14} />
                          {statusBadge.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {patient.status === 'ready-for-doctor' && (
                          <button
                            onClick={() => handleSendToDoctor(patient.id)}
                            className="flex items-center gap-2 mx-auto px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                          >
                            <Send size={14} /> Send to Doctor
                          </button>
                        )}
                        {patient.status === 'sent-to-doctor' && (
                          <button
                            onClick={() => handleMarkWithDoctor(patient.id)}
                            className="flex items-center gap-2 mx-auto px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition"
                          >
                            <CheckCircle size={14} /> Mark with Doctor
                          </button>
                        )}
                        {patient.status === 'with-doctor' && (
                          <span className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-600 text-xs font-semibold">
                            In Consultation
                          </span>
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
