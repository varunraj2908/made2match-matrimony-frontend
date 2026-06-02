import axiosInstance from "@/api/axiosInstance";
import type { ApiEnvelope, PageEnvelope } from "./homeService";

// ─── DTOs ──────────────────────────────────────────────────────
export interface ConversationSummary {
  otherUserId: number;
  otherProfileId?: number;
  otherName: string;
  otherPhotoUrl?: string;
  otherAge?: number;
  otherCity?: string;
  otherState?: string;
  lastMessage?: string;
  lastSentAt?: string;
  lastFromMe?: boolean;
  unreadCount: number;
}

export interface MessageDto {
  id: number;
  sender?: { id: number; fullName?: string; email?: string };
  receiver?: { id: number; fullName?: string; email?: string };
  content: string;
  isRead?: boolean;
  sentAt?: string;
  readAt?: string;
}

// ─── Endpoints ─────────────────────────────────────────────────
export const listConversations = async (): Promise<ConversationSummary[]> => {
  const res = await axiosInstance.get<ApiEnvelope<ConversationSummary[]>>(
    "/messages/conversations",
  );
  return res.data.data ?? [];
};

export const fetchConversation = async (
  otherUserId: number,
  page = 0,
  size = 100,
): Promise<MessageDto[]> => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<MessageDto>>>(
    `/messages/conversation/${otherUserId}`,
    { params: { page, size } },
  );
  return res.data.data.content ?? [];
};

export const sendChatMessage = async (
  receiverUserId: number,
  content: string,
): Promise<MessageDto> => {
  const res = await axiosInstance.post<ApiEnvelope<MessageDto>>(
    `/messages/send/${receiverUserId}`,
    { content },
  );
  return res.data.data;
};

export const markConversationRead = async (otherUserId: number) => {
  const res = await axiosInstance.patch(
    `/messages/conversation/${otherUserId}/read`,
  );
  return res.data;
};

export const getUnreadMessageCount = async (): Promise<number> => {
  const res = await axiosInstance.get<ApiEnvelope<number>>(
    "/messages/unread-count",
  );
  return res.data.data ?? 0;
};

// ─── Helpers ───────────────────────────────────────────────────
export const formatChatTime = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export const formatMessageTime = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
