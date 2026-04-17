'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, X, Mail, Phone, Calendar, Trash2, Edit2, 
  Users, Award, User
} from 'lucide-react';

type ReceptionStaff = {
  id: string;
  staffId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  education: string;
  email: string;
  phone: string;
  password: string;
  photoUrl?: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
};

const initialStaff: ReceptionStaff[] = [
  {
    id: '1',
    staffId: 'REC001',
    name: 'Priya Singh',
    age: 28,
    gender: 'Female',
    education: 'B.Sc, Diploma in Hospital Management',
    email: 'priya@clinic.com',
    phone: '+91 98765 43210',
    password: 'Priya@123456',
    photoUrl: 'https://i.pravatar.cc/150?u=rec1',
    createdAt: '2026-04-10',
    status: 'Active'
  },
  {
    id: '2',
    staffId: 'REC002',
    name: 'Rahul Verma',
    age: 32,
    gender: 'Male',
    education: 'B.Sc, Certification in Healthcare',
    email: 'rahul@clinic.com',
    phone: '+91 91234 56789',
    password: 'Rahul@123456',
    photoUrl: 'https://i.pravatar.cc/150?u=rec2',
    createdAt: '2026-04-12',
    status: 'Active'
  },
];

export default function ReceptionPage() {
  const [isDark, setIsDark] = useState(false);
  const [staff, setStaff] = useState<ReceptionStaff[]>(initialStaff);
  const [showModal, setShowModal] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLFormElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [education, setEducation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme === 'dark');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

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

  const generateStaffId = () => {
    const count = staff.length + 1;
    return `REC${String(count).padStart(3, '0')}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setGender('Male');
    setEducation('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !email || !phone || !password) return;

    const newStaff: ReceptionStaff = {
      id: `${Date.now()}`,
      staffId: generateStaffId(),
      name: name.trim(),
      age: Number(age),
      gender,
      education: education.trim() || 'Not specified',
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim(),
      photoUrl: photoPreview || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setStaff([newStaff, ...staff]);
    resetForm();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  const copyPassword = (pwd: string, id: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedPassword(id);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-3 lg:p-4`}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-cyan-600/20' : 'bg-cyan-100'}`}>
              <Users className={isDark ? 'text-cyan-400' : 'text-cyan-600'} size={18} />
            </div>
            <div>
              <p className={`text-cyan-600 dark:text-cyan-400 text-xs font-medium tracking-wider`}>RECEPTION TEAM</p>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Staff Management</h1>
            </div>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'} mt-0.5 pl-10`}>Manage reception staff and credentials</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium shadow text-xs transition-all"
        >
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      {/* STAFF GRID */}
      <div 
        ref={cardsRef} 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {staff.map((member) => (
          <article
            key={member.id}
            className={`relative rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5 h-auto flex flex-col ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Banner */}
            <div className="h-16 bg-gradient-to-r from-cyan-100 via-blue-100 to-emerald-100 dark:from-slate-800 dark:to-slate-900" />

            {/* Avatar + Body */}
            <div className="p-3 pt-2 flex-1 flex flex-col">
              <div className="flex items-start gap-2">
                <div className="-mt-8 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-cyan-50">
                    {member.photoUrl ? (
                      <Image src={member.photoUrl} alt={member.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cyan-100 dark:bg-cyan-900">
                        <span className="text-sm font-bold text-cyan-700 dark:text-cyan-200">{member.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{member.name}</h3>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{member.staffId}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className={`px-1.5 py-0.5 rounded-md text-xs shadow transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => deleteStaff(member.id)} className={`px-1.5 py-0.5 rounded-md text-xs shadow transition ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-2 space-y-0.5 text-xs">
                    <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      <strong className={`mr-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Age:</strong> {member.age} yrs
                    </div>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      <strong className={`mr-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Gender:</strong> {member.gender}
                    </div>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      <strong className={`mr-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Education:</strong> {member.education}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'} title={member.email}>{member.email.split('@')[0]}...</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{member.phone}</span>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className={`mt-2 p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <p className={`text-xs mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Password</p>
                    <div className="flex items-center justify-between gap-1">
                      <code className={`text-xs font-mono flex-1 truncate ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                        {copiedPassword === member.id ? member.password : '••••••••'}
                      </code>
                      <button
                        onClick={() => copyPassword(member.password, member.id)}
                        className={`px-1.5 py-0.5 rounded text-xs transition ${
                          copiedPassword === member.id
                            ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                            : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {copiedPassword === member.id ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'Active'
                        ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                        : isDark ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

    {/* ADD RECEPTION STAFF MODAL */}
    {showModal && (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
        isDark ? 'bg-black/70' : 'bg-black/50'
      }`}>
        <form
          ref={modalRef}
          onSubmit={handleAddStaff}
          className={`rounded-lg w-full max-w-md shadow-xl overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'}`}
        >
          <div className={`px-5 pt-5 pb-4`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add Reception Staff</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Create new staff account</p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className={`${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'} transition p-1`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Name */}
              <input
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                } focus:outline-none focus:border-emerald-500`}
              />

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Age *"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  min="18"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:border-emerald-500`}
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  } focus:outline-none focus:border-emerald-500`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Education */}
              <input
                placeholder="Education (e.g. B.Sc, Diploma)"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                } focus:outline-none focus:border-emerald-500`}
              />

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:border-emerald-500`}
                />
                <input
                  placeholder="Phone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:border-emerald-500`}
                />
              </div>

              {/* Password */}
              <div>
                <label className={`block text-xs mb-1 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password *
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } focus:outline-none focus:border-emerald-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setPassword(generatePassword())}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition ${
                      isDark
                        ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                        : 'bg-slate-100 text-cyan-600 hover:bg-slate-200'
                    }`}
                    title="Generate password"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <label className={`block text-xs mb-1 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Profile Photo
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className={`w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium ${
                    isDark
                      ? 'file:bg-emerald-900 file:text-emerald-300 hover:file:bg-emerald-800'
                      : 'file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200'
                  }`}
                />
                {photoPreview && (
                  <div className="mt-2">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-lg object-cover w-20 h-20"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Staff ID Preview */}
              {/* <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Auto Generated ID
                </p>
                <p className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {generateStaffId()}
                </p>
              </div> */}
            </div>
          </div>

          <div className={`px-4 py-3 flex gap-2 border-t ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <button
              type="button"
              onClick={handleCloseModal}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    )}
    </div>
  );
}