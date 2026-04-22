import { useEffect, useCallback } from "react"
import { useAppointmentStore } from "@/store/appointment_store_api"
import { useDoctorStore } from "@/store/doctor_store_api"
import { usePatientStore } from "@/store/patient_store_api"
import { useAdminUserStore } from "@/store/admin_user_store_api"
import { useHospitalStore } from "@/store/hospital_store_api"
import { useAuthStore } from "@/store/auth_store_api"

/**
 * ============================================
 * APPOINTMENT HOOKS
 * ============================================
 */

export const useAppointments = (filters?: any) => {
  const store = useAppointmentStore()

  useEffect(() => {
    store.fetchAppointments(filters || { page: 1, limit: 10 })
  }, [filters?.page, filters?.limit, filters?.search, filters?.status])

  return {
    appointments: store.appointments,
    totalItems: store.totalItems,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    loading: store.loading,
    error: store.error,
    fetchAppointments: store.fetchAppointments,
    createAppointment: store.createAppointment,
    updateAppointment: store.updateAppointment,
    deleteAppointment: store.deleteAppointment,
    updateAppointmentStatus: store.updateAppointmentStatus,
  }
}

/**
 * ============================================
 * DOCTOR HOOKS
 * ============================================
 */

export const useDoctors = (filters?: any) => {
  const store = useDoctorStore()

  useEffect(() => {
    store.fetchDoctors(filters || { page: 1, limit: 10 })
  }, [filters?.page, filters?.limit, filters?.search, filters?.specialization, filters?.hospitalId])

  useEffect(() => {
    store.fetchSpecializations()
  }, [])

  return {
    doctors: store.doctors,
    specializations: store.specializations,
    totalItems: store.totalItems,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    loading: store.loading,
    error: store.error,
    fetchDoctors: store.fetchDoctors,
    createDoctor: store.createDoctor,
    updateDoctor: store.updateDoctor,
    deleteDoctor: store.deleteDoctor,
    toggleDoctorStatus: store.toggleDoctorStatus,
  }
}

/**
 * ============================================
 * PATIENT HOOKS
 * ============================================
 */

export const usePatients = (filters?: any) => {
  const store = usePatientStore()

  useEffect(() => {
    store.fetchPatients(filters || { page: 1, limit: 10 })
  }, [filters?.page, filters?.limit, filters?.search, filters?.gender, filters?.bloodGroup])

  return {
    patients: store.patients,
    totalItems: store.totalItems,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    loading: store.loading,
    error: store.error,
    fetchPatients: store.fetchPatients,
    createPatient: store.createPatient,
    updatePatient: store.updatePatient,
    deletePatient: store.deletePatient,
    togglePatientStatus: store.togglePatientStatus,
    updateMedicalHistory: store.updateMedicalHistory,
  }
}

/**
 * ============================================
 * ADMIN USER HOOKS
 * ============================================
 */

export const useAdminUsers = (filters?: any) => {
  const store = useAdminUserStore()

  useEffect(() => {
    store.fetchAdminUsers(filters || { page: 1, limit: 10 })
  }, [filters?.page, filters?.limit, filters?.search, filters?.role, filters?.hospitalId])

  return {
    adminUsers: store.adminUsers,
    roles: store.roles,
    totalItems: store.totalItems,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    loading: store.loading,
    error: store.error,
    fetchAdminUsers: store.fetchAdminUsers,
    createAdminUser: store.createAdminUser,
    updateAdminUser: store.updateAdminUser,
    deleteAdminUser: store.deleteAdminUser,
    toggleAdminUserStatus: store.toggleAdminUserStatus,
    updatePermissions: store.updatePermissions,
  }
}

export const useAllUsers = (filters?: any) => {
  const store = useAdminUserStore()

  useEffect(() => {
    store.fetchAllUsers(filters || { page: 1, limit: 10 })
  }, [filters?.page, filters?.limit, filters?.search, filters?.role])

  return {
    users: store.allUsers,
    totalItems: store.totalItems,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    loading: store.loading,
    error: store.error,
    fetchAllUsers: store.fetchAllUsers,
  }
}

/**
 * ============================================
 * HOSPITAL HOOKS
 * ============================================
 */

