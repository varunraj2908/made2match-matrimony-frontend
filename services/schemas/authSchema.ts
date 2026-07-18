import { z } from "zod";

/* =========================
   TYPES
========================= */

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
}

/* =========================
   ZOD SCHEMA
========================= */

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  mobileNumber: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});