import axiosInstance from "@/api/axiosInstance";
import type {
  ApiEnvelope,
  MatchProfile,
  PageEnvelope,
  ProfileActivity,
} from "./homeService";
import { formatProfileCode } from "@/lib/memberId";

// ─── Unified card shape ────────────────────────────────────────
// Whatever endpoint returned the row, the UI cares about the same fields.
export interface CardProfile {
  id: string;
  numericId: number;
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
  isNew?: boolean;        // joined today
  createdAt?: string;     // ISO string from backend
}

const fallbackPhoto = (name?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=ea580c&color=fff&size=200`;

const isJoinedToday = (iso?: string): boolean => {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const fromMatch = (m: MatchProfile): CardProfile => ({
  id: formatProfileCode(m.profileCode, m.profileId),
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
  isNew: isJoinedToday(m.createdAt),
  createdAt: m.createdAt,
});

const fromActivity = (a: ProfileActivity): CardProfile => ({
  id: formatProfileCode(a.profileCode, a.profileId),
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
  mutualMatches?: boolean;    // route to /matches/mutual
  mutualHobbies?: string;     // hobby value — route to /matches/similar-hobbies
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
  // mutualMatches + mutualHobbies are handled by switching the active menu
  // in fetchForMenu, not as query params — no extra params needed here.
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
  profileId?: number;
  profileCode?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  heightCm?: number;
  heightDisplay?: string;
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
  readAt?: string | null;
  sender?: InterestProfileSummary;
  receiver?: InterestProfileSummary;
}

export type SentInterestProfileCacheInput = InterestProfileSummary & {
  fullName?: string;
  name?: string;
};

const SENT_INTEREST_CACHE_KEY = "made2match.sentInterests.v1";

const isBrowser = () => typeof window !== "undefined";

const hashValue = (value: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

const getSentInterestCacheKey = () => {
  if (!isBrowser()) return SENT_INTEREST_CACHE_KEY;
  const token = localStorage.getItem("token") || "anonymous";
  return `${SENT_INTEREST_CACHE_KEY}.${hashValue(token)}`;
};

const getInterestData = (payload: unknown): unknown => {
  const body = payload as {
    data?: unknown;
    payload?: unknown;
    result?: unknown;
    response?: unknown;
  };
  return body?.data ?? body?.payload ?? body?.result ?? body?.response ?? payload;
};

const asInterestDto = (value: unknown): InterestDto | null => {
  const row = value as Partial<InterestDto> | null | undefined;
  return typeof row?.id === "number" ? (row as InterestDto) : null;
};

const splitName = (profile: SentInterestProfileCacheInput) => {
  const fullName = (profile.fullName || profile.name || "").trim();
  if (!fullName) return { firstName: profile.firstName, lastName: profile.lastName };
  const [firstName, ...rest] = fullName.split(/\s+/);
  return {
    firstName: profile.firstName || firstName,
    lastName: profile.lastName || rest.join(" ") || undefined,
  };
};

const readCachedSentInterests = (): InterestDto[] => {
  if (!isBrowser()) return [];
  try {
    localStorage.removeItem(SENT_INTEREST_CACHE_KEY);
    const parsed = JSON.parse(localStorage.getItem(getSentInterestCacheKey()) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.map((item) => normalizeInterest(item as InterestDto)) : [];
  } catch {
    return [];
  }
};

const writeCachedSentInterests = (items: InterestDto[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(getSentInterestCacheKey(), JSON.stringify(items.slice(0, 100)));
};

export const cacheSentInterest = (
  receiverProfileId: number,
  profile: SentInterestProfileCacheInput,
  response?: unknown,
) => {
  if (!isBrowser() || !receiverProfileId) return;
  const responseInterest = asInterestDto(getInterestData(response));
  const names = splitName(profile);
  const cached: InterestDto = normalizeInterest({
    id: responseInterest?.id ?? -receiverProfileId,
    status: responseInterest?.status ?? "PENDING",
    message: responseInterest?.message,
    sentAt: responseInterest?.sentAt ?? new Date().toISOString(),
    updatedAt: responseInterest?.updatedAt,
    readAt: responseInterest?.readAt ?? null,
    sender: responseInterest?.sender,
    receiver: {
      id: receiverProfileId,
      profileCode: profile.profileCode,
      firstName: names.firstName,
      lastName: names.lastName,
      age: profile.age,
      heightCm: profile.heightCm,
      heightDisplay: profile.heightDisplay,
      city: profile.city,
      state: profile.state,
      caste: profile.caste,
      religion: profile.religion,
      highestQualification: profile.highestQualification,
      occupation: profile.occupation,
      profilePhotoUrl: profile.profilePhotoUrl,
    },
  });
  const next = readCachedSentInterests().filter(
    (item) => item.receiver?.id !== receiverProfileId,
  );
  writeCachedSentInterests([cached, ...next]);
};

const removeCachedSentInterest = (interestId: number) => {
  if (!isBrowser()) return;
  const next = readCachedSentInterests().filter((item) => item.id !== interestId);
  writeCachedSentInterests(next);
};

const mergeCachedSentInterests = (backendItems: InterestDto[]) => {
  const backendReceiverIds = new Set(
    backendItems
      .map((item) => item.receiver?.id)
      .filter((id): id is number => typeof id === "number"),
  );
  const missingCachedItems = readCachedSentInterests().filter(
    (item) =>
      item.status === "PENDING" &&
      typeof item.receiver?.id === "number" &&
      !backendReceiverIds.has(item.receiver.id),
  );
  return [...backendItems, ...missingCachedItems];
};

type RawPage<T> = Partial<PageEnvelope<T>> & {
  items?: T[];
  results?: T[];
  interests?: T[];
  received?: T[];
  receivedInterests?: T[];
  sent?: T[];
  sentInterests?: T[];
  data?: T[] | Partial<PageEnvelope<T>>;
};

type RawInterestProfile = InterestProfileSummary & {
  name?: string;
  profileName?: string;
};

type RawInterest = Partial<InterestDto> & {
  interestId?: number;
  senderProfile?: RawInterestProfile;
  receiverProfile?: RawInterestProfile;
  senderProfileSummary?: RawInterestProfile;
  receiverProfileSummary?: RawInterestProfile;
  fromProfile?: RawInterestProfile;
  toProfile?: RawInterestProfile;
  profile?: RawInterestProfile;
  createdAt?: string;
};

const normalizeInterestStatus = (status: unknown): InterestStatus => {
  const value = String(status || "PENDING").trim().toUpperCase();
  if (value === "ACCEPTED" || value === "ACCEPT" || value === "APPROVED") return "ACCEPTED";
  if (value === "REJECTED" || value === "DECLINED" || value === "DECLINE") return "REJECTED";
  if (value === "WITHDRAWN" || value === "CANCELLED" || value === "CANCELED") return "WITHDRAWN";
  return "PENDING";
};

const normalizeProfileSummary = (profile?: RawInterestProfile): InterestProfileSummary | undefined => {
  if (!profile) return undefined;
  const fullName = profile.fullName || profile.name || profile.profileName;
  const [firstName, ...rest] = (fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    ...profile,
    id: profile.id ?? profile.profileId,
    firstName: profile.firstName || firstName,
    lastName: profile.lastName || rest.join(" ") || undefined,
    fullName,
  };
};

const normalizeInterest = (interest: InterestDto): InterestDto => {
  const raw = interest as RawInterest;
  return {
    ...interest,
    id: interest.id ?? raw.interestId ?? 0,
    status: normalizeInterestStatus(interest.status),
    sentAt: interest.sentAt ?? raw.createdAt,
    sender: normalizeProfileSummary(
      raw.sender || raw.senderProfile || raw.senderProfileSummary || raw.fromProfile,
    ),
    receiver: normalizeProfileSummary(
      raw.receiver || raw.receiverProfile || raw.receiverProfileSummary || raw.toProfile || raw.profile,
    ),
  };
};

const normalizePage = <T,>(
  payload: unknown,
  page: number,
  size: number,
  collectionKeys: string[] = [],
): PageEnvelope<T> => {
  const body = payload as { data?: unknown };
  const raw = (body?.data ?? payload) as RawPage<T> | T[];
  const nested = !Array.isArray(raw) && raw?.data && !Array.isArray(raw.data)
    ? (raw.data as RawPage<T>)
    : raw;
  const keyedContent = !Array.isArray(nested)
    ? collectionKeys
        .map((key) => (nested as Record<string, unknown>)[key])
        .find((value): value is T[] => Array.isArray(value))
    : undefined;
  const content =
    Array.isArray(nested)
      ? nested
      : keyedContent
        ? keyedContent
      : Array.isArray(nested.content)
        ? nested.content
        : Array.isArray(nested.items)
          ? nested.items
          : Array.isArray(nested.results)
            ? nested.results
            : Array.isArray(nested.interests)
              ? nested.interests
            : Array.isArray(nested.data)
              ? nested.data
              : [];
  const totalElements = Array.isArray(nested)
    ? nested.length
    : nested.totalElements ?? content.length;
  return {
    content,
    totalElements,
    totalPages: Array.isArray(nested)
      ? Math.max(1, Math.ceil(nested.length / size))
      : nested.totalPages ?? Math.max(1, Math.ceil(totalElements / size)),
    number: Array.isArray(nested) ? page : nested.number ?? page,
    size: Array.isArray(nested) ? size : nested.size ?? size,
    first: Array.isArray(nested) ? page === 0 : nested.first ?? page === 0,
    last: Array.isArray(nested)
      ? true
      : nested.last ?? (page + 1 >= (nested.totalPages ?? Math.max(1, Math.ceil(totalElements / size)))),
    empty: content.length === 0,
  };
};

export const getReceivedInterests = async (page = 0, size = 200) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<InterestDto>>>(
    "/interests/received",
    { params: { page, size } },
  );
  const normalized = normalizePage<InterestDto>(
    res.data,
    page,
    size,
    ["received", "receivedInterests", "interests"],
  );
  return {
    ...normalized,
    content: normalized.content.map(normalizeInterest),
  };
};

export const getSentInterestsList = async (page = 0, size = 200) => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<InterestDto>>>(
    "/interests/sent",
    { params: { page, size } },
  );
  const normalized = normalizePage<InterestDto>(
    res.data,
    page,
    size,
    ["sent", "sentInterests", "interests"],
  );
  const content = mergeCachedSentInterests(normalized.content.map(normalizeInterest));
  return {
    ...normalized,
    content,
    totalElements: Math.max(normalized.totalElements, content.length),
    empty: content.length === 0,
  };
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
  const res = interestId < 0
    ? { data: { success: true } }
    : await axiosInstance.delete(`/interests/${interestId}`);
  removeCachedSentInterest(interestId);
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
    const content = mergeCachedSentInterests(
      normalizePage<InterestDto>(res.data, 0, size, ["sent", "sentInterests", "interests"]).content.map(normalizeInterest),
    );
    const map = new Map<number, InterestStatus>();
    // Backend returns newest first; first hit per profile is the latest status.
    content.forEach((row) => {
      const pid = row?.receiver?.id;
      if (typeof pid === "number" && !map.has(pid)) {
        map.set(pid, normalizeInterestStatus(row.status));
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
    const content = mergeCachedSentInterests(
      normalizePage<InterestDto>(res.data, 0, size, ["sent", "sentInterests", "interests"]).content.map(normalizeInterest),
    );
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
