import axiosInstance from "@/api/axiosInstance";
import type { ApiEnvelope } from "@/services/homeService";

export interface ProfileReportRequest {
  reportedProfileId: number;
  category: string;
  subject: string;
  complaintDetails: string;
  evidence?: string;
  matrimonyId?: string;
}

export interface ProfileReportResponse {
  id: number;
  reportedProfileId: number;
  reportedProfileName: string;
  category: string;
  subject: string;
  complaintDetails: string;
  evidence?: string;
  matrimonyId?: string;
  status: "OPEN" | "REVIEWED" | "ACTION_TAKEN" | "DISMISSED";
  createdAt: string;
}

export async function submitProfileReport(
  payload: ProfileReportRequest,
): Promise<ProfileReportResponse> {
  const response = await axiosInstance.post<ApiEnvelope<ProfileReportResponse>>(
    "/profile-reports",
    payload,
  );

  return response.data.data;
}
