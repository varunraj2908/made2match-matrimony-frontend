import axiosInstance from "@/api/axiosInstance";
import type {
  ApiEnvelope,
  MatchProfile,
  PageEnvelope,
} from "./homeService";

// ── Card shape the search results UI renders ───────────────────────
export interface SearchCardProfile {
  id: number;
  name: string;
  age?: number;
  height?: string;
  location?: string;
  profession?: string;
  education?: string;
  religion?: string;
  photo?: string;
  isPremium?: boolean;
}

const fallbackPhoto = (name?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=c0174c&color=fff&size=200`;

const toCard = (m: MatchProfile): SearchCardProfile => ({
  id: m.profileId,
  name: m.fullName || [m.firstName, m.lastName].filter(Boolean).join(" ") || "—",
  age: m.age,
  height: m.heightDisplay,
  location: [m.city, m.state].filter(Boolean).join(", "),
  profession: m.occupation,
  education: m.highestQualification,
  religion: m.religion,
  photo: m.profilePhotoUrl || fallbackPhoto(m.fullName),
  isPremium: m.isPremium,
});

// ── Filters supported by GET /matches/all ──────────────────────────
export interface SearchCriteria {
  minAge?: number;
  maxAge?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
  religion?: string;
  maritalStatus?: string;   // backend enum name e.g. NEVER_MARRIED
  education?: string;       // matches highestQualification
  city?: string;
  withPhotos?: boolean;
  withHoroscope?: boolean;
  profileCreatedBy?: string; // SELF | FRIEND ...
  sortBy?: string;
}

export interface SearchResult {
  items: SearchCardProfile[];
  totalElements: number;
  totalPages: number;
  page: number;
}

const buildParams = (c: SearchCriteria): Record<string, unknown> => {
  const p: Record<string, unknown> = {};
  if (c.minAge != null) p.minAge = c.minAge;
  if (c.maxAge != null) p.maxAge = c.maxAge;
  if (c.minHeightCm) p.minHeightCm = c.minHeightCm;
  if (c.maxHeightCm) p.maxHeightCm = c.maxHeightCm;
  if (c.religion) p.religion = c.religion;
  if (c.maritalStatus) p.maritalStatus = c.maritalStatus;
  if (c.education) p.education = c.education;
  if (c.city) p.city = c.city;
  if (c.withPhotos) p.withPhotos = true;
  if (c.withHoroscope) p.withHoroscope = true;
  if (c.profileCreatedBy) p.profileCreatedBy = c.profileCreatedBy;
  if (c.sortBy) p.sortBy = c.sortBy;
  return p;
};

// Search profiles by criteria (paginated).
export const searchProfiles = async (
  criteria: SearchCriteria,
  page = 0,
  size = 12,
): Promise<SearchResult> => {
  const res = await axiosInstance.get<ApiEnvelope<PageEnvelope<MatchProfile>>>(
    "/matches/all",
    { params: { page, size, ...buildParams(criteria) } },
  );
  const data = res.data.data;
  return {
    items: (data.content ?? []).map(toCard),
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
    page: data.number ?? page,
  };
};

// ── UI label → backend value maps (for the search form) ────────────
export const heightToCm = (label: string): number => {
  const m = label.match(/(\d+)'(\d+)/);
  if (!m) return 0;
  return Math.round((parseInt(m[1], 10) * 12 + parseInt(m[2], 10)) * 2.54);
};

export const MARITAL_STATUS_MAP: Record<string, string> = {
  "Never Married": "NEVER_MARRIED",
  Divorced: "DIVORCED",
  Widowed: "WIDOWED",
  "Awaiting Divorce": "AWAITING_DIVORCE",
};

export const PROFILE_CREATED_BY_MAP: Record<string, string> = {
  Self: "SELF",
  Friends: "FRIEND",
};

// Parse a matrimony id / code (e.g. "GM002341" or "2341") → numeric profile id.
export const parseProfileId = (raw: string): number | null => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};
