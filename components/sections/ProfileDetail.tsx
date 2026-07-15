

"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  getProfileById,
  getMyProfileFull,
  type FullProfile,
} from "@/services/profileService";
import {
  cacheSentInterest,
  fetchSentInterestStatusByProfileId,
  recordProfileView,
  sendInterest,
  type InterestStatus,
} from "@/services/matchesService";
import { blockProfile } from "@/services/blockedProfilesService";
import { submitProfileReport, type ProfileReportRequest } from "@/services/profileReportService";
import { addReportNotification } from "@/services/notificationService";
import AiMatchModal, { type MatchPerson } from "./AiMatchModal";
import { formatProfileCode } from "@/lib/memberId";

// ── Display helpers ─────────────────────────────────────────────
const FALLBACK_AVATAR = (name?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=b22234&color=fff&size=400`;

const formatHeight = (cm?: number): string => {
  if (!cm) return "—";
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches}\"`;
};

const formatWeight = (kg?: number): string => {
  if (!kg) return "—";
  const lbs = Math.round(kg * 2.205);
  return `${kg} Kgs / ${lbs} lbs`;
};

const formatIncome = (annual?: number): string => {
  if (annual == null) return "—";
  if (annual === 0) return "No income";
  const lakhs = annual / 100000;
  return lakhs >= 1
    ? `Rs. ${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)} Lakhs`
    : `Rs. ${annual.toLocaleString()}`;
};

const formatIncomeRange = (min?: number, max?: number): string => {
  if (min == null && max == null) return "Any";
  if (min != null && max != null) return `${formatIncome(min)} – ${formatIncome(max)}`;
  return formatIncome(min ?? max);
};