export const useHospitals = (filters?: any) => {
  const store = useHospitalStore()

  useEffect(() => {
    store.fetchHospitals(filters || { page: 1, limit: 10 })
  }, [filters?.page, filters?.limit, filters?.search])

  return {
    hospitals: store.hospitals,
    totalItems: store.totalItems,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    loading: store.loading,
    error: store.error,
    fetchHospitals: store.fetchHospitals,
    createHospital: store.createHospital,
    updateHospital: store.updateHospital,
    deleteHospital: store.deleteHospital,
    toggleHospitalStatus: store.toggleHospitalStatus,
  }
}

/**
 * ============================================
 * AUTHENTICATION HOOKS
 * ============================================
 */

export const useAuth = () => {
  const store = useAuthStore()

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    signup: store.signup,
    refreshAccessToken: store.refreshAccessToken,
    fetchUserProfile: store.fetchUserProfile,
    isSystemAdmin: store.isSystemAdmin,
    isAdmin: store.isAdmin,
    isDoctor: store.isDoctor,
    isReceptionist: store.isReceptionist,
    isPatient: store.isPatient,
  }
}

/**
 * ============================================
 * COMBINED DATA LOADING HOOK
 * ============================================
 */

export const useInitializeAppData = () => {
  const authStore = useAuthStore()
  const hospitalStore = useHospitalStore()
  const doctorStore = useDoctorStore()
  const appointmentStore = useAppointmentStore()
  const patientStore = usePatientStore()
  const adminUserStore = useAdminUserStore()

  const initializeData = useCallback(async () => {
    try {
      console.log("🔄 Initializing application data...")

      // Fetch basic data based on user role
      if (authStore.isSystemAdmin) {
        console.log("📊 System Admin - Loading system-wide data...")
        await Promise.all([
          hospitalStore.fetchHospitals({ page: 1, limit: 100 }),
          adminUserStore.fetchAdminUsers({ page: 1, limit: 100 }),
          appointmentStore.fetchAppointments({ page: 1, limit: 50 }),
        ])
      } else if (authStore.isAdmin) {
        console.log("📊 Admin - Loading admin data...")
        await Promise.all([
          hospitalStore.fetchHospitals({ page: 1, limit: 50 }),
          doctorStore.fetchDoctors({ page: 1, limit: 50 }),
          appointmentStore.fetchAppointments({ page: 1, limit: 50 }),
          patientStore.fetchPatients({ page: 1, limit: 50 }),
        ])
      } else if (authStore.isDoctor) {
        console.log("📊 Doctor - Loading doctor data...")
        await Promise.all([
          appointmentStore.fetchAppointments({ page: 1, limit: 50 }),
          patientStore.fetchPatients({ page: 1, limit: 50 }),
        ])
      } else if (authStore.isReceptionist) {
        console.log("📊 Receptionist - Loading receptionist data...")
        await Promise.all([
          appointmentStore.fetchAppointments({ page: 1, limit: 50 }),
          doctorStore.fetchDoctors({ page: 1, limit: 50 }),
          patientStore.fetchPatients({ page: 1, limit: 50 }),
        ])
      } else if (authStore.isPatient) {
        console.log("📊 Patient - Loading patient data...")
        await appointmentStore.fetchAppointments({ page: 1, limit: 20 })
      }

      console.log("✅ Data initialization complete")
    } catch (error) {
      console.error("❌ Error initializing data:", error)
    }
  }, [authStore, hospitalStore, doctorStore, appointmentStore, patientStore, adminUserStore])

  return {
    initializeData,
    isInitialized: authStore.isAuthenticated,
  }
}

/**
 * ============================================
 * PAGINATION HELPER HOOK
 * ============================================
 */

export const usePagination = (onPageChange: (page: number) => void, currentPage: number = 1) => {
  const handlePageChange = useCallback(
    (page: number) => {
      console.log(`📄 Navigating to page ${page}`)
      onPageChange(page)
    },
    [onPageChange]
  )

  return {
    currentPage,
    handlePageChange,
  }
}

/**
 * ============================================
 * SEARCH AND FILTER HOOK
 * ============================================
 */

export const useSearchAndFilter = (onFilter: (filters: any) => void) => {
  const handleSearch = useCallback(
    (search: string) => {
      console.log(`🔍 Searching for: ${search}`)
      onFilter({ search, page: 1 })
    },
    [onFilter]
  )

  const handleFilter = useCallback(
    (filters: any) => {
      console.log(`🎯 Applying filters:`, filters)
      onFilter({ ...filters, page: 1 })
    },
    [onFilter]
  )

  return {
    handleSearch,
    handleFilter,
  }
}
