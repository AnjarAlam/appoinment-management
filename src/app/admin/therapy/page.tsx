'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Clock, Users, Calendar } from 'lucide-react';

export default function TherapyPlansPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const initialTherapies = [
    {
      id: 'T-001',
      title: "Abhyanga",
      category: "DETOXIFICATION",
      type: 'Ayurvedic',
      frequency: 'Daily',
      duration: "60 Min",
      description: "Full body rhythmic massage using herb-infused oils tailored to specific doshas. Promotes lymphatic drainage and deep relaxation.",
      doshas: ["V", "P", "K"],
      img: 141,
      price: 120
    },
    {
      id: 'T-002',
      title: "Shirodhara",
      category: "MENTAL HEALTH",
      type: 'Mental',
      frequency: 'Daily',
      duration: "45 Min",
      description: "Continuous pouring of warm medicated oil on the forehead to calm the nervous system and relieve stress & insomnia.",
      doshas: ["V", "P"],
      img: 142,
      price: 95
    },
    {
      id: 'T-003',
      title: "Panchakarma",
      category: "IMMUNITY",
      type: 'Ayurvedic',
      frequency: 'Weekly',
      duration: "5-21 Days",
      description: "Comprehensive Ayurvedic detoxification and rejuvenation program involving multiple therapies and dietary regulation.",
      doshas: ["V", "P", "K"],
      img: 143,
      price: 850
    }
  ];

  const [therapies, setTherapies] = useState(initialTherapies);
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('60 Min');
  const [newType, setNewType] = useState<'Physical' | 'Mental' | 'Ayurvedic' | 'Rehab'>('Ayurvedic');
  const [newFrequency, setNewFrequency] = useState<'Daily' | 'Weekly'>('Daily');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newDifficulty, setNewDifficulty] = useState('Moderate');
  const [newCategory, setNewCategory] = useState('General');
  const [doshaV, setDoshaV] = useState(false);
  const [doshaP, setDoshaP] = useState(false);
  const [doshaK, setDoshaK] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateTherapy = () => {
    if (!newTitle.trim()) return;

    const doshasArr: string[] = [];
    if (doshaV) doshasArr.push('V');
    if (doshaP) doshasArr.push('P');
    if (doshaK) doshasArr.push('K');

    if (editingId) {
      // update existing
      setTherapies((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                title: newTitle.trim(),
                category: newCategory,
                type: newType,
                frequency: newFrequency,
                duration: newDuration,
                description: newDescription.trim(),
                doshas: doshasArr,
                price: parseFloat(newPrice) || 0,
              }
            : t
        )
      );
    } else {
      const newItem = {
        id: `T-${Date.now().toString().slice(-6)}`,
        title: newTitle.trim(),
        category: newCategory,
        type: newType,
        frequency: newFrequency,
        duration: newDuration,
        description: newDescription.trim(),
        doshas: doshasArr,
        img: 200,
        price: parseFloat(newPrice) || 0,
      };

      setTherapies([newItem, ...therapies]);
    }

    // Reset form
    setNewTitle('');
    setNewDuration('60 Min');
    setNewType('Ayurvedic');
    setNewFrequency('Daily');
    setNewPrice('');
    setNewDescription('');
    setNewImagePreview(null);
    setNewImageFile(null);
    setDoshaV(false);
    setDoshaP(false);
    setDoshaK(false);
    setEditingId(null);
    setShowModal(false);
  };

  const openForCreate = () => {
    setEditingId(null);
    setNewTitle('');
    setNewDuration('60 Min');
    setNewType('Ayurvedic');
    setNewFrequency('Daily');
    setNewPrice('');
    setNewDescription('');
    setNewImagePreview(null);
    setNewImageFile(null);
    setDoshaV(false);
    setDoshaP(false);
    setDoshaK(false);
    setShowModal(true);
  };

  const openForEdit = (therapyId: string) => {
    const t = therapies.find((x) => x.id === therapyId);
    if (!t) return;
    setEditingId(t.id);
    setNewTitle(t.title || '');
    setNewDuration(t.duration || '60 Min');
    setNewType((t as any).type || 'Ayurvedic');
    setNewFrequency((t as any).frequency || 'Daily');
    setNewPrice((t as any).price ? String((t as any).price) : '');
    setNewDescription(t.description || '');
    setNewImagePreview(t.img ? `https://picsum.photos/id/${t.img}/800/600` : null);
    setDoshaV(t.doshas?.includes('V'));
    setDoshaP(t.doshas?.includes('P'));
    setDoshaK(t.doshas?.includes('K'));
    setShowModal(true);
  };

  const typeColors: Record<string, string> = {
    'Ayurvedic': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Physical': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Mental': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Rehab': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-200 p-8 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
          <div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-500 text-xs font-semibold tracking-[2px] uppercase">WELLNESS MANAGEMENT</p>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mt-1">Therapy Plans</h1>
              </div>
            </div>
          </div>

          <button
            onClick={openForCreate}
            className="bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center gap-3 px-6 py-3 rounded-2xl font-medium shadow-lg dark:shadow-emerald-950/30"
          >
            <Plus size={20} />
            Create New Therapy
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-8 py-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'active'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Therapies (12)
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-8 py-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'archived'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Archived (4)
          </button>
        </div>

        {/* Therapy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {therapies.map((therapy) => {
            const typeColor = typeColors[therapy.type] || typeColors['Ayurvedic'];

            return (
              <div
                key={therapy.id}
                className="group bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-600/50 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-emerald-950/50"
              >
                {/* Image */}
                <div className="relative h-56">
                  <Image
                    src={`https://picsum.photos/id/${therapy.img || 141}/800/600`}
                    alt={therapy.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/6 to-transparent dark:from-black/80 dark:via-black/30" />

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-2xl text-xs font-medium flex items-center gap-2 bg-white/90 text-slate-900 dark:bg-black/70 dark:text-white backdrop-blur-sm">
                    <Clock size={14} />
                    {therapy.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{therapy.title}</h3>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">₹{therapy.price}</span>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-4 py-1 mt-3 rounded-2xl text-xs font-medium border ${typeColor}`}>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {therapy.type}
                      </div>
                    </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {therapy.description}
                  </p>

                  {/* Frequency & Doshas */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Frequency</p>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">{therapy.frequency}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-600 dark:text-slate-400">DOSHAS</p>
                      <div className="flex gap-1.5 justify-end mt-1">
                        {therapy.doshas.map((d, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button onClick={() => openForEdit(therapy.id)} className="w-full mt-6 flex items-center justify-center gap-3 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all py-3.5 rounded-2xl text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-emerald-600">
                    <Edit2 size={17} />
                    Edit Therapy Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Create Therapy Modal - Professional Version */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Create New Therapy Template</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Basic Info */}
              <div>
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">Therapy Name</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-200"
                      placeholder="e.g. Nasya Therapy"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">Duration</label>
                      <input
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-200"
                      >
                        <option value="Ayurvedic">Ayurvedic</option>
                        <option value="Physical">Physical</option>
                        <option value="Mental">Mental</option>
                        <option value="Rehab">Rehab</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1 block">Frequency</label>
                      <select
                        value={newFrequency}
                        onChange={(e) => setNewFrequency(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-200"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase">Therapy Image</h4>
                <div className="border border-dashed border-slate-200 dark:border-dashed dark:border-slate-700 rounded-2xl p-6 text-center bg-white dark:bg-slate-950">
                  {newImagePreview ? (
                    <div className="relative h-48 mx-auto rounded-2xl overflow-hidden">
                      <Image src={newImagePreview} alt="preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="py-8 text-slate-500">
                      <p className="text-sm">Upload therapy image (optional)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewImageFile(file);
                        setNewImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                    id="therapy-image"
                  />
                  <label
                    htmlFor="therapy-image"
                    className="mt-4 inline-block px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm cursor-pointer transition"
                  >
                    Choose Image
                  </label>
                </div>
              </div>

              {/* Pricing & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-200"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none text-sm text-slate-900 dark:text-slate-200"
                  >
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none resize-y text-sm text-slate-900 dark:text-slate-200"
                  placeholder="Describe the therapy, its benefits, and target conditions..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-800 flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium text-slate-900 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTherapy}
                disabled={!newTitle.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:text-slate-500 rounded-2xl font-semibold transition text-white"
              >
                {editingId ? 'Save Changes' : 'Create Therapy Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}