'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  User,
  Phone,
  Calendar,
  FileText,
  Heart,
  Eye,
} from 'lucide-react';

interface PatientRecord {
  id: number;
  name: string;
  phone: string;
  age: number;
  gender: string;
  lastVisit: string;
  conditions: string[];
  recentDiagnosis: string;
}

export default function DoctorPatients() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      age: 45,
      gender: 'Male',
      lastVisit: '2026-04-16',
      conditions: ['Hypertension', 'Diabetes'],
      recentDiagnosis: 'High BP with pre-diabetic condition',
    },
    {
      id: 2,
      name: 'Anjali Patel',
      phone: '+91 99876 54321',
      age: 38,
      gender: 'Female',
      lastVisit: '2026-04-15',
      conditions: ['Arthritis'],
      recentDiagnosis: 'Rheumatoid arthritis management',
    },
    {
      id: 3,
      name: 'Amit Desai',
      phone: '+91 97654 32109',
      age: 52,
      gender: 'Male',
      lastVisit: '2026-04-16',
      conditions: ['Hypertension', 'Cholesterol'],
      recentDiagnosis: 'Cardiovascular risk assessment',
    },
    {
      id: 4,
      name: 'Neha Singh',
      phone: '+91 96543 21098',
      age: 35,
      gender: 'Female',
      lastVisit: '2026-04-14',
      conditions: ['Thyroid'],
      recentDiagnosis: 'Hypothyroidism management',
    },
    {
      id: 5,
      name: 'Vikram Sharma',
      phone: '+91 95432 10987',
      age: 60,
      gender: 'Male',
      lastVisit: '2026-04-13',
      conditions: ['Arthritis', 'Hypertension'],
      recentDiagnosis: 'Chronic pain management',
    },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Patient Records
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage patient history and medical records
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Total Patients</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {patients.length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Active Patients</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {patients.length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Chronic Cases</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {patients.filter(p => p.conditions.length > 1).length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Avg Follow-ups</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              3.2
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by patient name or phone..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none transition ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-600'
                : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-600'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* PATIENTS TABLE */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Age/Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Conditions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Recent Diagnosis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Last Visit</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
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
                          <p className="text-sm font-medium">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        isDark
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {patient.age} yrs, {patient.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              idx === 0
                                ? isDark
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-blue-100 text-blue-700'
                                : isDark
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {patient.recentDiagnosis}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition mx-auto">
                        <Eye size={14} /> View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
