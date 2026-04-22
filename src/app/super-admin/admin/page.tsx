'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Trash2,
  Edit2,
  Search,
  Shield,
  AlertCircle,
  Loader,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useAdminUserStore, AdminUser } from '@/store/admin_user_store_api';

export default function AdminManagementPage() {
  const [isDark, setIsDark] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | ''>('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Get store
  const {
    adminUsers,
    totalItems,
    totalPages,
    loading,
    error,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminUserStatus,
  } = useAdminUserStore();

  // Form state - matching backend response fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    isSystemAdmin: false,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Fetch admin users on load and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        isActive: statusFilter !== '' ? statusFilter : undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, statusFilter, fetchAdminUsers]);

  // Handle create
  const handleCreate = async () => {
    if (!formData.name || !formData.email) {
      setErrorMsg('Please fill in all required fields');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    try {
      await createAdminUser({
        name: formData.name,
        email: formData.email,
        isAdmin: formData.isAdmin,
        isSystemAdmin: formData.isSystemAdmin,
      });
      setSuccessMsg('✅ Admin user created successfully!');
      setFormData({ name: '', email: '', isAdmin: false, isSystemAdmin: false });
      setShowModal(false);
      setCurrentPage(1);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to create admin user');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await updateAdminUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        isAdmin: formData.isAdmin,
        isSystemAdmin: formData.isSystemAdmin,
      });
      setSuccessMsg('✅ Admin user updated successfully!');
      setFormData({ name: '', email: '', isAdmin: false, isSystemAdmin: false });
      setShowEditModal(false);
      setEditingUser(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to update admin user');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this admin user? This action cannot be undone.')) {
      try {
        await deleteAdminUser(id);
        setSuccessMsg('✅ Admin user deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (error: any) {
        setErrorMsg(error.response?.data?.message || 'Failed to delete admin user');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAdminUserStatus(id, !currentStatus);
      setSuccessMsg('✅ Status updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to update status');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // Handle edit click
  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSystemAdmin: user.isSystemAdmin,
    });
    setShowEditModal(true);
  };

  // Get role text from flags
  const getRoleText = (user: AdminUser) => {
    if (user.isSystemAdmin) return 'System Admin';
    if (user.isAdmin) return user.hospitalId ? 'Hospital Admin' : 'Admin';
    return 'User';
  };

  // Get role color
  const getRoleColor = (user: AdminUser) => {
    if (user.isSystemAdmin) return 'bg-purple-100 text-purple-800';
    if (user.isAdmin) return 'bg-blue-100 text-blue-800';
    return 'bg-slate-100 text-slate-800';
  };

  // KPIs
  const kpis = [
    {
      title: 'Total Administrators',
      value: totalItems.toString(),
      trend: '+8.5%',
      isPositive: true,
      icon: Users,
      color: 'purple',
      details: `${adminUsers.length} on this page`,
    },
    {
      title: 'System Admins',
      value: adminUsers.filter(u => u.isSystemAdmin).length.toString(),
      trend: '+2.1%',
      isPositive: true,
      icon: Shield,
      color: 'blue',
      details: 'System level access',
    },
    {
      title: 'Hospital Admins',
      value: adminUsers.filter(u => u.isAdmin && u.hospitalId).length.toString(),
      trend: '+5.3%',
      isPositive: true,
      icon: Building2,
      color: 'emerald',
      details: 'Hospital management',
    },
    {
      title: 'Active Users',
      value: adminUsers.filter(u => u.isActive).length.toString(),
      trend: '+3.2%',
      isPositive: true,
      icon: CheckCircle2,
      color: 'amber',
      details: 'Currently active',
    },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ALERTS */}
        {successMsg && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-purple-600" />
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Administrator Management
              </h1>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage system and hospital administrators
            </p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: '', email: '', isAdmin: false, isSystemAdmin: false });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-semibold shadow-md hover:shadow-lg"
          >
            <Plus size={18} /> Create Admin
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            const colors = {
              purple: { bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50', text: 'text-purple-600' },
              blue: { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', text: 'text-blue-600' },
              emerald: { bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', text: 'text-emerald-600' },
              amber: { bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', text: 'text-amber-600' },
            }[stat.color];

            return (
              <div
                key={i}
                className={`rounded-xl border p-5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                    <Icon size={20} className={colors.text} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.isPositive
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.isPositive ? '↑' : '↓'} {stat.trend}
                  </span>
                </div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900 placeholder-slate-500'
                }`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter as any}
              onChange={(e) => {
                setStatusFilter(e.target.value === '' ? '' : e.target.value === 'true');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white'
                  : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
              }`}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                All Administrators ({totalItems})
              </h2>
              {loading && <Loader size={18} className="animate-spin text-purple-600" />}
            </div>
          </div>

          {error && (
            <div className="p-5 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!loading && adminUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={32} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No administrators found. Create one to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b text-xs ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <th className={`text-left py-3.5 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Administrator
                      </th>
                      <th className={`text-left py-3.5 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email
                      </th>
                      <th className={`text-left py-3.5 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Role
                      </th>
                      <th className={`text-left py-3.5 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Hospital
                      </th>
                      <th className={`text-left py-3.5 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Status
                      </th>
                      <th className={`text-center py-3.5 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`border-b text-xs transition-colors hover:${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        <td className={`py-4 px-5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                          <div className="font-medium">{user.name}</div>
                          <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className={`py-4 px-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <div className="flex items-center gap-2">
                            <Mail size={14} /> {user.email}
                          </div>
                        </td>
                        <td className={`py-4 px-5`}>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(user)}`}>
                            {getRoleText(user)}
                          </span>
                        </td>
                        <td className={`py-4 px-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {user.hospitalId ? `Hospital: ${user.hospitalId.substring(0, 8)}...` : '—'}
                        </td>
                        <td className={`py-4 px-5`}>
                          <button
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              user.isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {user.isActive ? '✓ Active' : '○ Inactive'}
                          </button>
                        </td>
                        <td className={`py-4 px-5`}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(user)}
                              className={`p-2 rounded-lg transition-all hover:shadow-md ${
                                isDark
                                  ? 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                                  : 'bg-slate-100 hover:bg-slate-200 text-blue-600'
                              }`}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className={`p-2 rounded-lg transition-all hover:shadow-md ${
                                isDark
                                  ? 'bg-slate-800 hover:bg-red-900 text-red-400'
                                  : 'bg-slate-100 hover:bg-red-100 text-red-600'
                              }`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className={`p-4 border-t flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? isDark
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? isDark
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Create New Administrator
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={`p-1 rounded-lg transition-all ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
                  }`}
                  placeholder="Dr. Rajesh Kumar"
                />
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
                  }`}
                  placeholder="admin@hospital.com"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <label className={`text-xs font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Role Permissions
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="isAdmin" className={`text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Admin Access
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isSystemAdmin"
                    checked={formData.isSystemAdmin}
                    onChange={(e) => setFormData({ ...formData, isSystemAdmin: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="isSystemAdmin" className={`text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    System Admin Access
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 px-4 py-2.5 rounded-lg border font-semibold transition-all ${
                  isDark
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl p-6 max-w-md w-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Edit Administrator
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className={`p-1 rounded-lg transition-all ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-purple-500 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <label className={`text-xs font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Role Permissions
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsAdmin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="editIsAdmin" className={`text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Admin Access
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsSystemAdmin"
                    checked={formData.isSystemAdmin}
                    onChange={(e) => setFormData({ ...formData, isSystemAdmin: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="editIsSystemAdmin" className={`text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    System Admin Access
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg border font-semibold transition-all ${
                  isDark
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
