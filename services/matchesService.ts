import axiosInstance from "@/api/axiosInstance";
import type {
  ApiEnvelope,
  MatchProfile,
  PageEnvelope,
  ProfileActivity,
} from "./homeService";

// ─── Unified card shape ────────────────────────────────────────
// Whatever endpoint returned the row, the UI cares about the same fields.
export interface CardProfile {
  id: string;          // profileId (string for stable React keys)
  numericId: number;   // profileId (number) — for navigation/actions
  name: string;
  age?: number;
  height?: string;
  religion?: string;
  caste?: string;
  location?: string;
  education?: string;
  profession?: string;
  income?: string;
  about?: string;
  photo?: string;
  isPremium?: boolean;
  gender?: "bride" | "groom";
}

const fallbackPhoto = (name?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=ea580c&color=fff&size=200`;

const fromMatch = (m: MatchProfile): CardProfile => ({
  id: String(m.profileId),
  numericId: m.profileId,
  name: m.fullName || [m.firstName, m.lastName].filter(Boolean).join(" ") || "—",
  age: m.age,
  height: m.heightDisplay,
  religion: m.religion,
  caste: m.caste,
  location: [m.city, m.state].filter(Boolean).join(", "),
  education: m.highestQualification,
  profession: m.occupation,
  income: m.annualIncome,
  about: m.bio,
  photo: m.profilePhotoUrl || fallbackPhoto(m.fullName),
  isPremium: m.isPremium,
});

const fromActivity = (a: ProfileActivity): CardProfile => ({
  id: String(a.profileId),
  numericId: a.profileId,
  name: a.fullName || "—",
  age: a.age,
  height: a.heightDisplay,
  location: [a.city, a.state].filter(Boolean).join(", "),
  education: a.highestQualification,
  profession: a.occupation,
  photo: a.profilePhotoUrl || fallbackPhoto(a.fullName),
  isPremium: a.isPremium,
});

// ─── Generic page fetcher ──────────────────────────────────────
const getPage = async <T,>(
  url: string,
  params: Record<string, unknown>,
): Promise<PageEnvelope<T>> => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<T>>>(url, { params });
  return res.data.data;
};

// ─── Filter shape (mirrors FilterBar's UI state, but server-side) ────
export interface MatchFilters {
  sortBy?: string;            // newly_joined | last_active | profile_score | age_asc | age_desc
  city?: string;              // location dropdown value
  withPhotos?: boolean;
  withHoroscope?: boolean;
  notSeen?: boolean;
  profileCreatedBy?: string;  // SELF | PARENT | SIBLING | FRIEND
}

const buildFilterParams = (f?: MatchFilters): Record<string, unknown> => {
  if (!f) return {};
  const params: Record<string, unknown> = {};
  if (f.sortBy) params.sortBy = f.sortBy;
  if (f.city) params.city = f.city;
  if (f.withPhotos) params.withPhotos = true;
  if (f.withHoroscope) params.withHoroscope = true;
  if (f.notSeen) params.notSeen = true;
  if (f.profileCreatedBy) params.profileCreatedBy = f.profileCreatedBy;
  return params;
};

// ─── Per-endpoint helpers ──────────────────────────────────────
export const fetchAllMatches = (
  page: number,
  size: number,
  filters?: MatchFilters,
) =>
  getPage<MatchProfile>("/matches/all", {
    page,
    size,
    ...buildFilterParams(filters),
  });

export const fetchByCategory = (
  category: string,
  page: number,
  size: number,
) => getPage<MatchProfile>("/matches/category", { category, page, size });

export const fetchShortlistedByMe = (page: number, size: number) =>
  getPage<ProfileActivity>("/activity/shortlisted-by-me", { page, size });

export const fetchWhoShortlistedMe = (page: number, size: number) =>
  getPage<ProfileActivity>("/activity/who-shortlisted-me", { page, size });

export const fetchViewedByMe = (page: number, size: number) =>
  getPage<ProfileActivity>("/activity/viewed-by-me", { page, size });

export const fetchWhoViewedMe = (page: number, size: number) =>
  getPage<ProfileActivity>("/activity/who-viewed-me", { page, size });

export const fetchNewMatches = (page: number, size: number) =>
  getPage<MatchProfile>("/activity/new-matches", { page, size });

// ─── Sidebar label → category dispatch ─────────────────────────
export const SIDEBAR_LABELS = [
  "Your Matches",
  "Shortlisted by you",
  "Viewed you",
  "Shortlisted you",
  "Viewed by you",
  "Newly Joined",
  "Nearby matches",
  "With photos",
  "With horoscope",
  "Similar hobbies",
  "Star matches",
  "Horoscope matches",
  "Mutual matches",
  "Looking for you",
  "Education preference",
  "Professional preference",
  "Location preference",
  "NRI matches",
] as const;

export type SidebarLabel = (typeof SIDEBAR_LABELS)[number];

export interface FetchResult {
  items: CardProfile[];
  totalElements: number;
  totalPages: number;
}

const mapMatches = (p: PageEnvelope<MatchProfile>): FetchResult => ({
  items: p.content.map(fromMatch),
  totalElements: p.totalElements ?? 0,
  totalPages: p.totalPages ?? 0,
});

const mapActivity = (p: PageEnvelope<ProfileActivity>): FetchResult => ({
  items: p.content.map(fromActivity),
  totalElements: p.totalElements ?? 0,
  totalPages: p.totalPages ?? 0,
});

export const fetchForMenu = async (
  label: SidebarLabel,
  page: number,
  size: number,
  filters?: MatchFilters,
): Promise<FetchResult> => {
  switch (label) {
    case "Your Matches":
      return mapMatches(await fetchAllMatches(page, size, filters));
    case "Shortlisted by you":
      return mapActivity(await fetchShortlistedByMe(page, size));
    case "Viewed you":
      return mapActivity(await fetchWhoViewedMe(page, size));
    case "Shortlisted you":
      return mapActivity(await fetchWhoShortlistedMe(page, size));
    case "Viewed by you":
      return mapActivity(await fetchViewedByMe(page, size));
    case "Newly Joined":
      return mapMatches(await fetchNewMatches(page, size));
    case "Nearby matches":
      return mapMatches(await fetchByCategory("NEARBY", page, size));
    case "With photos":
      return mapMatches(await fetchByCategory("WITH_PHOTOS", page, size));
    case "Education preference":
      return mapMatches(await fetchByCategory("EDUCATION_PREF", page, size));
    case "Professional preference":
      return mapMatches(await fetchByCategory("PROFESSIONAL_PREF", page, size));
    case "Location preference":
      return mapMatches(await fetchByCategory("LOCATION_PREF", page, size));
    case "NRI matches":
      return mapMatches(await fetchByCategory("NRI", page, size));
    // The remaining labels don't have specialised backend logic yet;
    // they fall back to "Your Matches" (with filters) so the UI still shows results.
    case "With horoscope":
    case "Similar hobbies":
    case "Star matches":
    case "Horoscope matches":
    case "Mutual matches":
    case "Looking for you":
    default:
      return mapMatches(await fetchAllMatches(page, size, filters));
  }
};

// ─── Shortlist actions ─────────────────────────────────────────
export const shortlistProfile = async (profileId: number) => {
  const res = await axiosInstance.post(`/activity/shortlist/${profileId}`);
  return res.data;
};

export const removeShortlist = async (profileId: number) => {
  const res = await axiosInstance.delete(`/activity/shortlist/${profileId}`);
  return res.data;
};

export const recordProfileView = async (profileId: number) => {
  const res = await axiosInstance.post(`/activity/view/${profileId}`);
  return res.data;
};

// ─── Express interest ──────────────────────────────────────────
export const sendInterest = async (
  receiverProfileId: number,
  message?: string,
) => {
  const res = await axiosInstance.post(
    `/interests/send/${receiverProfileId}`,
    message ? { message } : undefined,
  );
  return res.data;
};

// ─── Interest entity shape (mirrors backend `Interest`) ──────
export type InterestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface InterestProfileSummary {
  id?: number;
  firstName?: string;
  lastName?: string;
  age?: number;
  heightCm?: number;
  city?: string;
  state?: string;
  caste?: string;
  religion?: string;
  highestQualification?: string;
  occupation?: string;
  profilePhotoUrl?: string;
}

export interface InterestDto {
  id: number;
  status: InterestStatus;
  message?: string;
  sentAt?: string;
  updatedAt?: string;
  sender?: InterestProfileSummary;
  receiver?: InterestProfileSummary;
}

export const getReceivedInterests = async (page = 0, size = 200) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<InterestDto>>>(
    "/interests/received",
    { params: { page, size } },
  );
  return res.data.data;
};

export const getSentInterestsList = async (page = 0, size = 200) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<InterestDto>>>(
    "/interests/sent",
    { params: { page, size } },
  );
  return res.data.data;
};

export const acceptInterest = async (interestId: number) => {
  const res = await axiosInstance.patch(`/interests/${interestId}/accept`);
  return res.data;
};

export const rejectInterest = async (interestId: number) => {
  const res = await axiosInstance.patch(`/interests/${interestId}/reject`);
  return res.data;
};

export const withdrawInterest = async (interestId: number) => {
  const res = await axiosInstance.delete(`/interests/${interestId}`);
  return res.data;
};

// Map of profile-id → latest InterestStatus for interests the logged-in user
// has sent. Used to render the correct button on profile-detail (so a
// withdrawn interest no longer looks like an active "INTEREST SENT" badge).
export const fetchSentInterestStatusByProfileId = async (
  size = 200,
): Promise<Map<number, InterestStatus>> => {
  try {
    const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<InterestDto>>>(
      "/interests/sent",
      { params: { page: 0, size } },
    );
    const content = res.data.data.content ?? [];
    const map = new Map<number, InterestStatus>();
    // Backend returns newest first; first hit per profile is the latest status.
    content.forEach((row) => {
      const pid = row?.receiver?.id;
      if (typeof pid === "number" && !map.has(pid)) {
        map.set(pid, row.status);
      }
    });
    return map;
  } catch {
    return new Map();
  }
};

// Back-compat wrapper used elsewhere — returns just the ids.
export const fetchSentInterestProfileIds = async (size = 200): Promise<Set<number>> => {
  try {
    const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<InterestDto>>>(
      "/interests/sent", { params: { page: 0, size } },
    );
    const content = res.data.data.content ?? [];
    const ids = new Set<number>();
    content.forEach((row) => {
      const pid = row?.receiver?.id;
      if (typeof pid === "number") ids.add(pid);
    });
    return ids;
  } catch {
    return new Set();
  }
};

// ─── Send a direct message (starts a conversation) ─────────────
export const sendMessage = async (receiverUserId: number, content: string) => {
  const res = await axiosInstance.post(`/messages/send/${receiverUserId}`, {
    content,
  });
  return res.data;
};
