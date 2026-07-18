import axiosInstance from "@/api/axiosInstance";
import type { ApiEnvelope } from "@/services/homeService";

// Mirrors the backend NotificationPreferenceResponse / Request.
export interface NotificationPreferences {
  // E-mail · Member Activity
  emailPhoneNumberViews: boolean;
  emailRequests: boolean;
  emailShortlists: boolean;
  // E-mail · Member Response
  emailAccepts: boolean;
  emailDeclines: boolean;
  // E-mail · Matches
  emailHoroscopeMatches: boolean;
  emailPremiumMatches: boolean;
  emailMatchesWithNewPhoto: boolean;
  emailNewMatches: boolean;
  // SMS · Member Activity
  smsPhoneNumberViews: boolean;
  smsExpressInterest: boolean;
  smsPersonalizedMessages: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;

// GET /notifications/preferences
export const getNotificationPreferences =
  async (): Promise<NotificationPreferences> => {
    const res = await axiosInstance.get<ApiEnvelope<NotificationPreferences>>(
      "/notifications/preferences",
    );
    return res.data.data;
  };

// PUT /notifications/preferences — partial update (send only changed keys).
export const updateNotificationPreferences = async (
  patch: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> => {
  const res = await axiosInstance.put<ApiEnvelope<NotificationPreferences>>(
    "/notifications/preferences",
    patch,
  );
  return res.data.data;
};
