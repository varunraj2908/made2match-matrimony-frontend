import axiosInstance from "@/api/axiosInstance";
import type { ApiEnvelope } from "@/services/homeService";

export interface AssistantAction {
  label: string;
  href: string;
}

// Mirrors the backend MatchProfileResponse (subset the chat renders).
export interface AssistantApiProfile {
  profileId: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  city?: string;
  state?: string;
  occupation?: string;
  profilePhotoUrl?: string;
}

export interface AssistantChatResponse {
  reply: string;
  profiles?: AssistantApiProfile[];
  actions?: AssistantAction[];
}

// POST /assistant/chat
export const sendAssistantMessage = async (
  message: string,
): Promise<AssistantChatResponse> => {
  const res = await axiosInstance.post<ApiEnvelope<AssistantChatResponse>>(
    "/assistant/chat",
    { message },
  );
  return res.data.data;
};
