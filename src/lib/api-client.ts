import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.29.23:3030/api/v1"

/**
 * Comprehensive API Client with:
 * - JWT token management
 * - CORS configuration
 * - Error handling
 * - Request/response interceptors
 * - Token refresh logic
 */

interface ApiErrorResponse {
  statusCode: number
  error: string
  message: string
  path: string
  timestamp: string
}

interface ApiResponse<T> {
  statusCode: number
  data?: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    totalItems?: number
    totalPages?: number
  }
}

class ApiClient {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    onSuccess: (token: string) => void
    onFailed: (error: AxiosError) => void
  }> = []

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add JWT token from localStorage
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken")
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        // Add CORS headers
        config.headers["mode"] = "cors"
        config.headers["referrerPolicy"] = "no-referrer"

        return config
      },
      (error) => {
        console.error("❌ Request Error:", error)
        return Promise.reject(error)
      }
    )

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}: ${response.status}`)
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for token refresh to complete
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                  resolve(this.axiosInstance(originalRequest))
                },
                onFailed: (err: AxiosError) => reject(err),
              })
            })
          }

          this.isRefreshing = true
          originalRequest._retry = true

          try {
            if (typeof window !== "undefined") {
              const refreshToken = localStorage.getItem("refreshAccessToken")
              if (refreshToken) {
                console.log("🔄 Refreshing access token...")

                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                  refreshToken,
                }, {
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                  },
                  withCredentials: true,
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data

                // Update tokens in localStorage
                localStorage.setItem("accessToken", accessToken)
                if (newRefreshToken) {
                  localStorage.setItem("refreshAccessToken", newRefreshToken)
                }

                console.log("✅ Token refreshed successfully")

                // Process queued requests
                this.failedQueue.forEach((prom) => prom.onSuccess(accessToken))
                this.failedQueue = []

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return this.axiosInstance(originalRequest)
              }
            }
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError)

            // Process failed queue
            this.failedQueue.forEach((prom) => prom.onFailed(refreshError as AxiosError))
            this.failedQueue = []

            // Clear auth and redirect to login
            if (typeof window !== "undefined") {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshAccessToken")
              window.location.href = "/login"
            }

            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // Handle other errors
        this.handleErrorResponse(error)
        return Promise.reject(error)
      }
    )
  }

  private handleErrorResponse(error: AxiosError) {
    const response = error.response as AxiosResponse<ApiErrorResponse> | undefined

    if (response?.data) {
      console.error(`❌ API Error: ${response.data.statusCode} - ${response.data.message}`)
    } else if (error.message === "Network Error") {
      console.error("❌ Network Error - Cannot reach API")
    } else {
      console.error("❌ Error:", error.message)
    }
  }

  // GET request - return full ApiResponse (data + meta) so callers can access meta
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<any, AxiosResponse<ApiResponse<T>>>(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // POST request
  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<any, AxiosResponse<ApiResponse<T>>>(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // PUT request
  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<any, AxiosResponse<ApiResponse<T>>>(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // PATCH request
  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<any, AxiosResponse<ApiResponse<T>>>(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // DELETE request
  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<any, AxiosResponse<ApiResponse<T>>>(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Get raw axios instance for custom requests
  getInstance() {
    return this.axiosInstance
  }
}

export const apiClient = new ApiClient()
export default apiClient
