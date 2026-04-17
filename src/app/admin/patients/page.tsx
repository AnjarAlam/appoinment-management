'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, Edit2, Trash2, Users, Mail, Phone, MapPin, Calendar, Heart } from 'lucide-react';

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  address?: string;
  bloodGroup?: string;
  appointmentDate?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  conditions?: string[];
};

const initialPatients: Patient[] = [
  { id: 'p1', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 98765 43210', age: 45, gender: 'M', bloodGroup: 'O+', status: 'Active', conditions: ['Diabetes', 'BP'], appointmentDate: '2024-04-20' },
  { id: 'p2', name: 'Priya Singh', email: 'priya@email.com', phone: '+91 91234 56789', age: 32, gender: 'F', bloodGroup: 'A+', status: 'Active', conditions: ['Asthma'], appointmentDate: '2024-04-18' },
  { id: 'p3', name: 'Amit Patel', email: 'amit@email.com', phone: '+91 99887 77665', age: 58, gender: 'M', bloodGroup: 'B+', status: 'Active', conditions: ['Arthritis', 'Joint Pain'], appointmentDate: '2024-04-22' },
  { id: 'p4', name: 'Neha Sharma', email: 'neha@email.com', phone: '+91 98765 12345', age: 28, gender: 'F', bloodGroup: 'AB+', status: 'Pending', conditions: ['Skin Care'], appointmentDate: '2024-04-25' },
  { id: 'p5', name: 'Vikram Desai', email: 'vikram@email.com', phone: '+91 91111 22222', age: 50, gender: 'M', bloodGroup: 'O-', status: 'Active', conditions: ['Digestion'], appointmentDate: '2024-04-19' },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Pending'>('All');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Pending'>('Active');
  const [conditions, setConditions] = useState('');

  const tableRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLFormElement>(null);

  // GSAP Animation for table
  useEffect(() => {
    if (!tableRef.current) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    });
  }, [patients, searchTerm, statusFilter]);

  // Modal Animation
  useEffect(() => {
    if (!showModal || !modalRef.current) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    });
  }, [showModal]);

  function resetForm() {
    setName('');
    setEmail('');
    setPhone('');
    setAge('');
    setGender('M');
    setAddress('');
    setBloodGroup('');
    setAppointmentDate('');
    setStatus('Active');
    setConditions('');
    setEditingId(null);
  }

  function handleAddPatient(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || age === '') return;

    if (editingId) {
      setPatients(prev => prev.map(p =>
        p.id === editingId
          ? {
              ...p,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              age: Number(age),
              gender,
              address,
              bloodGroup,
              appointmentDate,
              status,
              conditions: conditions.split(',').map(c => c.trim()).filter(c => c)
            }
          : p
      ));
    } else {
      const newPatient: Patient = {
        id: `p_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: Number(age),
        gender,
        address,
        bloodGroup,
        appointmentDate,
        status,
        conditions: conditions.split(',').map(c => c.trim()).filter(c => c)
      };
      setPatients(prev => [newPatient, ...prev]);
    }

    resetForm();
    setShowModal(false);
  }

  function handleEditPatient(patient: Patient) {
    setName(patient.name);
    setEmail(patient.email);
    setPhone(patient.phone);
    setAge(patient.age);
    setGender(patient.gender);
    setAddress(patient.address || '');
    setBloodGroup(patient.bloodGroup || '');
    setAppointmentDate(patient.appointmentDate || '');
    setStatus(patient.status);
    setConditions(patient.conditions?.join(', ') || '');
    setEditingId(patient.id);
    setShowModal(true);
  }

  function handleDeletePatient(id: string) {
    setPatients(prev => prev.filter(p => p.id !== id));
  }

  function handleCloseModal() {
    setShowModal(false);
    resetForm();
  }

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Inactive':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={18} />
            </div>
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-wider">HEALTHCARE</p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Patients</h1>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 pl-11">Manage patient records and appointments</p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg text-sm transition-all"
        >
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Patients</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{patients.length}</h3>
            </div>
            <Users className="text-emerald-600" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
              <h3 className="text-2xl font-semibold text-emerald-600 mt-1">{patients.filter(p => p.status === 'Active').length}</h3>
            </div>
            <Heart className="text-emerald-600" size={28} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending Appointments</p>
              <h3 className="text-2xl font-semibold text-amber-600 mt-1">{patients.filter(p => p.status === 'Pending').length}</h3>
            </div>
            <Calendar className="text-amber-600" size={28} />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Patients Table */}
      <div ref={tableRef} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Age/Gender</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Blood Group</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Appointment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                      idx % 2 === 0 ? '' : 'bg-slate-50/30 dark:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-slate-900 dark:text-white font-medium">{patient.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{patient.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{patient.phone}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{patient.age}/{patient.gender}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{patient.bloodGroup || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                      {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <form
            ref={modalRef}
            onSubmit={handleAddPatient}
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit Patient' : 'Add New Patient'}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter patient details</p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-1.5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Phone & Age */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    min="1"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Gender & Blood Group */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="">Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Address */}
                <input
                  placeholder="Address (optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                />

                {/* Appointment Date & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Conditions */}
                <textarea
                  placeholder="Medical Conditions (comma-separated)"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500 transition resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t dark:border-slate-800 px-6 py-4 flex gap-3 bg-slate-50 dark:bg-slate-950">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition"
              >
                {editingId ? 'Update Patient' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
