'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Save, X, Heart, Droplet, Thermometer, Activity, Weight } from 'lucide-react';

interface VitalRecord {
  id: number;
  patientName: string;
  patientPhone: string;
  weight: string;
  bp: string;
  sugarLevel: string;
  temperature: string;
  pulseRate: string;
  notes: string;
  recordedAt: string;
  status: 'pending' | 'completed';
}

export default function PreMedicalTest() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vitals, setVitals] = useState<VitalRecord[]>([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      patientPhone: '+91 98765 43210',
      weight: '72.5',
      bp: '120/80',
      sugarLevel: '95',
      temperature: '98.6',
      pulseRate: '72',
      notes: 'Normal health status',
      recordedAt: '09:45 AM',
      status: 'completed',
    },
    {
      id: 2,
      patientName: 'Anjali Patel',
      patientPhone: '+91 99876 54321',
      weight: '',
      bp: '',
      sugarLevel: '',
      temperature: '',
      pulseRate: '',
      notes: '',
      recordedAt: '',
      status: 'pending',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    weight: '',
    bp: '',
    sugarLevel: '',
    temperature: '',
    pulseRate: '',
    notes: '',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const filteredVitals = vitals.filter((v) =>
    v.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.patientPhone.includes(searchTerm)
  );

  const handleAddClick = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      weight: '',
      bp: '',
      sugarLevel: '',
      temperature: '',
      pulseRate: '',
      notes: '',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vital: VitalRecord) => {
    setFormData({
      patientName: vital.patientName,
      patientPhone: vital.patientPhone,
      weight: vital.weight,
      bp: vital.bp,
      sugarLevel: vital.sugarLevel,
      temperature: vital.temperature,
      pulseRate: vital.pulseRate,
      notes: vital.notes,
    });
    setEditingId(vital.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setVitals(vitals.map(v =>
        v.id === editingId
          ? { ...v, ...formData, recordedAt: new Date().toLocaleTimeString(), status: 'completed' }
          : v
      ));
    } else {
      const newVital: VitalRecord = {
        id: Math.max(...vitals.map(v => v.id), 0) + 1,
        ...formData,
        recordedAt: new Date().toLocaleTimeString(),
        status: 'completed',
      };
      setVitals([...vitals, newVital]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setVitals(vitals.filter(v => v.id !== id));
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Pre-Medical Test
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Record vitals: Weight, BP, Sugar Level, Temperature & Pulse Rate
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
          >
            <Plus size={16} /> Record Vitals
          </button>
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
        </div>

        {/* VITALS TABLE */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Patient Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Weight (kg)</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">BP (mmHg)</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Sugar (mg/dL)</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Temp (°F)</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Pulse (bpm)</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVitals.map((vital) => (
                  <tr
                    key={vital.id}
                    className={`border-b transition hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium">{vital.patientName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{vital.patientPhone}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Weight size={14} className="text-purple-500" />
                        {vital.weight || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart size={14} className="text-red-500" />
                        {vital.bp || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Droplet size={14} className="text-blue-500" />
                        {vital.sugarLevel || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Thermometer size={14} className="text-orange-500" />
                        {vital.temperature || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Activity size={14} className="text-green-500" />
                        {vital.pulseRate || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        vital.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {vital.status === 'completed' ? 'Done' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(vital)}
                          className="px-3 py-1 rounded-lg text-blue-600 hover:bg-blue-500/10 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vital.id)}
                          className="px-3 py-1 rounded-lg text-red-600 hover:bg-red-500/10 transition"
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
          <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className={`sticky top-0 flex justify-between items-center p-6 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <h2 className="text-xl font-semibold">
                {editingId ? 'Update Vitals' : 'Record Vitals'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Weight size={16} /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 72.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Heart size={16} /> BP (mmHg)
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                    value={formData.bp}
                    onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                    placeholder="e.g., 120/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Droplet size={16} /> Sugar Level (mg/dL)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                    value={formData.sugarLevel}
                    onChange={(e) => setFormData({ ...formData, sugarLevel: e.target.value })}
                    placeholder="e.g., 95"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Thermometer size={16} /> Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                      isDark
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="e.g., 98.6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Activity size={16} /> Pulse Rate (bpm)
                </label>
                <input
                  type="number"
                  className={`w-full px-4 py-2 rounded-xl outline-none transition ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                  value={formData.pulseRate}
                  onChange={(e) => setFormData({ ...formData, pulseRate: e.target.value })}
                  placeholder="e.g., 72"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className={`w-full px-4 py-2 rounded-xl outline-none transition resize-none ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any observations or notes..."
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
                <Save size={16} /> Save Vitals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
