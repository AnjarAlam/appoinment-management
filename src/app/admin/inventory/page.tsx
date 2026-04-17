'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, Edit2, Trash2, Package, AlertCircle, Check } from 'lucide-react';

type Medicine = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  diseases: string[];
  manufacturer?: string;
  price?: number;
  expiryDate?: string;
};

const diseasesList = ['BP', 'Diabetes', 'Fever', 'Cough', 'Asthma', 'Arthritis', 'Digestion', 'Immunity', 'Skin', 'Joint Pain'];

const initialMedicines: Medicine[] = [
  { id: 'm1', name: 'Ashwagandha Powder', quantity: 50, unit: 'kg', diseases: ['Immunity', 'Stress'], manufacturer: 'Himalaya', price: 450 },
  { id: 'm2', name: 'Triphala Churna', quantity: 30, unit: 'kg', diseases: ['Digestion'], manufacturer: 'Dabur', price: 320 },
  { id: 'm3', name: 'Brahmi Oil', quantity: 20, unit: 'liters', diseases: ['Stress', 'Immunity'], manufacturer: 'Patanjali', price: 250 },
  { id: 'm4', name: 'Neem Tablets', quantity: 100, unit: 'boxes', diseases: ['Skin'], manufacturer: 'Organic', price: 199 },
  { id: 'm5', name: 'Turmeric Powder', quantity: 60, unit: 'kg', diseases: ['Arthritis', 'Inflammation'], manufacturer: 'Pure', price: 280 },
];

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add/Edit form
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('kg');
  const [diseases, setDiseases] = useState<string[]>([]);
  const [manufacturer, setManufacturer] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');

  const cardsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLFormElement>(null);

  // GSAP Animation for Cards
  useEffect(() => {
    if (!cardsRef.current) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        cardsRef.current!.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
      );
    });
  }, [medicines]);

  // Modal Animation
  useEffect(() => {
    if (!showAddModal || !modalRef.current) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    });
  }, [showAddModal]);

  function resetForm() {
    setName('');
    setQuantity('');
    setUnit('kg');
    setDiseases([]);
    setManufacturer('');
    setPrice('');
    setExpiryDate('');
    setEditingId(null);
  }

  function handleToggleDisease(disease: string) {
    setDiseases(prev => 
      prev.includes(disease) 
        ? prev.filter(d => d !== disease)
        : [...prev, disease]
    );
  }

  function handleAddMedicine(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || quantity === '' || !diseases.length) return;

    if (editingId) {
      setMedicines(prev => prev.map(m => 
        m.id === editingId 
          ? { ...m, name: name.trim(), quantity: Number(quantity), unit, diseases, manufacturer, price: price === '' ? undefined : Number(price), expiryDate }
          : m
      ));
    } else {
      const newMedicine: Medicine = {
        id: `m_${Date.now()}`,
        name: name.trim(),
        quantity: Number(quantity),
        unit,
        diseases,
        manufacturer,
        price: price === '' ? undefined : Number(price),
        expiryDate,
      };
      setMedicines(prev => [newMedicine, ...prev]);
    }

    resetForm();
    setShowAddModal(false);
  }

  function handleEditMedicine(medicine: Medicine) {
    setName(medicine.name);
    setQuantity(medicine.quantity);
    setUnit(medicine.unit);
    setDiseases(medicine.diseases);
    setManufacturer(medicine.manufacturer || '');
    setPrice(medicine.price || '');
    setExpiryDate(medicine.expiryDate || '');
    setEditingId(medicine.id);
    setShowAddModal(true);
  }

  function handleDeleteMedicine(id: string) {
    setMedicines(prev => prev.filter(m => m.id !== id));
  }

  function handleCloseModal() {
    setShowAddModal(false);
    resetForm();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={18} />
            </div>
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-wider">PHARMACY</p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Inventory</h1>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 pl-11">Manage medicines, stock, and disease assignments</p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg text-sm transition-all"
        >
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Medicines</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{medicines.length}</h3>
            </div>
            <Package className="text-emerald-600" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock (&lt;20)</p>
              <h3 className="text-3xl font-semibold text-amber-600 mt-2">{medicines.filter(m => m.quantity < 20).length}</h3>
            </div>
            <AlertCircle className="text-amber-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Value</p>
              <h3 className="text-3xl font-semibold text-emerald-600 mt-2">₹{medicines.reduce((acc, m) => acc + ((m.price || 0) * m.quantity), 0)}</h3>
            </div>
            <Check className="text-emerald-600" size={32} />
          </div>
        </div>
      </div>

      {/* Medicine Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicines.map((medicine) => (
          <article
            key={medicine.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{medicine.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{medicine.manufacturer || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditMedicine(medicine)}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteMedicine(medicine.id)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Quantity Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Stock</span>
                <span className={`text-sm font-semibold ${medicine.quantity < 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {medicine.quantity} {medicine.unit}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${medicine.quantity < 20 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min((medicine.quantity / 100) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Price */}
            {medicine.price && (
              <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Price per unit</p>
                <p className="text-lg font-semibold text-emerald-600">₹{medicine.price}</p>
              </div>
            )}

            {/* Diseases */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">For Diseases</p>
              <div className="flex flex-wrap gap-2">
                {medicine.diseases.map(disease => (
                  <span
                    key={disease}
                    className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-medium"
                  >
                    {disease}
                  </span>
                ))}
              </div>
            </div>

            {/* Expiry */}
            {medicine.expiryDate && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Add/Edit Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <form
            ref={modalRef}
            onSubmit={handleAddMedicine}
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Enter medicine details and disease assignments</p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-2"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <input
                  placeholder="Medicine Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition"
                />

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    min="1"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="boxes">boxes</option>
                    <option value="bottles">bottles</option>
                    <option value="tablets">tablets</option>
                  </select>
                </div>

                {/* Manufacturer & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <input
                    type="number"
                    placeholder="Price per unit (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Expiry Date */}
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition"
                />

                {/* Disease Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">Assign to Diseases</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {diseasesList.map(disease => (
                      <button
                        key={disease}
                        type="button"
                        onClick={() => handleToggleDisease(disease)}
                        className={`px-4 py-2.5 rounded-2xl transition font-medium ${
                          diseases.includes(disease)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {disease}
                      </button>
                    ))}
                  </div>
                  {!diseases.length && <p className="text-xs text-red-600 mt-2">Select at least one disease</p>}
                </div>
              </div>
            </div>

            <div className="border-t dark:border-slate-800 px-8 py-6 flex gap-4 bg-slate-50 dark:bg-slate-950">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-2xl transition"
              >
                {editingId ? 'Update Medicine' : 'Add Medicine'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
