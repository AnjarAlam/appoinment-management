'use client';

import { useEffect, useState } from 'react';
import {
  Network,
  Building2,
  Users,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Shield,
  User2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function NetworkPage() {
  const [isDark, setIsDark] = useState(true);
  const [expandedHospitals, setExpandedHospitals] = useState<number[]>([1]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clinic-theme');
    setIsDark(savedTheme !== 'light');

    const handleThemeChange = (e: any) => setIsDark(e.detail.isDark);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Hospital hierarchy data
  const hospitalNetwork = [
    {
      id: 1,
      name: 'Surya Medical Centre',
      location: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      status: 'Active',
      admin: {
        id: 1,
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@surya.com',
        phone: '+91 98765 43210',
        staff: [
          { id: 1, name: 'Dr. Ananya Sharma', role: 'Doctor', specialization: 'Cardiology', email: 'ananya@surya.com', phone: '+91 98765 43220' },
          { id: 2, name: 'Dr. Vikram Desai', role: 'Doctor', specialization: 'Neurology', email: 'vikram@surya.com', phone: '+91 98765 43221' },
          { id: 3, name: 'Priya Singh', role: 'Receptionist', specialization: 'Front Desk', email: 'priya@surya.com', phone: '+91 98765 43222' },
          { id: 4, name: 'Rahul Verma', role: 'Receptionist', specialization: 'Patient Coordination', email: 'rahul@surya.com', phone: '+91 98765 43223' },
          { id: 5, name: 'Dr. Arjun Kumar', role: 'Doctor', specialization: 'Orthopedics', email: 'arjun@surya.com', phone: '+91 98765 43231' },
          { id: 6, name: 'Sneha Kapoor', role: 'Receptionist', specialization: 'Scheduling', email: 'sneha@surya.com', phone: '+91 98765 43232' },
        ],
      },
    },
    {
      id: 2,
      name: 'Kerala Ayurveda Bhavan',
      location: 'Kochi, Kerala',
      city: 'Kochi',
      status: 'Active',
      admin: {
        id: 3,
        name: 'Dr. Priya Sharma',
        email: 'priya@kerala.com',
        phone: '+91 98765 43211',
        staff: [
          { id: 7, name: 'Dr. Deepak Nair', role: 'Doctor', specialization: 'Ayurveda', email: 'deepak@kerala.com', phone: '+91 98765 43240' },
          { id: 8, name: 'Dr. Lakshmi Menon', role: 'Doctor', specialization: 'Panchakarma', email: 'lakshmi@kerala.com', phone: '+91 98765 43241' },
          { id: 9, name: 'Anu Mathew', role: 'Receptionist', specialization: 'Appointments', email: 'anu@kerala.com', phone: '+91 98765 43242' },
        ],
      },
    },
    {
      id: 3,
      name: 'Lotus Health Hub',
      location: 'Bangalore, Karnataka',
      city: 'Bangalore',
      status: 'Active',
      admin: {
        id: 4,
        name: 'Dr. Amit Desai',
        email: 'amit@lotus.com',
        phone: '+91 98765 43212',
        staff: [
          { id: 10, name: 'Dr. Ravi Krishnan', role: 'Doctor', specialization: 'Dermatology', email: 'ravi@lotus.com', phone: '+91 98765 43250' },
          { id: 11, name: 'Dr. Neha Singh', role: 'Doctor', specialization: 'Pediatrics', email: 'neha@lotus.com', phone: '+91 98765 43251' },
          { id: 12, name: 'Kavya Reddy', role: 'Receptionist', specialization: 'Billing', email: 'kavya@lotus.com', phone: '+91 98765 43252' },
          { id: 13, name: 'Sanjay Gupta', role: 'Receptionist', specialization: 'Records', email: 'sanjay@lotus.com', phone: '+91 98765 43253' },
        ],
      },
    },
    {
      id: 4,
      name: 'Himalayan Wellness Centre',
      location: 'Delhi, Delhi',
      city: 'Delhi',
      status: 'Active',
      admin: {
        id: 5,
        name: 'Dr. Vikram Singh',
        email: 'vikram@himalayan.com',
        phone: '+91 98765 43213',
        staff: [
          { id: 14, name: 'Dr. Nikhil Sharma', role: 'Doctor', specialization: 'General Medicine', email: 'nikhil@himalayan.com', phone: '+91 98765 43260' },
          { id: 15, name: 'Ritika Joshi', role: 'Receptionist', specialization: 'Front Desk', email: 'ritika@himalayan.com', phone: '+91 98765 43261' },
          { id: 16, name: 'Dr. Hassan Khan', role: 'Doctor', specialization: 'Cardiology', email: 'hassan@himalayan.com', phone: '+91 98765 43262' },
          { id: 17, name: 'Zara Malik', role: 'Receptionist', specialization: 'Patient Care', email: 'zara@himalayan.com', phone: '+91 98765 43263' },
        ],
      },
    },
  ];

  const toggleHospital = (id: number) => {
    setExpandedHospitals(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  // KPI Cards
  const kpis = [
    {
      title: 'Total Hospitals',
      value: '4',
      icon: Building2,
      color: 'blue',
      details: 'All active and operational',
    },
    {
      title: 'Total Administrators',
      value: '4',
      icon: Shield,
      color: 'purple',
      details: 'Managing hospitals',
    },
    {
      title: 'Total Staff Members',
      value: '23',
      icon: Users,
      color: 'emerald',
      details: 'Doctors & Receptionists',
    },
    {
      title: 'Network Health',
      value: '100%',
      icon: Users,
      color: 'amber',
      details: 'All systems operational',
    },
  ];

  return (
    <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen p-3 sm:p-4 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network size={20} className="text-indigo-600" />
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Healthcare Network
            </h1>
          </div>
          <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} text-xs`}>
            Complete organizational hierarchy showing hospitals, administrators, and staff
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((stat, i) => {
            const Icon = stat.icon;
            const bgColor = {
              blue: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
              purple: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
              emerald: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
              amber: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            }[stat.color];
            const textColor = {
              blue: 'text-blue-600',
              purple: 'text-purple-600',
              emerald: 'text-emerald-600',
              amber: 'text-amber-600',
            }[stat.color];

            return (
              <div
                key={i}
                className={`rounded-lg border p-3 shadow-sm hover:shadow-md transition-all duration-200 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon size={18} className={textColor} />
                  </div>
                </div>
                <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {stat.details}
                </p>
              </div>
            );
          })}
        </div>

        {/* NETWORK HIERARCHY */}
        <div className="space-y-3">
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Organizational Structure
          </h2>

          {hospitalNetwork.map((hospital) => (
            <div key={hospital.id} className={`rounded-xl border overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* HOSPITAL HEADER */}
              <button
                onClick={() => toggleHospital(hospital.id)}
                className={`w-full p-3 flex items-center justify-between hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} transition ${
                  isDark ? 'bg-slate-900' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {hospital.name}
                    </h3>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <MapPin size={11} /> {hospital.location}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ml-auto ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    ● {hospital.status}
                  </span>
                </div>
                <div className={`p-1 rounded transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}>
                  {expandedHospitals.includes(hospital.id) ? (
                    <ChevronUp size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                  ) : (
                    <ChevronDown size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                  )}
                </div>
              </button>

              {/* HOSPITAL CONTENT */}
              {expandedHospitals.includes(hospital.id) && (
                <div className={`border-t space-y-3 p-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  {hospital.admin && (
                    <div className={`rounded-lg border p-3 ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {/* ADMIN SECTION */}
                      <div className="flex items-start gap-3 mb-3 pb-3 border-b" style={{borderColor: isDark ? '#334155' : '#e2e8f0'}}>
                        <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                          <Shield size={18} className="text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            ADMINISTRATOR
                          </p>
                          <h4 className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {hospital.admin.name}
                          </h4>
                          <div className={`text-xs space-y-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <p className="flex items-center gap-1">
                              <Mail size={11} /> {hospital.admin.email}
                            </p>
                            <p className="flex items-center gap-1">
                              <Phone size={11} /> {hospital.admin.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* STAFF SECTION */}
                      <div>
                        <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          STAFF ({hospital.admin.staff.length})
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {hospital.admin.staff.map((staff: any) => (
                            <div key={staff.id} className={`rounded-lg p-2 border ${
                              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                            }`}>
                              <div className="flex items-start gap-2">
                                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                                  staff.role === 'Doctor'
                                    ? isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                                    : isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'
                                }`}>
                                  {staff.role === 'Doctor' ? (
                                    <Stethoscope size={14} className="text-emerald-600" />
                                  ) : (
                                    <User2 size={14} className="text-cyan-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className={`text-xs font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {staff.name}
                                  </h5>
                                  <p className={`text-xs mb-1 ${
                                    staff.role === 'Doctor'
                                      ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                                      : isDark ? 'text-cyan-400' : 'text-cyan-700'
                                  } font-medium`}>
                                    {staff.role} • {staff.specialization}
                                  </p>
                                  <div className={`text-xs space-y-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                                    <p className="flex items-center gap-1 truncate">
                                      <Mail size={11} /> {staff.email}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <Phone size={11} /> {staff.phone}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
