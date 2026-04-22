import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3030/api/v1"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshAccessToken")
          if (refreshToken) {
            const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            }, {
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              withCredentials: true,
            })
            const { accessToken } = res.data
            localStorage.setItem("accessToken", accessToken)
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return axiosInstance(originalRequest)
          }
        }
      } catch (e) {
        console.error("Token refresh failed:", e)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshAccessToken")
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
