'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, Save, X, Heart, Droplet, Thermometer, Activity, Weight } from 'lucide-react';

interface VitalRecord {
  id: number;
  patientName: string;
  patientPhone: string;
  weight: string;
  height?: string;
  bp: string;
  sugarLevel: string;
  spO2?: string;
  bloodSugar?: string;
  symptoms?: string;
  allergies?: string;
  medications?: string;
  painLevel?: string;
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
      height: '172',
      bp: '120/80',
      sugarLevel: '95',
      spO2: '98',
      bloodSugar: '95',
      symptoms: 'None',
      allergies: 'None',
      medications: 'Multivitamin',
      painLevel: '0',
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
      height: '',
      bp: '',
      sugarLevel: '',
      spO2: '',
      bloodSugar: '',
      symptoms: '',
      allergies: '',
      medications: '',
      painLevel: '',
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
    height: '',
    bp: '',
    sugarLevel: '',
    spO2: '',
    bloodSugar: '',
    symptoms: '',
    allergies: '',
    medications: '',
    painLevel: '',
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

  // If navigated from appointments with query params, prefill and open the modal
  const searchParams = useSearchParams();
  useEffect(() => {
    const pName = searchParams.get('patientName');
    const phone = searchParams.get('phone');
    if (pName) {
      setFormData((prev) => ({ ...prev, patientName: pName, patientPhone: phone || prev.patientPhone }));
      setEditingId(null);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const filteredVitals = vitals.filter((v) =>
    v.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.patientPhone.includes(searchTerm)
  );

  const handleAddClick = () => {
    setFormData({
      patientName: '',
      patientPhone: '',
      weight: '',
      height: '',
      bp: '',
      sugarLevel: '',
      spO2: '',
      bloodSugar: '',
      symptoms: '',
      allergies: '',
      medications: '',
      painLevel: '',
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
      height: vital.height || '',
      bp: vital.bp,
      sugarLevel: vital.sugarLevel,
      spO2: vital.spO2 || '',
      bloodSugar: vital.bloodSugar || '',
      symptoms: vital.symptoms || '',
      allergies: vital.allergies || '',
      medications: vital.medications || '',
      painLevel: vital.painLevel || '',
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
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-100'} min-h-screen`}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Pre-Medical Test
            </h1>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm mt-1`}>Record vitals: Weight, BP, Sugar Level, Temperature & Pulse Rate</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-shadow shadow-sm text-sm"
            >
              <Plus size={14} /> Record Vitals
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className={`${isDark ? 'text-slate-400' : 'text-slate-400'} absolute left-3 top-3`} />
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* VITALS TABLE */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b` }>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Patient Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Phone</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Wt</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Ht</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">BP</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Sugar</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Temp</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Pulse</th>
                  <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Pain</th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVitals.map((vital) => (
                  <tr key={vital.id} className={`${isDark ? 'border-slate-800' : 'border-slate-200'} border-b transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                    <td className="px-3 py-3 text-sm font-medium text-slate-500">{vital.patientName}</td>
                    <td className="px-3 py-3 text-sm text-slate-500">{vital.patientPhone}</td>
                    <td className="px-3 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Weight size={13} className="text-slate-400" />
                        <span className="text-sm">{vital.weight || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-slate-500">
                      <span className="text-sm">{vital.height || '-'}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Heart size={13} className="text-rose-400" />
                        <span className="text-sm">{vital.bp || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Droplet size={13} className="text-sky-400" />
                        <span className="text-sm">{vital.bloodSugar || vital.sugarLevel || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Thermometer size={13} className="text-amber-400" />
                        <span className="text-sm">{vital.temperature || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Activity size={13} className="text-emerald-400" />
                        <span className="text-sm">{vital.pulseRate || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-center text-slate-500">
                      <span className="text-sm">{vital.painLevel || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                        vital.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {vital.status === 'completed' ? 'Done' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(vital)}
                          className="px-2 py-1 rounded-md text-xs text-blue-600 hover:bg-blue-500/10 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vital.id)}
                          className="px-2 py-1 rounded-md text-xs text-red-600 hover:bg-red-500/10 transition"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`sticky top-0 flex justify-between items-center py-4 px-5 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h2 id="modal-title" className="text-lg font-medium">{editingId !== null ? 'Update Vitals' : 'Record Vitals'}</h2>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">Patient Name *</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">Phone Number</label>
                  <input
                    type="tel"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2"><Weight size={14} /> Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 72.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2"><Heart size={14} /> BP (mmHg)</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.bp}
                    onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                    placeholder="e.g., 120/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2"><Weight size={14} /> Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g., 172"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2">SpO2 (%)</label>
                  <input
                    type="number"
                    step="1"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.spO2}
                    onChange={(e) => setFormData({ ...formData, spO2: e.target.value })}
                    placeholder="e.g., 98"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2"><Droplet size={14} /> Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.bloodSugar}
                    onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                    placeholder="e.g., 95"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2">Pain Level (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.painLevel}
                    onChange={(e) => setFormData({ ...formData, painLevel: e.target.value })}
                    placeholder="e.g., 2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-2"><Activity size={14} /> Pulse Rate (bpm)</label>
                <input
                  type="number"
                  className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                  value={formData.pulseRate}
                  onChange={(e) => setFormData({ ...formData, pulseRate: e.target.value })}
                  placeholder="e.g., 72"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">Symptoms</label>
                  <input
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="e.g., cough, fever"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">Allergies</label>
                  <input
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g., penicillin"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">Medications</label>
                  <input
                    className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none transition ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="e.g., aspirin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Notes</label>
                <textarea
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition resize-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900'}`}
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any observations or notes..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex gap-2 py-3 px-4 border-t justify-end ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-3 py-1.5 rounded-md text-xs transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.patientName.trim()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition ${!formData.patientName.trim() ? 'opacity-60 cursor-not-allowed hover:bg-emerald-600' : ''}`}
              >
                <Save size={14} /> Save Vitals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
