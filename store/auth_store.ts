"use client"

import axiosInstance from "@/lib/axios"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie"

export interface User {
  id?: string
  email: string
  name?: string
  role?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>
  fetchUserProfile: () => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      clearError: () => set({ error: null }),

      // ✅ LOGIN
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          console.log("📤 Sending login request to /api/v1/auth/login")
          
          const response = await axiosInstance.post(
            "/api/v1/auth/login",
            { email, password },
            { withCredentials: true }
          )

          console.log("✅ Login response received:", response.status)
          console.log("📋 Full response data:", JSON.stringify(response.data, null, 2))

          // 🔥 Extract tokens - handle multiple possible response shapes (both camelCase and snake_case)
          const accessToken = 
            response.data?.data?.access_token ||    // snake_case from backend
            response.data?.data?.accessToken ||     // camelCase fallback
            response.data?.accessToken ||           // root camelCase
            response.data?.access_token ||          // root snake_case
            response.data?.token
          
          const refreshToken = 
            response.data?.data?.refresh_token ||   // snake_case from backend
            response.data?.data?.refreshToken ||    // camelCase fallback
            response.data?.refreshToken ||          // root camelCase
            response.data?.refresh_token            // root snake_case

          console.log("🔐 Extracted accessToken:", accessToken ? "✓ Found" : "✗ Not found")
          console.log("🔐 Extracted refreshToken:", refreshToken ? "✓ Found" : "✗ Not found")

          if (!accessToken) {
            throw new Error("No access token received from server")
          }

          // 🔥 Save tokens to localStorage
          if (typeof window !== "undefined") {
            if (accessToken) {
              localStorage.setItem("accessToken", accessToken)
              console.log("✅ Access token saved to localStorage")
            }
            if (refreshToken) {
              localStorage.setItem("refreshAccessToken", refreshToken)
              console.log("✅ Refresh token saved to localStorage")
            }
          }

          // Update axios headers with new token
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`

          set({
            user: response.data?.data?.user || response.data?.user || { email },
            accessToken: accessToken || "",
            refreshToken: refreshToken || "",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          console.log("✅ Auth store updated successfully")

          // Optionally fetch complete user profile
          try {
            await get().fetchUserProfile()
          } catch (profileError) {
            console.warn("⚠️ Profile fetch after login failed, continuing:", profileError)
          }
        } catch (error: any) {
          const status = error?.response?.status
          const message =
            status === 401
              ? "Invalid email or password"
              : status === 403
              ? "You are not approved yet"
              : status === 400
              ? "Invalid request format"
              : error?.response?.data?.message || "Login failed"

          console.error("❌ Login failed:", { status, message, error: error?.response?.data })

          set({
            error: message,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          })

          throw new Error(message)
        }
      },

      // ✅ SIGNUP
      signup: async (name, email, phone, password) => {
        set({ isLoading: true, error: null })
        try {
          console.log("📤 Sending signup request to /api/v1/auth/register")
          
          const response = await axiosInstance.post(
            "/api/v1/auth/register",
            { name, email, phone, password },
            { withCredentials: true }
          )

          console.log("✅ Signup response received:", response.status)
          console.log("📋 Full response data:", JSON.stringify(response.data, null, 2))

          // 🔥 Extract tokens - handle multiple possible response shapes
          const accessToken = 
            response.data?.access_token ||    // snake_case from backend
            response.data?.accessToken ||     // camelCase fallback
            response.data?.data?.access_token ||
            response.data?.data?.accessToken ||
            response.data?.token
          
          const refreshToken = 
            response.data?.refresh_token ||   // snake_case from backend
            response.data?.refreshToken ||    // camelCase fallback
            response.data?.data?.refresh_token ||
            response.data?.data?.refreshToken

          console.log("🔐 Extracted accessToken:", accessToken ? "✓ Found" : "✗ Not found")

          if (!accessToken) {
            throw new Error("No access token received from server")
          }

          // 🔥 Save tokens to localStorage
          if (typeof window !== "undefined") {
            if (accessToken) {
              localStorage.setItem("accessToken", accessToken)
              console.log("✅ Access token saved to localStorage")
            }
            if (refreshToken) {
              localStorage.setItem("refreshAccessToken", refreshToken)
            }
          }

          // Update axios headers with new token
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`

          set({
            user: response.data?.user || { email, name },
            accessToken: accessToken || "",
            refreshToken: refreshToken || "",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          console.log("✅ Auth store updated successfully")

          // Fetch complete user profile
          try {
            await get().fetchUserProfile()
          } catch (profileError) {
            console.warn("⚠️ Profile fetch after signup failed, continuing:", profileError)
          }
        } catch (error: any) {
          const status = error?.response?.status
          const message =
            status === 409
              ? "Email already registered"
              : status === 400
              ? "Invalid registration data"
              : error?.response?.data?.message || "Signup failed"

          console.error("❌ Signup failed:", { status, message, error: error?.response?.data })

          set({
            error: message,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          })

          throw new Error(message)
        }
      },

      // ✅ LOGOUT
      logout: async () => {
        try {
          const current = get()
          if (current?.isLoading) return
        } catch (e) {
          // ignore
        }

        const hasLocalToken =
          typeof window !== "undefined" && !!localStorage.getItem("accessToken")
        const hasAuthHeader = !!axiosInstance.defaults.headers.common.Authorization

        if (!hasLocalToken && !hasAuthHeader) {
          set({ isLoading: true })

          // Clear local storage
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshAccessToken")
            localStorage.removeItem("auth-storage")
            delete axiosInstance.defaults.headers.common.Authorization
          }

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })

          if (typeof window !== "undefined") {
            setTimeout(() => (window.location.href = "/login"), 500)
          }

          return
        }

        set({ isLoading: true })
        try {
          await axiosInstance.post("/api/v1/auth/logout")

          // 🔥 Clear tokens from localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshAccessToken")
            localStorage.removeItem("auth-storage")
            delete axiosInstance.defaults.headers.common.Authorization
          }

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })

          console.log("✅ Logged out successfully")

          if (typeof window !== "undefined") {
            setTimeout(() => (window.location.href = "/login"), 500)
          }
        } catch (error: any) {
          const status = error?.response?.status
          const serverMsg = error?.response?.data?.message
          const friendly =
            status === 401
              ? serverMsg || "Session expired. Logging out."
              : serverMsg || error?.message || "Logout failed"

          // Clear data even if logout API fails
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshAccessToken")
            localStorage.removeItem("auth-storage")
            delete axiosInstance.defaults.headers.common.Authorization
          }

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: friendly,
          })

          console.warn("⚠️ Logout error:", friendly)

          if (typeof window !== "undefined") {
            setTimeout(() => (window.location.href = "/login"), 800)
          }
        }
      },

      // ✅ FETCH USER PROFILE
      fetchUserProfile: async () => {
        try {
          const response = await axiosInstance.get("/api/v1/auth/profile")

          // Backend response: { success, statusCode, message, data: { userId, email, role } }
          const userProfile = response.data?.data || response.data?.user || response.data

          const user: User = {
            id: userProfile?.userId || userProfile?.id,
            email: userProfile?.email || "",
            name: userProfile?.name || userProfile?.email?.split("@")[0] || "User",
            role: userProfile?.role || "",
          }

          set({
            user: user,
            isAuthenticated: true,
          })

          console.log("✅ User profile fetched successfully:", user)
        } catch (error: any) {
          console.error(
            "❌ Failed to fetch profile:",
            error?.response?.data?.message || error.message
          )
          // Don't throw error for profile fetch, user can still proceed
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
