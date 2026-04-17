'use client';

import { useState } from 'react';
import { Plus, Edit3, Clock } from 'lucide-react';

export default function TherapyPlansPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const initialTherapies = [
    {
      id: 'T-001',
      title: "Abhyanga",
      category: "DETOXIFICATION",
      duration: "60 Min",
      description: "Full body rhythmic massage using herb-infused oils tailored to specific doshas. Promotes lymphatic drainage and stress relief.",
      doshas: ["V", "P", "K"],
      img: 141,
      price: 120
    },
    {
      id: 'T-002',
      title: "Shirodhara",
      category: "MENTAL HEALTH",
      duration: "45 Min",
      description: "Continuous pouring of medicated liquids on the forehead. Excellent for insomnia, anxiety, and neurological equilibrium.",
      doshas: ["V", "P"],
      img: 142,
      price: 95
    },
    {
      id: 'T-003',
      title: "Panchakarma",
      category: "IMMUNITY",
      duration: "5-21 Days",
      description: "The cornerstone of Ayurvedic cleansing. A multi-stage process involving specialized diets and intense purification therapies.",
      doshas: ["V", "P", "K"],
      img: 143,
      price: 850
    }
  ];

  const [therapies, setTherapies] = useState(initialTherapies);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('60 Min');
//   const [newCategory, setNewCategory] = useState('General');
//   const [newImageId, setNewImageId] = useState('200');
  const [newPrice, setNewPrice] = useState('0');
  const [newDescription, setNewDescription] = useState('');

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newDifficulty, setNewDifficulty] = useState('Moderate');
  const [newTags, setNewTags] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [doshaV, setDoshaV] = useState(false);
  const [doshaP, setDoshaP] = useState(false);
  const [doshaK, setDoshaK] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-emerald-500 text-xs font-medium tracking-widest">MANAGEMENT</p>
            <h1 className="text-3xl font-semibold mt-1">Therapy Plans</h1>
          </div>

          <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium transition-all">
            <Plus size={18} /> Create New Template
          </button>
        </div>

        {/* Create Template Modal */}
    {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    />

    {/* Modal */}
    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Create Therapy Template
        </h3>
        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 text-lg">
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">

        {/* Card 1 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Basic Information
          </h4>

          <div>
            <label className="text-xs text-slate-500">Therapy Name</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Duration</label>
              <input
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border"
              />
            </div>
          </div>
        </div>

        {/* Card 2 - Image */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Therapy Image
          </h4>

          <div className="grid grid-cols-2 gap-4 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setNewImageFile(f);
                  setNewImagePreview(URL.createObjectURL(f));
                }
              }}
              className="text-sm"
            />

            {newImagePreview ? (
              <img
                src={newImagePreview}
                alt="preview"
                className="w-full h-28 object-cover rounded-lg border"
              />
            ) : (
              <div className="h-28 flex items-center justify-center border border-dashed rounded-lg text-slate-400 text-sm">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Pricing & Difficulty
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Price</label>
              <input
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border"
              >
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs text-slate-500">Description</label>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
            className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border"
          />
        </div>

        {/* Tags */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs text-slate-500">Tags</label>
          <input
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 dark:border-slate-700">

        <button
          onClick={() => setShowModal(false)}
          className="text-sm text-slate-500 hover:text-red-500"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            const id = `T-${Date.now()}`;
            const newItem = {
              id,
              title: newTitle || 'Untitled Therapy',
              category: newCategory || 'General',
              duration: newDuration || '60 Min',
              description: newDescription || '',
              doshas: [],
              img: 200,
              price: parseFloat(newPrice) || 0
            };

            setTherapies([newItem, ...therapies]);

            setNewTitle('');
            setNewDuration('60 Min');
            setNewCategory('General');
            setNewPrice('0');
            setNewDescription('');

            setShowModal(false);
          }}
          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
        >
          Create Therapy
        </button>

      </div>
    </div>
  </div>
)}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-1">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Active (12)
          </button>
          <button 
            onClick={() => setActiveTab('archived')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'archived' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Archived (4)
          </button>
        </div>

        {/* Therapy Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {therapies.map((therapy, i) => (
            <div key={i} className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 hover:border-emerald-600 transition-all group">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url('https://picsum.photos/id/${40 + i}/700/400')` }}
              >
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 text-xs rounded-full font-medium">
                  {therapy.duration}
                </div>
              </div>

              <div className="p-6">
                <div className="uppercase text-[10px] tracking-[1px] text-emerald-500 mb-1">{therapy.category}</div>
                <h3 className="text-lg font-semibold mb-3">{therapy.title}</h3>
                
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                  {therapy.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {therapy.doshas.map((d, idx) => (
                      <div key={idx} className="text-xs bg-slate-800 px-2.5 py-1 rounded font-mono">
                        {d}
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 text-xs font-medium">
                    Edit <Edit3 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Builder & Assign Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Plan Builder */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-7 border border-slate-700">
            <h2 className="text-xl font-semibold mb-1">Plan Builder</h2>
            <p className="text-slate-400 text-sm mb-6">Custom Protocol for Complex Cases</p>

            <div className="space-y-6">
              {[
                { step: "01", title: "TREATMENT SEQUENCE", content: "Abhyanga (Initial) → Swedana (Follow-up)" },
                { step: "02", title: "DIETARY REGIMEN", content: "Satvik diet, warm fluids, ginger water" },
                { step: "03", title: "LIFESTYLE ADVICE", content: "Morning sun exposure, meditation 15 mins" },
                { step: "04", title: "HERBAL PRESCRIPTIONS", content: "Triphala Guggulu - 2 tabs twice daily" }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-7 h-7 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-2 text-slate-300">{item.title}</p>
                    <div className="bg-slate-800 rounded-2xl p-4 text-sm text-slate-400">
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assign to Patient */}
          <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-7 border border-slate-700">
            <h3 className="text-lg font-semibold mb-5">Assign to Patient</h3>

            <input 
              type="text" 
              placeholder="Search patient name..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 px-5 text-sm mb-6 focus:outline-none focus:border-emerald-500"
            />

            <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4 mb-6">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Aditi" className="w-12 h-12 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-medium">Aditi Sharma</p>
                <p className="text-xs text-slate-400">Vata-Pitta Prakriti</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-slate-400 mb-2">START DATE</p>
              <input type="text" placeholder="mm/dd/yyyy" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 px-5 text-sm" />
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-medium text-sm transition-all mb-3">
              Deploy Therapy Plan
            </button>
            <button className="w-full py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 text-sm transition-all">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}