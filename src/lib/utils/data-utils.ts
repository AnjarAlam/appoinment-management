/**
 * ============================================
 * COMMON DATA UTILITIES
 * ============================================
 */

import { format, parseISO } from "date-fns"

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string, formatStr: string = "MMM dd, yyyy"): string => {
  try {
    return format(parseISO(dateString), formatStr)
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

/**
 * Format time string (HH:mm)
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return ""
  const [hours, minutes] = timeString.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Format date and time together
 */
export const formatDateTime = (dateString: string, timeString: string): string => {
  return `${formatDate(dateString, "MMM dd, yyyy")} at ${formatTime(timeString)}`
}

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

/**
 * Format appointment status with color
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "badge-warning"
    case "SCHEDULED":
      return "badge-info"
    case "COMPLETED":
      return "badge-success"
    case "CANCELLED":
      return "badge-danger"
    case "NO_SHOW":
      return "badge-secondary"
    default:
      return "badge-default"
  }
}

/**
 * Get appointment status display text
 */
export const getStatusDisplayText = (status: string): string => {
  return status?.replace(/_/g, " ").toUpperCase() || "UNKNOWN"
}

/**
 * Format doctor name
 */
export const formatDoctorName = (firstName: string, lastName: string, title?: string): string => {
  const fullName = `${firstName} ${lastName}`.trim()
  return title ? `${title} ${fullName}` : fullName
}

/**
 * Format patient name
 */
export const formatPatientName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim()
}

/**
 * Check if appointment is in the past
 */
export const isAppointmentInPast = (dateString: string, timeString: string): boolean => {
  const appointmentDate = new Date(`${dateString}T${timeString}`)
  return appointmentDate < new Date()
}

/**
 * Check if appointment is upcoming
 */
export const isAppointmentUpcoming = (dateString: string, timeString: string): boolean => {
  return !isAppointmentInPast(dateString, timeString)
}

/**
 * Get appointment duration in hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Paginate array
 */
export const paginateArray = <T,>(
  array: T[],
  page: number,
  limit: number
): {
  data: T[]
  page: number
  limit: number
  total: number
  pages: number
} => {
  const start = (page - 1) * limit
  const end = start + limit
  return {
    data: array.slice(start, end),
    page,
    limit,
    total: array.length,
    pages: Math.ceil(array.length / limit),
  }
}

/**
 * Filter array by search term
 */
export const filterBySearch = <T extends Record<string, any>>(
  array: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] => {
  if (!searchTerm) return array

  const lowerSearchTerm = searchTerm.toLowerCase()
  return array.filter((item) =>
    fields.some((field) => {
      const value = item[field]
      return String(value).toLowerCase().includes(lowerSearchTerm)
    })
  )
}

/**
 * Debounce function for search and filters
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for scroll and resize events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/
  return phoneRegex.test(phone)
}

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName?: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || ""
  const last = lastName?.charAt(0)?.toUpperCase() || ""
  return `${first}${last}`
}

/**
 * Generate random color for avatar
 */
export const getRandomColor = (seed?: string): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ]

  if (seed) {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Format as (XXX) XXX-XXXX if length is 10
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  // Return original if can't format
  return phone
}

/**
 * Truncate string with ellipsis
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

/**
 * Group array by property
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  property: keyof T
): Record<string, T[]> => {
  return array.reduce(
    (acc, obj) => {
      const key = String(obj[property])
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    },
    {} as Record<string, T[]>
  )
}

/**
 * Check if user has permission
 */
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission)
}

/**
 * Check if user has any of the permissions
 */
export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.some((perm) => userPermissions.includes(perm))
}

/**
 * Check if user has all permissions
 */
export const hasAllPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.every((perm) => userPermissions.includes(perm))
}

/**
 * Sort array by property
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  property: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  const sorted = [...array].sort((a, b) => {
    if (a[property] < b[property]) return order === "asc" ? -1 : 1
    if (a[property] > b[property]) return order === "asc" ? 1 : -1
    return 0
  })
  return sorted
}

/**
 * Get unique values from array
 */
export const getUniqueValues = <T,>(array: T[]): T[] => {
  return Array.from(new Set(array))
}

/**
 * Parse API error response
 */
export const parseApiError = (error: any): string => {
  if (typeof error === "string") {
    return error
  }

  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return "An unexpected error occurred"
}

/**
 * Retry API call with exponential backoff
 */
export const retryApiCall = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      const waitTime = delay * Math.pow(2, i)
      console.log(`Retrying in ${waitTime}ms... (attempt ${i + 1}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }
  throw new Error("Max retries exceeded")
}
