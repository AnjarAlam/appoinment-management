'use client';

import { useEffect, useState } from 'react';
import {
  UserCog,
  Plus,
  Building2,
  Users,
  Trash2,
  Edit2,
  Search,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [isDark, setIsDark] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Assignment KPIs - Enhanced
  const kpis = [
    {
      title: 'Total Assignments',
      value: '3,420',
      trend: '+15.2%',
      isPositive: true,
      icon: UserCog,
      color: 'emerald',
      details: '↑ 512 new this month',
    },
    {
      title: 'Active Assignments',
      value: '3,245',
      trend: '+12.8%',
      isPositive: true,
      icon: CheckCircle2,
      color: 'emerald',
      details: '✓ All running smoothly',
    },
    {
      title: 'Pending Setup',
      value: '156',
      trend: '-5.3%',
      isPositive: true,
      icon: Clock,
      color: 'amber',
      details: '⏳ 23 awaiting approval',
    },
    {
      title: 'Multi-Assigned Admins',
      value: '428',
      trend: '+8.1%',
      isPositive: true,
      icon: Users,
      color: 'blue',
      details: '↑ 34 new this week',
    },
  ];

  // Sample assignments data
  const assignments = [
    { id: 1, admin: 'Dr. Rajesh Kumar', hospital: 'Surya Medical Centre', role: 'Primary Admin', startDate: 'Jan 15, 2026', status: 'Active', permissions: 'Full Access' },
    { id: 2, admin: 'Dr. Priya Sharma', hospital: 'Kerala Ayurveda Bhavan', role: 'Primary Admin', startDate: 'Jan 12, 2026', status: 'Active', permissions: 'Full Access' },
    { id: 3, admin: 'Dr. Amit Desai', hospital: 'Lotus Health Hub', role: 'Primary Admin', startDate: 'Jan 20, 2026', status: 'Pending', permissions: 'Limited Access' },
    { id: 4, admin: 'Dr. Vikram Singh', hospital: 'Himalayan Wellness Centre', role: 'Primary Admin', startDate: 'Jan 18, 2026', status: 'Active', permissions: 'Full Access' },
    { id: 5, admin: 'Dr. Sarah Ahmed', hospital: 'Metro Health Solutions', role: 'Primary Admin', startDate: 'Jan 22, 2026', status: 'Active', permissions: 'Full Access' },
    { id: 6, admin: 'Dr. Rajesh Kumar', hospital: 'Metro Health Solutions', role: 'Secondary Admin', startDate: 'Feb 01, 2026', status: 'Active', permissions: 'Limited Access' },
  ];

  const filteredAssignments = assignments.filter(assignment =>
    assignment.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserCog size={20} className="text-emerald-600" />
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Admin-Hospital Assignments
              </h1>
            </div>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} text-xs`}>
              Manage administrator assignments and hospital allocations across the network
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-xs font-semibold shadow-sm hover:shadow-md">
            <Plus size={16} /> New Assignment
          </button>
        </div>

        {/* KPI CARDS - ENHANCED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            const bgColor = {
              emerald: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
              amber: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
              blue: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
            }[stat.color];
            const textColor = {
              emerald: 'text-emerald-600',
              amber: 'text-amber-600',
              blue: 'text-blue-600',
            }[stat.color];

            return (
              <div
                key={i}
                className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-lg ${bgColor}`}>
                    <Icon size={20} className={textColor} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.isPositive
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.isPositive ? '↑' : '↓'} {stat.trend}
                  </span>
                </div>
                <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stat.details}
                </p>
              </div>
            );
          })}
        </div>

        {/* SEARCH & FILTERS */}
        <div className={`rounded-xl border p-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="relative">
            <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search assignments by administrator or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 focus:border-emerald-600 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* ASSIGNMENTS TABLE */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Assignments ({filteredAssignments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Administrator</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}></th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Hospital</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Role</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Permissions</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <td className={`py-3 px-5 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {assignment.admin}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <ArrowRight size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    </td>
                    <td className={`py-3 px-5 font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Building2 size={14} /> {assignment.hospital}
                    </td>
                    <td className={`py-3 px-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        assignment.role === 'Primary Admin'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          : isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {assignment.role}
                      </span>
                    </td>
                    <td className={`py-3 px-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {assignment.permissions}
                    </td>
                    <td className={`py-3 px-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {assignment.startDate}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        assignment.status === 'Active'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {assignment.status === 'Active' ? '● Active' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/10 transition" title="Delete">
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

      {/* NEW ASSIGNMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="p-6 border-b sticky top-0 z-10" style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}>
              <div className="flex items-center gap-2 mb-1">
                <UserCog size={20} className="text-emerald-600" />
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Assignment</h2>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Link an administrator to a hospital</p>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select Administrator *</label>
                <select className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900'}`}>
                  <option>Select Administrator</option>
                  <option>Dr. Rajesh Kumar</option>
                  <option>Dr. Priya Sharma</option>
                  <option>Dr. Amit Desai</option>
                  <option>Dr. Vikram Singh</option>
                  <option>Dr. Sarah Ahmed</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select Hospital *</label>
                <select className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900'}`}>
                  <option>Select Hospital</option>
                  <option>Surya Medical Centre</option>
                  <option>Kerala Ayurveda Bhavan</option>
                  <option>Lotus Health Hub</option>
                  <option>Himalayan Wellness Centre</option>
                  <option>Metro Health Solutions</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Assignment Role *</label>
                <select className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900'}`}>
                  <option>Primary Admin</option>
                  <option>Secondary Admin</option>
                  <option>Manager</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Permission Level *</label>
                <select className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900'}`}>
                  <option>Full Access</option>
                  <option>Limited Access</option>
                  <option>View Only</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Notes (Optional)</label>
                <textarea placeholder="Add notes about this assignment..." rows={3} className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900'}`} />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
