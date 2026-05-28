import axiosInstance from "@/api/axiosInstance";

// ── Shared envelope ─────────────────────────────────────────────
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

// Spring Page shape (we only use a subset)
export interface PageEnvelope<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ── Domain DTOs (mirror backend) ────────────────────────────────
export interface MatchProfile {
  profileId: number;
  userId: number;
  profileCode?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  age?: number;
  heightDisplay?: string;
  profilePhotoUrl?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  religion?: string;
  caste?: string;
  maritalStatus?: string;
  highestQualification?: string;
  occupation?: string;
  motherTongue?: string;
  annualIncome?: string;
  matchScore?: number;
  isNewProfile?: boolean;
  isPremium?: boolean;
  recommendationType?: string;
}

export interface ProfileActivity {
  profileId: number;
  userId: number;
  fullName?: string;
  age?: number;
  heightDisplay?: string;
  profilePhotoUrl?: string;
  city?: string;
  state?: string;
  occupation?: string;
  highestQualification?: string;
  isPremium?: boolean;
  isShortlisted?: boolean;
  activityDate?: string; // ISO date-time
  activityType?: string;
}

export interface ActivityCounts {
  newMatchesCount?: number;
  whoViewedMeCount?: number;
  whoShortlistedMeCount?: number;
  shortlistedByMeCount?: number;
  viewedByMeCount?: number;
  horoscopeRequestsCount?: number;
  dontShowCount?: number;
}

export interface MyProfile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  profilePhotoUrl?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  religion?: string;
  caste?: string;
  maritalStatus?: string;
  highestQualification?: string;
  occupation?: string;
  annualIncome?: number;
  profileCompletionPct?: number;
  completionStep?: number;
  completionPercentage?: number;
  isPremium?: boolean;
  photoUrls?: string[];
}

// ── Helpers ─────────────────────────────────────────────────────
const unwrapPage = <T>(env: ApiEnvelope<PageEnvelope<T>>) => env.data;

// ── My profile ──────────────────────────────────────────────────
export const getMyProfile = async () => {
  const res = await axiosInstance.get<ApiEnvelope<MyProfile>>("/profiles/me");
  return res.data.data;
};

// ── Recommendations & Matches ───────────────────────────────────
export const getDailyRecommendations = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<MatchProfile>>>(
    "/matches/daily-recommendations",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getAllMatches = async (page = 0, size = 14) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<MatchProfile>>>(
    "/matches/all",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getMatchCount = async () => {
  const res = await axiosInstance.get<ApiEnvelope<number>>("/matches/count");
  return res.data.data ?? 0;
};

// ── Activity feeds ──────────────────────────────────────────────
export const getNewMatches = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<MatchProfile>>>(
    "/activity/new-matches",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getWhoViewedMe = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<ProfileActivity>>>(
    "/activity/who-viewed-me",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getViewedByMe = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<ProfileActivity>>>(
    "/activity/viewed-by-me",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getWhoShortlistedMe = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<ProfileActivity>>>(
    "/activity/who-shortlisted-me",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getShortlistedByMe = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<ProfileActivity>>>(
    "/activity/shortlisted-by-me",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getHoroscopeRequests = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<ProfileActivity>>>(
    "/activity/horoscope-requests",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getDontShowList = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<ProfileActivity>>>(
    "/activity/dont-show",
    { params: { page, size } },
  );
  return unwrapPage(res.data);
};

export const getActivityCounts = async () => {
  const res = await axiosInstance.get<ApiEnvelope<ActivityCounts>>(
    "/activity/counts",
  );
  return res.data.data ?? {};
};

// ── Display helpers ─────────────────────────────────────────────
export const formatActivityDate = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
