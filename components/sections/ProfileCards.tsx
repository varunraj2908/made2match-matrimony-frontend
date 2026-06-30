
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CoastHeaderBar from "../layout/CoastHeaderBar";
import FilterBar, { type FilterState } from "./FilterTab";
import {
  fetchForMenu,
  recordProfileView,
  shortlistProfile,
  sendInterest,
  type CardProfile,
  type MatchFilters,
  type SidebarLabel,
} from "@/services/matchesService";

const PAGE_SIZE = 10;

// Maps the UI-level FilterBar state to backend query params.
const PROFILE_CREATED_BY_MAP: Record<string, string> = {
  self: "SELF",
  parents: "PARENT",
  sibling: "SIBLING",
  friends: "FRIEND",
};

const buildMatchFilters = (state: FilterState): MatchFilters => {
  const sortFromToggle = state.toggles.newly_joined ? "newly_joined" : undefined;
  const pcb = state.dropdowns.profile_created_by ?? undefined;
  return {
    sortBy: state.dropdowns.sort ?? sortFromToggle,
    city: state.dropdowns.location ?? undefined,
    withPhotos: state.toggles.profiles_with_photo || undefined,
    withHoroscope: state.toggles.profiles_with_horoscope || undefined,
    notSeen: state.toggles.not_seen || undefined,
    profileCreatedBy: pcb ? (PROFILE_CREATED_BY_MAP[pcb] ?? pcb.toUpperCase()) : undefined,
  };
};

const EMPTY_FILTERS: FilterState = { toggles: {}, dropdowns: {} };


// ─── Sidebar data ─────────────────────────────────────────────────────────────
const SIDEBAR_SECTIONS = [
  {
    heading: null,
    items: [
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
        label: "Your Matches",
        desc: "View all the profiles that match your preferences",
        highlight: true,
      },
    ],
  },
  {
    heading: "Based on activity",
    items: [
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
        label: "Shortlisted by you",
        desc: "Matches you have shortlisted",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
        label: "Viewed you",
        desc: "Matches who have viewed your profile",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        ),
        label: "Shortlisted you",
        desc: "Matches who have shortlisted your profile",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
        label: "Viewed by you",
        desc: "Matches you have viewed",
      },
    ],
  },
  {
    heading: "Recently joined & nearby",
    items: [
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        ),
        label: "Newly Joined",
        desc: "Matches who joined within the last 30 days",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
        label: "Nearby matches",
        desc: "Matches near your location",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
        label: "With photos",
        desc: "Matches that have added photos",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
        label: "With horoscope",
        desc: "Matches that have added horoscope",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ),
        label: "Similar hobbies",
        desc: "Matches who have similar hobbies",
      },
    ],
  },
  {
    heading: "Astrological compatibility",
    items: [
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
        label: "Star matches",
        desc: "Matches with compatible star sign",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        ),
        label: "Horoscope matches",
        desc: "Matches with horoscope matching yours",
      },
    ],
  },
  {
    heading: "Looking for you",
    items: [
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ),
        label: "Mutual matches",
        desc: "Matches whose preferences match yours and vice versa",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
        label: "Looking for you",
        desc: "Matches whose preferences match your profile",
      },
    ],
  },
  {
    heading: "Based on preferences",
    items: [
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        ),
        label: "Education preference",
        desc: "Matches based on your preferred education",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        ),
        label: "Professional preference",
        desc: "Matches based on your preferred profession",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
        label: "Location preference",
        desc: "Matches based on your preferred city/location",
      },
      {
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        ),
        label: "NRI matches",
        desc: "Matches from outside India",
      },
    ],
  },
];

// Flat list for dropdown
const ALL_MENU_ITEMS = SIDEBAR_SECTIONS.flatMap((s) => s.items);

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-gray-400"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const GridViewIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const ListViewIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ─── Desktop Left Sidebar ─────────────────────────────────────────────────────
const LeftSidebar = ({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: (s: string) => void;
}) => (
  <aside
    className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl hidden lg:block shadow-sm overflow-y-auto"
    style={{ maxHeight: "calc(113vh - 3rem)" }}
  >
    {SIDEBAR_SECTIONS.map((section, si) => (
      <div
        key={si}
        className={si > 0 ? "border-y border-gray-100 py-3 rounded-xl" : ""}
      >
        {section.heading && (
          <p className="text-xs font-semibold text-gray-500 px-4 py-1 uppercase tracking-wide">
            {section.heading}
          </p>
        )}
        {section.items.map((item) => {
          const isActive = activeMenu === item.label || (item as any).highlight;
          return (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-rose-50 transition-colors text-left"
              style={{ backgroundColor: isActive ? "#c0174c" : undefined }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  style={{ color: isActive ? "white" : "#6b7280" }}
                  className="shrink-0"
                >
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: isActive ? "white" : "#1f2937" }}
                  >
                    {item.label}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-snug mt-0.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight />
            </button>
          );
        })}
      </div>
    ))}
  </aside>
);

