import axiosInstance from "@/api/axiosInstance";

// ── Shared envelope ────────────────────────────────────────────
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

// ── Mappers: UI label → backend enum / value ────────────────────
export const heightLabelToCm = (label: string): number => {
  const m = label.match(/(\d+)'(\d+)/);
  if (!m) return 0;
  const feet = parseInt(m[1], 10);
  const inches = parseInt(m[2], 10);
  return Math.round((feet * 12 + inches) * 2.54);
};

const MARITAL_MAP: Record<string, string> = {
  "Never married": "NEVER_MARRIED",
  "Widower": "WIDOWED",
  "Awaiting divorce": "AWAITING_DIVORCE",
  "Divorced": "DIVORCED",
};

const PHYSICAL_MAP: Record<string, string> = {
  "Normal": "NORMAL",
  "Physically challenged": "PHYSICALLY_CHALLENGED",
};

const SHUDHAJATHAKAM_MAP: Record<string, string> = {
  "Yes": "YES",
  "No": "NO",
  "Don't know": "DONT_KNOW",
};

const FAMILY_STATUS_MAP: Record<string, string | null> = {
  "Middle Class": "MIDDLE_CLASS",
  "Upper Middle Class": "UPPER_MIDDLE_CLASS",
  "Rich / Affluent": "AFFLUENT",
  "Traditional Family": null,
  "Modern Family": null,
};

export const mapMaritalStatus = (v: string): string | undefined =>
  MARITAL_MAP[v];
export const mapPhysicalStatus = (v: string): string | undefined =>
  PHYSICAL_MAP[v];
export const mapShudhajathakam = (v: string): string | undefined =>
  SHUDHAJATHAKAM_MAP[v];
export const mapFamilyStatus = (v: string): string | null | undefined =>
  v in FAMILY_STATUS_MAP ? FAMILY_STATUS_MAP[v] : undefined;

export const incomeLabelToAnnual = (label: string): number => {
  if (!label || label === "No Income" || label === "Less than 1 Lakh") return 0;
  const m = label.match(/(\d+)/);
  return m ? parseInt(m[1], 10) * 100000 : 0;
};

// ── Step 1: Basic Details ──────────────────────────────────────
export interface BasicDetailsPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth: string; // YYYY-MM-DD
  motherTongue: string;
  gender: string;
  profileCreatedBy: string;
}

export const saveBasicDetails = async (data: BasicDetailsPayload) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/onboarding/step/basic-details/save",
    data,
  );
  return response.data;
};

// ── Step 2: Personal & Religious ───────────────────────────────
export interface PersonalDetailsPayload {
  heightCm?: number;
  physicalStatus?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  willingToMarryAnyCaste?: boolean;
  shudhajathakam?: string;
}

export const savePersonalDetails = async (data: PersonalDetailsPayload) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/onboarding/step/personal-details/save",
    data,
  );
  return response.data;
};

// ── Step 3: Location & Professional ────────────────────────────
export interface ProfessionalDetailsPayload {
  country?: string;
  state?: string;
  city?: string;
  highestQualification?: string;
  occupation?: string;
  annualIncome?: number;
}

export const saveProfessionalDetails = async (
  data: ProfessionalDetailsPayload,
) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/onboarding/step/professional-details/save",
    data,
  );
  return response.data;
};

// ── Step 4: Additional Details ─────────────────────────────────
export interface AdditionalDetailsPayload {
  familyStatus?: string | null;
  bio?: string;
}

export const saveAdditionalDetails = async (data: AdditionalDetailsPayload) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/onboarding/step/aditional-details/save",
    data,
  );
  return response.data;
};

// ── Full profile detail ────────────────────────────────────────
export interface PartnerPreferenceDto {
  id?: number;
  minAge?: number;
  maxAge?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
  preferredCountry?: string;
  preferredState?: string;
  preferredReligion?: string;
  preferredCaste?: string;
  casteNoBar?: boolean;
  preferredMaritalStatus?: string;
  preferredEducation?: string;
  minAnnualIncome?: number;
  preferredDiet?: string;
  smokingAcceptable?: string;
  drinkingAcceptable?: string;
  partnerDescription?: string;
}

export interface FullProfile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  profilePhotoUrl?: string;
  bio?: string;
  profileCreatedBy?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  motherTongue?: string;
  maritalStatus?: string;
  willingToMarryAnyCaste?: boolean;
  shudhajathakam?: string;
  heightCm?: number;
  weightKg?: number;
  bodyType?: string;
  complexion?: string;
  physicalStatus?: string;
  highestQualification?: string;
  collegeUniversity?: string;
  occupation?: string;
  annualIncome?: number;
  employedIn?: string;
  familyType?: string;
  familyStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  noOfBrothers?: number;
  noOfSisters?: number;
  diet?: string;
  smoking?: string;
  drinking?: string;
  photoUrls?: string[];
  profileCompletionPct?: number;
  isPremium?: boolean;
  createdAt?: string;
  partnerPreference?: PartnerPreferenceDto;
}

export const getProfileById = async (id: number | string) => {
  const res = await axiosInstance.get<ApiEnvelope<FullProfile>>(`/profiles/${id}`);
  return res.data.data;
};

