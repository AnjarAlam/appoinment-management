'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Key Statistics
  const stats = [
    {
      label: 'Total Revenue',
      value: '$45,231',
      change: '+18.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      label: 'Active Patients',
      value: '1,247',
      change: '+12.3%',
      isPositive: true,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Total Appointments',
      value: '856',
      change: '+8.2%',
      isPositive: true,
      icon: Calendar,
      color: 'cyan',
    },
    {
      label: 'Avg. Rating',
      value: '4.8/5',
      change: '+0.3',
      isPositive: true,
      icon: Activity,
      color: 'amber',
    },
  ];

  // Monthly Revenue Data
  const monthlyRevenue = [
    { month: 'Jan', value: 32000 },
    { month: 'Feb', value: 38000 },
    { month: 'Mar', value: 42000 },
    { month: 'Apr', value: 45231 },
    { month: 'May', value: 48000 },
    { month: 'Jun', value: 51000 },
  ];

  // Appointment Status
  const appointmentStatus = [
    { status: 'Completed', count: 623, color: 'emerald', icon: CheckCircle },
    { status: 'Pending', count: 156, color: 'amber', icon: Clock },
    { status: 'Cancelled', count: 47, color: 'red', icon: AlertCircle },
  ];

  // Top Services
  const topServices = [
    { name: 'General Check-up', count: 245, percentage: 35, growth: '+12%' },
    { name: 'Abhyanga Therapy', count: 189, percentage: 27, growth: '+8%' },
    { name: 'Consultation', count: 156, percentage: 22, growth: '+15%' },
    { name: 'Follow-up', count: 111, percentage: 16, growth: '+5%' },
  ];

  // Doctor Performance
  const doctorPerformance = [
    { name: 'Dr. Ahmed Khan', rating: 4.8, patients: 156, revenue: '$12,450', growth: '+18%' },
    { name: 'Dr. Sarah Ahmed', rating: 4.6, patients: 124, revenue: '$9,860', growth: '+12%' },
    { name: 'Dr. Hassan Ali', rating: 4.7, patients: 98, revenue: '$7,920', growth: '+8%' },
  ];

  // Patient Demographics
  const demographics = [
    { group: 'Age 18-25', count: 124, percentage: 10 },
    { group: 'Age 26-35', count: 372, percentage: 30 },
    { group: 'Age 36-50', count: 496, percentage: 40 },
    { group: 'Age 50+', count: 255, percentage: 20 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analytics & Reports
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Clinic performance, patient metrics, and financial insights
          </p>
        </div>

        {/* KEY STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`rounded-lg border p-5 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                } transition`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      stat.color === 'emerald'
                        ? isDark
                          ? 'bg-emerald-500/10'
                          : 'bg-emerald-50'
                        : stat.color === 'blue'
                          ? isDark
                            ? 'bg-blue-500/10'
                            : 'bg-blue-50'
                          : stat.color === 'cyan'
                            ? isDark
                              ? 'bg-cyan-500/10'
                              : 'bg-cyan-50'
                            : isDark
                              ? 'bg-amber-500/10'
                              : 'bg-amber-50'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`${
                        stat.color === 'emerald'
                          ? 'text-emerald-600'
                          : stat.color === 'blue'
                            ? 'text-blue-600'
                            : stat.color === 'cyan'
                              ? 'text-cyan-600'
                              : 'text-amber-600'
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                      stat.isPositive
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-emerald-100 text-emerald-700'
                        : isDark
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {stat.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {stat.change}
                  </div>
                </div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* REVENUE CHART */}
          <div
            className={`lg:col-span-2 rounded-lg border p-6 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <BarChart3 size={20} className="text-blue-600" />
              Monthly Revenue Trend
            </h2>
            <div className="space-y-4">
              {monthlyRevenue.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.month}
                    </span>
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${(item.value / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                      style={{ width: `${(item.value / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* APPOINTMENT STATUS */}
          <div
            className={`rounded-lg border p-6 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <PieChart size={20} className="text-emerald-600" />
              Appointment Status
            </h2>
            <div className="space-y-3">
              {appointmentStatus.map((item, idx) => {
                const Icon = item.icon;
                const total = appointmentStatus.reduce((sum, s) => sum + s.count, 0);
                const percentage = ((item.count / total) * 100).toFixed(1);
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          size={16}
                          className={
                            item.color === 'emerald'
                              ? 'text-emerald-600'
                              : item.color === 'amber'
                                ? 'text-amber-600'
                                : 'text-red-600'
                          }
                        />
                        <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {item.status}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.count}
                      </span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-slate-800' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          item.color === 'emerald'
                            ? 'bg-emerald-600'
                            : item.color === 'amber'
                              ? 'bg-amber-600'
                              : 'bg-red-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {percentage}% of total
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* TOP SERVICES */}
          <div
            className={`rounded-lg border p-6 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Top Services
            </h2>
            <div className="space-y-4">
              {topServices.map((service, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {idx + 1}. {service.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {service.count} bookings
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {service.growth}
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-700' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PATIENT DEMOGRAPHICS */}
          <div
            className={`rounded-lg border p-6 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Patient Demographics
            </h2>
            <div className="space-y-4">
              {demographics.map((demo, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {demo.group}
                    </span>
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {demo.count}
                    </span>
                  </div>
                  <div
                    className={`w-full h-3 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-blue-600'
                          : idx === 1
                            ? 'bg-cyan-600'
                            : idx === 2
                              ? 'bg-emerald-600'
                              : 'bg-purple-600'
                      }`}
                      style={{ width: `${demo.percentage}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {demo.percentage}% of patients
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DOCTOR PERFORMANCE */}
        <div
          className={`rounded-lg border p-6 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Doctor Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Doctor Name
                  </th>
                  <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Rating
                  </th>
                  <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Patients
                  </th>
                  <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Revenue
                  </th>
                  <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctorPerformance.map((doctor, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition`}
                  >
                    <td className={`py-3 px-4 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {doctor.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                        ⭐ {doctor.rating}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {doctor.patients}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {doctor.revenue}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {doctor.growth}
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
