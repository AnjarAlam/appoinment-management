import { z } from "zod"

/**
 * ============================================
 * APPOINTMENT VALIDATION SCHEMAS
 * ============================================
 */

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  hospitalId: z.string().min(1, "Hospital is required"),
  symptoms: z.string().min(3, "Symptoms must be at least 3 characters").max(500, "Symptoms cannot exceed 500 characters"),
  notes: z.string().optional(),
  appointmentDate: z.string().refine((date) => {
    const d = new Date(date)
    return d >= new Date()
  }, "Appointment date must be in the future"),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
  duration: z.number().int().min(15, "Duration must be at least 15 minutes").max(480, "Duration cannot exceed 8 hours"),
  consultationType: z.enum(["ONLINE", "OFFLINE"], {
    errorMap: () => ({ message: "Consultation type must be ONLINE or OFFLINE" }),
  }),
})

export const updateAppointmentSchema = createAppointmentSchema.partial()

export const appointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"], {
    errorMap: () => ({ message: "Invalid appointment status" }),
  }),
})

export const appointmentFilterSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  doctorId: z.string().optional(),
  patientId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  hospitalId: z.string().optional(),
})

/**
 * ============================================
 * DOCTOR VALIDATION SCHEMAS
 * ============================================
 */

export const createDoctorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().min(1, "License number is required").max(50),
  experience: z.number().int().min(0, "Experience cannot be negative").max(70, "Experience seems invalid"),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  hospitalId: z.string().optional(),
})

export const updateDoctorSchema = createDoctorSchema.partial()

export const doctorStatusSchema = z.object({
  isActive: z.boolean(),
})

export const doctorFilterSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  specialization: z.string().optional(),
  hospitalId: z.string().optional(),
  isActive: z.boolean().optional(),
})

/**
 * ============================================
 * PATIENT VALIDATION SCHEMAS
 * ============================================
 */

export const createPatientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
  dateOfBirth: z.string().refine((date) => {
    const d = new Date(date)
    const now = new Date()
    const age = now.getFullYear() - d.getFullYear()
    return age >= 1 && age <= 150
  }, "Invalid date of birth"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Gender must be MALE, FEMALE, or OTHER" }),
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().regex(/^\d{4,10}$/, "Invalid zip code").optional(),
  medicalHistory: z.object({
    allergies: z.array(z.string()).optional(),
    chronicDiseases: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    surgeries: z.array(z.string()).optional(),
    hospitalizations: z.array(z.string()).optional(),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^[0-9+\-\s()]{7,20}$/),
    relation: z.string().min(2),
  }).optional(),
})

export const updatePatientSchema = createPatientSchema.partial()

export const patientStatusSchema = z.object({
  isActive: z.boolean(),
})

export const medicalHistorySchema = z.object({
  allergies: z.array(z.string()).optional(),
  chronicDiseases: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  surgeries: z.array(z.string()).optional(),
  hospitalizations: z.array(z.string()).optional(),
})

export const patientFilterSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  isActive: z.boolean().optional(),
})

/**
 * ============================================
 * ADMIN USER VALIDATION SCHEMAS
 * ============================================
 */

export const createAdminUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").max(50),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "HOSPITAL_ADMIN"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
  permissions: z.array(z.string()).optional(),
  hospitalId: z.string().optional(),
})

export const updateAdminUserSchema = createAdminUserSchema.partial().omit({ password: true })

export const adminUserStatusSchema = z.object({
  isActive: z.boolean(),
})

export const permissionsSchema = z.object({
  permissions: z.array(z.string().min(1, "Permission cannot be empty")),
})

export const adminUserFilterSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  hospitalId: z.string().optional(),
})

export const userListFilterSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
})

/**
 * ============================================
 * TYPE EXPORTS FOR FORM DATA
 * ============================================
 */

export type CreateAppointment = z.infer<typeof createAppointmentSchema>
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>

export type CreateDoctor = z.infer<typeof createDoctorSchema>
export type UpdateDoctor = z.infer<typeof updateDoctorSchema>

export type CreatePatient = z.infer<typeof createPatientSchema>
export type UpdatePatient = z.infer<typeof updatePatientSchema>
export type MedicalHistory = z.infer<typeof medicalHistorySchema>

export type CreateAdminUser = z.infer<typeof createAdminUserSchema>
export type UpdateAdminUser = z.infer<typeof updateAdminUserSchema>
export type Permissions = z.infer<typeof permissionsSchema>
