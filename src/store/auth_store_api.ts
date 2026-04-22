"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie"
import { apiClient } from "@/lib/api-client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.29.23:3030/api/v1"

// Optional imports - gracefully handle if not available
let setSession: ((token: string) => Promise<void>) | undefined
let JWT_STORAGE_KEY: string = "clinic-jwt"
let toast: ((opts: any) => void) | undefined

try {
  const jwtModule = require("@/hooks/jwt/jwt/utils")
  setSession = jwtModule?.setSession
} catch (e) {
  console.warn("⚠️ setSession not available")
}

try {
  const constantModule = require("@/hooks/jwt/jwt/constant")
  JWT_STORAGE_KEY = constantModule?.JWT_STORAGE_KEY || "clinic-jwt"
} catch (e) {
  console.warn("⚠️ JWT_STORAGE_KEY not available, using default")
}

try {
  const toastModule = require("@/hooks/use-toast")
  toast = toastModule?.toast
} catch (e) {
  console.warn("⚠️ toast not available")
}

export interface User {
  id?: string
  email?: string
  roleId?: string
  hospitalId?: string
  isSystemAdmin?: boolean
  isAdmin?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  error: string | null

  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: (userId: string, refreshToken: string) => Promise<void>
  fetchUserProfile: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStoreApi = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // LOGIN
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const trimmedEmail = email.trim().toLowerCase()
          console.log("📤 Logging in with email:", trimmedEmail)
          console.log("🌐 API URL:", `${API_BASE_URL}/auth/login`)

          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ email: trimmedEmail, password }),
          })

          console.log("📊 Response status:", response.status, response.statusText)

          if (!response.ok) {
            try {
              const err = await response.json()
              throw new Error(err.message || `Login failed: ${response.status} ${response.statusText}`)
            } catch (parseErr: any) {
              throw new Error(`Login failed: ${response.status} ${response.statusText}. Verify API is running at ${API_BASE_URL}`)
            }
          }

          const data = await response.json()
          console.log("✅ Login response received:", data)

          const accessToken = data?.accessToken
          const refreshToken = data?.refreshToken
          const expiresIn = data?.expiresIn  // Token expiration time (15 min = 900 seconds)
          const tokenType = data?.tokenType  // "Bearer"
          const user = data?.user

          if (!accessToken) throw new Error("No access token returned from server")
          if (!user) throw new Error("No user data returned from server")

          console.log("🔐 Tokens extracted:")
          console.log(`   - Access Token: ${accessToken.substring(0, 20)}...`)
          console.log(`   - Refresh Token: ${refreshToken?.substring(0, 20)}...`)
          console.log(`   - Token Type: ${tokenType}`)
          console.log(`   - Expires In: ${expiresIn}s`)
          console.log(`   - User: ${user.email} (${user.isSystemAdmin ? 'System Admin' : user.isAdmin ? 'Admin' : 'User'})`)

          // persist tokens locally
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("tokenType", tokenType || "Bearer")
            if (refreshToken) localStorage.setItem("refreshAccessToken", refreshToken)
            if (expiresIn) {
              const expirationTime = Date.now() + (expiresIn * 1000)
              localStorage.setItem("tokenExpiration", expirationTime.toString())
              console.log(`✅ Token will expire at: ${new Date(expirationTime).toLocaleTimeString()}`)
            }
            console.log("✅ Tokens saved to localStorage")
          }

          // set JWT cookie if helper available
          try {
            if (setSession) await setSession(accessToken)
            console.log("✅ JWT session set")
          } catch (e) {
            console.warn("⚠️ setSession failed:", e)
          }

          set({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          console.log("✅ Auth state updated")

          // Role-based redirect
          if (typeof window !== "undefined") {
            setTimeout(() => {
              if (user.isSystemAdmin) {
                console.log("🔄 Redirecting system admin to /super-admin/dashboard")
                window.location.href = "/super-admin/dashboard"
              } else if (user.isAdmin) {
                console.log("🔄 Redirecting admin to /admin/dashboard")
                window.location.href = "/admin/dashboard"
              } else {
                console.log("🔄 Redirecting user to /dashboard")
                window.location.href = "/dashboard"
              }
            }, 300)
          }
        } catch (error: any) {
          const message = error?.message || "Login failed"
          
          // Detect and provide helpful error messages
          if (message.includes("Failed to fetch")) {
            console.error("❌ Network Error - Cannot reach API at:", API_BASE_URL)
            console.error("💡 Troubleshooting:")
            console.error("   1. Is the API server running?")
            console.error("   2. Is it accessible at http://192.168.29.23:3030?")
            console.error("   3. Check CORS configuration on backend")
            console.error("   4. Check Network tab (F12) for failed requests")
            set({ error: `Cannot reach API server at ${API_BASE_URL}. Is it running?`, isAuthenticated: false, isLoading: false, user: null })
          } else if (message.includes("401") || message.includes("401")) {
            console.error("❌ Unauthorized - Wrong credentials")
            set({ error: "Invalid email or password", isAuthenticated: false, isLoading: false, user: null })
          } else {
            console.error("❌ Login failed:", message)
            set({ error: message, isAuthenticated: false, isLoading: false, user: null })
          }
          throw new Error(message)
        }
      },

      // SIGNUP
      signup: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          console.log("📤 Signing up with email:", email)

          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ name, email, password }),
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `Signup failed: ${response.status}`)
          }

          const data = await response.json()
          console.log("✅ Signup response received:", data)

          const accessToken = data?.accessToken
          const refreshToken = data?.refreshToken
          const user = data?.user

          if (!accessToken) throw new Error("No access token returned from server")
          if (!user) throw new Error("No user data returned from server")

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken)
            if (refreshToken) localStorage.setItem("refreshAccessToken", refreshToken)
          }

          try {
            if (setSession) await setSession(accessToken)
          } catch (e) {
            console.warn("⚠️ setSession failed:", e)
          }

          set({
            user: user,
            accessToken,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          console.log("✅ Auth state updated")

          // Role-based redirect
          if (typeof window !== "undefined") {
            setTimeout(() => {
              if (user.isSystemAdmin) {
                console.log("🔄 Redirecting system admin to /super-admin/dashboard")
                window.location.href = "/super-admin/dashboard"
              } else if (user.isAdmin) {
                console.log("🔄 Redirecting admin to /admin/dashboard")
                window.location.href = "/admin/dashboard"
              } else {
                console.log("🔄 Redirecting user to /dashboard")
                window.location.href = "/dashboard"
              }
            }, 300)
          }
        } catch (error: any) {
          const message = error?.message || "Signup failed"
          console.error("❌ Signup failed:", message)
          set({ error: message, isAuthenticated: false, isLoading: false, user: null })
          throw new Error(message)
        }
      },

      // LOGOUT
      logout: async () => {
        set({ isLoading: true })
        const hasAuthToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken")

        if (!hasAuthToken) {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false, error: null })
          try { if (toast) toast({ title: "Logged out", description: "Redirecting to login." }) } catch (e) {}
          return
        }

        try {
          const token = localStorage.getItem("accessToken")
          const refreshToken = localStorage.getItem("refreshAccessToken")
          const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ refreshToken: refreshToken || "" }),
          })

          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false, error: null })
          try { if (toast) toast({ title: response?.ok ? "Logged out" : "Logout", description: "You have been logged out." }) } catch (e) {}

          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshAccessToken")
            Cookies.remove(JWT_STORAGE_KEY, { path: "/" })
          }

          setTimeout(() => window.location.href = "/login", 300)
        } catch (err: any) {
          const friendly = err.message || "Logout failed"
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false, error: friendly })
          try { if (toast) toast({ title: "Logged out", description: friendly }) } catch (e) {}
        }
      },

      // REFRESH ACCESS TOKEN
      refreshAccessToken: async (userId, refreshToken) => {
        try {
          console.log("📤 Refreshing access token for userId:", userId)

          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ refreshToken }),
          })

          if (!response.ok) throw new Error(`Refresh failed: ${response.status}`)

          const data = await response.json()
          console.log("✅ Token refresh response received:", data)

          const newAccessToken = data?.accessToken
          const newRefreshToken = data?.refreshToken

          if (!newAccessToken) throw new Error("No access token in refresh response")

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken)
            if (newRefreshToken) localStorage.setItem("refreshAccessToken", newRefreshToken)
            try {
              if (setSession) await setSession(newAccessToken)
              console.log("✅ JWT session updated")
            } catch (e) {
              console.warn("⚠️ setSession failed:", e)
            }
          }

          set({
            user: data?.user || null,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken || refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })

          console.log("✅ Token refresh successful")
        } catch (error: any) {
          const message = error?.message || "Token refresh failed"
          console.error("❌ Token refresh failed:", message)

          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshAccessToken")
            Cookies.remove(JWT_STORAGE_KEY, { path: "/" })
          }

          set({ error: message, isAuthenticated: false, isLoading: false, user: null, accessToken: null, refreshToken: null })
          throw new Error(message)
        }
      },

      // FETCH USER PROFILE
      fetchUserProfile: async () => {
        try {
          console.log("📤 Fetching user profile...")
          const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

          if (!token) return

          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
            credentials: "include",
            mode: "cors",
            referrerPolicy: "no-referrer",
          })

          if (!response.ok) throw new Error(`Profile fetch failed: ${response.status}`)

          const data = await response.json()
          console.log("✅ User profile received:", data)

          const userProfile = data?.user || data?.data || data

          set({ user: userProfile, isAuthenticated: true })

          console.log("✅ User profile updated:", userProfile.email)
        } catch (error: any) {
          console.error("❌ Failed to fetch profile:", error?.message)
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, accessToken: state.accessToken, refreshToken: state.refreshToken }),
    }
  )
)

export default useAuthStoreApi