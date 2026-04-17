'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  Clock,
  Plus,
  FileDown,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Heart,
  Pill,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Zap,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function ReceptionDashboard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Professional KPI Cards - Receptionist Focused
  const kpis = [
    {
      label: "Today's Appointments",
      value: '24',
      trend: '+12%',
      isPositive: true,
      change: 'vs yesterday',
      icon: Calendar,
      color: 'blue',
    },
    {
      label: 'Active Patients',
      value: '1,247',
      trend: '+8%',
      isPositive: true,
      change: 'registered',
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Pending Appointments',
      value: '156',
      trend: '+5%',
      isPositive: false,
      change: 'needs confirmation',
      icon: Clock,
      color: 'amber',
    },
    {
      label: 'Waiting Now',
      value: '12',
      trend: '+3',
      isPositive: true,
      change: 'in clinic',
      icon: AlertCircle,
      color: 'emerald',
    },
  ];

  // Appointment Sources/Categories - Receptionist View
  const appointmentCategories = [
    { name: 'New Patients', count: 8, percentage: 33, icon: Users, color: 'blue' },
    { name: 'Follow-ups', count: 9, percentage: 38, icon: CheckCircle, color: 'emerald' },
    { name: 'Urgent Cases', count: 4, percentage: 17, icon: AlertCircle, color: 'red' },
    { name: 'Walk-ins', count: 3, percentage: 12, icon: Clock, color: 'amber' },
  ];

  // Doctor Availability - Receptionist View
  const doctorAvailability = [
    { name: 'Dr. Ahmed Khan', status: 'Available', appointments: 8, nextBreak: '2:00 PM' },
    { name: 'Dr. Sarah Ahmed', status: 'In Consultation', appointments: 6, nextBreak: '1:30 PM' },
    { name: 'Dr. Hassan Ali', status: 'Available', appointments: 5, nextBreak: '3:00 PM' },
  ];

  // Hourly Appointment Distribution
  const hourlyData = [
    { time: '8 AM', appointments: 2, completed: 2 },
    { time: '9 AM', appointments: 3, completed: 3 },
    { time: '10 AM', appointments: 4, completed: 3 },
    { time: '11 AM', appointments: 5, completed: 4 },
    { time: '12 PM', appointments: 3, completed: 2 },
    { time: '1 PM', appointments: 2, completed: 1 },
    { time: '2 PM', appointments: 4, completed: 3 },
  ];

  // Weekly Appointment Trend
  const weeklyTrend = [
    { day: 'Mon', appointments: 18, waiting: 12 },
    { day: 'Tue', appointments: 22, waiting: 14 },
    { day: 'Wed', appointments: 25, waiting: 16 },
    { day: 'Thu', appointments: 24, waiting: 15 },
    { day: 'Fri', appointments: 28, waiting: 18 },
    { day: 'Sat', appointments: 20, waiting: 12 },
  ];

  // Appointment Categories for Pie Chart
  const appointmentTypesData = [
    { name: 'New Patients', value: 8, color: '#3b82f6' },
    { name: 'Follow-ups', value: 9, color: '#10b981' },
    { name: 'Urgent Cases', value: 4, color: '#ef4444' },
    { name: 'Walk-ins', value: 3, color: '#f59e0b' },
  ];

  // Appointment Status Breakdown
  const appointmentStatus = [
    { label: 'Completed', value: 623, color: 'emerald', percentage: 73 },
    { label: 'Pending', value: 156, color: 'amber', percentage: 18 },
    { label: 'Cancelled', value: 47, color: 'red', percentage: 5 },
    { label: 'No-show', value: 30, color: 'slate', percentage: 4 },
  ];

  const maxRevenue = Math.max(...hourlyData.map(d => d.appointments));

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4`}>
      <div className="max-w-7xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Reception <span className="text-emerald-600">Dashboard</span>
            </h1>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} mt-0.5 text-xs`}>
              Manage appointments and patient flow • <span className="font-medium text-emerald-600">24 appointments today</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-xs font-medium shadow-sm">
              <Plus size={14} /> New Appointment
            </button>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              isDark ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-100'
            }`}>
              <FileDown size={14} /> Export
            </button>
          </div>
        </div>

        {/* KEY PERFORMANCE INDICATORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`rounded-lg border p-4 shadow-sm transition hover:shadow-md ${
                  isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    kpi.color === 'emerald' ? isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                    : kpi.color === 'blue' ? isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                    : kpi.color === 'purple' ? isDark ? 'bg-purple-500/10' : 'bg-purple-50'
                    : isDark ? 'bg-amber-500/10' : 'bg-amber-50'
                  }`}>
                    <Icon size={16} className={`${
                      kpi.color === 'emerald' ? 'text-emerald-600'
                      : kpi.color === 'blue' ? 'text-blue-600'
                      : kpi.color === 'purple' ? 'text-purple-600'
                      : 'text-amber-600'
                    }`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded ${
                    kpi.isPositive
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {kpi.isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    {kpi.trend}
                  </div>
                </div>
                <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {kpi.label}
                </p>
                <p className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {kpi.value}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {kpi.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* PROFESSIONAL CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Hourly Appointments Bar Chart */}
          <div className={`rounded-lg border p-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="mb-4">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Today's Schedule</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Appointments by time slot</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyData}>
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
                <Legend />
                <Bar dataKey="appointments" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Total" />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Appointment Types Pie Chart */}
          <div className={`rounded-lg border p-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="mb-4">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Appointment Types</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Distribution by category</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={appointmentTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WEEKLY TREND LINE CHART */}
        <div className={`rounded-lg border p-4 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="mb-4">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Weekly Appointment Trend</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total appointments vs waiting patients</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyTrend}>
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
              <Area type="monotone" dataKey="appointments" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Total Appointments" />
              <Area type="monotone" dataKey="waiting" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Waiting" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MAIN ANALYTICS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* APPOINTMENT STATUS - LEFT SPAN 2 */}
          <div className={`lg:col-span-2 rounded-lg border p-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Zap size={16} className="text-amber-600" />
              Appointment Status
            </h2>
            <div className="space-y-3">
              {appointmentStatus.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.label}
                    </span>
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.value}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-full rounded-full ${
                        item.color === 'emerald' ? 'bg-emerald-600'
                        : item.color === 'amber' ? 'bg-amber-600'
                        : item.color === 'red' ? 'bg-red-600'
                        : 'bg-slate-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {item.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* APPOINTMENT CATEGORIES - RIGHT */}
          <div className={`rounded-lg border p-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Appointment Types
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {appointmentCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div key={idx} className={`p-2 rounded-lg border text-center ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Icon size={16} className={`${
                      category.color === 'blue' ? 'text-blue-600'
                      : category.color === 'emerald' ? 'text-emerald-600'
                      : category.color === 'red' ? 'text-red-600'
                      : 'text-amber-600'
                    } mx-auto mb-1`} />
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {category.name}
                    </p>
                    <p className={`text-sm font-bold ${
                      category.color === 'blue' ? isDark ? 'text-blue-400' : 'text-blue-600'
                      : category.color === 'emerald' ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                      : category.color === 'red' ? isDark ? 'text-red-400' : 'text-red-600'
                      : isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}>
                      {category.count}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DOCTOR AVAILABILITY */}
        <div className={`rounded-lg border p-4 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Doctor Availability
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className={`text-left py-2 px-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Doctor
                  </th>
                  <th className={`text-left py-2 px-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Status
                  </th>
                  <th className={`text-center py-2 px-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Today
                  </th>
                  <th className={`text-right py-2 px-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Next Break
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctorAvailability.map((doctor, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition`}
                  >
                    <td className={`py-2.5 px-3 font-medium text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {doctor.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        doctor.status === 'Available'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 text-center font-medium text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {doctor.appointments}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-medium text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {doctor.nextBreak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WORKFLOW STAGES */}
        <div>
          <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Patient Flow
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { stage: 'Appointments', count: 24, icon: Calendar, href: '/receptionist/appointments', bgColor: 'from-blue-500 to-blue-600', description: 'Create' },
              { stage: 'Pre-Medical', count: 18, icon: Heart, href: '/receptionist/pre-medical-test', bgColor: 'from-red-500 to-pink-600', description: 'Vitals' },
              { stage: 'Patient Queue', count: 12, icon: ArrowRight, href: '/receptionist/patient-queue', bgColor: 'from-amber-500 to-orange-600', description: 'Doctor' },
              { stage: 'Medicines', count: 8, icon: Pill, href: '/receptionist/medicine-dispensing', bgColor: 'from-emerald-500 to-green-600', description: 'Dispense' },
            ].map((workflow, i) => {
              const Icon = workflow.icon;
              return (
                <Link
                  key={i}
                  href={workflow.href}
                  className={`group rounded-lg border shadow-sm transition hover:shadow-md overflow-hidden ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className={`h-12 bg-gradient-to-br ${workflow.bgColor} opacity-90 group-hover:opacity-100 transition relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition" />
                  </div>
                  <div className={`p-3 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <Icon size={16} className="text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                      <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {workflow.count}
                      </span>
                    </div>
                    <h3 className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {workflow.stage}
                    </h3>
                    <p className="text-xs text-slate-500">{workflow.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}