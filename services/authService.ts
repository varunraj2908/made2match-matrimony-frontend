

import axiosInstance from "@/api/axiosInstance";
import { RegisterRequest } from "@/schemas/authSchema";

export type { RegisterRequest };

export const registerUser = async (
  data: RegisterRequest
) => {
  const response = await axiosInstance.post(
    "/auth/register",
    data
  );

  return response.data;
};