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
  Activity,
  Thermometer,
  Weight,
  Zap,
} from 'lucide-react';

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

interface Therapy {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  frequency: string;
  duration: string;
}

interface PreMedicalVitals {
  patientName: string;
  weight?: string;
  height?: string;
  bp?: string;
  pulseRate?: string;
  temperature?: string;
  spO2?: string;
  bloodSugar?: string;
  symptoms?: string;
  allergies?: string;
  medications?: string;
  painLevel?: string;
  recordedAt?: string;
}

export default function DiagnosisReportGenerator() {
  const searchParams = useSearchParams();
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

  // Therapy assignment state
  const [assignedTherapies, setAssignedTherapies] = useState<Therapy[]>([]);
  const [preMedicalVitals, setPreMedicalVitals] = useState<PreMedicalVitals>({
    patientName: patientNameParam || '',
    weight: '72.5',
    height: '172',
    bp: '120/80',
    pulseRate: '72',
    temperature: '98.6',
    spO2: '98',
    bloodSugar: '95',
    symptoms: 'None',
    allergies: 'None',
    medications: 'Multivitamin',
    painLevel: '0',
    recordedAt: '09:45 AM',
  });

  const suggestedTherapies: Therapy[] = [
    {
      id: '1',
      title: 'Abhyanga Therapy',
      category: 'Massage',
      type: 'Relaxation',
      description: 'Full body therapeutic massage',
      frequency: '2-3 times/week',
      duration: '60 mins',
    },
    {
      id: '2',
      title: 'Shirodhara',
      category: 'Head Treatment',
      type: 'Cooling',
      description: 'Therapeutic head and forehead oil treatment',
      frequency: 'Weekly',
      duration: '45 mins',
    },
    {
      id: '3',
      title: 'Panchakarma',
      category: 'Detox',
      type: 'Cleansing',
      description: 'Comprehensive detoxification therapy',
      frequency: 'As needed',
      duration: 'Multiple sessions',
    },
  ];

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
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT COLUMN - DIAGNOSIS FORM */}
        <div className="lg:col-span-2 space-y-4">

          {/* PRESCRIPTION DOCUMENT */}
          <div className={`rounded-lg border shadow-md p-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>

            {/* HEADER */}
            <div className="border-b border-slate-300 pb-3 mb-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Medical Diagnosis Report
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">Sanctuary Ayurvedic Clinic</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-700">Dr. Priya Sharma</p>
                  <p className="text-xs text-slate-600">B.H.M.S.</p>
                </div>
              </div>
            </div>

            {/* PATIENT INFO - GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 pb-3 border-b border-slate-200">
              <div>
                <label className="text-xs font-semibold text-slate-600">Patient Name *</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Age</label>
                <input
                  type="number"
                  className={`w-full px-2 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Gender</label>
                <select
                  className={`w-full px-2 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Date</label>
                <input
                  type="text"
                  disabled
                  className={`w-full px-2 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white opacity-50' : 'bg-slate-50 border border-slate-300 text-slate-900 opacity-50'}`}
                  value={new Date().toLocaleDateString('en-IN')}
                />
              </div>
            </div>

            {/* VITALS - COMPACT GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 p-2 bg-slate-100 rounded dark:bg-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-600">BP (mmHg)</label>
                <input
                  type="text"
                  className={`w-full px-1.5 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'}`}
                  value={formData.bpReading}
                  onChange={(e) => setFormData({ ...formData, bpReading: e.target.value })}
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Blood Sugar</label>
                <input
                  type="number"
                  className={`w-full px-1.5 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'}`}
                  value={formData.sugarLevel}
                  onChange={(e) => setFormData({ ...formData, sugarLevel: e.target.value })}
                  placeholder="95"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Weight (kg)</label>
                <input
                  type="number"
                  className={`w-full px-1.5 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'}`}
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="72"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Condition</label>
                <select
                  className={`w-full px-1.5 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'}`}
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
            </div>

            {/* SYMPTOMS & OBSERVATIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Symptoms</label>
                <input
                  type="text"
                  className={`w-full px-2 py-1 rounded text-xs outline-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Fever, cough..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Clinical Observations</label>
                <textarea
                  className={`w-full px-2 py-1 rounded text-xs outline-none resize-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                  rows={1}
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Clinical notes..."
                />
              </div>
            </div>

            {/* PRESCRIPTION SECTION */}
            <div className="mb-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-slate-800">℞</span>
                <p className="text-xs font-semibold text-slate-800">PRESCRIBED MEDICINES</p>
              </div>

              <div className="space-y-1 border-l-2 border-slate-300 pl-2">
                {formData.medicines.length === 0 ? (
                  <p className="text-xs text-slate-500 py-1">No medicines added yet.</p>
                ) : (
                  formData.medicines.map((med, idx) => (
                    <div key={med.id} className="pb-1 flex justify-between items-start group text-xs">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{idx + 1}. {med.name}</p>
                        <p className="text-slate-700"><span className="font-medium">{med.dosage}</span> - {med.frequency}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMedicine(med.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ADD MEDICINE BUTTONS */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setShowMedicineModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
              >
                <Plus size={12} /> Add Medicine
              </button>
            </div>

            {/* SUGGESTED MEDICINES */}
            {suggestedMedicines.length > 0 && (
              <div className="mb-3 pb-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-800 mb-1">Suggested Medicines:</p>
                <div className="grid grid-cols-2 gap-1">
                  {suggestedMedicines.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => handleAddSuggestedMedicine(med)}
                      className={`text-left p-1.5 rounded text-xs border transition ${
                        med.category === 'primary'
                          ? isDark
                            ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                          : isDark
                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                            : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 truncate">{med.name}</p>
                      <p className="text-xs text-slate-600">{med.dosage}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RECOMMENDATIONS */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-slate-800 mb-1 block">Recommendations & Follow-up</label>
              <textarea
                className={`w-full px-2 py-1 rounded text-xs outline-none resize-none ${isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                rows={2}
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                placeholder="Diet, lifestyle, follow-up advice..."
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-600 text-white text-xs font-semibold hover:bg-slate-700 transition"
              >
                <Download size={12} /> Download
              </button>
              <button
                onClick={handleSaveReport}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition"
              >
                <Save size={12} /> Save
              </button>
            </div>
          </div>

          {/* THERAPY ASSIGNMENT SECTION */}
          <div className={`rounded-lg border shadow-md p-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Zap size={14} className="inline mr-1" /> Assign Therapy Templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedTherapies.map((therapy) => (
                <button
                  key={therapy.id}
                  onClick={() => {
                    if (!assignedTherapies.find(t => t.id === therapy.id)) {
                      setAssignedTherapies([...assignedTherapies, therapy]);
                    }
                  }}
                  disabled={assignedTherapies.some(t => t.id === therapy.id)}
                  className={`text-left p-2 rounded text-xs border transition ${
                    assignedTherapies.some(t => t.id === therapy.id)
                      ? isDark
                        ? 'bg-emerald-900 border-emerald-700 text-emerald-300'
                        : 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : isDark
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <p className="font-semibold">{therapy.title}</p>
                  <p className="text-xs text-slate-600">{therapy.frequency}</p>
                </button>
              ))}
            </div>
            {assignedTherapies.length > 0 && (
              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">
                <p className="text-xs font-semibold mb-1">Assigned Therapies:</p>
                <div className="space-y-1">
                  {assignedTherapies.map((therapy) => (
                    <div key={therapy.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-semibold">{therapy.title}</p>
                        <p className="text-slate-600">{therapy.frequency}</p>
                      </div>
                      <button
                        onClick={() => setAssignedTherapies(assignedTherapies.filter(t => t.id !== therapy.id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - PRE-MEDICAL TEST SIDEBAR */}
        <div className={`rounded-lg border shadow-md p-4 h-fit ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 pb-2 border-b border-slate-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Pre-Medical Test Report
          </h3>

          <div className="space-y-2 text-xs">
            <div>
              <p className="font-semibold text-slate-600">Patient</p>
              <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.patientName || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-slate-600 flex items-center gap-1"><Weight size={12} /> Weight</p>
                <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.weight || '-'} kg</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600">Height</p>
                <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.height || '-'} cm</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-600 flex items-center gap-1"><Heart size={12} /> Blood Pressure</p>
              <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.bp || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-slate-600 flex items-center gap-1"><Activity size={12} /> Pulse</p>
                <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.pulseRate || '-'} bpm</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600 flex items-center gap-1"><Thermometer size={12} /> Temp</p>
                <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.temperature || '-'}°F</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-slate-600">SpO2</p>
                <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.spO2 || '-'}%</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600 flex items-center gap-1"><Droplet size={12} /> Blood Sugar</p>
                <p className="text-slate-900 dark:text-slate-100">{preMedicalVitals.bloodSugar || '-'} mg/dL</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300">
              <p className="font-semibold text-slate-600">Symptoms</p>
              <p className="text-slate-700 dark:text-slate-300">{preMedicalVitals.symptoms || 'None'}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-600">Allergies</p>
              <p className="text-slate-700 dark:text-slate-300">{preMedicalVitals.allergies || 'None'}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-600">Current Medications</p>
              <p className="text-slate-700 dark:text-slate-300">{preMedicalVitals.medications || 'None'}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-600">Pain Level</p>
              <p className="text-slate-700 dark:text-slate-300">{preMedicalVitals.painLevel || '-'}/10</p>
            </div>

            <div className="pt-2 border-t border-slate-300">
              <p className="text-xs text-slate-500">Recorded: {preMedicalVitals.recordedAt || 'N/A'}</p>
            </div>
          </div>

          {/* ISSUE ALERT */}
          <div className={`mt-3 p-2 rounded border ${isDark ? 'bg-red-900/20 border-red-700/30' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs font-semibold text-red-700 flex items-center gap-1 mb-1">
              <AlertCircle size={12} /> Potential Issues
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
              {parseInt(preMedicalVitals.bp?.split('/')[0] || '0') > 140 && (
                <li>• High Blood Pressure detected</li>
              )}
              {parseInt(preMedicalVitals.bloodSugar || '0') > 150 && (
                <li>• High Blood Sugar detected</li>
              )}
              {parseInt(preMedicalVitals.painLevel || '0') > 5 && (
                <li>• Significant Pain Level</li>
              )}
              {!preMedicalVitals.allergies || preMedicalVitals.allergies === 'None' ? null : (
                <li>• Allergies present - check medications</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // MEDICINE MODAL - NEW LAYOUT
  if (showMedicineModal) {
    return (
      <>
        <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3`}>
          {/* Medicine modal shown inline */}
        </div>
      </>
    );
  }

  return null;
}
