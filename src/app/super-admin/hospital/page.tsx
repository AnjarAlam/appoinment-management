'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Edit2,
  Search,
  AlertCircle,
  Loader,
  X,
} from 'lucide-react';
import useHospitalStoreApi, { Hospital } from '@/store/hospital_store_api';
import { createHospitalSchema, updateHospitalSchema } from '@/lib/validations/hospital';

export default function HospitalManagementPage() {
  const [isDark, setIsDark] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  // Hospital Store
  const {
    hospitals,
    isLoading,
    error,
    totalItems,
    totalPages,
    createHospital,
    fetchHospitals,
    updateHospital,
    deleteHospital,
    toggleHospitalStatus,
  } = useHospitalStoreApi();

  // Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Fetch hospitals on mount
  useEffect(() => {
    fetchHospitals(currentPage, 10, searchTerm);
  }, [currentPage, searchTerm]);

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '' });
    setValidationErrors({});
    setIsEditMode(false);
    setEditingHospital(null);
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const handleEditClick = (hospital: Hospital) => {
    setFormData({
      name: hospital.name,
      address: hospital.address || '',
      phone: hospital.phone || '',
    });
    setEditingHospital(hospital);
    setIsEditMode(true);
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validate
      const schema = isEditMode ? updateHospitalSchema : createHospitalSchema;
      const validationResult = schema.safeParse(formData);

      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          const fieldName = err.path[0] as string;
          errors[fieldName] = err.message;
        });
        setValidationErrors(errors);
        console.error('❌ Validation failed:', errors);
        return;
      }

      console.log('📤 Submitting hospital form:', formData);

      if (isEditMode && editingHospital) {
        // Update
        await updateHospital(editingHospital.id, formData);
        console.log('✅ Hospital updated successfully');
      } else {
        // Create
        await createHospital(formData.name, formData.address, formData.phone);
        console.log('✅ Hospital created successfully');
      }

      resetForm();
      setShowModal(false);
      // Refresh list
      await fetchHospitals(1, 10, searchTerm);
    } catch (err: any) {
      console.error('❌ Submit error:', err.message);
      setValidationErrors({ submit: err.message });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hospital?')) return;

    try {
      await deleteHospital(id);
      console.log('✅ Hospital deleted successfully');
      await fetchHospitals(1, 10, searchTerm);
    } catch (err: any) {
      console.error('❌ Delete error:', err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleHospitalStatus(id, !currentStatus);
      console.log('✅ Hospital status updated');
      await fetchHospitals(currentPage, 10, searchTerm);
    } catch (err: any) {
      console.error('❌ Status toggle error:', err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Hospital KPIs
  const kpis = [
    {
      title: 'Total Hospitals',
      value: totalItems.toString(),
      icon: Building2,
      color: 'blue',
    },
    {
      title: 'Active Facilities',
      value: hospitals.filter((h) => h.isActive).length.toString(),
      icon: Phone,
      color: 'emerald',
    },
    {
      title: 'Inactive Facilities',
      value: hospitals.filter((h) => !h.isActive).length.toString(),
      icon: AlertCircle,
      color: 'amber',
    },
  ];

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
              Add, manage and monitor all healthcare facilities
            </p>
          </div>
          <button
            onClick={handleAddClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 transition text-xs font-semibold shadow-sm hover:shadow-md"
          >
            <Plus size={16} /> Add Hospital
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            const bgColor = {
              blue: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
              emerald: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
              amber: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            }[stat.color];
            const textColor = {
              blue: 'text-blue-600',
              emerald: 'text-emerald-600',
              amber: 'text-amber-600',
            }[stat.color];

            return (
              <div
                key={i}
                className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-lg w-fit mb-3 ${bgColor}`}>
                  <Icon size={20} className={textColor} />
                </div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* SEARCH */}
        <div
          className={`rounded-xl border p-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="relative">
            <Search
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search hospitals by name, code, address or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* HOSPITALS TABLE */}
        <div
          className={`rounded-xl border shadow-sm overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className={`p-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Hospitals ({totalItems})
            </h2>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader size={24} className="animate-spin text-blue-600" />
              </div>
            ) : hospitals.length === 0 ? (
              <div className={`p-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Building2 size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hospitals found</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Name
                    </th>
                    <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Code
                    </th>
                    <th className={`text-left py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Contact
                    </th>
                    <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Status
                    </th>
                    <th className={`text-center py-3 px-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital) => (
                    <tr
                      key={hospital.id}
                      className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      <td className={`py-3 px-5 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {hospital.name}
                      </td>
                      <td className={`py-3 px-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {hospital.code}
                      </td>
                      <td className={`py-3 px-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <div className="space-y-0.5">
                          {hospital.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} /> {hospital.phone}
                            </div>
                          )}
                          {hospital.address && (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} /> {hospital.address}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <button
                          onClick={() => handleToggleStatus(hospital.id, hospital.isActive)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                            hospital.isActive
                              ? isDark
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : isDark
                              ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {hospital.isActive ? '● Active' : '● Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(hospital)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 disabled:opacity-50 transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(hospital.id)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/10 disabled:opacity-50 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`p-4 border-t flex items-center justify-center gap-2 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD/EDIT HOSPITAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            <div
              className={`p-6 border-b sticky top-0 z-10 flex items-center justify-between ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={20} className="text-blue-600" />
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isEditMode ? 'Edit Hospital' : 'Add New Hospital'}
                  </h2>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isEditMode ? 'Update hospital information' : 'Register a new healthcare facility'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className={`p-1 rounded-lg transition ${
                  isDark
                    ? 'hover:bg-slate-800 text-slate-400'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Hospital Name */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Hospital Name *
                </label>
                <input
                  type="text"
                  placeholder="Ayurvedic Multispeciality Hospital"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                    validationErrors.name
                      ? isDark
                        ? 'border-red-600 bg-slate-800 text-white'
                        : 'border-red-500 bg-slate-50 text-slate-900'
                      : isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Address
                </label>
                <input
                  type="text"
                  placeholder="12 Herbal Street, Pune"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (validationErrors.address) {
                      setValidationErrors({ ...validationErrors, address: '' });
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                    validationErrors.address
                      ? isDark
                        ? 'border-red-600 bg-slate-800 text-white'
                        : 'border-red-500 bg-slate-50 text-slate-900'
                      : isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                  }`}
                />
                {validationErrors.address && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.address}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91-9988776655"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (validationErrors.phone) {
                      setValidationErrors({ ...validationErrors, phone: '' });
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                    validationErrors.phone
                      ? isDark
                        ? 'border-red-600 bg-slate-800 text-white'
                        : 'border-red-500 bg-slate-50 text-slate-900'
                      : isDark
                      ? 'bg-slate-800 border-slate-700 focus:border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                  }`}
                />
                {validationErrors.phone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {validationErrors.submit && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  {validationErrors.submit}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-slate-400 transition flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader size={16} className="animate-spin" />}
                  {isEditMode ? 'Update' : 'Add'} Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
