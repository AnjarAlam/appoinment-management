"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios from "@/lib/axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.29.23:3030/api/v1"

export interface Hospital {
  id: string
  name: string
  code: string
  address?: string
  phone?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface HospitalAdmin {
  id: string
  name: string
  email: string
  hospitalId: string
  isAdmin: boolean
  isSystemAdmin: boolean
  isActive: boolean
}

interface HospitalState {
  hospitals: Hospital[]
  selectedHospital: Hospital | null
  isLoading: boolean
  error: string | null
  totalItems: number
  totalPages: number
  currentPage: number

  // Hospital Methods
  createHospital: (name: string, address: string, phone: string) => Promise<Hospital>
  fetchHospitals: (page?: number, limit?: number, search?: string) => Promise<void>
  fetchHospitalById: (id: string) => Promise<Hospital>
  updateHospital: (id: string, data: Partial<Hospital>) => Promise<Hospital>
  deleteHospital: (id: string) => Promise<void>
  toggleHospitalStatus: (id: string, isActive: boolean) => Promise<void>

  // Hospital Admin Methods
  createHospitalAdmin: (hospitalId: string, name: string, email: string, password: string) => Promise<HospitalAdmin>

  // State Management
  setSelectedHospital: (hospital: Hospital | null) => void
  clearError: () => void
}

export const useHospitalStoreApi = create<HospitalState>()(
  persist(
    (set, get) => ({
      hospitals: [],
      selectedHospital: null,
      isLoading: false,
      error: null,
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,

      setSelectedHospital: (hospital) => set({ selectedHospital: hospital }),
      clearError: () => set({ error: null }),

      // CREATE HOSPITAL
      createHospital: async (name, address, phone) => {
        set({ isLoading: true, error: null })
        try {
          console.log("🏥 Creating hospital:", { name, address, phone })

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
              name: name.trim(),
              address: address.trim() || undefined,
              phone: phone.trim() || undefined,
            }),
          })

          console.log("📊 Response status:", response.status, response.statusText)

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `Failed to create hospital: ${response.status}`)
          }

          const data = await response.json()
          console.log("✅ Hospital created:", data)

          const newHospital: Hospital = {
            id: data.id,
            name: data.name,
            code: data.code,
            address: data.address,
            phone: data.phone,
            isActive: data.isActive,
          }

          set((state) => ({
            hospitals: [newHospital, ...state.hospitals],
            isLoading: false,
          }))