// ─── Mobile Menu Dropdown ─────────────────────────────────────────────────────
const MobileMenuDropdown = ({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: (s: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeItem =
    ALL_MENU_ITEMS.find((i) => i.label === activeMenu) ?? ALL_MENU_ITEMS[0];

  return (
    <div ref={ref} className="relative lg:hidden  w-[90%]">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-semibold text-gray-800"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 text-[#b22234]">{activeItem.icon}</span>
          <span className="truncate">{activeItem.label}</span>
        </div>
        <span
          className="shrink-0 text-[#b22234] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {SIDEBAR_SECTIONS.map((section, si) => (
            <div key={si}>
              {section.heading && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-2.5 pb-1 bg-gray-50 border-b border-gray-100">
                  {section.heading}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = activeMenu === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenu(item.label);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors border-b border-gray-50 last:border-0"
                    style={{
                      backgroundColor: isActive ? "#fdf2f3" : "white",
                    }}
                  >
                    <span
                      style={{ color: isActive ? "#b22234" : "#9ca3af" }}
                      className="shrink-0"
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: isActive ? "#b22234" : "#1f2937" }}
                      >
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {item.desc}
                      </p>
                    </div>
                    {isActive && (
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#b22234]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Profile Card — Desktop / Grid View ──────────────────────────────────────
const ProfileCardGrid = ({
  profile,
  onOpen,
  onShortlist,
  onInterest,
}: {
  profile: CardProfile;
  onOpen: (p: CardProfile) => void;
  onShortlist: (p: CardProfile) => void;
  onInterest: (p: CardProfile) => void;
}) => {
  const [imgError, setImgError] = useState(false);
  const tags = [profile.profession, profile.education, profile.religion, profile.height].filter(Boolean).slice(0, 4) as string[];

  return (
    <div className="rounded-[28px] bg-white border border-gray-200 p-3 group shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_42px_-12px_rgba(192,23,76,0.25)] hover:border-[#f0c6d2] transition-all">
      {/* Photo (click to open) */}
      <div
        onClick={() => onOpen(profile)}
        className="relative w-full aspect-[3/4] overflow-hidden rounded-[22px] bg-gray-900 cursor-pointer"
      >
        {imgError || !profile.photo ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-6xl">👤</div>
        ) : (
          <img
            src={profile.photo}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        )}

        {/* Bottom darken for panel legibility */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55) 4%, rgba(0,0,0,0) 42%)" }} />

        {/* Ready-for-relationship pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium px-3 py-1.5 rounded-full">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff2d6f"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          Ready for relationship
        </div>

        {/* Shortlist heart */}
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); onShortlist(profile); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#c0174c] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </span>

        {/* Frosted info panel */}
        <div className="absolute inset-x-3 bottom-3 rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3.5 text-white">
          {profile.location && (
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span className="truncate">{profile.location}</span>
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-2xl font-bold leading-tight truncate">
              {profile.name}{profile.age != null && <>, {profile.age}</>}
            </h3>
            <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#ff2d6f" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {tags.map((t, i) => (
                <span key={i} className="bg-white/[0.12] border border-white/15 text-white/90 text-[11px] font-medium px-3 py-1 rounded-full truncate max-w-[150px]">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* About Me */}
      <div className="mt-2 rounded-[16px] bg-[#fdf3f6] border border-[#f5dbe3] px-3.5 py-2">
        <p className="text-[12px] font-bold text-gray-800 mb-0.5">About Me</p>
        <p className="text-[12px] text-gray-500 leading-snug line-clamp-2">
          {profile.about ||
            `${profile.profession || "Professional"}${profile.location ? ` from ${profile.location.split(",")[0]}` : ""}${profile.education ? ` · ${profile.education}` : ""}. Looking for a meaningful, lasting connection.`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => onInterest(profile)}
          className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-bold py-2.5 rounded-full cursor-pointer transition-transform active:scale-95 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#ff5d8f,#c0174c)", boxShadow: "0 8px 22px rgba(192,23,76,0.45)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          Express Interest
        </button>
        <button
          type="button"
          onClick={() => onShortlist(profile)}
          aria-label="Shortlist"
          className="w-10 h-10 rounded-full bg-[#fdeef2] border border-[#f3c6d4] flex items-center justify-center text-[#c0174c] cursor-pointer hover:bg-[#fbdce6] active:scale-95 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        </button>
        <button
          type="button"
          onClick={() => onOpen(profile)}
          aria-label="Call"
          className="w-10 h-10 rounded-full bg-[#fdeef2] border border-[#f3c6d4] flex items-center justify-center text-[#c0174c] cursor-pointer hover:bg-[#fbdce6] active:scale-95 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
        </button>
      </div>

      {/* View full profile */}
      <button
        type="button"
        onClick={() => onOpen(profile)}
        className="w-full mt-1.5 py-1.5 rounded-full text-sm font-bold text-gray-500 hover:text-[#c0174c] transition-colors cursor-pointer flex items-center justify-center gap-1"
      >
        View full profile
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};

// ─── Profile Card — Mobile List View ─────────────────────────────────────────
const ProfileCardList = ({
  profile,
  onOpen,
  onShortlist,
  onInterest,
}: {
  profile: CardProfile;
  onOpen: (p: CardProfile) => void;
  onShortlist: (p: CardProfile) => void;
  onInterest: (p: CardProfile) => void;
}) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col min-h-[186px]">
      {/* WhatsApp — top-right corner */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Chat on WhatsApp"
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <div className="flex gap-3 px-3 py-2 flex-1">
        <button
          type="button"
          onClick={() => onOpen(profile)}
          className="shrink-0 cursor-pointer"
        >
          <div className="w-32 h-32 rounded-md overflow-hidden border-2 border-[#f5d0d7]">
            {imgError || !profile.photo ? (
              <div className="w-full h-full bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-xl">
                👤
              </div>
            ) : (
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <button
            type="button"
            onClick={() => onOpen(profile)}
            className="min-w-0 text-left cursor-pointer pr-8"
          >
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {profile.name}
              </h3>
              {profile.isPremium ? (
                <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  Not Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 font-mono truncate">
              {profile.id}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.age != null && (
                <span className="text-xs bg-[#fdf2f3] text-[#b22234] font-semibold px-2 py-0.5 rounded-full">
                  {profile.age} Yrs
                </span>
              )}
              {profile.height && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {profile.height}
                </span>
              )}
              {profile.religion && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-[80px]">
                  {profile.religion}
                </span>
              )}
            </div>
            {profile.location && (
              <p className="text-[13px] text-gray-600 mt-1 truncate">
                📍 {profile.location}
              </p>
            )}
            {profile.education && (
              <p className="text-[13px] text-gray-600 truncate">
                🎓 {profile.education}
              </p>
            )}
            {profile.profession && (
              <p className="text-[13px] text-gray-600 truncate">
                💼 {profile.profession}
              </p>
            )}
          </button>
        </div>
      </div>

      {/* Full-width action bar (edge-to-edge, ~20% of card) */}
      <div className="flex items-stretch gap-1.5 px-3 pb-3 pt-0 mt-auto">
        <button
          type="button"
          onClick={() => onInterest(profile)}
          className="flex-1 bg-[#b22234] text-white text-[11px] font-bold py-2.5 rounded cursor-pointer transition-colors hover:bg-[#9a1d2b]"
        >
          ❤ Interest
        </button>
        <button
          type="button"
          onClick={() => onShortlist(profile)}
          className="flex-1 border border-[#b22234] text-[#b22234] text-[11px] font-bold py-2.5 rounded cursor-pointer transition-colors hover:bg-[#fdeef2]"
        >
          ⭐ Shortlist
        </button>
        <button
          type="button"
          onClick={() => onOpen(profile)}
          className="flex-1 border border-[#b22234] text-[#b22234] text-[11px] font-bold py-2.5 rounded cursor-pointer transition-colors hover:bg-[#fdeef2]"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onOpen(profile)}
          className="px-3 text-xs text-[#b22234] font-bold border border-[#b22234] rounded cursor-pointer transition-colors hover:bg-[#fdeef2]"
        >
          📞
        </button>
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
    <button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-[#b22234] hover:text-white hover:border-[#b22234] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      ‹
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-8 h-8 text-sm rounded font-medium transition-colors ${
          currentPage === page
            ? "bg-[#b22234] text-white border border-[#b22234]"
            : "border border-gray-300 text-gray-700 hover:bg-[#b22234] hover:text-white hover:border-[#b22234]"
        }`}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-[#b22234] hover:text-white hover:border-[#b22234] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      ›
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileCards() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<string>("Your Matches");
  const [mobileViewMode, setMobileViewMode] = useState<"grid" | "list">("grid");

  const [items, setItems] = useState<CardProfile[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>("");
  const [shortlistMsg, setShortlistMsg] = useState<string>("");
  const [filterState, setFilterState] = useState<FilterState>(EMPTY_FILTERS);

  // Infinite scroll — load the next page when nearing the bottom.
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const appendModeRef = useRef(false); // true → append (scroll), false → replace (page click)
  const onProfilesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      !loading &&
      !loadingMore &&
      currentPage < totalPages &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 320
    ) {
      appendModeRef.current = true;
      setCurrentPage((p) => p + 1);
    }
  };

  // Lock the page scroll on mobile so only the profiles list scrolls.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const html = document.documentElement;
    const apply = () => {
      const v = mq.matches ? "hidden" : "";
      html.style.overflow = v;
      document.body.style.overflow = v;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Stable serialised key — reruns the fetch effect when any filter changes
  // without forcing the consumer to do its own deep-equal.
  const filterKey = JSON.stringify(filterState);

  // Reset to page 1 when menu or filter changes
  useEffect(() => {
    appendModeRef.current = false;
    setCurrentPage(1);
  }, [activeMenu, filterKey]);

  // Fetch profiles whenever menu, page or filters change
  useEffect(() => {
    let cancelled = false;
    const append = appendModeRef.current; // captured for this run
    appendModeRef.current = false;
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError("");

    const matchFilters = buildMatchFilters(filterState);

    fetchForMenu(activeMenu as SidebarLabel, currentPage - 1, PAGE_SIZE, matchFilters)
      .then((result) => {
        if (cancelled) return;
        // Append for infinite scroll, replace for fresh loads / page clicks.
        setItems((prev) => (append ? [...prev, ...result.items] : result.items));
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
      })
      .catch((ex: any) => {
        if (cancelled) return;
        const msg =
          ex?.response?.data?.message ||
          ex?.message ||
          "Could not load profiles.";
        if (!append) {
          setError(msg);
          setItems([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu, currentPage, filterKey]);

  const handleOpen = (p: CardProfile) => {
    recordProfileView(p.numericId).catch(() => undefined);
    router.push(`/profiles/${p.numericId}`);
  };

  const handleShortlist = async (p: CardProfile) => {
    try {
      await shortlistProfile(p.numericId);
      setShortlistMsg(`${p.name} added to your shortlist`);
      window.setTimeout(() => setShortlistMsg(""), 2500);
    } catch (ex: any) {
      setShortlistMsg(
        ex?.response?.data?.message || "Could not shortlist this profile.",
      );
      window.setTimeout(() => setShortlistMsg(""), 2500);
    }
  };

  const handleInterest = async (p: CardProfile) => {
    try {
      await sendInterest(p.numericId);
      setShortlistMsg(`Interest sent to ${p.name}`);
      window.setTimeout(() => setShortlistMsg(""), 2500);
    } catch (ex: any) {
      setShortlistMsg(
        ex?.response?.data?.message || "Could not send interest.",
      );
      window.setTimeout(() => setShortlistMsg(""), 2500);
    }
  };

  return (
    <div className="bg-white lg:min-h-screen overflow-hidden lg:overflow-visible">
      <CoastHeaderBar />

      {shortlistMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#b22234] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          {shortlistMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-1 pb-4 sm:py-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <LeftSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col h-[calc(100dvh-9rem)] lg:h-[calc(100dvh-4rem)]">
            {/* Fixed top section: menu, view toggle, filters */}
            <div className="shrink-0 bg-white pt-[10px]">
            <div className="flex gap-1 justify-center items-center">
              <MobileMenuDropdown
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />

              <div className="flex items-center gap-2  ">
                <div className="flex lg:hidden items-center border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
                  <button
                    onClick={() => setMobileViewMode("grid")}
                    title="Grid view"
                    className={`w-10 h-10 flex items-center justify-center transition-colors ${
                      mobileViewMode === "grid"
                        ? "bg-[#b22234] text-white"
                        : "text-gray-400 hover:text-[#b22234]"
                    }`}
                  >
                    <GridViewIcon />
                  </button>
                  <div className="w-px h-5 bg-gray-200" />
                  <button
                    onClick={() => setMobileViewMode("list")}
                    title="List view"
                    className={`w-10 h-10 flex items-center justify-center transition-colors ${
                      mobileViewMode === "list"
                        ? "bg-[#b22234] text-white"
                        : "text-gray-400 hover:text-[#b22234]"
                    }`}
                  >
                    <ListViewIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 pb-2 pt-2 mt-2 flex items-center justify-between flex-wrap gap-2">
              <FilterBar value={filterState} onChange={setFilterState} />
              {!loading && !error && (
                <span className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-800">{items.length}</span> of{" "}
                  <span className="font-semibold text-gray-800">{totalElements.toLocaleString()}</span>{" "}
                  profiles
                </span>
              )}
            </div>
            </div>
            {/* end fixed top section */}

            {/* Scrollable profiles */}
            <div
              ref={scrollContainerRef}
              onScroll={onProfilesScroll}
              className="flex-1 overflow-y-auto pt-2"
            >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 animate-pulse rounded-lg h-44 md:h-40"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-sm font-semibold">No profiles to show here</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different category from the sidebar.
                </p>
              </div>
            ) : (
              <>
                {/* ── Desktop: detailed list cards (grid view is mobile-only) ── */}
                <div className="hidden md:grid grid-cols-2 gap-4">
                  {items.map((profile, i) => (
                    <ProfileCardList
                      key={`${profile.id}-${i}`}
                      profile={profile}
                      onOpen={handleOpen}
                      onShortlist={handleShortlist}
                      onInterest={handleInterest}
                    />
                  ))}
                </div>

                {/* ── Mobile: grid toggle ── */}
                <div className="md:hidden">
                  {mobileViewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-3">
                      {items.map((profile, i) => (
                        <ProfileCardGrid
                          key={`${profile.id}-${i}`}
                          profile={profile}
                          onOpen={handleOpen}
                          onShortlist={handleShortlist}
                          onInterest={handleInterest}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {items.map((profile, i) => (
                        <div key={`${profile.id}-${i}`} className="contents">
                          <ProfileCardList
                            profile={profile}
                            onOpen={handleOpen}
                            onShortlist={handleShortlist}
                            onInterest={handleInterest}
                          />
                          {/* Membership promo: first after 3 profiles, then every 10 */}
                          {i >= 2 && (i - 2) % 10 === 0 && (
                            <div
                              className="rounded-xl p-4 text-white text-center shadow-md"
                              style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}
                            >
                              <p className="text-sm font-bold">✨ Unlock Premium Matches</p>
                              <p className="text-[11px] text-white/85 mt-0.5">
                                Subscribe to a plan and connect with matches faster.
                              </p>
                              <button
                                onClick={() => router.push("/specialoffer")}
                                className="mt-2.5 bg-white text-[#c0174c] text-xs font-bold px-5 py-1.5 rounded-full hover:bg-pink-50 transition-colors"
                              >
                                View Plans
                              </button>
                              <div className="mt-3 pt-2.5 border-t border-white/20 text-[11px] text-white/90">
                                Need help?{" "}
                                <a href="tel:8075067058" className="font-bold underline">
                                  📞 8075067058
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Loading-more spinner (infinite scroll) */}
            {loadingMore && (
              <div className="flex justify-center py-5">
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#b22234" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            )}

            {/* Pagination — desktop only (mobile uses infinite scroll) */}
            {totalPages > 1 && (
              <div className="hidden lg:block">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
            </div>
            {/* end scrollable profiles */}
          </div>
        </div>
      </div>
    </div>
  );
}
