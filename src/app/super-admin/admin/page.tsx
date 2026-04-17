'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Building2,
  Trash2,
  Edit2,
  Search,
  Eye,
  EyeOff,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminManagementPage() {
  const [isDark, setIsDark] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Admin KPIs - Enhanced
  const kpis = [
    {
      title: 'Total Administrators',
      value: '3,420',
      trend: '+8.5%',
      isPositive: true,
      icon: Users,
      color: 'purple',
      details: '↑ 285 new this month',
    },
    {
      title: 'Currently Online',
      value: '2,847',
      trend: '+5.2%',
      isPositive: true,
      icon: CheckCircle2,
      color: 'emerald',
      details: '↑ 142 online this hour',
    },
    {
      title: 'Hospitals Managed',
      value: '1,284',
      trend: '+12.3%',
      isPositive: true,
      icon: Building2,
      color: 'blue',
      details: '↑ 156 new hospitals',
    },
    {
      title: 'Onboarding Queue',
      value: '156',
      trend: '-3.1%',
      isPositive: true,
      icon: Clock,
      color: 'amber',
      details: '↓ 8 completed today',
    },
  ];

  // Sample admins data
  const admins = [
    { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh@clinic.com', phone: '+91 98765 43210', hospital: 'Surya Medical Centre', status: 'Active', joinDate: 'Jan 15, 2026' },
    { id: 2, name: 'Dr. Priya Sharma', email: 'priya@clinic.com', phone: '+91 98765 43211', hospital: 'Kerala Ayurveda', status: 'Active', joinDate: 'Jan 12, 2026' },
    { id: 3, name: 'Dr. Amit Desai', email: 'amit@clinic.com', phone: '+91 98765 43212', hospital: 'Lotus Health Hub', status: 'Pending', joinDate: 'Jan 20, 2026' },
    { id: 4, name: 'Dr. Vikram Singh', email: 'vikram@clinic.com', phone: '+91 98765 43213', hospital: 'Himalayan Wellness', status: 'Active', joinDate: 'Jan 18, 2026' },
    { id: 5, name: 'Dr. Sarah Ahmed', email: 'sarah@clinic.com', phone: '+91 98765 43214', hospital: 'Metro Health', status: 'Active', joinDate: 'Jan 22, 2026' },
  ];

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-purple-600" />
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Administrator Management
              </h1>
            </div>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} text-xs`}>
              Create, manage and assign system administrators to hospitals
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition text-xs font-semibold shadow-sm hover:shadow-md">
            <Plus size={16} /> Create Admin
          </button>
        </div>

        {/* KPI CARDS - ENHANCED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            const bgColor = {
              purple: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
              emerald: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
              blue: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
              amber: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            }[stat.color];
            const textColor = {
              purple: 'text-purple-600',
              emerald: 'text-emerald-600',
              blue: 'text-blue-600',
              amber: 'text-amber-600',
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
              placeholder="Search administrators by name, email or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 focus:border-purple-600 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* ADMINS TABLE */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Administrators ({filteredAdmins.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Administrator</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Contact</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Assigned Hospital</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Join Date</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <td className={`py-3 px-5 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {admin.name}
                    </td>
                    <td className={`py-3 px-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} /> {admin.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} /> {admin.phone}
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-5 font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Building2 size={14} /> {admin.hospital}
                    </td>
                    <td className={`py-3 px-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {admin.joinDate}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        admin.status === 'Active'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {admin.status === 'Active' ? '● Active' : '⏳ Pending'}
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

      {/* CREATE ADMIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="p-6 border-b sticky top-0 z-10" style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={20} className="text-purple-600" />
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Administrator</h2>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Add a new system administrator</p>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name *</label>
                <input type="text" placeholder="Dr. Name" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-purple-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address *</label>
                <input type="email" placeholder="admin@clinic.com" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-purple-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number *</label>
                <input type="tel" placeholder="+91 98765 43210" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-purple-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-purple-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900'}`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Assign Hospital *</label>
                <select className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-purple-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900'}`}>
                  <option>Select Hospital</option>
                  <option>Surya Medical Centre</option>
                  <option>Kerala Ayurveda Bhavan</option>
                  <option>Lotus Health Hub</option>
                  <option>Himalayan Wellness</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition">
                  Create Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
