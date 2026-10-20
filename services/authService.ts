

import axiosInstance from "@/api/axiosInstance";
import { RegisterRequest } from "@/schemas/authSchema";

export type { RegisterRequest };

export type RegistrationPayload = RegisterRequest & {
  acceptedTerms: true;
  acceptedPrivacyPolicy: true;
};

export const registerUser = async (
  data: RegistrationPayload
) => {
  const response = await axiosInstance.post(
    "/auth/register",
    {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.mobileNumber,
      acceptedTerms: data.acceptedTerms,
      acceptedPrivacyPolicy: data.acceptedPrivacyPolicy,
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

// ── Forgot password ───────────────────────────────────────────
export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};
