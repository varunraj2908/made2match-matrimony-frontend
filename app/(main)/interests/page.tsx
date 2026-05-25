
"use client";

import CoastHeaderBar from "@/components/layout/CoastHeaderBar";
import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Profile = {
  id: string;
  name: string;
  age: number;
  height: string;
  caste: string;
  education: string;
  profession: string;
  location: string;
  photo: string;
  sentDate: string;
  sentByLabel: string;
};

type SidebarItem = { key: string; label: string; count?: number; badge?: number };

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const MOCK_PROFILES: Profile[] = [
  {
    id: "E11082681",
    name: "Anjali.G.G",
    age: 31,
    height: `5'2"`,
    caste: "Ezhava",
    education: "M.Sc.",
    profession: "Officer",
    location: "Ernakulam",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    sentDate: "12 Feb 26",
    sentByLabel: "She sent you an interest",
  },
  {
    id: "E11083456",
    name: "Priya.Menon",
    age: 28,
    height: `5'4"`,
    caste: "Nair",
    education: "B.Tech",
    profession: "Software Engineer",
    location: "Thrissur",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    sentDate: "10 Feb 26",
    sentByLabel: "She sent you an interest",
  },
  {
    id: "E11091234",
    name: "Lakshmi.Nair",
    age: 30,
    height: `5'3"`,
    caste: "Sharma",
    education: "MBA",
    profession: "Manager",
    location: "Kozhikode",
    photo: "https://randomuser.me/api/portraits/women/72.jpg",
    sentDate: "08 Feb 26",
    sentByLabel: "She sent you an interest",
  },
];

const RECEIVED_ITEMS: SidebarItem[] = [
  { key: "all",      label: "All",             count: 116 },
  { key: "pending",  label: "Pending",          count: 1   },
  { key: "accepted", label: "Accepted/Replied", count: 60, badge: 3 },
  { key: "declined", label: "Declined",         count: 55  },
];

const SENT_ITEMS: SidebarItem[] = [
  { key: "all",      label: "All"              },
  { key: "pending",  label: "Pending"          },
  { key: "accepted", label: "Accepted/Replied" },
  { key: "declined", label: "Declined"         },
];

const HEADING_MAP: Record<string, { title: string; subtitle: string }> = {
  "received-all":      { title: "All interests (116)",     subtitle: "All interests received from members" },
  "received-pending":  { title: "Pending interests (1)",   subtitle: "Interests from free members awaiting your response" },
  "received-accepted": { title: "Accepted/Replied (60)",   subtitle: "Interests you have accepted or replied to" },
  "received-declined": { title: "Declined (55)",           subtitle: "Interests you have declined" },
  "sent-all":          { title: "All interests sent (48)", subtitle: "All interests you have sent" },
  "sent-pending":      { title: "Pending (12)",            subtitle: "Interests awaiting their response" },
  "sent-accepted":     { title: "Accepted/Replied (24)",   subtitle: "Interests that have been accepted" },
  "sent-declined":     { title: "Declined (12)",           subtitle: "Interests that have been declined" },
};

