'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Users,
  Phone,
  Mail,
  Trash2,
  Edit2,
  Search,
  Globe,
  Star,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function HospitalManagementPage() {
  const [isDark, setIsDark] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Hospital KPIs - Enhanced
  const kpis = [
    {
      title: 'Total Hospitals',
      value: '1,284',
      trend: '+12.3%',
      isPositive: true,
      icon: Building2,
      color: 'blue',
      details: '↑ 156 new this month',
    },
    {
      title: 'Active Facilities',
      value: '1,198',
      trend: '+8.5%',
      isPositive: true,
      icon: Activity,
      color: 'emerald',
      details: '↓ 86 in maintenance',
    },
    {
      title: 'Total Healthcare Staff',
      value: '42.8K',
      trend: '+18.2%',
      isPositive: true,
      icon: Users,
      color: 'purple',
      details: '↑ 7.8K new hires',
    },
    {
      title: 'Avg Patient Satisfaction',
      value: '4.6/5',
      trend: '+0.3',
      isPositive: true,
      icon: Star,
      color: 'amber',
      details: '✓ 94% satisfied',
    },
  ];

  // Sample hospitals data
  const hospitals = [
    {
      id: 1,
      name: 'Surya Medical Centre',
      location: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      contact: '+91 98765 43210',
      email: 'info@suryamedical.com',
      admin: 'Dr. Rajesh Kumar',
      staff: '245',
      status: 'Active',
      rating: '4.8',
      established: '2018',
    },
    {
      id: 2,
      name: 'Kerala Ayurveda Bhavan',
      location: 'Kochi, Kerala',
      city: 'Kochi',
      contact: '+91 98765 43211',
      email: 'info@keralaayurveda.com',
      admin: 'Dr. Priya Sharma',
      staff: '189',
      status: 'Active',
      rating: '4.7',
      established: '2015',
    },
    {
      id: 3,
      name: 'Lotus Health Hub',
      location: 'Bangalore, Karnataka',
      city: 'Bangalore',
      contact: '+91 98765 43212',
      email: 'info@lotushealth.com',
      admin: 'Dr. Amit Desai',
      staff: '312',
      status: 'Inactive',
      rating: '4.5',
      established: '2019',
    },
    {
      id: 4,
      name: 'Himalayan Wellness Centre',
      location: 'Delhi, Delhi',
      city: 'Delhi',
      contact: '+91 98765 43213',
      email: 'info@himalayan.com',
      admin: 'Dr. Vikram Singh',
      staff: '267',
      status: 'Active',
      rating: '4.6',
      established: '2016',
    },
    {
      id: 5,
      name: 'Metro Health Solutions',
      location: 'Pune, Maharashtra',
      city: 'Pune',
      contact: '+91 98765 43214',
      email: 'info@metrohealth.com',
      admin: 'Dr. Sarah Ahmed',
      staff: '198',
      status: 'Active',
      rating: '4.9',
      established: '2020',
    },
  ];

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={20} className="text-blue-600" />
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hospital Management
              </h1>
            </div>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} text-xs`}>
              Add, manage and monitor all hospitals across the healthcare network
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-semibold shadow-sm hover:shadow-md">
            <Plus size={16} /> Add Hospital
          </button>
        </div>

        {/* KPI CARDS - ENHANCED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            const bgColor = {
              blue: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
              emerald: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
              purple: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
              amber: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            }[stat.color];
            const textColor = {
              blue: 'text-blue-600',
              emerald: 'text-emerald-600',
              purple: 'text-purple-600',
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
              placeholder="Search hospitals by name, location or administrator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* HOSPITALS TABLE */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Hospitals ({filteredHospitals.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Hospital</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Location</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Contact</th>
                  <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Administrator</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Staff</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Rating</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                  <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <td className={`py-3 px-5 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {hospital.name}
                    </td>
                    <td className={`py-3 px-5 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <MapPin size={14} /> {hospital.location}
                    </td>
                    <td className={`py-3 px-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} /> {hospital.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} /> {hospital.contact}
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-5 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {hospital.admin}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {hospital.staff}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="flex items-center justify-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" /> {hospital.rating}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        hospital.status === 'Active'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          : isDark ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {hospital.status === 'Active' ? '● Active' : '● Inactive'}
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

      {/* ADD HOSPITAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="p-6 border-b sticky top-0 z-10" style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}>
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={20} className="text-blue-600" />
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add New Hospital</h2>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Register a new healthcare facility</p>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Hospital Name *</label>
                <input type="text" placeholder="Hospital Name" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Location / City *</label>
                <input type="text" placeholder="City, State" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address *</label>
                <input type="email" placeholder="hospital@email.com" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number *</label>
                <input type="tel" placeholder="+91 98765 43210" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Website URL</label>
                <input type="url" placeholder="https://example.com" className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'}`} />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                  Add Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
