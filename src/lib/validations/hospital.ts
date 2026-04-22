import { z } from "zod"

// Hospital Creation Schema
export const createHospitalSchema = z.object({
  name: z
    .string()
    .min(1, "Hospital name is required")
    .max(120, "Hospital name must be 120 characters or less")
    .trim(),
  address: z
    .string()
    .max(200, "Address must be 200 characters or less")
    .trim()
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone number must be 30 characters or less")
    .trim()
    .optional()
    .or(z.literal("")),
})

export type CreateHospitalFormData = z.infer<typeof createHospitalSchema>

// Hospital Update Schema
export const updateHospitalSchema = z.object({
  name: z
    .string()
    .min(1, "Hospital name is required")
    .max(120, "Hospital name must be 120 characters or less")
    .trim(),
  address: z
    .string()
    .max(200, "Address must be 200 characters or less")
    .trim()
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone number must be 30 characters or less")
    .trim()
    .optional()
    .or(z.literal("")),
})

export type UpdateHospitalFormData = z.infer<typeof updateHospitalSchema>

// Hospital Admin Creation Schema
export const createHospitalAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Admin name is required")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be 50 characters or less"),
})

export type CreateHospitalAdminFormData = z.infer<typeof createHospitalAdminSchema>

// Hospital Filter/Search Schema
export const hospitalFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
})

export type HospitalFilterData = z.infer<typeof hospitalFilterSchema>
