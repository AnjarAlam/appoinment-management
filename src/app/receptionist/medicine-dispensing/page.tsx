'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Save, X, Pill, Clock, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface MedicineDispense {
  id: number;
  patientName: string;
  patientPhone: string;
  doctorDiagnosis: string;
  medicines: Medicine[];
  dispensedAt: string;
  notes: string;
  status: 'pending' | 'dispensed';
}

export default function MedicineDispensing() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [records, setRecords] = useState<MedicineDispense[]>([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      patientPhone: '+91 98765 43210',
      doctorDiagnosis: 'Common Cold & Cough',
      medicines: [
        { id: '1', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' },
        { id: '2', name: 'Cough Syrup', dosage: '10ml', frequency: 'Thrice daily', duration: '7 days' },
      ],
      dispensedAt: '11:30 AM',
      notes: 'Take after food. Drink plenty of water.',
      status: 'dispensed',
    },
    {
      id: 2,
      patientName: 'Anjali Patel',
      patientPhone: '+91 99876 54321',
      doctorDiagnosis: 'Hypertension',
      medicines: [
        { id: '1', name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      ],
      dispensedAt: '',
      notes: '',
      status: 'pending',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorDiagnosis: '',
    medicines: [{ id: '1', name: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClick = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      doctorDiagnosis: '',
      medicines: [{ id: '1', name: '', dosage: '', frequency: '', duration: '' }],
      notes: '',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: MedicineDispense) => {
    setFormData({
      patientName: record.patientName,
      patientPhone: record.patientPhone,
      doctorDiagnosis: record.doctorDiagnosis,
      medicines: record.medicines,
      notes: record.notes,
    });
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setRecords(records.map(r =>
        r.id === editingId
          ? { ...r, ...formData, dispensedAt: new Date().toLocaleTimeString(), status: 'dispensed' }
          : r
      ));
    } else {
      const newRecord: MedicineDispense = {
        id: Math.max(...records.map(r => r.id), 0) + 1,
        ...formData,
        dispensedAt: new Date().toLocaleTimeString(),
        status: 'dispensed',
      };
      setRecords([...records, newRecord]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteMedicine = (medicineId: string) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter(m => m.id !== medicineId),
    });
  };

  const handleAddMedicine = () => {
    const newId = String(Math.max(...formData.medicines.map(m => parseInt(m.id) || 0), 0) + 1);
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { id: newId, name: '', dosage: '', frequency: '', duration: '' }],
    });
  };

  const handleMedicineChange = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    });
  };

  const handleDelete = (id: number) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Medicine Dispensing
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Dispense medicines & record intake times for patients
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow"
          >
            <Plus size={16} /> Dispense Medicine
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Pending Dispensing</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {records.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Dispensed Today</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {records.filter(r => r.status === 'dispensed').length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-sm text-slate-500">Total Records</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {records.length}
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl outline-none transition ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-600'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-600'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-xl outline-none transition ${
              isDark
                ? 'bg-slate-900 border border-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="dispensed">Dispensed</option>
          </select>
        </div>

        {/* RECORDS TABLE */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Doctor Diagnosis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Medicines</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{record.patientName}</p>
                        <p className="text-xs text-slate-500">{record.patientPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-blue-500" />
                        {record.doctorDiagnosis}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        {record.medicines.map((med) => (
                          <div key={med.id} className="flex items-center gap-2">
                            <Pill size={14} className="text-emerald-500" />
                            <span className="text-xs">
                              {med.name} - {med.dosage} ({med.frequency})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                        record.status === 'dispensed'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {record.status === 'dispensed' ? (
                          <>
                            <CheckCircle size={14} /> Dispensed
                          </>
                        ) : (
                          <>
                            <Clock size={14} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(record)}
                          className="px-3 py-1 rounded-lg text-blue-600 hover:bg-blue-500/10 transition text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="px-3 py-1 rounded-lg text-red-600 hover:bg-red-500/10 transition text-sm"
                        >
                          Delete
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className={`sticky top-0 flex justify-between items-center p-6 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <h2 className="text-xl font-semibold">
                {editingId ? 'Update Medicine Dispensing' : 'Dispense Medicine'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Patient Name *</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertCircle size={16} /> Doctor's Diagnosis
                </label>
                <textarea
                  className={`w-full px-4 py-2 rounded-xl outline-none transition resize-none ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                  rows={2}
                  value={formData.doctorDiagnosis}
                  onChange={(e) => setFormData({ ...formData, doctorDiagnosis: e.target.value })}
                  placeholder="e.g., Common Cold & Cough"
                />
              </div>

              {/* MEDICINES */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium flex items-center gap-2">
                    <Pill size={16} /> Medicines
                  </label>
                  <button
                    onClick={handleAddMedicine}
                    className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.medicines.map((medicine) => (
                    <div key={medicine.id} className={`p-4 rounded-xl border ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Medicine Name</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 rounded-lg outline-none text-sm ${
                              isDark
                                ? 'bg-slate-700 border border-slate-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-900'
                            }`}
                            value={medicine.name}
                            onChange={(e) => handleMedicineChange(medicine.id, 'name', e.target.value)}
                            placeholder="e.g., Paracetamol 500mg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Dosage</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 rounded-lg outline-none text-sm ${
                              isDark
                                ? 'bg-slate-700 border border-slate-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-900'
                            }`}
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(medicine.id, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Frequency</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 rounded-lg outline-none text-sm ${
                              isDark
                                ? 'bg-slate-700 border border-slate-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-900'
                            }`}
                            value={medicine.frequency}
                            onChange={(e) => handleMedicineChange(medicine.id, 'frequency', e.target.value)}
                            placeholder="e.g., Twice daily"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Duration</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 rounded-lg outline-none text-sm ${
                              isDark
                                ? 'bg-slate-700 border border-slate-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-900'
                            }`}
                            value={medicine.duration}
                            onChange={(e) => handleMedicineChange(medicine.id, 'duration', e.target.value)}
                            placeholder="e.g., 5 days"
                          />
                        </div>
                      </div>
                      {formData.medicines.length > 1 && (
                        <button
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="mt-3 flex items-center gap-2 text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock size={16} /> Instructions & Notes
                </label>
                <textarea
                  className={`w-full px-4 py-2 rounded-xl outline-none transition resize-none ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Take after food. Drink plenty of water. Avoid dairy products."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex gap-3 p-6 border-t justify-end ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-xl transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                <Save size={16} /> Save & Dispense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
