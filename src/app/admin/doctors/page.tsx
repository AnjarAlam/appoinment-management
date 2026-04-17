'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, Mail, Phone, Calendar, MessageSquare, Star, Award, Clock } from 'lucide-react';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  experience?: number;
  photoUrl?: string;
};

const initialDoctors: Doctor[] = [
  { 
    id: 'd1', 
    name: 'Dr. Asha Nair', 
    specialty: 'Panchakarma', 
    email: 'asha@example.com', 
    phone: '+91 98765 43210', 
    experience: 8,
    photoUrl: 'https://i.pravatar.cc/150?u=d1'
  },
  { 
    id: 'd2', 
    name: 'Dr. Rohit Desai', 
    specialty: 'Kayachikitsa', 
    email: 'rohit@example.com', 
    phone: '+91 91234 56789', 
    experience: 12,
    photoUrl: 'https://i.pravatar.cc/150?u=d2'
  },
  { 
    id: 'd3', 
    name: 'Dr. Meera Kapoor', 
    specialty: 'Shalya', 
    email: 'meera@example.com', 
    phone: '+91 99887 77665', 
    experience: 5,
    photoUrl: 'https://i.pravatar.cc/150?u=d3'
  },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState<number | ''>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLFormElement>(null);

  // Image Preview
  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  // GSAP Animation for Cards
  useEffect(() => {
    if (!cardsRef.current) return;

    import('gsap').then(({ gsap }) => {
      gsap.fromTo(
        cardsRef.current!.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: 0.07,
          duration: 0.6,
          ease: 'power3.out'
        }
      );
    });
  }, [doctors]);

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

  const resetForm = () => {
    setName('');
    setSpecialty('');
    setEmail('');
    setPhone('');
    setExperience('');
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim()) return;

    const newDoctor: Doctor = {
      id: `d${Date.now()}`,
      name: name.trim(),
      specialty: specialty.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      experience: experience === '' ? undefined : Number(experience),
      photoUrl: photoPreview || undefined,
    };

    setDoctors(prev => [newDoctor, ...prev]);
    resetForm();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] p-3 lg:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Award className="text-white" size={18} />
            </div>
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-wider">PRACTITIONERS</p>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Our Doctors</h1>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 pl-11">Manage and organize healthcare professionals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium shadow text-xs transition-all"
        >
          <Plus size={16} />
          Add Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      <div 
        ref={cardsRef} 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5 h-72 flex flex-col"
          >
            {/* Banner */}
            <div className="h-20 bg-gradient-to-r from-pink-100 via-amber-100 to-emerald-100 dark:from-slate-800 dark:to-slate-900" />

            {/* Avatar + Body */}
            <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="-mt-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-emerald-50">
                    {doctor.photoUrl ? (
                      <Image src={doctor.photoUrl} alt={doctor.name} width={64} height={64} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900">
                        <span className="text-lg font-bold text-emerald-700 dark:text-emerald-200">{doctor.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{doctor.name}</h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-0.5">{doctor.specialty}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs shadow">Edit</button>
                      <button className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs shadow">Follow</button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Experienced practitioner in traditional Ayurvedic therapies. Focused on individualised care and Panchakarma.</p>

                  <div className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="break-words"><strong className="text-slate-900 dark:text-white mr-1 text-sm">Email:</strong> {doctor.email ?? '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span className="break-words"><strong className="text-slate-900 dark:text-white mr-1 text-sm">Phone:</strong> {doctor.phone ?? '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span><strong className="text-slate-900 dark:text-white mr-1 text-sm">Experience:</strong> {doctor.experience ?? '—'} yrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <form
            ref={modalRef}
            onSubmit={handleAddDoctor}
            className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-semibold">Add New Doctor</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter practitioner details</p>
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
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition text-sm"
                />

                <input
                  placeholder="Specialty (e.g. Panchakarma)"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition text-sm"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition text-sm"
                  />
                  <input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition text-sm"
                  />
                </div>

                <input
                  type="number"
                  placeholder="Years of Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value === '' ? '' : Number(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 transition text-sm"
                />

                <div>
                  <label className="block text-sm text-slate-500 mb-2">Profile Photo</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 dark:file:bg-emerald-900 dark:file:text-emerald-300"
                  />
                  {photoPreview && (
                    <div className="mt-4">
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        width={120}
                        height={120}
                        className="rounded-2xl object-cover shadow-md"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t dark:border-slate-800 px-6 py-4 flex gap-3 bg-slate-50 dark:bg-slate-950">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg text-sm transition"
              >
                Add Doctor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}