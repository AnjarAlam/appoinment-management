import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiClient } from "@/lib/api-client"

export interface Appointment {
  id: string
  appointmentId: string
  patientId: string
  patientName?: string
  doctorId: string
  doctorName?: string
  hospitalId: string
  symptoms: string
  notes?: string
  status: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  appointmentDate: string
  appointmentTime: string
  duration: number // in minutes
  consultationType: "ONLINE" | "OFFLINE"
  createdAt: string
  updatedAt: string
}

export interface AppointmentFilter {
  page?: number
  limit?: number
  search?: string
  status?: string
  doctorId?: string
  patientId?: string
  dateFrom?: string
  dateTo?: string
  hospitalId?: string
}

interface AppointmentStore {
  // State
  appointments: Appointment[]
  totalItems: number
  totalPages: number
  currentPage: number
  loading: boolean
  error: string | null

  // Actions
  fetchAppointments: (filters: AppointmentFilter) => Promise<void>
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<Appointment>
  deleteAppointment: (id: string) => Promise<void>
  updateAppointmentStatus: (id: string, status: string) => Promise<Appointment>
  getAppointmentById: (id: string) => Appointment | undefined
  setError: (error: string | null) => void
  clearAppointments: () => void
}

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      appointments: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      loading: false,
      error: null,

      // Fetch appointments with filters
      fetchAppointments: async (filters: AppointmentFilter) => {
        set({ loading: true, error: null })
        try {
          const params = new URLSearchParams()
          if (filters.page) params.append("page", filters.page.toString())
          if (filters.limit) params.append("limit", filters.limit.toString())
          if (filters.search) params.append("search", filters.search)
          if (filters.status) params.append("status", filters.status)
          if (filters.doctorId) params.append("doctorId", filters.doctorId)
          if (filters.patientId) params.append("patientId", filters.patientId)
          if (filters.dateFrom) params.append("dateFrom", filters.dateFrom)
          if (filters.dateTo) params.append("dateTo", filters.dateTo)
          if (filters.hospitalId) params.append("hospitalId", filters.hospitalId)

          const queryString = params.toString()
          const url = `/appointments${queryString ? `?${queryString}` : ""}`

          const response = await apiClient.get<any>(url)
          console.log("✅ Appointments fetched:", response)

          set({
            appointments: response.data || response.appointments || [],
            totalItems: response.meta?.totalItems || 0,
            totalPages: response.meta?.totalPages || 0,
            currentPage: response.meta?.page || filters.page || 1,
            loading: false,
          })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to fetch appointments"
          console.error("❌ Error fetching appointments:", errorMsg)
          set({ error: errorMsg, loading: false })
        }
      },

      // Create appointment
      createAppointment: async (data: Partial<Appointment>) => {
        set({ loading: true, error: null })
        try {
          console.log("📝 Creating appointment:", data)
          const response = await apiClient.post<Appointment>("/appointments", data)
          console.log("✅ Appointment created:", response)

          // Add to appointments list
          const { appointments } = get()
          set({ appointments: [response, ...appointments], loading: false })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to create appointment"
          console.error("❌ Error creating appointment:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Update appointment
      updateAppointment: async (id: string, data: Partial<Appointment>) => {
        set({ loading: true, error: null })
        try {
          console.log("✏️ Updating appointment:", id, data)
          const response = await apiClient.put<Appointment>(`/appointments/${id}`, data)
          console.log("✅ Appointment updated:", response)

          // Update in list
          const { appointments } = get()
          set({
            appointments: appointments.map((apt) => (apt.id === id ? response : apt)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update appointment"
          console.error("❌ Error updating appointment:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Delete appointment
      deleteAppointment: async (id: string) => {
        set({ loading: true, error: null })
        try {
          console.log("🗑️ Deleting appointment:", id)
          await apiClient.delete(`/appointments/${id}`)
          console.log("✅ Appointment deleted")

          // Remove from list
          const { appointments } = get()
          set({ appointments: appointments.filter((apt) => apt.id !== id), loading: false })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to delete appointment"
          console.error("❌ Error deleting appointment:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Update appointment status
      updateAppointmentStatus: async (id: string, status: string) => {
        set({ loading: true, error: null })
        try {
          console.log("🔄 Updating appointment status:", id, status)
          const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status })
          console.log("✅ Status updated:", response)

          // Update in list
          const { appointments } = get()
          set({
            appointments: appointments.map((apt) => (apt.id === id ? response : apt)),
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

      // Get appointment by ID
      getAppointmentById: (id: string) => {
        return get().appointments.find((apt) => apt.id === id)
      },

      // Set error
      setError: (error: string | null) => {
        set({ error })
      },

      // Clear appointments
      clearAppointments: () => {
        set({ appointments: [], totalItems: 0, totalPages: 0, currentPage: 1, error: null })
      },
    }),
    {
      name: "appointment-store",
      version: 1,
      partialize: (state) => ({
        appointments: state.appointments,
      }),
    }
  )
)
