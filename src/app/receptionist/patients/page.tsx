'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, User, Phone, Mail } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  status: 'active' | 'inactive' | 'pending';
  lastVisit?: string;
}

export default function ReceptionPatients() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      age: 35,
      gender: 'M',
      bloodGroup: 'O+',
      status: 'active',
      lastVisit: '2026-04-10',
    },
    {
      id: 2,
      name: 'Anjali Patel',
      email: 'anjali@email.com',
      phone: '+91 99876 54321',
      age: 28,
      gender: 'F',
      bloodGroup: 'B+',
      status: 'active',
      lastVisit: '2026-04-05',
    },
    {
      id: 3,
      name: 'Amit Desai',
      email: 'amit@email.com',
      phone: '+91 97654 32109',
      age: 42,
      gender: 'M',
      bloodGroup: 'A+',
      status: 'pending',
      lastVisit: '2026-03-20',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    bloodGroup: string;
    status: 'pending' | 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    phone: '',
    age: 0,
    gender: 'M',
    bloodGroup: 'O+',
    status: 'pending',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClick = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: 0,
      gender: 'M',
      bloodGroup: 'O+',
      status: 'pending',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      status: patient.status,
    });
    setEditingId(patient.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    if (editingId) {
      setPatients(patients.map((p) =>
        p.id === editingId ? { ...p, ...formData } : p
      ));
    } else {
      setPatients([...patients, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'inactive':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className={`flex-1 overflow-auto transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`p-6`}>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Patient Registry
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage and register patient records
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all
                ${isDark
                  ? 'bg-slate-800 border border-slate-700 focus:border-blue-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-500'
                }`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-medium focus:outline-none transition-all
              ${isDark
                ? 'bg-slate-800 border border-slate-700 text-slate-100'
                : 'bg-white border border-slate-200 text-slate-900'
              }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Register Patient
          </button>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`rounded-2xl border p-4 transition-all hover:shadow-lg ${
                isDark
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    patient.gender === 'M' ? 'bg-blue-600' : 'bg-pink-600'
                  }`}>
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {patient.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(patient.status)}`}>
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Mail size={14} />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Phone size={14} />
                  <span>{patient.phone}</span>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <User size={14} />
                  <span>Blood: <span className="font-semibold text-red-600">{patient.bloodGroup}</span></span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
                <button
                  onClick={() => handleEdit(patient)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isDark
                      ? 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                      : 'bg-slate-100 text-blue-600 hover:bg-slate-200'
                  }`}
                >
                  <Edit2 size={14} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isDark
                      ? 'bg-slate-800 text-red-400 hover:bg-slate-700'
                      : 'bg-slate-100 text-red-600 hover:bg-slate-200'
                  }`}
                >
                  <Trash2 size={14} className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`rounded-3xl shadow-2xl p-6 w-96 border transition-all max-h-96 overflow-y-auto ${
            isDark
              ? 'bg-slate-950 border-slate-800'
              : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {editingId ? 'Edit Patient' : 'Register Patient'}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-all
                  ${isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                  }`}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${isDark
                    ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                {editingId ? 'Update' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
