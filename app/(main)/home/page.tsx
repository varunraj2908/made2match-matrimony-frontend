"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  formatActivityDate,
  getActivityCounts,
  getAllMatches,
  getDailyRecommendations,
  getHoroscopeRequests,
  getMatchCount,
  getMyProfile,
  getNewMatches,
  getShortlistedByMe,
  getViewedByMe,
  getWhoShortlistedMe,
  getWhoViewedMe,
  type ActivityCounts,
  type MatchProfile,
  type MyProfile,
  type ProfileActivity,
} from "@/services/homeService";
import { uploadProfilePhoto } from "@/services/profileService";
import ProfileBookModal from "@/components/sections/ProfileBookModal";

// ─── UI display type (kept narrow — what cards actually render) ───
interface CardProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  location: string;
  photo: string;
  isPrime?: boolean;
  viewedOn?: string;
  shortlistedOn?: string;
}

const FALLBACK_PHOTO = (name?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=ea580c&color=fff&size=120`;

const toCardFromMatch = (m: MatchProfile): CardProfile => ({
  id: String(m.profileId),
  name: m.fullName || [m.firstName, m.lastName].filter(Boolean).join(" ") || "—",
  age: m.age ?? 0,
  height: m.heightDisplay || "—",
  location: [m.city, m.state].filter(Boolean).join(", ") || "—",
  photo: m.profilePhotoUrl || FALLBACK_PHOTO(m.fullName),
  isPrime: m.isPremium,
});

const toCardFromActivity = (a: ProfileActivity): CardProfile => ({
  id: String(a.profileId),
  name: a.fullName || "—",
  age: a.age ?? 0,
  height: a.heightDisplay || "—",
  location: [a.city, a.state].filter(Boolean).join(", ") || "—",
  photo: a.profilePhotoUrl || FALLBACK_PHOTO(a.fullName),
  isPrime: a.isPremium,
  viewedOn: formatActivityDate(a.activityDate),
  shortlistedOn: formatActivityDate(a.activityDate),
});

// ─── Icons ────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CrownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const MoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const CameraIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const ChatIconSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ─── Profile Card ─────────────────────────────────────────────────
const ProfileCard = ({ profile, subText }: { profile: CardProfile; subText?: string }) => (
  <div className="shrink-0 w-24 sm:w-28 lg:w-32 cursor-pointer group">
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden mb-1.5 border border-gray-200 group-hover:border-[#ea580c] transition-colors">
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_PHOTO(profile.name);
        }}
      />
      {profile.isPrime && (
        <div className="absolute top-1.5 left-1.5 bg-amber-400 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          <CrownIcon />
        </div>
      )}
    </div>
    <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate leading-tight">{profile.name}</p>
    <p className="text-[9px] sm:text-[10px] text-gray-500">{profile.age} Yrs, {profile.height}</p>
    {subText && <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">{subText}</p>}
  </div>
);

// ─── Empty / loading helpers ─────────────────────────────────────
const SectionScrollerSkeleton = () => (
  <div className="flex gap-2 sm:gap-3 overflow-hidden p-3 sm:p-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="shrink-0 w-24 sm:w-28 lg:w-32">
        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-lg bg-gray-100 animate-pulse mb-1.5" />
        <div className="h-3 bg-gray-100 animate-pulse rounded mb-1" />
        <div className="h-2 bg-gray-100 animate-pulse rounded w-16" />
      </div>
    ))}
  </div>
);

const EmptyRow = ({ message }: { message: string }) => (
  <div className="p-6 text-center text-xs text-gray-400">{message}</div>
);

// ─── Section Row ──────────────────────────────────────────────────
const SectionRow = ({
  title,
  subtitle,
  count,
  profiles,
  subTextKey,
  loading,
}: {
  title: string;
  subtitle: string;
  count?: number;
  profiles: CardProfile[];
  subTextKey?: "viewedOn" | "shortlistedOn";
  loading?: boolean;
}) => (
  <div>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#b22234] p-3 sm:p-4">
      <div>
        <h2 className="text-sm sm:text-base font-bold text-white">
          {title}{" "}
          {count !== undefined && (
            <span className="text-white font-normal">({count.toLocaleString()})</span>
          )}
        </h2>
        <p className="text-[10px] sm:text-xs text-white/80 mt-0.5">{subtitle}</p>
      </div>
      <button className="self-start sm:self-auto flex items-center gap-1 text-xs text-white font-semibold border border-white px-3 py-1.5 rounded-full hover:bg-white hover:text-[#b22234] transition-colors shrink-0">
        View all <ChevronRight />
      </button>
    </div>
    {loading ? (
      <SectionScrollerSkeleton />
    ) : profiles.length === 0 ? (
      <EmptyRow message="Nothing here yet." />
    ) : (
      <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide p-3 sm:p-4">
        {profiles.map((p) => (
          <ProfileCard
            key={p.id}
            profile={p}
            subText={
              subTextKey
                ? subTextKey === "viewedOn"
                  ? `Viewed: ${p.viewedOn}`
                  : `Shortlisted: ${p.shortlistedOn}`
                : undefined
            }
          />
        ))}
        <div className="shrink-0 w-8 flex items-center justify-center">
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors bg-white shadow-sm">
            <ChevronRight />
          </button>
        </div>
      </div>
    )}
  </div>
);

const Timer = () => (
  <div className="hidden sm:flex items-center gap-1 bg-gray-800 text-white text-[10px] px-2.5 py-1.5 rounded-full font-mono">
    <ClockIcon />
    <span>13:03:56s</span>
  </div>
);

// ─── Hero Carousel (large screens only) ──────────────────────────
interface CarouselSlide {
  image: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  cta: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    image: "/Newlywed South Asian couple in traditional attire.png",
    eyebrow: "Made for Matrimony",
    heading: "Find your perfect life partner",
    subtitle:
      "Curated matches based on your preferences, traditions, and values.",
    cta: "Explore matches",
  },
  {
    image: "/Traditional Kerala wedding portrait.png",
    eyebrow: "Verified profiles",
    heading: "Trusted by lakhs of families",
    subtitle:
      "Every profile is verified — connect with confidence and start meaningful conversations.",
    cta: "Browse profiles",
  },
  {
    image: "/romantic-couple.png",
    eyebrow: "Featured in Limca Book of Records",
    heading: "Lakhs of happy marriages, and counting",
    subtitle:
      "Join the matrimony service that has helped millions find love and lasting commitment.",
    cta: "Read success stories",
  },
];

const HeroCarousel = ({ onCta }: { onCta?: () => void }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = CAROUSEL_SLIDES.length;

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(
      () => setIdx((i) => (i + 1) % total),
      5000,
    );
    return () => window.clearInterval(t);
  }, [paused, total]);

  const goPrev = () => setIdx((i) => (i - 1 + total) % total);
  const goNext = () => setIdx((i) => (i + 1) % total);

  const slide = CAROUSEL_SLIDES[idx];

  return (
    <div
      className="hidden lg:block relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-72"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — stack and crossfade */}
      {CAROUSEL_SLIDES.map((s, i) => (
        <div
          key={s.image}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.heading}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.0) 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-10 max-w-2xl">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 mb-2">
          {slide.eyebrow}
        </span>
        <h2 className="text-3xl font-black text-white leading-tight mb-2">
          {slide.heading}
        </h2>
        <p className="text-sm text-white/90 mb-5 max-w-md">
          {slide.subtitle}
        </p>
        <div>
          <button
            onClick={onCta}
            className="bg-white text-[#b22234] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-orange-50 transition-colors"
          >
            {slide.cta} →
          </button>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/55 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/55 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === idx ? 24 : 8,
              background: i === idx ? "white" : "rgba(255,255,255,0.55)",
            }}
          />
        ))}
      </div>

    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [me, setMe] = useState<MyProfile | null>(null);
  const [counts, setCounts] = useState<ActivityCounts>({});

  const [daily, setDaily] = useState<CardProfile[]>([]);
  const [allMatches, setAllMatches] = useState<CardProfile[]>([]);
  const [allMatchesCount, setAllMatchesCount] = useState<number>(0);
  const [newMatches, setNewMatches] = useState<CardProfile[]>([]);
  const [whoViewed, setWhoViewed] = useState<CardProfile[]>([]);
  const [whoShortlisted, setWhoShortlisted] = useState<CardProfile[]>([]);
  const [shortlistedByMe, setShortlistedByMe] = useState<CardProfile[]>([]);
  const [viewedByMe, setViewedByMe] = useState<CardProfile[]>([]);
  const [horoscopeRequests, setHoroscopeRequests] = useState<ProfileActivity[]>([]);

  const [loading, setLoading] = useState({
    daily: true,
    allMatches: true,
    newMatches: true,
    whoViewed: true,
    whoShortlisted: true,
    shortlistedByMe: true,
    viewedByMe: true,
  });

  const [profilePhoto, setProfilePhoto] = useState<string>(
    "https://i.pravatar.cc/300?img=33",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [profileWarning, setProfileWarning] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  const handlePhotoClick = () => photoInputRef.current?.click();

  // ── Initial data load ──
  useEffect(() => {
    let cancelled = false;

    const load = <T,>(
      promise: Promise<T>,
      onData: (data: T) => void,
      onDone?: () => void,
    ) => {
      promise
        .then((data) => {
          if (!cancelled) onData(data);
        })
        .catch((err) => {
          console.error("Home load failed:", err);
          const msg = err?.response?.data?.message as string | undefined;
          if (
            !cancelled &&
            msg &&
            /complete your profile/i.test(msg)
          ) {
            setProfileWarning(msg);
          }
        })
        .finally(() => {
          if (!cancelled && onDone) onDone();
        });
    };

    load(getMyProfile(), (data) => {
      setMe(data);
      if (data.profilePhotoUrl) setProfilePhoto(data.profilePhotoUrl);
    });

    load(getActivityCounts(), setCounts);
    load(getMatchCount(), setAllMatchesCount);

    load(
      getDailyRecommendations(0, 10),
      (page) => setDaily(page.content.map(toCardFromMatch)),
      () => setLoading((l) => ({ ...l, daily: false })),
    );

    load(
      getAllMatches(0, 14),
      (page) => {
        setAllMatches(page.content.map(toCardFromMatch));
        if (page.totalElements != null) setAllMatchesCount(page.totalElements);
      },
      () => setLoading((l) => ({ ...l, allMatches: false })),
    );

    load(
      getNewMatches(0, 10),
      (page) => setNewMatches(page.content.map(toCardFromMatch)),
      () => setLoading((l) => ({ ...l, newMatches: false })),
    );

    load(
      getWhoViewedMe(0, 10),
      (page) => setWhoViewed(page.content.map(toCardFromActivity)),
      () => setLoading((l) => ({ ...l, whoViewed: false })),
    );

    load(
      getWhoShortlistedMe(0, 10),
      (page) => setWhoShortlisted(page.content.map(toCardFromActivity)),
      () => setLoading((l) => ({ ...l, whoShortlisted: false })),
    );

    load(
      getShortlistedByMe(0, 10),
      (page) => setShortlistedByMe(page.content.map(toCardFromActivity)),
      () => setLoading((l) => ({ ...l, shortlistedByMe: false })),
    );

    load(
      getViewedByMe(0, 10),
      (page) => setViewedByMe(page.content.map(toCardFromActivity)),
      () => setLoading((l) => ({ ...l, viewedByMe: false })),
    );

    load(getHoroscopeRequests(0, 10), (page) =>
      setHoroscopeRequests(page.content),
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Photo upload (hits real API) ──
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }

    setUploadError("");

    // Optimistic preview
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      const photoUrl = (res?.data as { photoUrl?: string } | undefined)?.photoUrl;
      if (photoUrl) setProfilePhoto(photoUrl);
      // Tell the rest of the UI (Navbar, etc.) to re-fetch /profiles/me
      window.dispatchEvent(new CustomEvent("profile:updated"));
    } catch (ex: any) {
      setUploadError(
        ex?.response?.data?.message ||
          ex?.message ||
          "Photo upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const displayName =
    [me?.firstName, me?.lastName].filter(Boolean).join(" ") || me?.firstName || "—";
  const completionPct =
    me?.profileCompletionPct ?? me?.completionPercentage ?? 0;
  const isPremium = !!me?.isPremium;
  const userIdLabel = me ? `E${String(me.userId).padStart(7, "0")}` : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile flip-book popup overlay */}
      <ProfileBookModal />

      {/* ── Mobile Profile Banner ── */}
      <div className="lg:hidden bg-white border border-gray-200 px-4 py-3 mx-3 mt-3 lg:mt-0 rounded-xl lg:rounded-none">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={profilePhoto}
              alt={displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_PHOTO(displayName);
              }}
            />
            <button
              onClick={handlePhotoClick}
              disabled={isUploading}
              className="absolute inset-0 rounded-full flex items-end justify-center pb-0.5 bg-black/0 hover:bg-black/30 transition-all"
            >
              <span className="opacity-0 hover:opacity-100 bg-black/60 rounded-full p-0.5">
                {isUploading ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <CameraIcon />
                )}
              </span>
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-sm">{displayName}</h3>
            <p className="text-[10px] text-gray-400 font-mono">
              {userIdLabel} • {isPremium ? "Prime member" : "Free member"}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[#b22234] font-medium mt-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b22234" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              Made2Match Matrimony
            </div>
          </div>

          {!isPremium && (
            <button
              onClick={() => router.push("/specialoffer")}
              className="shrink-0 bg-[#b22234] text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500">Profile completeness</span>
            <span className="text-[10px] font-bold text-[#ea580c]">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-[#ea580c] h-1.5 rounded-full" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
        {uploadError && (
          <p className="text-[10px] text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex gap-4 lg:gap-6">
        {/* ── Left Sidebar (desktop) ── */}
        <aside className="w-52 shrink-0 space-y-4 hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <img
                src={profilePhoto}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_PHOTO(displayName);
                }}
              />
              <div
                onClick={handlePhotoClick}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full cursor-pointer border-2 border-white flex items-center justify-center"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <button
                onClick={handlePhotoClick}
                disabled={isUploading}
                className="absolute inset-0 rounded-full flex items-end justify-center pb-1 bg-black/0 hover:bg-black/35 transition-all group/cam focus:outline-none"
              >
                <span className="opacity-0 group-hover/cam:opacity-100 transition-opacity bg-black/60 rounded-full p-1">
                  {isUploading ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <CameraIcon />
                  )}
                </span>
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">{displayName}</h3>
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#b22234] font-medium mb-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b22234" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              Made2Match Matrimony
            </div>
            <p className="text-[11px] text-gray-500 font-mono mb-1">{userIdLabel}</p>
            <span className="inline-block text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {isPremium ? "Prime member" : "Free member"}
            </span>
            {!isPremium && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-gray-600 mb-1.5 leading-snug">
                  Upgrade membership to call or message with matches
                </p>
                <button
                  onClick={() => router.push("/specialoffer")}
                  className="bg-[#b22234] text-white text-[10px] font-bold px-4 py-1.5 rounded-full w-full hover:bg-red-700 transition-colors"
                >
                  Upgrade now
                </button>
              </div>
            )}
            {uploadError && (
              <p className="text-[10px] text-red-500 mt-2">{uploadError}</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {[
              { icon: <EditIcon />, label: "Edit profile", href: "/edit-profile" },
              { icon: <SettingsIcon />, label: "Edit preferences", href: "/partnerpreferences" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ea580c] transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
              >
                <span className="text-gray-400">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <p className="text-[11px] text-gray-400 font-semibold px-4 pt-3 pb-1 uppercase tracking-wider">
              Support & feedback
            </p>
            {[
              { icon: <SettingsIcon />, label: "Settings", href: "/settings" },
              { icon: <HelpIcon />, label: "Help", href: "/help" },
              { icon: <HeartIcon />, label: "Success stories", href: "/help" },
              { icon: <MoreIcon />, label: "More", href: "/search" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ea580c] transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
              >
                <span className="text-gray-400">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">
              Matrimony.com - Other Services
            </p>
            {["AstroFreeChat.com", "WeddingBazaar.com", "Mandap.com"].map((s) => (
              <a key={s} href="#" className="flex items-center gap-2 text-xs text-[#ea580c] hover:underline py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                {s}
              </a>
            ))}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-3 sm:space-y-5">
          {/* Hero carousel — large screens only */}
          <HeroCarousel onCta={() => router.push("/search")} />

          {profileWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0 font-bold">
                !
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-900">
                  {profileWarning}
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Matches and recommendations appear once your gender, date of birth, and basic details are saved.
                </p>
              </div>
              <button
                onClick={() => router.push("/onboarding/basic-details")}
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full"
              >
                Complete profile
              </button>
            </div>
          )}

          {/* Profile completion (desktop) */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-800">Complete Your Profile</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-gray-500">Profile completeness score</span>
              <span className="text-xs font-bold text-[#ea580c]">{completionPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-[#ea580c] h-2 rounded-full" style={{ width: `${completionPct}%` }} />
            </div>
            <button className="flex items-center gap-2 border border-[#ea580c] text-[#ea580c] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add Horoscope
            </button>
          </div>

          {/* Daily Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#b22234] p-3 sm:p-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">Daily Recommendations</h2>
                <p className="text-[10px] sm:text-xs text-white/80 mt-0.5">Recommended matches for today</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <button onClick={scrollLeft} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] bg-white shadow-sm">
                  <ChevronLeft />
                </button>
                <button onClick={scrollRight} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] bg-white shadow-sm">
                  <ChevronRight />
                </button>
                <Timer />
                <button className="flex items-center gap-1 text-xs text-white font-semibold border border-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-white hover:text-[#b22234] transition-colors">
                  View all <ChevronRight />
                </button>
              </div>
            </div>
            {loading.daily ? (
              <SectionScrollerSkeleton />
            ) : daily.length === 0 ? (
              <EmptyRow message="No recommendations yet — complete your profile to get matches." />
            ) : (
              <div className="p-3 sm:p-4">
                <div ref={scrollRef} className="flex gap-2 sm:gap-3 overflow-hidden scroll-smooth">
                  {daily.map((p) => <ProfileCard key={p.id} profile={p} />)}
                </div>
              </div>
            )}
          </div>

          {/* All Matches */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionRow
              title="All Matches"
              subtitle="Members who match your partner preferences"
              count={allMatchesCount}
              profiles={allMatches}
              loading={loading.allMatches}
            />
          </div>

          {/* New Matches */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionRow
              title="New Matches"
              subtitle="Members who match your preferences and joined in last 30 days"
              count={counts.newMatchesCount}
              profiles={newMatches}
              loading={loading.newMatches}
            />
          </div>

          {/* Assisted Service Banner (static promo) */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-[#ea580c] rounded-full flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-xs text-[#ea580c] font-semibold">Assisted service</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Personalised matchmaking service</p>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">
                Find your match <span className="text-[#ea580c]">10x faster</span>
              </h3>
              <p className="text-xs text-gray-600 mb-2 sm:mb-3">
                Personalized matchmaking service through expert Relationship Manager
              </p>
              <div className="space-y-1 mb-3 sm:mb-4">
                {["Guaranteed matches", "Better response", "Save time & effort"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle />{f}
                  </div>
                ))}
              </div>
              <button className="bg-[#ea580c] text-white text-xs font-bold px-4 sm:px-5 py-2 rounded-full hover:bg-orange-600 transition-colors">
                Know more
              </button>
            </div>
            <div className="w-20 sm:w-28 shrink-0">
              <img
                src="https://picsum.photos/seed/assisted/112/140"
                alt="Assisted Service"
                className="w-full h-28 sm:h-36 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_PHOTO("A");
                }}
              />
            </div>
          </div>

          {/* Who Viewed You */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionRow
              title="Who Viewed You"
              subtitle="Members who have viewed your profile"
              count={counts.whoViewedMeCount}
              profiles={whoViewed}
              subTextKey="viewedOn"
              loading={loading.whoViewed}
            />
          </div>

          {/* Who Shortlisted You */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionRow
              title="Who Shortlisted You"
              subtitle="Members who have shortlisted your profile"
              count={counts.whoShortlistedMeCount}
              profiles={whoShortlisted}
              subTextKey="shortlistedOn"
              loading={loading.whoShortlisted}
            />
          </div>

          {/* Photo/Horoscope Requests */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1">Photo/Horoscope Requests</h2>
            <div className="flex gap-4 border-b border-gray-200 mb-3 sm:mb-4">
              <button className="text-xs font-semibold text-[#ea580c] border-b-2 border-[#ea580c] pb-2 px-1">
                Requests received ({counts.horoscopeRequestsCount ?? horoscopeRequests.length})
              </button>
            </div>
            {(counts.horoscopeRequestsCount ?? horoscopeRequests.length) === 0 ? (
              <p className="text-xs text-gray-400 py-3">No pending requests.</p>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {horoscopeRequests.slice(0, 3).map((r) => (
                      <img
                        key={r.profileId}
                        src={r.profilePhotoUrl || FALLBACK_PHOTO(r.fullName)}
                        alt={r.fullName || ""}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_PHOTO(r.fullName);
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Horoscope requests received</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] text-gray-500 mb-2">
                    {counts.horoscopeRequestsCount ?? horoscopeRequests.length} members have requested you to add Horoscope
                  </p>
                  <button className="bg-[#ea580c] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
                    Add Horoscope
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profiles You Shortlisted */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionRow
              title="Profiles You Shortlisted"
              subtitle="Members that you have shortlisted"
              count={counts.shortlistedByMeCount}
              profiles={shortlistedByMe}
              subTextKey="shortlistedOn"
              loading={loading.shortlistedByMe}
            />
          </div>

          {/* Profiles You Viewed */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <SectionRow
              title="Profiles You Viewed"
              subtitle="Members that you have viewed"
              count={counts.viewedByMeCount}
              profiles={viewedByMe}
              subTextKey="viewedOn"
              loading={loading.viewedByMe}
            />
          </div>

          {/* Don't Show summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-700">
                  Profiles Marked As "Don't show" ({counts.dontShowCount ?? 0})
                </p>
              </div>
              <button className="self-start sm:self-auto flex items-center gap-1 text-xs text-[#ea580c] font-semibold border border-[#ea580c] px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors">
                View all <ChevronRight />
              </button>
            </div>
          </div>

          {/* Other Services (static) */}
          <div className="pb-2">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-3">Matrimony.com - Other Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  name: "AstroFreeChat",
                  sub: "From Matrimony.com Group",
                  desc: "Looking for astrology guidance in love, relationships, career, or health?",
                  features: ["Instant Astrology Insights", "Chat Anytime, Anywhere", "First 5 Minutes FREE"],
                  cta: "Download AstroFreeChat",
                  color: "bg-orange-50 border-orange-200",
                },
                {
                  name: "weddingbazaar",
                  sub: "from Matrimony.com group",
                  desc: "India's Largest Wedding Planning Platform",
                  features: [
                    "Photographers, Makeup artists, Caterers and more",
                    "Trusted wedding marketplace from matrimony.com group",
                    "2.8 Lakh+ trusted vendors across 40+ cities",
                  ],
                  cta: "Know more",
                  color: "bg-purple-50 border-purple-200",
                },
                {
                  name: "mandap",
                  sub: "from Matrimony.com group",
                  desc: "India's Largest Mandap Platform",
                  features: ["Free listings", "100% verified", "40,000+ mandaps", "Services across India"],
                  cta: "Know more",
                  color: "bg-blue-50 border-blue-200",
                },
              ].map((svc) => (
                <div key={svc.name} className={`border rounded-xl p-4 ${svc.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                      <span className="text-[10px] font-bold text-[#ea580c]">{svc.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{svc.name}</p>
                      <p className="text-[9px] text-gray-500">{svc.sub}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 leading-tight">{svc.desc}</p>
                  <div className="space-y-1 mb-3">
                    {svc.features.map((f) => (
                      <div key={f} className="flex items-start gap-1.5 text-[10px] text-gray-600">
                        <CheckCircle /><span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#ea580c] text-white text-[10px] font-bold py-2 rounded-full hover:bg-orange-600 transition-colors">
                    {svc.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Help Bar */}
      <div className="bg-white border-t border-gray-200 py-3 sm:py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Need help in using KeralaMatrimony?</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Reach out to us on this number or chat with us</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 text-xs font-semibold px-3 sm:px-4 py-2 rounded-full hover:border-[#ea580c] hover:text-[#ea580c] transition-colors">
              <PhoneIcon /> Call now
            </button>
            <button className="flex items-center gap-2 bg-[#ea580c] text-white text-xs font-semibold px-3 sm:px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
              <ChatIconSvg /> Chat with us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
