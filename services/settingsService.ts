import axiosInstance from "@/api/axiosInstance";
import type { ApiEnvelope } from "@/services/homeService";

export interface Account {
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
}

// GET /account/me
export const getAccount = async (): Promise<Account> => {
  const res = await axiosInstance.get<ApiEnvelope<Account>>("/account/me");
  return res.data.data ?? {};
};

// PUT /account/email
export const updateEmail = async (email: string): Promise<Account> => {
  const res = await axiosInstance.put<ApiEnvelope<Account>>("/account/email", {
    email,
  });
  return res.data.data;
};

// PUT /account/password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await axiosInstance.put("/account/password", { currentPassword, newPassword });
};

// POST /account/deactivate
export const deactivateAccount = async (): Promise<void> => {
  await axiosInstance.post("/account/deactivate");
};

// Clears the auth token (client-side logout).
export const clearSession = () => {
  if (typeof window !== "undefined") localStorage.removeItem("token");
};