const friendly = (enumValue: unknown): string => {
  if (enumValue == null || enumValue === "") return "—";
  if (typeof enumValue === "boolean") return enumValue ? "Yes" : "No";

  const displayValue =
    typeof enumValue === "object"
      ? (enumValue as { label?: unknown; name?: unknown; value?: unknown }).label ??
        (enumValue as { name?: unknown }).name ??
        (enumValue as { value?: unknown }).value
      : enumValue;

  if (displayValue == null || displayValue === "") return "—";

  return String(displayValue)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const formatLocation = (p: FullProfile): string =>
  [p.country, p.state, p.city].filter(Boolean).join(" / ") || "—";

const formatReligion = (p: FullProfile): string =>
  [p.religion, p.caste].filter(Boolean).join(" – ") || "—";

const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getAsyncErrorMessage = (errorValue: unknown, fallback: string) =>
  (errorValue as { response?: { data?: { message?: string } }; message?: string })
    ?.response?.data?.message ||
  (errorValue as { message?: string })?.message ||
  fallback;

// Maps a fetched FullProfile to the AI modal's MatchPerson shape.
const toMatchPerson = (p: FullProfile): MatchPerson => {
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || "—";
  const isFemale = (p.gender || "").toUpperCase().startsWith("F");
  const horoscope = [friendly(p.nakshatra), friendly(p.raasi)]
    .filter((value) => value && value !== "—")
    .join(" · ");
  return {
    name,
    role: isFemale ? "Bride" : "Groom",
    photo: p.profilePhotoUrl || p.photoUrls?.[0] || FALLBACK_AVATAR(name),
    age: p.age ?? 0,
    height: formatHeight(p.heightCm),
    education: [p.highestQualification, p.occupation].filter(Boolean).join(", ") || "—",
    family: [friendly(p.familyType), friendly(p.familyStatus)]
      .filter((v) => v && v !== "—")
      .join(" · ") || "—",
    location: [p.city, p.state].filter(Boolean).join(", ") || "—",
    weight: p.weightKg ? `${p.weightKg} kg` : "—",
    horoscope: horoscope || (friendly(p.shudhajathakam) !== "—" ? friendly(p.shudhajathakam) : "—"),
  };
};

const REPORT_CATEGORIES = [
  "Fake profile",
  "Inappropriate message",
  "Misleading photo",
  "Harassment",
  "Advertisement or solicitation",
  "Other",
];

function ReportViolationModal({
  profileId,
  profileCode,
  profileName,
  onClose,
  onSubmit,
  submitting,
}: {
  profileId: string;
  profileCode?: string;
  profileName: string;
  onClose: () => void;
  onSubmit: (payload: ProfileReportRequest) => Promise<void>;
  submitting: boolean;
}) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [evidence, setEvidence] = useState("");
  const [matrimonyId, setMatrimonyId] = useState(formatProfileCode(profileCode, profileId));

  const reset = () => {
    setCategory("");
    setSubject("");
    setDetails("");
    setEvidence("");
    setMatrimonyId(formatProfileCode(profileCode, profileId));
  };

  const submit = () => {
    if (!category || !subject.trim() || !details.trim()) return;
    onSubmit({
      reportedProfileId: Number(profileId.replace(/\D/g, "")),
      category,
      subject: subject.trim(),
      complaintDetails: details.trim(),
      evidence: evidence.trim() || undefined,
      matrimonyId: matrimonyId.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-rose-100">
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
            Report Violation
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 border border-white/30 text-white hover:bg-white hover:text-[#c0174c] transition-colors"
            aria-label="Close report form"
          >
            x
          </button>
        </div>

        <div className="bg-white px-5 sm:px-6 py-5 max-h-[78vh] overflow-y-auto">
          <div className="rounded-xl border border-rose-100 bg-rose-50/45 p-4 text-sm text-gray-800 leading-relaxed space-y-3">
            <p>
              We work with our trust and safety team to take action against people
              who misuse Made2Match. You can reach us at{" "}
              <a href="tel:+918075067058" className="font-semibold text-[#c0174c] hover:underline">
                +91-8075067058
              </a>{" "}
              or email{" "}
              <a
                href="mailto:support@made2match.com"
                className="font-semibold text-[#c0174c] hover:underline"
              >
                support@made2match.com
              </a>
              , and we will review the necessary action.
            </p>
            <p className="font-bold text-[#8b0f38]">
              Note: We will not disclose your identity to the reported member.
            </p>
            <div>
              <p className="font-bold text-gray-900 mb-2">Some examples of violation:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>If a member sends obscene or inappropriate messages.</li>
                <li>If you suspect a member&apos;s profile is fake or fraudulent.</li>
                <li>If a member is sending harassing messages.</li>
                <li>If you suspect a member&apos;s photograph is not real.</li>
                <li>If you notice business or solicitation material.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <label className="block">
              <span className="font-bold text-gray-900">Abuse Category</span>
              <span className="text-red-500 text-xs ml-1">* Select abuse category.</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1 w-full h-10 rounded-lg border border-rose-100 bg-white px-3 font-mono font-bold text-[#c0174c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]/25"
              >
                <option value="">- select -</option>
                {REPORT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-bold text-gray-900">Subject</span>
              <span className="text-red-500 text-xs ml-1">* Enter your subject.</span>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-1 w-full h-10 rounded-lg border border-rose-100 bg-white px-3 font-mono font-bold text-[#c0174c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]/25"
              />
            </label>

            <label className="block">
              <span className="font-bold text-gray-900">Complaint Details</span>
              <span className="text-red-500 text-xs ml-1">
                * Enter your complaint details.
              </span>
              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-rose-100 bg-white px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]/25"
              />
            </label>

            <label className="block">
              <span className="font-bold text-gray-900">Paste Evidence, if Any</span>
              <textarea
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-rose-100 bg-white px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]/25"
              />
            </label>

            <label className="block">
              <span className="font-bold text-gray-900">Complaint against Made2Match ID</span>
              <input
                value={matrimonyId}
                onChange={(event) => setMatrimonyId(event.target.value)}
                className="mt-1 w-full h-10 rounded-lg border border-rose-100 bg-white px-3 font-mono font-bold text-[#c0174c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]/25"
              />
              <span className="block text-xs font-semibold text-gray-400 mt-0.5">
                Reporting {profileName}. Furnish Made2Match ID if relevant.
              </span>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[#c0174c] text-white text-sm font-bold shadow hover:bg-[#9a123b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg border border-rose-200 bg-white text-[#c0174c] text-sm font-bold hover:bg-rose-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileData {
  id: string;
  name: string;
  age: number;
  height: string;
  weight: string;
  religion: string;
  caste: string;
  subCaste: string;
  location: string;
  education: string;
  profession: string;
  annualIncome: string;
  lastLogin: string;
  photo: string;
  photos: string[];
  about: string;
  bodyType: string;
  complexion: string;
  physicalStatus: string;
  eatingHabits: string;
  drinkingHabits: string;
  smokingHabits: string;
  motherTongue: string;
  maritalStatus: string;
  chatStatus: string;
  callStatus: string;
  sendMail: string;
  country: string;
  state: string;
  citizenship: string;
  city: string;
  educationDetail: string;
  employedIn: string;
  occupationType: string;
  occupationDetail: string;
  dob: string;
  birthPlace: string;
  timeOfBirth: string;
  manglik: string;
  star: string;
  raasi: string;
  gothram: string;
  dosh: string;
  completionPct?: number;        // from backend profileCompletionPct
  socialLinks: { icon: string; color: string }[];
  partnerPreferences: {
    ageFrom: number;
    ageTo: number;
    heightFrom: string;
    heightTo: string;
    maritalStatus: string;
    physicalStatus: string;
    eatingHabits: string;
    drinkingHabits: string;
    smokingHabits: string;
    education: string;
    occupation: string;
    annualIncome: string;
    country: string;
    state: string;
    citizenship: string;
    city: string;
    religion: string;
    caste: string;
    subCaste: string;
    star: string;
    raasi: string;
    gothram: string;
    dosh: string;
    motherTongue: string;
    aboutPartner: string;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROFILE: ProfileData = {
  id: "MTM01247",
  name: "Lorem Ipsum",
  age: 20,
  height: "5'1 In",
  weight: "45 Kgs / 99 lbs",
  religion: "Hindu – Brahmin",
  caste: "Sharma",
  subCaste: "Brahmin Pundait / Brahmin",
  location: "India / Up / Lucknow",
  education: "Accounts / Finance",
  profession: "Accounts / Finance",
  annualIncome: "2 – 3 Lakhs",
  lastLogin: "1 hour ago",
  photo: "https://randomuser.me/api/portraits/women/44.jpg",
  photos: [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/women/45.jpg",
    "https://randomuser.me/api/portraits/women/46.jpg",
    "https://randomuser.me/api/portraits/women/47.jpg",
    "https://randomuser.me/api/portraits/women/48.jpg",
    "https://randomuser.me/api/portraits/women/49.jpg",
    "https://randomuser.me/api/portraits/women/50.jpg",
    "https://randomuser.me/api/portraits/women/51.jpg",
  ],
  about:
    "My daughter is a Manager with a Master's degree currently working in Private sector in Gurgaon. We come from a Middle class, Nuclear family background with traditional values.",
  bodyType: "Slim",
  complexion: "Fair",
  physicalStatus: "Normal",
  eatingHabits: "Vegetarian",
  drinkingHabits: "Never drinks",
  smokingHabits: "Never smokes",
  motherTongue: "Hindi",
  maritalStatus: "Never married",
  chatStatus: "Online",
  callStatus: "Online",
  sendMail: "Online",
  country: "India",
  state: "Uttar Pradesh",
  citizenship: "Indian",
  city: "Lucknow",
  educationDetail: "MBA (Sales/b)",
  employedIn: "Private Sector",
  occupationType: "Manager",
  occupationDetail: "Asst.Manager (HR)",
  dob: "2007/90",
  birthPlace: "India",
  timeOfBirth: "22:33 hrs",
  manglik: "No",
  star: "Hasta / Hastya / Kanya (Virgo)",
  raasi: "Hastya / Kanya (Virgo)",
  gothram: "Not Specified",
  dosh: "Not Specified",
  socialLinks: [
    { icon: "f", color: "#1877F2" },
    { icon: "in", color: "#0A66C2" },
    { icon: "t", color: "#1DA1F2" },
    { icon: "y", color: "#FF0000" },
    { icon: "g", color: "#34A853" },
  ],
  partnerPreferences: {
    ageFrom: 27,
    ageTo: 32,
    heightFrom: "5'4 In",
    heightTo: "6'2 In",
    maritalStatus: "Never married",
    physicalStatus: "Normal",
    eatingHabits: "Doesn't matter",
    drinkingHabits: "Prefer someone who never drinks",
    smokingHabits: "Prefer someone who never smokes",
    education: "Any Engineering / Computers...",
    occupation: "Any Occupation",
    annualIncome: "Any Annual Income",
    country: "India",
    state: "Uttar Pradesh, Bhojpur, Bihar...",
    citizenship: "Indian",
    city: "Lucknow",
    religion: "Hindu",
    caste: "Nai / nai/Brahmin, bhoi...",
    subCaste: "Nai / (Nai/Brahmin/bhoi/gotthu)",
    star: "Hasta / Hastya / Kanya (Virgo)",
    raasi: "Hastya / Kanya (Virgo)",
    gothram: "Not Specified",
    dosh: "Not Specified",
    motherTongue: "Hindi",
    aboutPartner:
      "My groom is a Manager with a Master's degree currently working in Private sector in Gurgaon. We come from a Middle class, Nuclear family background with traditional values.",
  },
};

// ─── Photo Slider ─────────────────────────────────────────────────────────────
const PhotoSlider = ({ photos, name }: { photos: string[]; name: string }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [thumbStart, setThumbStart] = useState(0);
  const THUMB_VISIBLE = 5;

  const ensureThumbVisible = useCallback((idx: number) => {
    setThumbStart((start) => {
      if (idx < start) return idx;
      if (idx >= start + THUMB_VISIBLE) return idx - THUMB_VISIBLE + 1;
      return start;
    });
  }, []);

  const goToPhoto = useCallback((idx: number) => {
    setActive(idx);
    ensureThumbVisible(idx);
  }, [ensureThumbVisible]);

  const prev = useCallback(() => {
    goToPhoto((active - 1 + photos.length) % photos.length);
  }, [active, goToPhoto, photos.length]);

  const next = useCallback(() => {
    goToPhoto((active + 1) % photos.length);
  }, [active, goToPhoto, photos.length]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  const visibleThumbs = photos.slice(thumbStart, thumbStart + THUMB_VISIBLE);

  return (
    <>
      <div className="shrink-0 w-full sm:w-48">
        {/* Main Image */}
        <div
          className="relative w-full sm:w-48 h-56 rounded-lg overflow-hidden border-2 border-[#f5d0d7] shadow-md group cursor-pointer"
          onClick={() => setLightbox(true)}
        >
          <img
            src={photos[active]}
            alt={`${name} photo ${active + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/192x224?text=No+Photo"; }}
          />
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#b22234] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#b22234] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          >›</button>
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">
            {active + 1}/{photos.length}
          </div>
          <div className="absolute top-1.5 right-1.5 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            🔍 View
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
              disabled={thumbStart === 0}
              className="text-gray-400 hover:text-[#b22234] disabled:opacity-20 text-sm font-bold leading-none"
            >‹</button>
            <div className="flex gap-1 flex-1 justify-center">
              {visibleThumbs.map((photo, idx) => {
                const realIdx = thumbStart + idx;
                return (
                  <button
                    key={realIdx}
                    onClick={() => goToPhoto(realIdx)}
                    className={`w-8 h-8 rounded overflow-hidden border-2 transition-all shrink-0 ${
                      active === realIdx
                        ? "border-[#b22234] scale-110 shadow-md"
                        : "border-gray-200 hover:border-[#b22234] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`thumb ${realIdx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/32?text=?"; }}
                    />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setThumbStart((s) => Math.min(photos.length - THUMB_VISIBLE, s + 1))}
              disabled={thumbStart + THUMB_VISIBLE >= photos.length}
              className="text-gray-400 hover:text-[#b22234] disabled:opacity-20 text-sm font-bold leading-none"
            >›</button>
          </div>
          <div className="flex justify-center gap-1 mt-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all ${
                  active === i ? "w-3 h-1.5 bg-[#b22234]" : "w-1.5 h-1.5 bg-gray-300 hover:bg-[#b22234]"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-1.5">📸 {photos.length} Photos</p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-[#b22234] transition-colors z-10"
            onClick={() => setLightbox(false)}
          >✕</button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#b22234] text-white w-10 h-10 rounded-full text-xl flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >‹</button>
          <div className="relative max-w-2xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[active]}
              alt={`${name} photo ${active + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500?text=No+Photo"; }}
            />
            <div className="text-white text-center text-xs mt-3 opacity-70">
              {active + 1} / {photos.length} — Press ← → to navigate, Esc to close
            </div>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#b22234] text-white w-10 h-10 rounded-full text-xl flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >›</button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className={`w-10 h-10 rounded overflow-hidden border-2 transition-all ${
                  active === i ? "border-[#b22234] scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={photo} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#b22234]">
    <span className="text-base">{icon}</span>
    <h3 className="text-base font-bold text-[#b22234] tracking-wide">{title}</h3>
  </div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: string }) => {
  const isContact = label === "Email" || label === "Phone Number";

  return (
    <div
      className={`flex gap-2 py-1.5 border-b last:border-0 ${
        isContact
          ? "my-1 rounded-lg border border-rose-100 bg-rose-50 px-3"
          : "border-gray-50"
      }`}
    >
      <span
        className={`text-xs w-36 shrink-0 font-semibold ${
          isContact ? "text-[#c0174c]" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-xs flex-1 break-all ${
          isContact ? "font-bold text-gray-900" : "text-gray-800"
        }`}
      >
        {value || "Not Specified"}
      </span>
    </div>
  );
};

// ─── Two-Column Details ───────────────────────────────────────────────────────
const TwoColDetails = ({
  left,
  right,
}: {
  left: { label: string; value: string }[];
  right: { label: string; value: string }[];
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
    <div>{left.map((r) => <DetailRow key={r.label} {...r} />)}</div>
    <div>{right.map((r) => <DetailRow key={r.label} {...r} />)}</div>
  </div>
);

// ─── Sidebar (desktop only) ───────────────────────────────────────────────────
const Sidebar = () => (
  <aside className="hidden lg:block w-56 shrink-0 space-y-3">
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#b22234] text-white px-4 py-3 font-semibold text-sm">Filter Profiles</div>

      {/* Country */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 bg-orange-50">
          <span className="flex items-center gap-1.5"><span>🌍</span> Country</span>
          <span className="text-gray-400 text-base leading-none">−</span>
        </div>
        <div className="px-4 py-2 space-y-1">
          {["India Matrimony","China Matrimony","Nepal Matrimony","Germany Matrimony","Pakistan Matrimony","Bangladesh Matrimony"].map((c) => (
            <label key={c} className="flex items-center gap-2 text-[10px] text-gray-600 cursor-pointer hover:text-[#b22234] py-0.5">
              <input type="checkbox" className="accent-[#b22234] w-3 h-3" defaultChecked={c === "India Matrimony"} />
              {c}
            </label>
          ))}
          <button className="mt-2 text-[10px] text-white bg-[#b22234] px-3 py-1 rounded w-full">More Countries →</button>
        </div>
      </div>

      {/* Marital Status */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span>💍 Marital Status</span><span className="text-gray-400">+</span>
        </div>
      </div>

      {/* Religion */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span>🕌 Religion</span><span className="text-gray-400">+</span>
        </div>
      </div>

      {/* Horoscope */}
      <div className="border-b border-gray-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50">🔮 Horoscope</div>
        <div className="px-4 py-2 space-y-0.5">
          {["Kundli Matching","Tamil Kundli","Telugu Kundli","Maharashtra Kundli","Marathi Kundli","Gujarati Kundli","Kannada Kundli","Bihari Kundli","Bengali Kundli"].map((k) => (
            <div key={k} className="text-[10px] text-blue-600 hover:text-[#b22234] cursor-pointer py-0.5 flex items-center gap-1">
              <span className="text-gray-300">▶</span>{k}
            </div>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <div className="border-b border-gray-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50">⭐ Our Services</div>
        <div className="px-4 py-2 space-y-1">
          {[["Marathi Shaadi","ON"],["Assamese Shaadi","ON"],["Bengali Shaadi","ON"],["Hindi Shaadi","ON"],["Jain Shaadi","ON"],["Kannada Shaadi","ON"],["Telugu Shaadi","ON"]].map(([label, badge]) => (
            <div key={label} className="flex items-center justify-between text-[10px]">
              <span className="text-pink-600 cursor-pointer flex items-center gap-1"><span className="text-[#b22234]">★</span>{label}</span>
              <span className="bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="border-b border-gray-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50">🏷️ Tags</div>
        <div className="px-4 py-2 flex flex-wrap gap-1">
          {["Wedding","Matrimony","Client","Hindu","Event","London","Fonts","Bengali","Liger","India","Marathi","Oats","Popular","Tamil"].map((tag) => (
            <span key={tag} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded cursor-pointer hover:bg-[#b22234] hover:text-white transition-colors">{tag}</span>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="text-[10px] font-bold text-gray-700 mb-1">SUBSCRIBE NOW!</div>
        <p className="text-[9px] text-gray-500 mb-2">Stay updated with the latest profiles and matches.</p>
        <div className="flex gap-1">
          <input type="email" placeholder="Your Email address..." className="flex-1 text-[9px] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#b22234]" />
          <button className="bg-[#b22234] text-white text-[9px] px-2 py-1 rounded hover:bg-[#9a1d2b]">SEND</button>
        </div>
      </div>
    </div>
  </aside>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const LegacyProfileSidebar = Sidebar;

const isFilled = (value?: string | number): boolean => {
  if (value == null) return false;
  const text = String(value).trim();
  return Boolean(text && text !== "â€”" && text.toLowerCase() !== "not specified");
};

const ProfileSidebarRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="py-2 border-b border-gray-100 last:border-0">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className="text-xs font-semibold text-gray-800 leading-snug mt-0.5">{isFilled(value) ? value : "Not Specified"}</p>
  </div>
);

const ProfileSidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
      <h3 className="text-xs font-bold text-gray-800">{title}</h3>
    </div>
    <div className="px-4 py-2">{children}</div>
  </div>
);

const ProfileSidebar = ({
  profile,
  preferences,
}: {
  profile: ProfileData;
  preferences: ProfileData["partnerPreferences"];
}) => {
  const completionFields = [
    profile.name,
    profile.photo,
    profile.age,
    profile.height,
    profile.location,
    profile.religion,
    profile.education,
    profile.profession,
    profile.about,
    profile.maritalStatus,
  ];
  const filledCount = completionFields.filter(isFilled).length;
  const localCompletion = Math.round((filledCount / completionFields.length) * 100);
  // Use backend value if available (more accurate — includes all onboarding fields)
  const completion = profile.completionPct ?? localCompletion;
  const highlights = [
    `${profile.age} Yrs`,
    profile.height,
    profile.maritalStatus,
    profile.religion,
    profile.location,
  ].filter(isFilled);

  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-3">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#b22234] text-white px-4 py-3">
          <p className="text-sm font-bold leading-tight">Profile Summary</p>
          <p className="text-[10px] text-white/80 mt-0.5 truncate">{profile.name}</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              role="img"
              aria-label={profile.name}
              className="w-14 h-14 rounded-md border border-rose-100 bg-center bg-cover bg-rose-50 shrink-0"
              style={{ backgroundImage: `url(${profile.photo || FALLBACK_AVATAR(profile.name)})` }}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{profile.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{profile.profession}</p>
              <p className="text-[11px] text-gray-500 truncate">{profile.city}, {profile.state}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 mb-1">
              <span>Profile filled</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#b22234]" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {highlights.map((item) => (
              <span key={item} className="text-[10px] text-gray-700 bg-rose-50 border border-rose-100 px-2 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ProfileSidebarSection title="At A Glance">
        <ProfileSidebarRow label="Annual Income" value={profile.annualIncome} />
        <ProfileSidebarRow label="Mother Tongue" value={profile.motherTongue} />
        <ProfileSidebarRow label="Diet" value={profile.eatingHabits} />
        <ProfileSidebarRow label="Shudhajathakam" value={profile.manglik} />
      </ProfileSidebarSection>

      <ProfileSidebarSection title="Partner Preference">
        <ProfileSidebarRow label="Age Range" value={`${preferences.ageFrom} - ${preferences.ageTo} Yrs`} />
        <ProfileSidebarRow label="Location" value={[preferences.city, preferences.state, preferences.country].filter(isFilled).join(", ") || "Any"} />
        <ProfileSidebarRow label="Religion / Caste" value={[preferences.religion, preferences.caste].filter(isFilled).join(" / ") || "Any"} />
        <ProfileSidebarRow label="Education" value={preferences.education} />
      </ProfileSidebarSection>

      <ProfileSidebarSection title="Quick Match Checks">
        <div className="space-y-2 py-1">
          {[
            ["Basic details", isFilled(profile.age) && isFilled(profile.height)],
            ["Location", isFilled(profile.city) || isFilled(profile.state) || isFilled(profile.country)],
            ["Religion", isFilled(profile.religion) && isFilled(profile.caste)],
            ["Profession", isFilled(profile.education) || isFilled(profile.profession)],
            ["Photos", profile.photos.length > 0],
          ].map(([label, ok]) => (
            <div key={String(label)} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-600">{label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ok ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                {ok ? "Ready" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      </ProfileSidebarSection>
    </aside>
  );
};

interface ProfileDetailProps {
  id?: string;
}

export default function ProfileDetail({ id }: ProfileDetailProps = {}) {
  const router = useRouter();
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string>("");
  // null = never sent · "PENDING"/"ACCEPTED"/"REJECTED"/"WITHDRAWN" if one exists
  const [interestStatus, setInterestStatus] = useState<InterestStatus | null>(null);
  const [actionMsg, setActionMsg] = useState<string>("");
  const [actionBusy, setActionBusy] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [me, setMe] = useState<FullProfile | null>(null);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Logged-in user — used as the other side of the AI compatibility match.
  useEffect(() => {
    getMyProfileFull()
      .then(setMe)
      .catch(() => undefined);
  }, []);

  const showToast = (msg: string) => {
    setActionMsg(msg);
    window.setTimeout(() => setActionMsg(""), 2500);
  };

  const handleSendInterest = async () => {
    if (!profile || interestStatus !== null || actionBusy) return;
    setActionBusy(true);
    try {
      const response = await sendInterest(profile.id);
      cacheSentInterest(profile.id, {
        profileCode: profile.profileCode,
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        heightCm: profile.heightCm,
        city: profile.city,
        state: profile.state,
        caste: profile.caste,
        religion: profile.religion,
        highestQualification: profile.highestQualification,
        occupation: profile.occupation,
        profilePhotoUrl: profile.profilePhotoUrl,
      }, response);
      setInterestStatus("PENDING");
      showToast(`Interest sent to ${profile.firstName ?? "this profile"}`);
    } catch (ex: unknown) {
      showToast(getAsyncErrorMessage(ex, "Could not send interest. Please try again."));
    } finally {
      setActionBusy(false);
    }
  };

  const handleChatNow = () => {
    if (!profile) return;
    router.push(`/chat/${profile.userId}`);
  };

  const handleBlockProfile = async () => {
    if (!profile) return;
    setBlockConfirmOpen(false);
    setActionBusy(true);
    
    try {
      // Pass full profile data to blockProfile for localStorage fallback
      const profileData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        city: profile.city,
        state: profile.state,
        profilePhotoUrl: profile.profilePhotoUrl,
        occupation: profile.occupation,
      };
      
      await blockProfile(profile.id, profileData);
      showToast(`${profile.firstName ?? "Profile"} has been blocked`);
      
      // Dispatch event to refresh blocked profiles list
      window.dispatchEvent(new CustomEvent('profile-blocked', { detail: { profileId: profile.id } }));
      
      // Optional: Navigate back to profiles page
      setTimeout(() => router.push('/profiles'), 1500);
    } catch (e) {
      showToast(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not block profile. Please try again."
      );
    } finally {
      setActionBusy(false);
    }
  };

  const handleReportSubmit = async (payload: ProfileReportRequest) => {
    setReportSubmitting(true);
    try {
      const report = await submitProfileReport(payload);
      addReportNotification({
        reportId: report.id,
        reportedProfileId: report.reportedProfileId,
        reportedProfileName: report.reportedProfileName,
        createdAt: report.createdAt,
      });
      setReportOpen(false);
      showToast("Report submitted. Made2Match will review it shortly.");
    } catch (reportError) {
      showToast(getAsyncErrorMessage(reportError, "Could not submit report. Please try again."));
    } finally {
      setReportSubmitting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    // Reset per-profile interaction state so visiting a new profile
    // doesn't inherit the "Interest sent" badge from the previous one.
    setProfile(null);
    setInterestStatus(null);
    setActionMsg("");
    setActionBusy(false);

    getProfileById(id)
      .then((data) => { if (!cancelled) setProfile(data); })
      .catch((ex: unknown) => {
        if (cancelled) return;
        setError(getAsyncErrorMessage(ex, "Could not load this profile."));
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Pre-fill the interaction status if this user has any prior interest
    // (pending / accepted / rejected / withdrawn) toward this profile.
    fetchSentInterestStatusByProfileId()
      .then((map) => {
        if (cancelled) return;
        const status = map.get(Number(id));
        if (status) setInterestStatus(status);
      })
      .catch(() => undefined);

    // Fire-and-forget: record that the logged-in user viewed this profile
    recordProfileView(Number(id)).catch(() => undefined);

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
          <div className="bg-white rounded-lg p-4 sm:p-5 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-48 h-48 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-500 text-sm font-semibold mb-1">Couldn&apos;t load profile</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Build a ProfileData-shape view from the fetched FullProfile, falling
  // back to the mock when the field isn't supplied by the backend.
  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—"
    : PROFILE.name;
  const photoList = profile?.photoUrls && profile.photoUrls.length > 0
    ? profile.photoUrls
    : profile?.profilePhotoUrl
      ? [profile.profilePhotoUrl]
      : [FALLBACK_AVATAR(fullName)];
  const heroPhoto = photoList[0];

  const p: typeof PROFILE = profile
    ? {
        ...PROFILE,
        id: String(profile.id),
        name: fullName,
        age: profile.age ?? PROFILE.age,
        height: formatHeight(profile.heightCm),
        weight: formatWeight(profile.weightKg),
        religion: formatReligion(profile),
        caste: profile.caste || "—",
        location: formatLocation(profile),
        education: profile.highestQualification || "—",
        profession: profile.occupation || "—",
        annualIncome: formatIncome(profile.annualIncome),
        photo: heroPhoto,
        photos: photoList,
        about: profile.bio || PROFILE.about,
        bodyType: friendly(profile.bodyType),
        complexion: friendly(profile.complexion),
        physicalStatus: friendly(profile.physicalStatus),
        eatingHabits: friendly(profile.diet),
        drinkingHabits: friendly(profile.drinking),
        smokingHabits: friendly(profile.smoking),
        motherTongue: friendly(profile.motherTongue),
        maritalStatus: friendly(profile.maritalStatus),
        country: profile.country || "—",
        state: profile.state || "—",
        city: profile.city || "—",
        educationDetail: profile.collegeUniversity || profile.highestQualification || "",
        employedIn: friendly(profile.employedIn),
        occupationType: profile.occupation || "",
        occupationDetail: profile.occupation || "",
        dob: formatDate(profile.dateOfBirth),
        lastLogin: formatDate(profile.createdAt),
        // Fields not stored on the profile record → show "Not Specified"
        // instead of leaking mock data.
        subCaste: profile.subcaste || "",
        citizenship: profile.country || "",
        star: "",
        raasi: "",
        gothram: "",
        dosh: "",
        manglik: friendly(profile.shudhajathakam),
        birthPlace: "",
        timeOfBirth: "",
        chatStatus: "",
        callStatus: "",
        sendMail: "",
        completionPct: profile.profileCompletionPct ?? undefined,
      }
    : PROFILE;

  const pref = profile?.partnerPreference;
  const pp: typeof PROFILE.partnerPreferences = pref
    ? {
        ...PROFILE.partnerPreferences,
        ageFrom: pref.minAge ?? PROFILE.partnerPreferences.ageFrom,
        ageTo: pref.maxAge ?? PROFILE.partnerPreferences.ageTo,
        heightFrom: formatHeight(pref.minHeightCm),
        heightTo: formatHeight(pref.maxHeightCm),
        maritalStatus: friendly(pref.preferredMaritalStatus),
        education: pref.preferredEducation || "Any",
        annualIncome: formatIncomeRange(pref.minAnnualIncome, undefined),
        country: pref.preferredCountry || "Any",
        state: pref.preferredState || "Any",
        city: PROFILE.partnerPreferences.city,
        religion: pref.preferredReligion || "Any",
        caste: pref.preferredCaste || (pref.casteNoBar ? "Any (no bar)" : "Any"),
        eatingHabits: friendly(pref.preferredDiet) || "Any",
        drinkingHabits: friendly(pref.drinkingAcceptable) || "Any",
        smokingHabits: friendly(pref.smokingAcceptable) || "Any",
        occupation: pref.preferredOccupation || "Any",
        aboutPartner: pref.partnerDescription || PROFILE.partnerPreferences.aboutPartner,
        // Not part of the preference record → default to "Any".
        motherTongue: "Any",
        physicalStatus: "Any",
        subCaste: "Any",
        citizenship: "Any",
        star: "Any",
        raasi: "Any",
        gothram: "Any",
        dosh: "Any",
      }
    : PROFILE.partnerPreferences;

  // Gender-aware wording (template is bride-worded by default).
  const g = (profile?.gender || "").toUpperCase();
  const isBride = !(g === "MALE" || g === "GROOM" || g === "M");
  const selfNoun = isBride ? "bride" : "groom";
  const partnerNoun = isBride ? "Groom" : "Bride";
  const possessive = isBride ? "Her" : "His";

  // Build the AI match pair from the CURRENT profile + the logged-in viewer.
  // The viewed profile keeps its real data; the viewer fills the opposite slot.
  const viewedPerson = profile ? toMatchPerson(profile) : undefined;
  const viewerPerson = me ? toMatchPerson(me) : undefined;
  const aiBride = viewedPerson
    ? viewedPerson.role === "Bride"
      ? viewedPerson
      : viewerPerson && { ...viewerPerson, role: "Bride" }
    : undefined;
  const aiGroom = viewedPerson
    ? viewedPerson.role === "Groom"
      ? viewedPerson
      : viewerPerson && { ...viewerPerson, role: "Groom" }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* AI compatibility analysis popup — analyses the current profile */}
      <AiMatchModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        bride={aiBride || undefined}
        groom={aiGroom || undefined}
        targetProfileId={id}
      />

      {/* Block Confirmation Modal */}
      {blockConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-pop">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b22234" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Block this profile?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Are you sure you want to block {profile?.firstName ?? "this profile"}? They won&apos;t be able to see your profile or contact you.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setBlockConfirmOpen(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={handleBlockProfile}
                className="flex-1 px-4 py-3 bg-[#b22234] text-white rounded-xl font-semibold hover:bg-[#9a1d2b] transition-colors shadow-lg"
              >
                Yes, Block
              </button>
            </div>
          </div>
        </div>
      )}

      {reportOpen && (
        <ReportViolationModal
          profileId={p.id}
          profileCode={profile?.profileCode}
          profileName={p.name}
          onClose={() => setReportOpen(false)}
          onSubmit={handleReportSubmit}
          submitting={reportSubmitting}
        />
      )}

      {/* Floating "Ask AI" button — right side, stacked above the chat FAB.
          z below the chat layer (1400) so the chat popup covers it when open. */}
      <button
        onClick={() => setAiOpen(true)}
        className="group fixed bottom-[8.75rem] lg:bottom-[5.5rem] right-5 z-[1300] w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-fab-pulse"
        style={{ background: "linear-gradient(135deg,#c0174c,#ea580c)" }}
        aria-label="Ask AI to analyze compatibility"
      >
        <span className="text-2xl leading-none">🤖</span>
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-300 text-[#2D1B35] text-[11px] font-black flex items-center justify-center shadow-md">
          ✦
        </span>
        <span className="pointer-events-none absolute right-16 px-3 py-1.5 rounded-full bg-[#2D1B35] text-white text-xs font-bold whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-lg">
          Ask AI
        </span>
      </button>

      {/* Toast for interest / chat actions */}
      {actionMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#b22234] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          {actionMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-4 lg:gap-6">

        {/* ── Left Sidebar — hidden on mobile & tablet, visible lg+ ── */}
        <ProfileSidebar profile={p} preferences={pp} />

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── Hero Card ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5">

              {/* Photo Slider — full width on mobile, fixed on sm+ */}
              <div className="w-full sm:w-48 shrink-0">
                <PhotoSlider photos={p.photos} name={p.name} />
                <p className="text-[10px] text-gray-400 text-center mt-1">Last Login: {p.lastLogin}</p>
              </div>

              {/* Middle Info + Right Panel stack on mobile */}
              <div className="flex flex-col sm:flex-row flex-1 min-w-0 gap-4">

                {/* Middle Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-300 text-lg">♡</span>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">{p.name}</h1>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Age:</span> {p.age} Yrs | Height: {p.height}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Religion:</span> {p.religion}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Caste:</span> {p.caste}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Location:</span> {p.location}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Education:</span> {p.education}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Profession:</span> {p.profession}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Annual Income:</span> {p.annualIncome}</p>
                  </div>
                  <button
                    onClick={handleChatNow}
                    disabled={!profile}
                    className="mt-4 flex items-center gap-2 bg-[#b22234] hover:bg-[#9a1d2b] text-white text-xs font-bold px-5 py-2 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    💬 CHAT NOW
                  </button>
                </div>

                {/* Right Panel */}
                <div className="sm:w-52 shrink-0">
                  <p className="text-[10px] text-gray-600 leading-relaxed mb-3 line-clamp-5">
                    {p.about}
                  </p>
                  {/* Social Icons */}
                  <div className="flex gap-2 mb-3">
                    {/* Facebook */}
                    <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: "#1877F2" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: "#0A66C2" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    {/* WhatsApp */}
                    <a href="#" aria-label="WhatsApp" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: "#25D366" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>
                  {(() => {
                    const STATUS_UI: Record<
                      InterestStatus,
                      { label: string; styles: string }
                    > = {
                      PENDING: {
                        label: "✓ INTEREST SENT",
                        styles: "border-green-600 bg-green-50 text-green-700",
                      },
                      ACCEPTED: {
                        label: "💚 INTEREST ACCEPTED",
                        styles: "border-emerald-600 bg-emerald-600 text-white",
                      },
                      REJECTED: {
                        label: "✗ INTEREST DECLINED",
                        styles: "border-gray-400 bg-gray-100 text-gray-500",
                      },
                      WITHDRAWN: {
                        label: "✗ INTEREST WITHDRAWN",
                        styles: "border-gray-400 bg-gray-100 text-gray-500",
                      },
                    };
                    const ui = interestStatus ? STATUS_UI[interestStatus] : null;
                    const baseStyles = ui
                      ? ui.styles
                      : "border-[#b22234] text-[#b22234] hover:bg-[#b22234] hover:text-white";
                    return (
                      <button
                        onClick={handleSendInterest}
                        disabled={!profile || interestStatus !== null || actionBusy}
                        className={`w-full flex items-center justify-center gap-2 border-2 text-xs font-bold px-4 py-2 rounded transition-colors cursor-pointer disabled:cursor-not-allowed ${baseStyles} ${actionBusy ? "opacity-60" : ""}`}
                      >
                        {ui
                          ? ui.label
                          : actionBusy
                            ? "SENDING..."
                            : "💌 SEND INTEREST"}
                      </button>
                    );
                  })()}
                  
                  {/* Block and Report buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setBlockConfirmOpen(true)}
                      className="flex-1 flex items-center justify-center gap-1 border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 text-[11px] font-semibold px-3 py-2 rounded transition-colors cursor-pointer"
                      title="Block this profile"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                      </svg>
                      Block
                    </button>
                    <button
                      onClick={() => setReportOpen(true)}
                      className="flex-1 flex items-center justify-center gap-1 border border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 text-[11px] font-semibold px-3 py-2 rounded transition-colors cursor-pointer"
                      title="Report this profile"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5">
            <SectionHeader icon="👤" title="Personal Information" />

            {/* About */}
            <div className="mb-5 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <span>📍</span>
                <span className="text-xs font-bold text-gray-700">About the {selfNoun}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{p.about}</p>
            </div>

            {/* Basic Details */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📋</span>
                <span className="text-sm font-bold text-gray-700">Basic Details</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Name", value: p.name },
                  { label: "Age", value: `${p.age} Yrs` },
                  { label: "Height", value: p.height },
                  { label: "Weight", value: p.weight },
                  { label: "Email", value: profile?.email || "" },
                  { label: "Phone Number", value: profile?.phoneNumber || "" },
                  { label: "Mother Tongue", value: p.motherTongue },
                  { label: "Marital Status", value: p.maritalStatus },
                ]}
                right={[
                  { label: "Body Type", value: p.bodyType },
                  { label: "Complexion", value: p.complexion },
                  { label: "Physical Status", value: p.physicalStatus },
                  { label: "Eating Habits", value: p.eatingHabits },
                  { label: "Drinking Habits", value: p.drinkingHabits },
                  { label: "Smoking Habits", value: p.smokingHabits },
                ]}
              />
            </div>

            {/* Contact + Religion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">📞</span>
                  <span className="text-sm font-bold text-gray-700">Contact Details</span>
                </div>
                {[
                  { label: "Chat Status", value: p.chatStatus },
                  { label: "Call Status", value: p.callStatus },
                  { label: "Send Mail", value: p.sendMail },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🕌</span>
                  <span className="text-sm font-bold text-gray-700">Religion Information</span>
                </div>
                {[
                  { label: "Religion", value: friendly(profile?.religion) },
                  { label: "Caste", value: p.caste },
                  { label: "Sub Caste", value: p.subCaste },
                  { label: "Mother Tongue", value: p.motherTongue },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
            </div>

            {/* Location */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📍</span>
                <span className="text-sm font-bold text-gray-700">{selfNoun === "bride" ? "Bride" : "Groom"}&apos;s Location</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <div>
                  {[
                    { label: "Country", value: p.country },
                    { label: "State", value: p.state },
                    { label: "Citizenship", value: p.citizenship },
                    { label: "City", value: p.city },
                  ].map((r) => <DetailRow key={r.label} {...r} />)}
                </div>
              </div>
            </div>

            {/* Professional + Astro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">💼</span>
                  <span className="text-sm font-bold text-gray-700">Professional Information</span>
                </div>
                {[
                  { label: "Education", value: p.education },
                  { label: "College / University", value: p.educationDetail },
                  { label: "Employed In", value: p.employedIn },
                  { label: "Occupation", value: p.occupationType },
                  { label: "Annual Income", value: p.annualIncome },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🔮</span>
                  <span className="text-sm font-bold text-gray-700">Astro Details</span>
                </div>
                {[
                  { label: "Date of Birth", value: p.dob },
                  { label: "Shudhajathakam", value: p.manglik },
                  { label: "Star / Nakshatra", value: p.star },
                  { label: "Raasi", value: p.raasi },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
            </div>

            {/* Family Details (from DB) */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">👪</span>
                <span className="text-sm font-bold text-gray-700">Family Details</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Family Type", value: friendly(profile?.familyType) },
                  { label: "Family Status", value: friendly(profile?.familyStatus) },
                  { label: "Father's Occupation", value: friendly(profile?.fatherOccupation) },
                ]}
                right={[
                  { label: "Mother's Occupation", value: friendly(profile?.motherOccupation) },
                  { label: "No. of Brothers", value: profile?.noOfBrothers != null ? String(profile.noOfBrothers) : "" },
                  { label: "No. of Sisters", value: profile?.noOfSisters != null ? String(profile.noOfSisters) : "" },
                ]}
              />
            </div>
          </div>

          {/* ── Partner Preferences ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5">
            <SectionHeader icon="💞" title={`${possessive} Partner Preferences`} />

            {/* About Partner */}
            <div className="mb-5 p-3 bg-pink-50 rounded-lg border border-pink-100">
              <div className="flex items-center gap-2 mb-2">
                <span>💬</span>
                <span className="text-xs font-bold text-gray-700">About partner</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{pp.aboutPartner}</p>
            </div>

            {/* Basic Preferences */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📋</span>
                <span className="text-sm font-bold text-gray-700">Basic Preferences</span>
              </div>
              <TwoColDetails
                left={[
                  { label: `${partnerNoun}'s Age`, value: `${pp.ageFrom} – ${pp.ageTo} Yrs` },
                  { label: "Height", value: `${pp.heightFrom} – ${pp.heightTo}` },
                  { label: "Marital Status", value: pp.maritalStatus },
                ]}
                right={[
                  { label: "Physical Status", value: pp.physicalStatus },
                  { label: "Eating Habits", value: pp.eatingHabits },
                  { label: "Drinking Habits", value: pp.drinkingHabits },
                ]}
              />
            </div>

            {/* Professional Preferences */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">💼</span>
                <span className="text-sm font-bold text-gray-700">Professional</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Education", value: pp.education },
                  { label: "Occupation", value: pp.occupation },
                ]}
                right={[
                  { label: "Annual Income", value: pp.annualIncome },
                  { label: "Eating Habits", value: pp.eatingHabits },
                ]}
              />
            </div>

            {/* Religious Preferences */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🕌</span>
                <span className="text-sm font-bold text-gray-700">Religious Preferences</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Religion", value: pp.religion },
                  { label: "Caste / Sub Caste", value: pp.caste },
                  { label: "Star / Raasi", value: pp.star },
                  { label: "Gothram", value: pp.gothram },
                ]}
                right={[
                  { label: "Dosh", value: pp.dosh },
                  { label: "Caste", value: pp.subCaste },
                  { label: "Raasi", value: pp.raasi },
                  { label: "Gothram", value: pp.gothram },
                ]}
              />
            </div>

            {/* Location Preferences */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📍</span>
                <span className="text-sm font-bold text-gray-700">Location Preferences</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <div>
                  {[
                    { label: "Country", value: pp.country },
                    { label: "State", value: pp.state },
                    { label: "Citizenship", value: pp.citizenship },
                    { label: "City", value: pp.city },
                  ].map((r) => <DetailRow key={r.label} {...r} />)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
