'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Stethoscope,
  Users,
  TrendingDown,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DoctorDashboard() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const stats = [
    {
      title: "Today's Appointments",
      value: '12',
      icon: Calendar,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Pending Diagnoses',
      value: '5',
      icon: AlertCircle,
      color: 'amber',
      bgGradient: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Completed Today',
      value: '8',
      icon: CheckCircle,
      color: 'emerald',
      bgGradient: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Total Patients',
      value: '234',
      icon: Users,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-600',
    },
  ];

  const todayAppointments = [
    {
      id: 1,
      patient: 'Rajesh Kumar',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'active',
    },
    {
      id: 2,
      patient: 'Anjali Patel',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'upcoming',
    },
    {
      id: 3,
      patient: 'Amit Desai',
      time: '11:45 AM',
      type: 'Initial',
      status: 'upcoming',
    },
    {
      id: 4,
      patient: 'Neha Singh',
      time: '02:00 PM',
      type: 'Review',
      status: 'upcoming',
    },
  ];

  const recentDiagnoses = [
    {
      id: 1,
      patient: 'Priya Sharma',
      condition: 'Hypertension',
      date: '2026-04-16',
      status: 'completed',
    },
    {
      id: 2,
      patient: 'Vikram Singh',
      condition: 'Diabetes Management',
      date: '2026-04-16',
      status: 'completed',
    },
    {
      id: 3,
      patient: 'Meera Kapoor',
      condition: 'Arthritis Treatment',
      date: '2026-04-16',
      status: 'pending',
    },
  ];

  // Chart data
  const weeklyTrendData = [
    { day: 'Mon', appointments: 8, completed: 6 },
    { day: 'Tue', appointments: 10, completed: 9 },
    { day: 'Wed', appointments: 12, completed: 10 },
    { day: 'Thu', appointments: 9, completed: 8 },
    { day: 'Fri', appointments: 14, completed: 13 },
    { day: 'Sat', appointments: 7, completed: 6 },
  ];

  const dailyBreakdownData = [
    { time: '8AM', count: 2 },
    { time: '9AM', count: 4 },
    { time: '10AM', count: 6 },
    { time: '11AM', count: 8 },
    { time: '12PM', count: 5 },
    { time: '1PM', count: 3 },
    { time: '2PM', count: 7 },
    { time: '3PM', count: 4 },
  ];

  const patientCategoryData = [
    { name: 'New Patients', value: 35, color: '#3b82f6' },
    { name: 'Follow-up', value: 45, color: '#10b981' },
    { name: 'Check-up', value: 20, color: '#f59e0b' },
  ];

  const performanceData = [
    { metric: 'Avg. Consultation Time', value: '28 min', trend: '+2min', positive: true },
    { metric: 'Patient Satisfaction', value: '4.8/5', trend: '+0.2', positive: true },
    { metric: 'Cancellation Rate', value: '2.5%', trend: '-0.8%', positive: true },
    { metric: 'Same-day Appointments', value: '156', trend: '+12', positive: true },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4`}>
      <div className="max-w-7xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Doctor <span className="text-emerald-600">Dashboard</span>
            </h1>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} mt-0.5 text-xs`}>
              Welcome back, Dr. Priya Sharma • <span className="font-medium text-emerald-600">12 appointments today</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/doctor/diagnosis" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-xs font-medium shadow-sm">
              <AlertCircle size={14} /> New Diagnosis
            </Link>
            <Link href="/doctor/appointments" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              isDark ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-100'
            }`}>
              <Calendar size={14} /> All Appointments
            </Link>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Weekly Trend Chart */}
          <div className={`rounded-lg border p-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="mb-4">
              <h3 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Weekly Trend</h3>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Appointments vs Completed</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 5 }} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Breakdown Chart */}
          <div className={`rounded-lg border p-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="mb-4">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Breakdown</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Appointments by time slot</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="time" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {performanceData.map((perf, i) => (
            <div key={i} className={`rounded-lg border p-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{perf.metric}</p>
              <div className="flex items-end justify-between gap-2 mt-2">
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{perf.value}</p>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${perf.positive ? isDark ? 'text-emerald-400' : 'text-emerald-600' : isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {perf.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {perf.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`rounded-lg border p-4 shadow-sm transition hover:shadow-md ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    stat.color === 'emerald' ? isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                    : stat.color === 'blue' ? isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                    : stat.color === 'amber' ? isDark ? 'bg-amber-500/10' : 'bg-amber-50'
                    : isDark ? 'bg-purple-500/10' : 'bg-purple-50'
                  }`}>
                    <Icon size={16} className={`${
                      stat.color === 'emerald' ? 'text-emerald-600'
                      : stat.color === 'blue' ? 'text-blue-600'
                      : stat.color === 'amber' ? 'text-amber-600'
                      : 'text-purple-600'
                    }`} />
                  </div>
                </div>
                <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* TODAY'S APPOINTMENTS */}
          <div className={`lg:col-span-2 rounded-lg border shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar size={16} className="text-blue-600" />
                    Today's Appointments
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Patient consultations</p>
                </div>
                <Link href="/doctor/appointments" className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                  View All →
                </Link>
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className={`p-3 flex items-center justify-between hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} transition`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-1.5 rounded flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                    }`}>
                      <Stethoscope size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {apt.patient}
                      </p>
                      <p className="text-xs text-slate-500">{apt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                      apt.status === 'active'
                        ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                        : isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {apt.status === 'active' ? '● Active' : '⏱ Upcoming'}
                    </span>
                    <p className={`text-xs font-medium w-16 text-right ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {apt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className={`rounded-lg border shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Quick Actions
              </h3>
            </div>

            <div className="p-4 space-y-2">
              <Link href="/doctor/diagnosis" className={`flex items-center gap-3 p-2.5 rounded-lg transition text-xs ${
                isDark
                  ? 'hover:bg-slate-800 bg-slate-800/50'
                  : 'hover:bg-slate-100 bg-slate-50'
              }`}>
                <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 flex-shrink-0">
                  <AlertCircle size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">New Diagnosis</p>
                  <p className="text-xs text-slate-500">Create report</p>
                </div>
              </Link>

              <Link href="/doctor/patients" className={`flex items-center gap-3 p-2.5 rounded-lg transition text-xs ${
                isDark
                  ? 'hover:bg-slate-800 bg-slate-800/50'
                  : 'hover:bg-slate-100 bg-slate-50'
              }`}>
                <div className="w-8 h-8 rounded flex items-center justify-center bg-emerald-600 flex-shrink-0">
                  <Users size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">Patient Records</p>
                  <p className="text-xs text-slate-500">View history</p>
                </div>
              </Link>

              <Link href="/doctor/prescriptions" className={`flex items-center gap-3 p-2.5 rounded-lg transition text-xs ${
                isDark
                  ? 'hover:bg-slate-800 bg-slate-800/50'
                  : 'hover:bg-slate-100 bg-slate-50'
              }`}>
                <div className="w-8 h-8 rounded flex items-center justify-center bg-amber-600 flex-shrink-0">
                  <Clock size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">Prescriptions</p>
                  <p className="text-xs text-slate-500">Recent list</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* RECENT DIAGNOSES */}
        <div className={`rounded-lg border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <CheckCircle size={16} className="text-emerald-600" />
              Recent Diagnoses
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className={`text-left py-2 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Patient</th>
                  <th className={`text-left py-2 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Condition</th>
                  <th className={`text-left py-2 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Date</th>
                  <th className={`text-center py-2 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDiagnoses.map((diagnosis) => (
                  <tr key={diagnosis.id} className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <td className={`py-2.5 px-4 font-medium text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {diagnosis.patient}
                    </td>
                    <td className={`py-2.5 px-4 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {diagnosis.condition}
                    </td>
                    <td className={`py-2.5 px-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {diagnosis.date}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        diagnosis.status === 'completed'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {diagnosis.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                      </span>
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
