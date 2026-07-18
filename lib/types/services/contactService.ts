import axiosInstance from "@/api/axiosInstance";
import type { ApiEnvelope } from "./homeService";

export interface ContactRequest {
  name: string;
  email: string;
  mobileNumber?: string;
  message: string;
}

export interface ContactResponse {
  id?: number;
  delivered: boolean;
  message?: string;
}

export const submitContactMessage = async (
  payload: ContactRequest,
): Promise<ContactResponse> => {
  const res = await axiosInstance.post<ApiEnvelope<ContactResponse>>(
    "/contact/send",
    payload,
  );
  return res.data.data;
};
