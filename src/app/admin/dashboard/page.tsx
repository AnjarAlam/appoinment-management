'use client';

import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Clock, DollarSign, MoreHorizontal, ArrowUpRight, 
  ArrowDownRight, TrendingUp, Search, Plus, Download, Bell, CheckCircle2, 
  UserPlus 
} from 'lucide-react';

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [chartHeights, setChartHeights] = useState([42, 58, 51, 73, 68, 82]);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Seed Data - Monthly New Registrations
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const registrationsData = [124, 156, 142, 189, 203, 231];

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    if (savedTheme) setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Dynamic & Smooth Chart Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setChartHeights(prev => 
        prev.map((h, i) => {
          const target = registrationsData[i];
          return Math.max(40, Math.min(95, h + (target - h) * 0.22)); // Faster & smoother animation
        })
      );
      setLastUpdated(new Date());
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { title: 'Total Doctors', value: '248', trend: '+8%', change: 'positive', icon: Users, subtitle: '18 onboarded this month' },
    { title: 'Receptionists', value: '47', trend: '+2%', change: 'positive', icon: UserCheck, subtitle: '4 new this month' },
    { title: 'Total Patients', value: '12,847', trend: '+14%', change: 'positive', icon: UserPlus, subtitle: '1,240 registered this month' },
    { title: 'Active Therapies', value: '392', trend: '-3%', change: 'negative', icon: Clock, subtitle: 'Today’s sessions' },
    { title: 'Monthly Revenue', value: '$1.84M', trend: '+11%', change: 'positive', icon: DollarSign, highlighted: true, subtitle: 'Profit: $428K' },
  ];

  const allRecords = [
    { id: 'DR-124', name: 'Dr. Priya Sharma', role: 'Cardiologist', location: 'Mumbai', date: 'Oct 24, 2025', status: 'ACTIVE' as const },
    { id: 'RC-089', name: 'Anjali Verma', role: 'Receptionist', location: 'Delhi', date: 'Oct 23, 2025', status: 'ACTIVE' as const },
    { id: 'PT-7842', name: 'Rahul Mehta', role: 'Patient', location: 'Bangalore', date: 'Oct 22, 2025', status: 'PENDING' as const },
    { id: 'DR-137', name: 'Dr. Sameer Khan', role: 'Orthopedic', location: 'Hyderabad', date: 'Oct 20, 2025', status: 'ACTIVE' as const },
    { id: 'PT-7921', name: 'Sneha Patel', role: 'Patient', location: 'Chennai', date: 'Oct 19, 2025', status: 'ACTIVE' as const },
    { id: 'RC-092', name: 'Vikram Singh', role: 'Receptionist', location: 'Pune', date: 'Oct 18, 2025', status: 'PENDING' as const },
  ];

  const filteredRecords = allRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-4">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Welcome back, <span className="text-emerald-600">Administrator</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-500 mt-0.5 text-xs">
                  Clinic network running smoothly • <span className="font-medium text-emerald-600">14% growth</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm">
                  <Plus size={16} /> Add New
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {metrics.map((metric, i) => {
                const Icon = metric.icon;
                const isPositive = metric.change === 'positive';
                return (
                  <div
                    key={i}
                    className={`group rounded-3xl p-4 border transition-all duration-300 transform will-change-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl ${metric.highlighted 
                      ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200 dark:from-emerald-950 dark:border-emerald-900' 
                      : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:shadow-md hover:from-white hover:to-emerald-50 hover:border-emerald-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition ${metric.highlighted ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 group-hover:text-emerald-700 group-hover:scale-105'}`}>
                        <Icon size={20} />
                      </div>
                      <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        {metric.trend}
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">{metric.title}</p>
                      <p className={`text-3xl font-semibold tracking-tighter mt-2 ${metric.highlighted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {metric.value}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{metric.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Registrations Trend Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-semibold text-xl text-slate-900 dark:text-white">Registrations Trend</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Monthly new registrations (Doctors + Patients + Staff)</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-5 py-2 rounded-3xl text-sm font-medium">
                    <TrendingUp size={20} /> +14.8% this quarter
                  </div>
                </div>

                <div className="h-56 px-2 relative">
                  {/* Responsive SVG line + area chart */}
                  <svg viewBox="0 0 600 240" preserveAspectRatio="none" className="w-full h-56">
                    <defs>
                      <linearGradient id="gradArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="gradLine" x1="0" x2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>

                    {
                      (() => {
                        const W = 600;
                        const H = 200;
                        const paddingX = 40;
                        const paddingY = 20;
                        const maxVal = Math.max(...registrationsData, 1);
                        const stepX = (W - paddingX * 2) / Math.max(months.length - 1, 1);

                        const points = registrationsData.map((val, idx) => {
                          const x = paddingX + idx * stepX;
                          const y = paddingY + (H - paddingY * 2) * (1 - val / maxVal);
                          return { x, y, val };
                        });

                        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                        const areaPath = `${linePath} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

                        return (
                          <g>
                            <path d={areaPath} fill="url(#gradArea)" />
                            <path d={linePath} stroke="url(#gradLine)" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

                            {points.map((p, i) => (
                              <g key={i}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={hoveredBar === i ? 6 : 4}
                                  fill={hoveredBar === i ? '#10b981' : '#34d399'}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredBar(i)}
                                  onMouseLeave={() => setHoveredBar(null)}
                                />
                              </g>
                            ))}
                          </g>
                        );
                      })()
                    }
                  </svg>

                  {/* Tooltip */}
                  {hoveredBar !== null && (
                    <div className="absolute z-40 -translate-x-1/2" style={{ left: `${(hoveredBar / Math.max(months.length - 1, 1)) * 100}%`, top: '4.8rem' }}>
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-2xl text-sm shadow-lg whitespace-nowrap">
                        {registrationsData[hoveredBar]} New Registrations
                      </div>
                    </div>
                  )}

                  {/* X-axis labels */}
                  <div className="mt-3 grid grid-cols-6 text-[11px] text-slate-500 dark:text-slate-400">
                    {months.map((m, i) => (
                      <div key={m} className="text-center font-medium">{m}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Panels */}
                <div className="xl:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Today’s Active</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Doctors On Duty', perc: 87 },
                      { label: 'Patients Checked In', perc: 76 },
                      { label: 'Therapy Sessions', perc: 92 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{item.perc}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000" style={{ width: `${item.perc}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Activity</h3>
                    <Bell size={20} className="text-slate-400" />
                  </div>
                  <div className="space-y-5">
                    {[
                      { time: '3m ago', action: 'New doctor registered', name: 'Dr. Priya Sharma' },
                      { time: '18m ago', action: 'New patient registered', name: 'Rahul Mehta' },
                      { time: '42m ago', action: 'Therapy session booked', name: 'Physiotherapy Dept' },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 text-sm transition-all hover:translate-x-1">
                        <div className="text-xs text-slate-400 whitespace-nowrap w-14 pt-0.5">{act.time}</div>
                        <div>
                          <p className="text-slate-700 dark:text-slate-300">{act.action}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{act.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <h3 className="font-semibold text-xl text-slate-900 dark:text-white">Recent Registrations</h3>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by name or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-400 rounded-3xl text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-3xl p-1">
                    {['ALL', 'ACTIVE', 'PENDING'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f as any)}
                        className={`px-5 py-2.5 text-sm font-medium rounded-3xl transition-all ${
                          statusFilter === f ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button className="px-3 py-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-3xl transition-all text-sm">
                    <Download size={18} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">ID / Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Location</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Joined</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-200 group">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{record.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{record.id}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">{record.role}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{record.location}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm">{record.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-3xl text-xs font-medium ${
                            record.status === 'ACTIVE' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                          }`}>
                            {record.status === 'ACTIVE' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-slate-400 group-hover:text-slate-600 transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
  );
}