          console.log("✅ Hospital added to store")
          return newHospital
        } catch (error: any) {
          const message = error?.message || "Failed to create hospital"
          console.error("❌ Create hospital error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      // FETCH HOSPITALS
      fetchHospitals: async (page = 1, limit = 10, search = "") => {
        set({ isLoading: true, error: null })
        try {
          console.log("🔄 Fetching hospitals:", { page, limit, search })

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          })
          if (search) params.append("search", search)

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals?${params}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch hospitals: ${response.status}`)
          }

          const data = await response.json()
          console.log("✅ Hospitals fetched:", data)

          const hospitals: Hospital[] = (data.data || []).map((h: any) => ({
            id: h.id,
            name: h.name,
            code: h.code,
            address: h.address,
            phone: h.phone,
            isActive: h.isActive,
            createdAt: h.createdAt,
            updatedAt: h.updatedAt,
          }))

          set({
            hospitals,
            totalItems: data.meta?.totalItems || 0,
            totalPages: data.meta?.totalPages || 1,
            currentPage: page,
            isLoading: false,
          })

          console.log("✅ Hospitals loaded:", hospitals.length)
        } catch (error: any) {
          const message = error?.message || "Failed to fetch hospitals"
          console.error("❌ Fetch hospitals error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      // FETCH HOSPITAL BY ID
      fetchHospitalById: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          console.log("📋 Fetching hospital:", id)

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch hospital: ${response.status}`)
          }

          const data = await response.json()
          console.log("✅ Hospital fetched:", data)

          const hospital: Hospital = {
            id: data.id,
            name: data.name,
            code: data.code,
            address: data.address,
            phone: data.phone,
            isActive: data.isActive,
          }

          set({
            selectedHospital: hospital,
            isLoading: false,
          })

          return hospital
        } catch (error: any) {
          const message = error?.message || "Failed to fetch hospital"
          console.error("❌ Fetch hospital error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      // UPDATE HOSPITAL
      updateHospital: async (id: string, updateData: Partial<Hospital>) => {
        set({ isLoading: true, error: null })
        try {
          console.log("✏️ Updating hospital:", id, updateData)

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
              name: updateData.name?.trim(),
              address: updateData.address?.trim(),
              phone: updateData.phone?.trim(),
            }),
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `Failed to update hospital: ${response.status}`)
          }

          const data = await response.json()
          console.log("✅ Hospital updated:", data)

          const updatedHospital: Hospital = {
            id: data.id,
            name: data.name,
            code: data.code,
            address: data.address,
            phone: data.phone,
            isActive: data.isActive,
          }

          set((state) => ({
            hospitals: state.hospitals.map((h) => (h.id === id ? updatedHospital : h)),
            selectedHospital: state.selectedHospital?.id === id ? updatedHospital : state.selectedHospital,
            isLoading: false,
          }))

          return updatedHospital
        } catch (error: any) {
          const message = error?.message || "Failed to update hospital"
          console.error("❌ Update hospital error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      // DELETE HOSPITAL
      deleteHospital: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          console.log("🗑️ Deleting hospital:", id)

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `Failed to delete hospital: ${response.status}`)
          }

          console.log("✅ Hospital deleted")

          set((state) => ({
            hospitals: state.hospitals.filter((h) => h.id !== id),
            selectedHospital: state.selectedHospital?.id === id ? null : state.selectedHospital,
            isLoading: false,
          }))
        } catch (error: any) {
          const message = error?.message || "Failed to delete hospital"
          console.error("❌ Delete hospital error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      // TOGGLE HOSPITAL STATUS
      toggleHospitalStatus: async (id: string, isActive: boolean) => {
        set({ isLoading: true, error: null })
        try {
          console.log("🔄 Toggling hospital status:", id, isActive)

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals/${id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ isActive }),
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `Failed to update status: ${response.status}`)
          }

          console.log("✅ Hospital status updated")

          set((state) => ({
            hospitals: state.hospitals.map((h) =>
              h.id === id ? { ...h, isActive } : h
            ),
            selectedHospital:
              state.selectedHospital?.id === id
                ? { ...state.selectedHospital, isActive }
                : state.selectedHospital,
            isLoading: false,
          }))
        } catch (error: any) {
          const message = error?.message || "Failed to update status"
          console.error("❌ Toggle status error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      // CREATE HOSPITAL ADMIN
      createHospitalAdmin: async (
        hospitalId: string,
        name: string,
        email: string,
        password: string
      ) => {
        set({ isLoading: true, error: null })
        try {
          console.log("👤 Creating hospital admin:", { hospitalId, name, email })

          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
          if (!token) throw new Error("Authentication token not found")

          const response = await fetch(`${API_BASE_URL}/system-admin/hospitals/${hospitalId}/admins`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
            }),
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `Failed to create admin: ${response.status}`)
          }

          const data = await response.json()
          console.log("✅ Hospital admin created:", data)

          const admin: HospitalAdmin = {
            id: data.id,
            name: data.name,
            email: data.email,
            hospitalId: data.hospitalId,
            isAdmin: data.isAdmin,
            isSystemAdmin: data.isSystemAdmin,
            isActive: data.isActive,
          }

          set({ isLoading: false })
          return admin
        } catch (error: any) {
          const message = error?.message || "Failed to create hospital admin"
          console.error("❌ Create admin error:", message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },
    }),
    {
      name: "hospital-storage",
      partialize: (state) => ({ hospitals: state.hospitals }),
    }
  )
)

export default useHospitalStoreApi
