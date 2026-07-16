

import axiosInstance from "@/api/axiosInstance";
import { RegisterRequest } from "@/schemas/authSchema";

export type { RegisterRequest };

export const registerUser = async (
  data: RegisterRequest
) => {
  const response = await axiosInstance.post(
    "/auth/register",
    {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.mobileNumber,
    }
  );

  return response.data;
};

// ── Login ──────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};