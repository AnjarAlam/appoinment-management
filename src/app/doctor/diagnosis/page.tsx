'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Pill,
  Heart,
  Droplet,
  TrendingUp,
  Download,
  X,
} from 'lucide-react';
import { useSearchParams as useSearchParamsHook } from 'next/navigation';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  reason: string;
}

interface SuggestedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  reason: string;
  category: 'primary' | 'secondary';
}

export default function DiagnosisReportGenerator() {
  const searchParams = useSearchParamsHook();
  const [isDark, setIsDark] = useState(true);
  const patientIdParam = searchParams.get('patientId');
  const patientNameParam = searchParams.get('patientName');

  const [formData, setFormData] = useState({
    patientName: patientNameParam || '',
    patientAge: '',
    gender: 'male',
    condition: '',
    symptoms: '',
    bpReading: '120/80',
    sugarLevel: '95',
    weight: '72',
    observations: '',
    recommendations: '',
    medicines: [] as Medicine[],
  });

  const [suggestedMedicines, setSuggestedMedicines] = useState<SuggestedMedicine[]>([]);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [addingFromSuggestions, setAddingFromSuggestions] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    reason: '',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const medicineDatabase: { [key: string]: SuggestedMedicine[] } = {
    hypertension: [
      {
        id: '1',
        name: 'Amlodipine',
        dosage: '5-10 mg',
        frequency: 'Once daily',
        duration: '30-60 days',
        reason: 'Calcium channel blocker - reduces blood pressure',
        category: 'primary',
      },
      {
        id: '2',
        name: 'Lisinopril',
        dosage: '10-20 mg',
        frequency: 'Once daily',
        duration: '30-60 days',
        reason: 'ACE inhibitor - lowers BP effectively',
        category: 'primary',
      },
      {
        id: '3',
        name: 'Hydrochlorothiazide',
        dosage: '12.5-25 mg',
        frequency: 'Once daily',
        duration: '30-60 days',
        reason: 'Diuretic - reduces fluid retention',
        category: 'secondary',
      },
      {
        id: '4',
        name: 'Metoprolol',
        dosage: '50-100 mg',
        frequency: 'Twice daily',
        duration: '30-60 days',
        reason: 'Beta-blocker - heart rate control',
        category: 'secondary',
      },
    ],
    diabetes: [
      {
        id: '1',
        name: 'Metformin',
        dosage: '500-1000 mg',
        frequency: 'Twice daily',
        duration: '60-90 days',
        reason: 'Reduces blood glucose levels',
        category: 'primary',
      },
      {
        id: '2',
        name: 'Glipizide',
        dosage: '5-10 mg',
        frequency: 'Once daily',
        duration: '60-90 days',
        reason: 'Stimulates insulin secretion',
        category: 'primary',
      },
      {
        id: '3',
        name: 'Sitagliptin',
        dosage: '100 mg',
        frequency: 'Once daily',
        duration: '60-90 days',
        reason: 'DPP-4 inhibitor - controls blood sugar',
        category: 'secondary',
      },
      {
        id: '4',
        name: 'Insulin Glargine',
        dosage: '10-20 units',
        frequency: 'At bedtime',
        duration: '30 days',
        reason: 'Long-acting insulin',
        category: 'secondary',
      },
    ],
    arthritis: [
      {
        id: '1',
        name: 'Ibuprofen',
        dosage: '400-600 mg',
        frequency: 'Thrice daily',
        duration: '15-30 days',
        reason: 'Anti-inflammatory pain relief',
        category: 'primary',
      },
      {
        id: '2',
        name: 'Diclofenac',
        dosage: '50 mg',
        frequency: 'Twice daily',
        duration: '15-30 days',
        reason: 'NSAID for joint pain',
        category: 'primary',
      },
      {
        id: '3',
        name: 'Glucosamine',
        dosage: '1500 mg',
        frequency: 'Once daily',
        duration: '90 days',
        reason: 'Joint health support',
        category: 'secondary',
      },
      {
        id: '4',
        name: 'Collagen Peptide',
        dosage: '10 g',
        frequency: 'Once daily',
        duration: '60-90 days',
        reason: 'Cartilage repair support',
        category: 'secondary',
      },
    ],
    cough: [
      {
        id: '1',
        name: 'Dextromethorphan',
        dosage: '10-20 mg',
        frequency: 'Thrice daily',
        duration: '7-10 days',
        reason: 'Cough suppressant',
        category: 'primary',
      },
      {
        id: '2',
        name: 'Ambroxol',
        dosage: '30 mg',
        frequency: 'Thrice daily',
        duration: '7-14 days',
        reason: 'Mucolytic agent',
        category: 'primary',
      },
      {
        id: '3',
        name: 'Salbutamol Inhaler',
        dosage: '100 mcg',
        frequency: 'As needed (2-4 puffs)',
        duration: 'Ongoing',
        reason: 'Bronchodilator for relief',
        category: 'secondary',
      },
    ],
    cold: [
      {
        id: '1',
        name: 'Paracetamol',
        dosage: '500 mg',
        frequency: 'Thrice daily',
        duration: '5-7 days',
        reason: 'Fever & pain relief',
        category: 'primary',
      },
      {
        id: '2',
        name: 'Cetirizine',
        dosage: '10 mg',
        frequency: 'Once daily',
        duration: '7 days',
        reason: 'Allergy & congestion relief',
        category: 'primary',
      },
      {
        id: '3',
        name: 'Guaifenesin',
        dosage: '200 mg',
        frequency: 'Thrice daily',
        duration: '7-10 days',
        reason: 'Expectorant',
        category: 'secondary',
      },
    ],
  };

  const handleConditionChange = (condition: string) => {
    setFormData({ ...formData, condition });

    const conditionKey = condition.toLowerCase();
    const medicines = medicineDatabase[conditionKey] || [];
    setSuggestedMedicines(medicines);
  };

  const handleAddSuggestedMedicine = (medicine: SuggestedMedicine) => {
    const newMed: Medicine = {
      id: String(Date.now()),
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      duration: medicine.duration,
      reason: medicine.reason,
    };
    setFormData({
      ...formData,
      medicines: [...formData.medicines, newMed],
    });
  };

  const handleAddCustomMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      const medicine: Medicine = {
        id: String(Date.now()),
        ...newMedicine,
      };
      setFormData({
        ...formData,
        medicines: [...formData.medicines, medicine],
      });
      setNewMedicine({ name: '', dosage: '', frequency: '', duration: '', reason: '' });
      setShowMedicineModal(false);
    }
  };

  const handleRemoveMedicine = (id: string) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter(m => m.id !== id),
    });
  };

  const handleSaveReport = () => {
    alert('Diagnosis report saved successfully!');
    // Here you would send the data to the backend
    console.log('Report Data:', formData);
  };

  const handleDownloadReport = () => {
    const reportContent = `
MEDICAL DIAGNOSIS REPORT
========================

Patient Name: ${formData.patientName}
Age: ${formData.patientAge}
Gender: ${formData.gender}
Date: ${new Date().toLocaleDateString()}

CLINICAL FINDINGS:
-------------------
Condition: ${formData.condition}
Symptoms: ${formData.symptoms}

VITAL SIGNS:
------------
Blood Pressure: ${formData.bpReading}
Blood Sugar: ${formData.sugarLevel} mg/dL
Weight: ${formData.weight} kg

OBSERVATIONS:
${formData.observations}

MEDICATIONS PRESCRIBED:
${formData.medicines.map(m => `
- ${m.name}
  Dosage: ${m.dosage}
  Frequency: ${m.frequency}
  Duration: ${m.duration}
  Reason: ${m.reason}
`).join('')}

RECOMMENDATIONS:
${formData.recommendations}

---
Report generated by Dr. Priya Sharma
Sanctuary Ayurvedic Clinic
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `diagnosis_report_${formData.patientName}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-4`}>
      <div className="max-w-4xl mx-auto">

        {/* PRESCRIPTION DOCUMENT */}
        <div className={`rounded-xl border shadow-lg p-8 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
        }`}>

          {/* HEADER - CLINIC BRANDING */}
          <div className="border-b-2 border-slate-300 pb-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Sanctuary Ayurvedic Clinic
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">आयुर्वेद चिकित्सा केंद्र</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-700">Dr. Priya Sharma</p>
                <p className="text-xs text-slate-600">B.H.M.S., Reg. No. 48XXX1</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Address: Shop No.1, Shivganga Building, Near M.G. Road, Mumbai - 400001 | Phone: +91-9876543210
            </p>
          </div>

          {/* PATIENT & APPOINTMENT INFO */}
          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-700">Patient Name</p>
              <p className="text-sm font-medium text-slate-900">{formData.patientName || '_______________'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Age / Gender / Weight</p>
              <p className="text-sm font-medium text-slate-900">
                {formData.patientAge || '__'} / {formData.gender} / {formData.weight} kg
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Date</p>
              <p className="text-sm font-medium text-slate-900">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* VITAL SIGNS - COMPACT */}
          <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-slate-50 rounded-lg dark:bg-slate-800">
            <div>
              <p className="text-xs text-slate-600 font-semibold">BP</p>
              <input
                type="text"
                className={`w-full px-1.5 py-1 rounded text-xs outline-none ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'bg-white border border-slate-300 text-slate-900'
                }`}
                value={formData.bpReading}
                onChange={(e) => setFormData({ ...formData, bpReading: e.target.value })}
                placeholder="120/80"
              />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold">Blood Sugar</p>
              <input
                type="number"
                className={`w-full px-1.5 py-1 rounded text-xs outline-none ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'bg-white border border-slate-300 text-slate-900'
                }`}
                value={formData.sugarLevel}
                onChange={(e) => setFormData({ ...formData, sugarLevel: e.target.value })}
                placeholder="95"
              />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold">Condition</p>
              <select
                className={`w-full px-1.5 py-1 rounded text-xs outline-none ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'bg-white border border-slate-300 text-slate-900'
                }`}
                value={formData.condition}
                onChange={(e) => handleConditionChange(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Arthritis">Arthritis</option>
                <option value="Cough">Cough</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold">Symptoms</p>
              <input
                type="text"
                className={`w-full px-1.5 py-1 rounded text-xs outline-none ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'bg-white border border-slate-300 text-slate-900'
                }`}
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Fever, cough..."
              />
            </div>
          </div>

          {/* CLINICAL FINDINGS */}
          <div className="mb-4 pb-3 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-800 mb-1">Clinical Observations:</p>
            <textarea
              className={`w-full px-2 py-1 rounded text-xs outline-none resize-none ${
                isDark
                  ? 'bg-slate-800 border border-slate-700 text-white'
                  : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
              rows={2}
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Enter clinical observations..."
            />
          </div>

          {/* RX - PRESCRIPTION */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-slate-800">℞</span>
              <p className="text-xs font-bold text-slate-800">PRESCRIPTION</p>
            </div>

            <div className="space-y-1 border-l-2 border-slate-300 pl-3">
              {formData.medicines.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No medicines prescribed yet.</p>
              ) : (
                formData.medicines.map((med, idx) => (
                  <div key={med.id} className="pb-1 flex justify-between items-start group">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900">
                        {idx + 1}. {med.name}
                      </p>
                      <p className="text-xs text-slate-700">
                        <span className="font-medium">{med.dosage}</span> - {med.frequency} - {med.duration}
                      </p>
                      {med.reason && (
                        <p className="text-xs text-slate-600 italic">({med.reason})</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveMedicine(med.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ADD MEDICINE BUTTONS - COMPACT */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setShowMedicineModal(true);
                setAddingFromSuggestions(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <Plus size={14} /> Add Custom
            </button>
          </div>

          {/* SUGGESTED MEDICINES - HORIZONTAL */}
          {suggestedMedicines.length > 0 && (
            <div className="mb-4 pb-3 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-800 mb-2">Suggested Medicines:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedMedicines.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => handleAddSuggestedMedicine(med)}
                    className={`text-left p-2 rounded text-xs border transition ${
                      med.category === 'primary'
                        ? isDark
                          ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        : isDark
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                          : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{med.name}</p>
                    <p className="text-xs text-slate-600">{med.dosage}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDATIONS */}
          <div className="mb-4 pb-3 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-800 mb-1">Recommendations & Follow-up:</p>
            <textarea
              className={`w-full px-2 py-1 rounded text-xs outline-none resize-none ${
                isDark
                  ? 'bg-slate-800 border border-slate-700 text-white'
                  : 'bg-slate-50 border border-slate-300 text-slate-900'
              }`}
              rows={2}
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              placeholder="Lifestyle advice, diet, follow-up instructions..."
            />
          </div>

          {/* SIGNATURE AREA */}
          <div className="flex justify-between items-end pt-4">
            <div>
              <p className="text-xs text-slate-600">Patient/Guardian Signature</p>
              <div className="w-24 h-8 border-b border-slate-400 mt-2"></div>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 border-b border-slate-400 mb-1"></div>
              <p className="text-xs font-semibold text-slate-700">Dr. Priya Sharma</p>
            </div>
          </div>

          {/* ACTION BUTTONS - BOTTOM */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-600 text-white text-xs font-semibold hover:bg-slate-700 transition"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={handleSaveReport}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition"
            >
              <Save size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOM MEDICINE MODAL */}
      {showMedicineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-sm ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}>
            <div className={`flex justify-between items-center p-4 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Add Custom Medicine
              </h3>
              <button onClick={() => setShowMedicineModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Medicine Name *</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1.5 rounded text-xs outline-none transition ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="e.g., Aspirin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Dosage *</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1.5 rounded text-xs outline-none transition ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  placeholder="e.g., 500 mg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Frequency</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1.5 rounded text-xs outline-none transition ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                  value={newMedicine.frequency}
                  onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                  placeholder="e.g., Twice daily"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Duration</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1.5 rounded text-xs outline-none transition ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                  value={newMedicine.duration}
                  onChange={(e) => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                  placeholder="e.g., 5 days"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Reason/Notes</label>
                <textarea
                  className={`w-full px-2 py-1.5 rounded text-xs outline-none transition resize-none ${
                    isDark
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                  rows={2}
                  value={newMedicine.reason}
                  onChange={(e) => setNewMedicine({ ...newMedicine, reason: e.target.value })}
                  placeholder="Why this medicine..."
                />
              </div>
            </div>

            <div className={`flex gap-2 p-4 border-t justify-end ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setShowMedicineModal(false)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomMedicine}
                className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-semibold flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
