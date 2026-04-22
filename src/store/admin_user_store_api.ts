import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiClient } from "@/lib/api-client"

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: "SUPER_ADMIN" | "ADMIN" | "HOSPITAL_ADMIN"
  permissions: string[]
  hospitalId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserListItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  createdAt: string
}

export interface AdminUserFilter {
  page?: number
  limit?: number
  search?: string
  role?: string
  isActive?: boolean
  hospitalId?: string
}

export interface UserListFilter {
  page?: number
  limit?: number
  search?: string
  role?: string
  isActive?: boolean
}

interface AdminUserStore {
  // State
  adminUsers: AdminUser[]
  allUsers: UserListItem[]
  totalItems: number
  totalPages: number
  currentPage: number
  loading: boolean
  error: string | null
  roles: { value: string; label: string }[]

  // Actions
  fetchAdminUsers: (filters: AdminUserFilter) => Promise<void>
  fetchAllUsers: (filters: UserListFilter) => Promise<void>
  createAdminUser: (data: Partial<AdminUser>) => Promise<AdminUser>
  updateAdminUser: (id: string, data: Partial<AdminUser>) => Promise<AdminUser>
  deleteAdminUser: (id: string) => Promise<void>
  toggleAdminUserStatus: (id: string, isActive: boolean) => Promise<AdminUser>
  getAdminUserById: (id: string) => AdminUser | undefined
  updatePermissions: (id: string, permissions: string[]) => Promise<AdminUser>
  setError: (error: string | null) => void
  clearAdminUsers: () => void
}

export const useAdminUserStore = create<AdminUserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      adminUsers: [],
      allUsers: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      loading: false,
      error: null,
      roles: [
        { value: "SUPER_ADMIN", label: "Super Admin" },
        { value: "ADMIN", label: "Admin" },
        { value: "HOSPITAL_ADMIN", label: "Hospital Admin" },
      ],

      // Fetch admin users with filters
      fetchAdminUsers: async (filters: AdminUserFilter) => {
        set({ loading: true, error: null })
        try {
          const params = new URLSearchParams()
          if (filters.page) params.append("page", filters.page.toString())
          if (filters.limit) params.append("limit", filters.limit.toString())
          if (filters.search) params.append("search", filters.search)
          if (filters.role) params.append("role", filters.role)
          if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())
          if (filters.hospitalId) params.append("hospitalId", filters.hospitalId)

          const queryString = params.toString()
          const url = `/admin-user${queryString ? `?${queryString}` : ""}`

          const response = await apiClient.get<any>(url)
          console.log("✅ Admin users fetched:", response)

          set({
            adminUsers: response.data || response.adminUsers || [],
            totalItems: response.meta?.totalItems || 0,
            totalPages: response.meta?.totalPages || 0,
            currentPage: response.meta?.page || filters.page || 1,
            loading: false,
          })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to fetch admin users"
          console.error("❌ Error fetching admin users:", errorMsg)
          set({ error: errorMsg, loading: false })
        }
      },

      // Fetch all users (any role)
      fetchAllUsers: async (filters: UserListFilter) => {
        set({ loading: true, error: null })
        try {
          const params = new URLSearchParams()
          if (filters.page) params.append("page", filters.page.toString())
          if (filters.limit) params.append("limit", filters.limit.toString())
          if (filters.search) params.append("search", filters.search)
          if (filters.role) params.append("role", filters.role)
          if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())

          const queryString = params.toString()
          const url = `/user/list${queryString ? `?${queryString}` : ""}`

          const response = await apiClient.get<any>(url)
          console.log("✅ All users fetched:", response)

          set({
            allUsers: response.data || response.users || [],
            totalItems: response.meta?.totalItems || 0,
            totalPages: response.meta?.totalPages || 0,
            currentPage: response.meta?.page || filters.page || 1,
            loading: false,
          })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to fetch users"
          console.error("❌ Error fetching users:", errorMsg)
          set({ error: errorMsg, loading: false })
        }
      },

      // Create admin user
      createAdminUser: async (data: Partial<AdminUser>) => {
        set({ loading: true, error: null })
        try {
          console.log("📝 Creating admin user:", data)
          const response = await apiClient.post<AdminUser>("/admin-user", data)
          console.log("✅ Admin user created:", response)

          // Add to list
          const { adminUsers } = get()
          set({ adminUsers: [response, ...adminUsers], loading: false })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to create admin user"
          console.error("❌ Error creating admin user:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Update admin user
      updateAdminUser: async (id: string, data: Partial<AdminUser>) => {
        set({ loading: true, error: null })
        try {
          console.log("✏️ Updating admin user:", id, data)
          const response = await apiClient.put<AdminUser>(`/admin-user/${id}`, data)
          console.log("✅ Admin user updated:", response)

          // Update in list
          const { adminUsers } = get()
          set({
            adminUsers: adminUsers.map((user) => (user.id === id ? response : user)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update admin user"
          console.error("❌ Error updating admin user:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Delete admin user
      deleteAdminUser: async (id: string) => {
        set({ loading: true, error: null })
        try {
          console.log("🗑️ Deleting admin user:", id)
          await apiClient.delete(`/admin-user/${id}`)
          console.log("✅ Admin user deleted")

          // Remove from list
          const { adminUsers } = get()
          set({ adminUsers: adminUsers.filter((user) => user.id !== id), loading: false })
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to delete admin user"
          console.error("❌ Error deleting admin user:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Toggle admin user status
      toggleAdminUserStatus: async (id: string, isActive: boolean) => {
        set({ loading: true, error: null })
        try {
          console.log("🔄 Updating admin user status:", id, isActive)
          const response = await apiClient.patch<AdminUser>(`/admin-user/${id}/status`, { isActive })
          console.log("✅ Admin user status updated:", response)

          // Update in list
          const { adminUsers } = get()
          set({
            adminUsers: adminUsers.map((user) => (user.id === id ? response : user)),
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

      // Update permissions
      updatePermissions: async (id: string, permissions: string[]) => {
        set({ loading: true, error: null })
        try {
          console.log("🔐 Updating permissions:", id, permissions)
          const response = await apiClient.patch<AdminUser>(`/admin-user/${id}/permissions`, {
            permissions,
          })
          console.log("✅ Permissions updated:", response)

          // Update in list
          const { adminUsers } = get()
          set({
            adminUsers: adminUsers.map((user) => (user.id === id ? response : user)),
            loading: false,
          })

          return response
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || "Failed to update permissions"
          console.error("❌ Error updating permissions:", errorMsg)
          set({ error: errorMsg, loading: false })
          throw error
        }
      },

      // Get admin user by ID
      getAdminUserById: (id: string) => {
        return get().adminUsers.find((user) => user.id === id)
      },

      // Set error
      setError: (error: string | null) => {
        set({ error })
      },

      // Clear admin users
      clearAdminUsers: () => {
        set({ adminUsers: [], allUsers: [], totalItems: 0, totalPages: 0, currentPage: 1, error: null })
      },
    }),
    {
      name: "admin-user-store",
      version: 1,
      partialize: (state) => ({
        adminUsers: state.adminUsers,
        allUsers: state.allUsers,
      }),
    }
  )
)
