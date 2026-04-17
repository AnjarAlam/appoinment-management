export type UserRole = 'superadmin' | 'admin' | 'doctor' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  contact: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  medicalHistory?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  appointmentDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  composition: string;
  dosage: string;
  stock: number;
  unit: string;
  price: number;
}

export interface TherapyPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface DiseaseMapping {
  id: string;
  disease: string;
  medicines: MappedMedicine[];
}

export interface MappedMedicine {
  medicineId: string;
  medicineName?: string;
  dosage: string;
  timing: string;
  duration: number;
  notes?: string;
}

export interface Dashboard {
  totalPatients: number;
  totalAppointments: number;
  totalMedicines: number;
  totalRevenue: number;
  appointmentsTrend: { month: string; count: number }[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'medicine' | 'therapy';
  description: string;
  timestamp: string;
}