const SECTION_LABELS: Record<string, string> = {
  "received-all":      "All (116)",
  "received-pending":  "Pending (1)",
  "received-accepted": "Accepted/Replied (60)",
  "received-declined": "Declined (55)",
  "sent-all":          "All (48)",
  "sent-pending":      "Pending (12)",
  "sent-accepted":     "Accepted/Replied (24)",
  "sent-declined":     "Declined (12)",
};

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (s: string) => void;
}) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Interests Received */}
        <div>
          <h2 className="text-lg font-semibold text-white bg-[#b22234] py-4 px-5">Interests</h2>
          <h2 className="text-sm font-semibold text-[#b22234] py-4 px-5">Interests Received</h2>
          <div className="border-b h-px w-full border-gray-200"></div>

          <ul className="space-y-1 px-5">
            {RECEIVED_ITEMS.map((item) => {
              const key = `received-${item.key}`;
              const isActive = activeSection === key;
              return (
                <li key={key} className="my-1">
                  <button
                    onClick={() => setActiveSection(key)}
                    className="w-full text-left flex items-center justify-between py-1 group"
                  >
                    <span
                      className={`text-sm ${
                        isActive
                          ? "text-green-600 font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                      {item.count !== undefined && (
                        <span> ({item.count})</span>
                      )}
                    </span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}+
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Interests Sent */}
        <div>
          <h2 className="text-sm font-semibold text-[#b22234] py-4 px-5 border-y border-gray-200">
            Interests Sent
          </h2>
          <ul className="space-y-1 px-5">
            {SENT_ITEMS.map((item) => {
              const key = `sent-${item.key}`;
              const isActive = activeSection === key;
              return (
                <li key={key} className="my-1">
                  <button
                    onClick={() => setActiveSection(key)}
                    className="w-full text-left py-1"
                  >
                    <span
                      className={`text-sm ${
                        isActive
                          ? "text-green-600 font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   MOBILE SECTION DROPDOWN
───────────────────────────────────────────── */
function MobileSectionDropdown({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (key: string) => {
    setActiveSection(key);
    setOpen(false);
  };

  return (
    <div className="lg:hidden mb-3 relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-[#b22234] rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
      >
        <span>{SECTION_LABELS[activeSection] ?? activeSection}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">

          {/* Received group */}
          <p className="text-xs font-semibold text-[#b22234] px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            Interests Received
          </p>
          {RECEIVED_ITEMS.map((item) => {
            const key = `received-${item.key}`;
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full text-left flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-green-600 font-semibold bg-green-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>
                  {item.label}
                  {item.count !== undefined && ` (${item.count})`}
                </span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}+
                  </span>
                )}
              </button>
            );
          })}

          {/* Sent group */}
          <p className="text-xs font-semibold text-[#b22234] px-4 py-2.5 border-t border-b border-gray-100 bg-gray-50">
            Interests Sent
          </p>
          {SENT_ITEMS.map((item) => {
            const key = `sent-${item.key}`;
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-green-600 font-semibold bg-green-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE CARD
───────────────────────────────────────────── */
function ProfileCard({
  profile,
  mode,
}: {
  profile: Profile;
  mode: "received" | "sent";
}) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4">
      <div className="flex">

        {/* Photo */}
        <div className="shrink-0">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-24 h-24 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-cover rounded-lg border border-[#b22234]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d4a89a&color=fff&size=208`;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 px-3 sm:px-6 flex flex-col justify-between relative">

          {/* Three-dot menu */}
          <button className="absolute top-0 right-0 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5"  r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {/* Top: Name + details */}
          <div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-0.5 pr-6">
              {profile.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">{profile.id}</p>

            {/* Inline dot-separated info */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm text-gray-600">
              {[
                `${profile.age} yrs`,
                profile.height,
                profile.caste,
                profile.education,
                profile.profession,
                profile.location,
              ].map((item, i, arr) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span>{item}</span>
                  {i < arr.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-gray-400 inline-block" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom: Interest message + action buttons */}
          <div className="mt-3 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-800 mb-0.5">
              <span className="font-semibold">{profile.sentByLabel}</span>
              <span className="text-gray-500"> - {profile.sentDate}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              {mode === "received"
                ? "Accept her interest to start a conversation"
                : "Waiting for her response"}
            </p>

            {mode === "received" ? (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Decline */}
                <button
                  onClick={() => { setDeclined(!declined); setAccepted(false); }}
                  className={`flex items-center gap-1.5 border rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                    declined
                      ? "border-gray-400 bg-gray-100 text-gray-600"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  {declined ? "Declined" : "Decline"}
                </button>

                {/* Accept Interest */}
                <button
                  onClick={() => { setAccepted(!accepted); setDeclined(false); }}
                  className={`flex items-center gap-1.5 border rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                    accepted
                      ? "border-[#b22234] bg-[#b22234] text-white"
                      : "border-[#b22234] text-[#b22234] hover:bg-orange-50"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {accepted ? "Accepted ✓" : "Accept Interest"}
                </button>
              </div>
            ) : (
              <button className="flex items-center gap-1.5 border border-[#b22234] text-[#b22234] hover:bg-orange-50 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Cancel Interest
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGINATION
───────────────────────────────────────────── */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const base =
    "flex items-center justify-center text-sm transition-colors border rounded-lg bg-white";

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${base} gap-1 px-2.5 sm:px-3 py-2 border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${base} w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-medium ${
              currentPage === p
                ? "bg-green-600 border-green-600 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${base} gap-1 px-2.5 sm:px-3 py-2 border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm`}
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function InterestsPage() {
  const [activeSection, setActiveSection] = useState("received-pending");
  const [currentPage, setCurrentPage] = useState(1);

  const mode = activeSection.startsWith("received") ? "received" : "sent";
  const heading = HEADING_MAP[activeSection] ?? { title: "Interests", subtitle: "" };

  return (
    <div className="min-h-screen bg-gray-50">
      <CoastHeaderBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">

          {/* Sidebar — large screens only */}
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Mobile dropdown — shown only on small screens */}
            <MobileSectionDropdown
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{heading.title}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{heading.subtitle}</p>
              </div>
              <button className="flex items-center gap-2 border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:border-gray-400 bg-white transition-colors shrink-0 ml-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filter
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-4">
              {MOCK_PROFILES.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} mode={mode} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}