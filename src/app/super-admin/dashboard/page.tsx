'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  Activity,
  AlertCircle,
  Crown,
  LineChart as LineChartIcon,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function SuperAdminDashboard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Enhanced KPI data
  const kpis = [
    {
      title: 'Total Hospitals',
      value: '1,284',
      change: '+12.5%',
      period: 'vs last month',
      icon: Building2,
      color: 'blue',
      bgColor: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      textColor: 'text-blue-600',
      details: '↑ 156 new hospitals',
    },
    {
      title: 'Active Administrators',
      value: '3,420',
      change: '+8.3%',
      period: 'vs last month',
      icon: Users,
      color: 'purple',
      bgColor: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
      textColor: 'text-purple-600',
      details: '↓ 12 inactive this week',
    },
    {
      title: 'System Users',
      value: '42.8K',
      change: '+18.2%',
      period: 'vs last month',
      icon: Activity,
      color: 'emerald',
      bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      textColor: 'text-emerald-600',
      details: '↑ 7.8K new users',
    },
    {
      title: 'Network Health',
      value: '99.8%',
      change: '+0.2%',
      period: 'uptime',
      icon: TrendingUp,
      color: 'amber',
      bgColor: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      textColor: 'text-amber-600',
      details: '✓ All systems operational',
    },
  ];

  // Network growth data
  const networkGrowthData = [
    { month: 'Jan', hospitals: 1100, admins: 3100, users: 38000 },
    { month: 'Feb', hospitals: 1150, admins: 3250, users: 39500 },
    { month: 'Mar', hospitals: 1200, admins: 3350, users: 40800 },
    { month: 'Apr', hospitals: 1240, admins: 3420, users: 42800 },
    { month: 'May', hospitals: 1250, admins: 3380, users: 42500 },
    { month: 'Jun', hospitals: 1284, admins: 3420, users: 43200 },
  ];

  // Regional distribution
  const regionData = [
    { name: 'North India', value: 325, color: '#3b82f6' },
    { name: 'South India', value: 420, color: '#10b981' },
    { name: 'East India', value: 285, color: '#f59e0b' },
    { name: 'West India', value: 254, color: '#8b5cf6' },
  ];

  // Performance metrics
  const performanceMetrics = [
    { metric: 'Avg Response Time', value: '142ms', status: 'Excellent', trend: '↓ 8ms' },
    { metric: 'API Success Rate', value: '99.95%', status: 'Excellent', trend: '↑ 0.05%' },
    { metric: 'Database Load', value: '42%', status: 'Good', trend: '↑ 2%' },
    { metric: 'Memory Usage', value: '58%', status: 'Good', trend: '↓ 3%' },
  ];

  // Recent hospitals
  const recentHospitals = [
    { id: 1, name: 'Surya Medical Centre', location: 'Mumbai, MH', admin: 'Dr. Rajesh Kumar', users: 2456, status: 'Active', lastUpdated: '2 hours ago' },
    { id: 2, name: 'Kerala Ayurveda Bhavan', location: 'Kochi, KL', admin: 'Dr. Priya Sharma', users: 1823, status: 'Active', lastUpdated: '5 hours ago' },
    { id: 3, name: 'Lotus Health Hub', location: 'Bangalore, KA', admin: 'Dr. Amit Desai', users: 3124, status: 'Inactive', lastUpdated: '1 day ago' },
    { id: 4, name: 'Himalayan Wellness', location: 'Delhi, DL', admin: 'Dr. Vikram Singh', users: 2789, status: 'Active', lastUpdated: '3 hours ago' },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Crown className="text-purple-600" size={20} />
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              System Dashboard
            </h1>
          </div>
          <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} text-xs`}>
            Welcome back! Here's your healthcare network overview
          </p>
        </div>

        {/* KPI CARDS - ENHANCED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <Icon size={20} className={stat.textColor} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <div className="flex justify-between items-center">
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {stat.period}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    {stat.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Network Growth Chart - Takes 2 columns */}
          <div className={`lg:col-span-2 rounded-xl border p-6 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <LineChartIcon size={18} className="text-blue-600" />
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Network Growth Trend
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={networkGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis stroke={isDark ? '#94a3b8' : '#64748b'} style={{ fontSize: '12px' }} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="hospitals" stroke="#3b82f6" strokeWidth={2} name="Hospitals" />
                <Line type="monotone" dataKey="admins" stroke="#10b981" strokeWidth={2} name="Administrators" />
                <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={2} name="Total Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Distribution Chart */}
          <div className={`rounded-xl border p-6 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-emerald-600" />
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Regional Distribution
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {regionData.map((region, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{region.name}</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{region.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className={`rounded-xl border p-6 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            System Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, i) => (
              <div key={i} className={`rounded-lg p-4 border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {metric.metric}
                </p>
                <p className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {metric.value}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    metric.status === 'Excellent'
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {metric.status}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT HOSPITALS */}
        <div className={`rounded-xl border p-6 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recently Updated Hospitals
          </h3>
          <div className="space-y-3">
            {recentHospitals.map((hospital) => (
              <div key={hospital.id} className={`rounded-lg p-4 border flex justify-between items-center ${
                isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              } transition-colors`}>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {hospital.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {hospital.location} • Managed by {hospital.admin}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {hospital.users}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      users
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    hospital.status === 'Active'
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {hospital.status === 'Active' ? '● Active' : '● Inactive'}
                  </span>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {hospital.lastUpdated}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
