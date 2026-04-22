import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiClient } from "@/lib/api-client"

export interface Doctor {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number // in years
  bio?: string
  profilePhoto?: string
  hospital?: {
    id: string
    name: string
  }
  isActive: boolean
  schedule?: {
    monday: { start: string; end: string }
    tuesday: { start: string; end: string }
    wednesday: { start: string; end: string }
    thursday: { start: string; end: string }
    friday: { start: string; end: string }
    saturday: { start: string; end: string }
    sunday: { start: string; end: string }
  }
  createdAt: string
  updatedAt: string
}

export interface DoctorFilter {
  page?: number
  limit?: number
  search?: string
  specialization?: string
  hospitalId?: string
  isActive?: boolean
}

interface DoctorStore {
  // State
  doctors: Doctor[]
  totalItems: number
  totalPages: number
  currentPage: number
  loading: boolean
  error: string | null
  specializations: string[]

  // Actions
  fetchDoctors: (filters: DoctorFilter) => Promise<void>
  createDoctor: (data: Partial<Doctor>) => Promise<Doctor>
  updateDoctor: (id: string, data: Partial<Doctor>) => Promise<Doctor>
  deleteDoctor: (id: string) => Promise<void>
  toggleDoctorStatus: (id: string, isActive: boolean) => Promise<Doctor>
  getDoctorById: (id: string) => Doctor | undefined
  fetchSpecializations: () => Promise<void>
  setError: (error: string | null) => void
  clearDoctors: () => void
}

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      doctors: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      loading: false,
      error: null,
      specializations: [
        "Vaidya (Ayurvedic Physician)",
        "Panchakarma Specialist",
        "Dermatologist",
        "Orthopedic",
        "Gynecologist",
        "Pediatrician",
        "General Physician",
      ],

      // Fetch doctors with filters
      fetchDoctors: async (filters: DoctorFilter) => {
        set({ loading: true, error: null })
        try {
          const params = new URLSearchParams()
          if (filters.page) params.append("page", filters.page.toString())
          if (filters.limit) params.append("limit", filters.limit.toString())
          if (filters.search) params.append("search", filters.search)
          if (filters.specialization) params.append("specialization", filters.specialization)
          if (filters.hospitalId) params.append("hospitalId", filters.hospitalId)
          if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())

          const queryString = params.toString()
          const url = `/user/doctors${queryString ? `?${queryString}` : ""}`

          const response = await apiClient.get<any>(url)
          console.log("✅ Doctors fetched:", response)

          set({
            doctors: response.data || response.doctors || [],
            totalItems: response.meta?.totalItems || 0,
            totalPages: response.meta?.totalPages || 0,
            currentPage: response.meta?.page || filters.page || 1,
            loading: false,
          })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to fetch doctors"
          console.error("❌ Error fetching doctors:", errorMsg)
          set({ error: errorMsg, loading: false })
        }
      },

      // Create doctor
      createDoctor: async (data: Partial<Doctor>) => {
        set({ loading: true, error: null })
        try {
          console.log("📝 Creating doctor:", data)
          const response = await apiClient.post<Doctor>("/user/doctors", data)
          console.log("✅ Doctor created:", response)

          // Add to doctors list
          const { doctors } = get()
          set({ doctors: [response, ...doctors], loading: false })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to create doctor"
          console.error("❌ Error creating doctor:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Update doctor
      updateDoctor: async (id: string, data: Partial<Doctor>) => {
        set({ loading: true, error: null })
        try {
          console.log("✏️ Updating doctor:", id, data)
          const response = await apiClient.put<Doctor>(`/user/doctors/${id}`, data)
          console.log("✅ Doctor updated:", response)

          // Update in list
          const { doctors } = get()
          set({
            doctors: doctors.map((doc) => (doc.id === id ? response : doc)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update doctor"
          console.error("❌ Error updating doctor:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Delete doctor
      deleteDoctor: async (id: string) => {
        set({ loading: true, error: null })
        try {
          console.log("🗑️ Deleting doctor:", id)
          await apiClient.delete(`/user/doctors/${id}`)
          console.log("✅ Doctor deleted")

          // Remove from list
          const { doctors } = get()
          set({ doctors: doctors.filter((doc) => doc.id !== id), loading: false })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to delete doctor"
          console.error("❌ Error deleting doctor:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Toggle doctor status
      toggleDoctorStatus: async (id: string, isActive: boolean) => {
        set({ loading: true, error: null })
        try {
          console.log("🔄 Updating doctor status:", id, isActive)
          const response = await apiClient.patch<Doctor>(`/user/doctors/${id}/status`, { isActive })
          console.log("✅ Doctor status updated:", response)

          // Update in list
          const { doctors } = get()
          set({
            doctors: doctors.map((doc) => (doc.id === id ? response : doc)),
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

      // Get doctor by ID
      getDoctorById: (id: string) => {
        return get().doctors.find((doc) => doc.id === id)
      },

      // Fetch specializations
      fetchSpecializations: async () => {
        try {
          const response = await apiClient.get<string[]>("/user/doctors/specializations")
          set({ specializations: response })
        } catch (error: any) {
          console.error("❌ Error fetching specializations:", error)
          // Keep default specializations
        }
      },

      // Set error
      setError: (error: string | null) => {
        set({ error })
      },

      // Clear doctors
      clearDoctors: () => {
        set({ doctors: [], totalItems: 0, totalPages: 0, currentPage: 1, error: null })
      },
    }),
    {
      name: "doctor-store",
      version: 1,
      partialize: (state) => ({
        doctors: state.doctors,
        specializations: state.specializations,
      }),
    }
  )
)
