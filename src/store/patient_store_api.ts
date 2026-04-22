import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiClient } from "@/lib/api-client"

export interface Patient {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "MALE" | "FEMALE" | "OTHER"
  bloodGroup?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  profilePhoto?: string
  medicalHistory?: {
    allergies: string[]
    chronicDiseases: string[]
    medications: string[]
    surgeries: string[]
    hospitalizations: string[]
  }
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PatientFilter {
  page?: number
  limit?: number
  search?: string
  gender?: string
  bloodGroup?: string
  isActive?: boolean
}

interface PatientStore {
  // State
  patients: Patient[]
  totalItems: number
  totalPages: number
  currentPage: number
  loading: boolean
  error: string | null

  // Actions
  fetchPatients: (filters: PatientFilter) => Promise<void>
  createPatient: (data: Partial<Patient>) => Promise<Patient>
  updatePatient: (id: string, data: Partial<Patient>) => Promise<Patient>
  deletePatient: (id: string) => Promise<void>
  togglePatientStatus: (id: string, isActive: boolean) => Promise<Patient>
  getPatientById: (id: string) => Patient | undefined
  updateMedicalHistory: (id: string, medicalHistory: any) => Promise<Patient>
  setError: (error: string | null) => void
  clearPatients: () => void
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      // Initial state
      patients: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      loading: false,
      error: null,

      // Fetch patients with filters
      fetchPatients: async (filters: PatientFilter) => {
        set({ loading: true, error: null })
        try {
          const params = new URLSearchParams()
          if (filters.page) params.append("page", filters.page.toString())
          if (filters.limit) params.append("limit", filters.limit.toString())
          if (filters.search) params.append("search", filters.search)
          if (filters.gender) params.append("gender", filters.gender)
          if (filters.bloodGroup) params.append("bloodGroup", filters.bloodGroup)
          if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())

          const queryString = params.toString()
          const url = `/user/patients${queryString ? `?${queryString}` : ""}`

          const response = await apiClient.get<any>(url)
          console.log("✅ Patients fetched:", response)

          set({
            patients: response.data || response.patients || [],
            totalItems: response.meta?.totalItems || 0,
            totalPages: response.meta?.totalPages || 0,
            currentPage: response.meta?.page || filters.page || 1,
            loading: false,
          })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to fetch patients"
          console.error("❌ Error fetching patients:", errorMsg)
          set({ error: errorMsg, loading: false })
        }
      },

      // Create patient
      createPatient: async (data: Partial<Patient>) => {
        set({ loading: true, error: null })
        try {
          console.log("📝 Creating patient:", data)
          const response = await apiClient.post<Patient>("/user/patients", data)
          console.log("✅ Patient created:", response)

          // Add to patients list
          const { patients } = get()
          set({ patients: [response, ...patients], loading: false })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to create patient"
          console.error("❌ Error creating patient:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Update patient
      updatePatient: async (id: string, data: Partial<Patient>) => {
        set({ loading: true, error: null })
        try {
          console.log("✏️ Updating patient:", id, data)
          const response = await apiClient.put<Patient>(`/user/patients/${id}`, data)
          console.log("✅ Patient updated:", response)

          // Update in list
          const { patients } = get()
          set({
            patients: patients.map((pat) => (pat.id === id ? response : pat)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update patient"
          console.error("❌ Error updating patient:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Delete patient
      deletePatient: async (id: string) => {
        set({ loading: true, error: null })
        try {
          console.log("🗑️ Deleting patient:", id)
          await apiClient.delete(`/user/patients/${id}`)
          console.log("✅ Patient deleted")

          // Remove from list
          const { patients } = get()
          set({ patients: patients.filter((pat) => pat.id !== id), loading: false })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to delete patient"
          console.error("❌ Error deleting patient:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Toggle patient status
      togglePatientStatus: async (id: string, isActive: boolean) => {
        set({ loading: true, error: null })
        try {
          console.log("🔄 Updating patient status:", id, isActive)
          const response = await apiClient.patch<Patient>(`/user/patients/${id}/status`, { isActive })
          console.log("✅ Patient status updated:", response)

          // Update in list
          const { patients } = get()
          set({
            patients: patients.map((pat) => (pat.id === id ? response : pat)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update status"
          console.error("❌ Error updating status:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Update medical history
      updateMedicalHistory: async (id: string, medicalHistory: any) => {
        set({ loading: true, error: null })
        try {
          console.log("📋 Updating medical history:", id, medicalHistory)
          const response = await apiClient.patch<Patient>(
            `/user/patients/${id}/medical-history`,
            medicalHistory
          )
          console.log("✅ Medical history updated:", response)

          // Update in list
          const { patients } = get()
          set({
            patients: patients.map((pat) => (pat.id === id ? response : pat)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update medical history"
          console.error("❌ Error updating medical history:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Get patient by ID
      getPatientById: (id: string) => {
        return get().patients.find((pat) => pat.id === id)
      },

      // Set error
      setError: (error: string | null) => {
        set({ error })
      },

      // Clear patients
      clearPatients: () => {
        set({ patients: [], totalItems: 0, totalPages: 0, currentPage: 1, error: null })
      },
    }),
    {
      name: "patient-store",
      version: 1,
      partialize: (state) => ({
        patients: state.patients,
      }),
    }
  )
)