// ── Profile photo upload (multipart) ───────────────────────────
export const uploadProfilePhoto = async (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/photos/upload",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

// ── Hobbies & Interests ────────────────────────────────────────
const INTEREST_CATEGORY_MAP: Record<string, string> = {
  hobbies: "HOBBIES",
  music: "MUSIC",
  reading: "READING",
  movies: "MOVIES_TV",
  sports: "SPORTS_FITNESS",
  food: "FOOD",
  languages: "SPOKEN_LANGUAGES",
};

export const mapInterestCategory = (k: string): string | undefined =>
  INTEREST_CATEGORY_MAP[k];

export const saveAllInterests = async (
  interestsByCategory: Record<string, string[]>,
) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/interests",
    interestsByCategory,
  );
  return response.data;
};

// ── Horoscope ──────────────────────────────────────────────────
export interface HoroscopePayload {
  dateOfBirth?: string; // dd-MMM-yyyy
  timeOfBirth?: string; // HH:mm (24h)
  birthCountry?: string;
  birthState?: string;
  birthCity?: string;
}

export const timeLabelToHHmm = (label: string): string | undefined => {
  if (!label) return undefined;
  const m = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return undefined;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const period = m[3]?.toUpperCase();
  if (period === "AM") {
    if (h === 12) h = 0;
  } else if (period === "PM") {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, "0")}:${min}`;
};

export const saveHoroscope = async (data: HoroscopePayload) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/horoscope",
    data,
  );
  return response.data;
};

// ── Star Details (Nakshatra + Raasi) ──────────────────────────
const NAKSHATRA_MAP: Record<string, string> = {
  "Ashwini / Aswathi": "ASHWINI",
  "Bharani": "BHARANI",
  "Krittika / Karthika": "KRITTIKA",
  "Rohini": "ROHINI",
  "Mrigashira / Makayiram": "MRIGASHIRA",
  "Ardra / Thiruvathira": "ARDRA",
  "Punarvasu / Punartham": "PUNARVASU",
  "Pushya / Pooyam": "PUSHYA",
  "Ashlesha / Ayilyam": "ASHLESHA",
  "Magha / Makam": "MAGHA",
  "Purva Phalguni / Pooram": "PURVA_PHALGUNI",
  "Uttara Phalguni / Uthram": "UTTARA_PHALGUNI",
  "Hasta / Atham": "HASTA",
  "Chitra / Chithira": "CHITRA",
  "Swati / Chothi": "SWATI",
  "Vishakha / Vishakam": "VISHAKHA",
  "Anuradha / Anizham": "ANURADHA",
  "Jyeshtha / Thrikketta": "JYESHTHA",
  "Mula / Moolam": "MOOLA",
  "Purva Ashadha / Pooradam": "PURVA_ASHADHA",
  "Uttara Ashadha / Uthradam": "UTTARA_ASHADHA",
  "Shravana / Thiruvonam": "SHRAVANA",
  "Dhanishtha / Avittam": "DHANISHTA",
  "Shatabhisha / Chathayam": "SHATABHISHA",
  "Purva Bhadrapada / Pooruruttathi": "PURVA_BHADRAPADA",
  "Uttara Bhadrapada / Uthrattathi": "UTTARA_BHADRAPADA",
  "Revati": "REVATI",
};

const RAASI_MAP: Record<string, string> = {
  "Mesha (Aries)": "MESHA",
  "Vrishabha (Taurus)": "VRISHABHA",
  "Mithunam (Gemini)": "MITHUNA",
  "Karkata (Cancer)": "KARKA",
  "Simha (Leo)": "SIMHA",
  "Kanya (Virgo)": "KANYA",
  "Tula (Libra)": "TULA",
  "Vrischika (Scorpio)": "VRISHCHIKA",
  "Dhanus (Sagittarius)": "DHANU",
  "Makara (Capricorn)": "MAKARA",
  "Kumbha (Aquarius)": "KUMBHA",
  "Meena (Pisces)": "MEENA",
};

export const mapNakshatra = (v: string): string | undefined => NAKSHATRA_MAP[v];
export const mapRaasi = (v: string): string | undefined => RAASI_MAP[v];

export interface StarDetailsPayload {
  nakshatra?: string;
  raasi?: string;
}

export const saveStarDetails = async (data: StarDetailsPayload) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/star-details",
    data,
  );
  return response.data;
};

// ── Eating Habit ──────────────────────────────────────────────
const DIET_MAP: Record<string, string> = {
  "Vegetarian": "VEGETARIAN",
  "Non-Vegetarian": "NON_VEGETARIAN",
  "Eggetarian": "EGGETARIAN",
};

export const mapDiet = (v: string): string | undefined => DIET_MAP[v];

export const saveEatingHabit = async (diet: string) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/eating-habit",
    { diet },
  );
  return response.data;
};

// ── College & Organization ────────────────────────────────────
export interface CollegeOrgPayload {
  collegeUniversity?: string;
  companyName?: string;
}

export const saveCollegeOrg = async (data: CollegeOrgPayload) => {
  const response = await axiosInstance.post<ApiEnvelope<Record<string, unknown>>>(
    "/profiles/college-org",
    data,
  );
  return response.data;
};
