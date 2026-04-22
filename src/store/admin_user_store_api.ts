import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiClient } from "@/lib/api-client"

export interface AdminUser {
  id: string
  name: string
  email: string
  hospitalId: string
  isAdmin: boolean
  isSystemAdmin: boolean
  isActive: boolean
}

export interface UserListItem {
  id: string
  name: string
  email: string
  isActive: boolean
}

export interface AdminUserFilter {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  hospitalId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
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
        { value: "system_admin", label: "System Admin" },
        { value: "admin", label: "Admin" },
        { value: "hospital_admin", label: "Hospital Admin" },
      ],

      // Fetch admin users with filters
      fetchAdminUsers: async (filters: AdminUserFilter) => {
        set({ loading: true, error: null })
        try {
          const params = new URLSearchParams()
          if (filters.page) params.append("page", filters.page.toString())
          if (filters.limit) params.append("limit", filters.limit.toString())
          if (filters.search) params.append("search", filters.search)
          if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())
          if (filters.hospitalId) params.append("hospitalId", filters.hospitalId)
          if (filters.sortBy) params.append("sortBy", filters.sortBy)
          if (filters.sortOrder) params.append("sortOrder", filters.sortOrder)

          const queryString = params.toString()
          const url = `/system-admin/admin-users${queryString ? `?${queryString}` : ""}`

          const response = await apiClient.get<any>(url)
          console.log("✅ Admin users fetched:", response)

          set({
            adminUsers: response.data || [],
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
          const res = await apiClient.post<AdminUser>("/admin-user", data)
          const created = res.data as AdminUser
          console.log("✅ Admin user created:", created)

          // Add to list
          const { adminUsers } = get()
          set({ adminUsers: [created, ...adminUsers], loading: false })

          return created
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
          const res = await apiClient.put<AdminUser>(`/admin-user/${id}`, data)
          const updated = res.data as AdminUser
          console.log("✅ Admin user updated:", updated)

          // Update in list
          const { adminUsers } = get()
          set({
            adminUsers: adminUsers.map((user) => (user.id === id ? updated : user)),
            loading: false,
          })

          return updated
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
          const res = await apiClient.patch<AdminUser>(`/admin-user/${id}/status`, { isActive })
          const updated = res.data as AdminUser
          console.log("✅ Admin user status updated:", updated)

          // Update in list
          const { adminUsers } = get()
          set({
            adminUsers: adminUsers.map((user) => (user.id === id ? updated : user)),
            loading: false,
          })

          return updated
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
          const res = await apiClient.patch<AdminUser>(`/admin-user/${id}/permissions`, {
            permissions,
          })
          const updated = res.data as AdminUser
          console.log("✅ Permissions updated:", updated)

          // Update in list
          const { adminUsers } = get()
          set({
            adminUsers: adminUsers.map((user) => (user.id === id ? updated : user)),
            loading: false,
          })

          return updated
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
