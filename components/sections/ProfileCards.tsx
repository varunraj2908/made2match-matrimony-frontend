
"use client";

import { useState, useRef, useEffect } from "react";
import CoastHeaderBar from "../layout/CoastHeaderBar";
import FilterBar from "./FilterTab";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id: string;
  name: string;
  age: number;
  height: string;
  religion: string;
  caste: string;
  location: string;
  education: string;
  profession: string;
  income: string;
  about: string;
  gender: "bride" | "groom";
  photo: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const generateProfiles = (): Profile[] => {
  const brides: Profile[] = [
    {
      id: "GM001247",
      name: "Priya Sharma",
      age: 26,
      height: "5'4\"",
      religion: "Hindu",
      caste: "Brahmin",
      location: "Kerala, India",
      education: "B.Tech Software",
      profession: "Software Engineer",
      income: "6-8 LPA",
      about:
        "Smart, intelligent, well mannered and humble girl looking for a loving and caring life partner.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "GM001248",
      name: "Anjali Nair",
      age: 24,
      height: "5'3\"",
      religion: "Hindu",
      caste: "Nair",
      location: "Kochi, Kerala",
      education: "MBA Finance",
      profession: "Financial Analyst",
      income: "5-7 LPA",
      about:
        "Simple, educated and family-oriented girl seeking a compatible and understanding partner.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: "GM001248",
      name: "Anjali Nair",
      age: 54,
      height: "5'3\"",
      religion: "Hindu",
      caste: "Nair",
      location: "Kochi, Kerala",
      education: "MBA Finance",
      profession: "Financial Analyst",
      income: "5-7 LPA",
      about:
        "Simple, educated and family-oriented girl seeking a compatible and understanding partner.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: "GM001249",
      name: "Meera Pillai",
      age: 27,
      height: "5'5\"",
      religion: "Hindu",
      caste: "Pillai",
      location: "Trivandrum, Kerala",
      education: "MBBS",
      profession: "Doctor",
      income: "10-12 LPA",
      about:
        "Caring and well-educated girl who values family traditions and modern values equally.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: "GM001250",
      name: "Deepa Thomas",
      age: 25,
      height: "5'4\"",
      religion: "Christian",
      caste: "Latin Catholic",
      location: "Thrissur, Kerala",
      education: "B.Com CA",
      profession: "Chartered Accountant",
      income: "7-9 LPA",
      about:
        "Ambitious, independent woman who loves cooking and travelling in free time.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
      id: "GM001251",
      name: "Lakshmi Menon",
      age: 23,
      height: "5'2\"",
      religion: "Hindu",
      caste: "Menon",
      location: "Kozhikode, Kerala",
      education: "B.Sc Nursing",
      profession: "Staff Nurse",
      income: "3-5 LPA",
      about:
        "Soft-spoken and dedicated nurse seeking a kind-hearted and responsible life partner.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    {
      id: "GM001252",
      name: "Nithya Krishnan",
      age: 28,
      height: "5'6\"",
      religion: "Hindu",
      caste: "Kshatriya",
      location: "Kollam, Kerala",
      education: "M.Tech CSE",
      profession: "Data Scientist",
      income: "12-15 LPA",
      about:
        "Tech-savvy and intelligent woman with strong family values and a passion for learning.",
      gender: "bride",
      photo: "https://randomuser.me/api/portraits/women/72.jpg",
    },
  ];
  const grooms: Profile[] = [
    {
      id: "GM002341",
      name: "Rahul Varma",
      age: 29,
      height: "5'10\"",
      religion: "Hindu",
      caste: "Brahmin",
      location: "Bangalore, KA",
      education: "B.Tech IT",
      profession: "Software Engineer",
      income: "10-12 LPA",
      about:
        "Smart, intelligent, well mannered and humble boy seeking a compatible life partner.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "GM002342",
      name: "Arjun Nambiar",
      age: 31,
      height: "5'11\"",
      religion: "Hindu",
      caste: "Nambiar",
      location: "Kochi, Kerala",
      education: "MBA",
      profession: "Business Manager",
      income: "15-18 LPA",
      about:
        "Successful entrepreneur who values family and seeks an educated, caring partner.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: "GM002343",
      name: "Vishnu Pillai",
      age: 27,
      height: "5'9\"",
      religion: "Hindu",
      caste: "Pillai",
      location: "Trivandrum, Kerala",
      education: "MBBS MD",
      profession: "Doctor",
      income: "18-20 LPA",
      about:
        "Dedicated doctor with calm temperament looking for an educated life partner.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/53.jpg",
    },
    {
      id: "GM002344",
      name: "Sanjay Thomas",
      age: 30,
      height: "5'8\"",
      religion: "Christian",
      caste: "Syrian Christian",
      location: "Thrissur, Kerala",
      education: "B.E Civil",
      profession: "Civil Engineer",
      income: "8-10 LPA",
      about:
        "Down-to-earth and hard-working professional seeking a simple, family-oriented partner.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/61.jpg",
    },
    {
      id: "GM002345",
      name: "Arun Menon",
      age: 26,
      height: "5'9\"",
      religion: "Hindu",
      caste: "Menon",
      location: "Kozhikode, Kerala",
      education: "B.Com MBA",
      profession: "Bank Manager",
      income: "9-11 LPA",
      about:
        "Friendly and responsible banker who loves music and outdoor activities.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/29.jpg",
    },
    {
      id: "GM002346",
      name: "Kiran Krishnan",
      age: 32,
      height: "6'0\"",
      religion: "Hindu",
      caste: "Kshatriya",
      location: "Kollam, Kerala",
      education: "M.Sc Physics",
      profession: "Research Scientist",
      income: "12-14 LPA",
      about:
        "Passionate researcher with a love for science and technology, seeking an intellectual partner.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/74.jpg",
    },
    {
      id: "GM002347",
      name: "Kiran Krishnan",
      age: 37,
      height: "6'0\"",
      religion: "Hindu",
      caste: "Kshatriya",
      location: "Kollam, Kerala",
      education: "M.Sc Physics",
      profession: "Research Scientist",
      income: "12-14 LPA",
      about:
        "Passionate researcher with a love for science and technology, seeking an intellectual partner.",
      gender: "groom",
      photo: "https://randomuser.me/api/portraits/men/74.jpg",
    },
  ];
  return [...brides, ...grooms];
};

const ALL_PROFILES = generateProfiles();
const PROFILES_PER_PAGE = 6;

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
// Fixed: no overflow, all content constrained
const ProfileCardGrid = ({ profile }: { profile: Profile }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
      <div className="flex flex-col md:flex-row gap-2 md:gap-2.5 p-2 md:p-2.5 flex-1">
        {/* Photo — full width on mobile, fixed size on desktop */}
        <div className="shrink-0">
          <div className="w-full h-36 md:w-24 md:h-28 rounded-md overflow-hidden border-2 border-[#f5d0d7]">
            {imgError ? (
              <div className="w-full h-full bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-2xl">
                {profile.gender === "bride" ? "👰" : "🤵"}
              </div>
            ) : (
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        {/* Info — min-w-0 prevents overflow */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="min-w-0">
            <p className="text-[9px] text-gray-400 font-mono truncate">
              ID: {profile.id}
            </p>
            <h3 className="text-sm font-bold text-gray-800 truncate leading-tight">
              {profile.name}
            </h3>

            <div className="text-[11px] md:text-[10px] text-gray-600 space-y-0.5 mt-1">
              <p className="truncate">
                <span className="text-[#b22234] font-semibold">
                  {profile.age}Y
                </span>{" "}
                • {profile.height} • {profile.religion}
              </p>
              <p className="truncate">📍 {profile.location}</p>
              <p className="truncate">🎓 {profile.education}</p>
              <p className="truncate">💼 {profile.profession}</p>
              <p className="hidden md:block truncate text-[9px] text-gray-400">
                💰 {profile.income}
              </p>
            </div>

            <p className="hidden md:block text-[10px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
              {profile.about}
            </p>
          </div>

          {/* Buttons — always at bottom, no overflow */}
          <div className="flex gap-1 mt-2">
            <button className="flex-1 bg-[#b22234] hover:bg-[#9a1d2b] text-white text-[10px] font-bold py-1.5 rounded transition-colors truncate">
              Login
            </button>
            <button className="flex-1 border border-[#b22234] text-[#b22234] hover:bg-[#b22234] hover:text-white text-[10px] font-bold py-1.5 rounded transition-colors truncate">
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Contact strip */}
      <div className="border-t border-gray-100 px-2.5 py-1.5 bg-gray-50 shrink-0">
        <button className="text-[10px] text-[#b22234] font-bold hover:underline flex items-center gap-1 w-full justify-center">
          📞 CONTACT NOW!
        </button>
      </div>
    </div>
  );
};

// ─── Profile Card — Mobile List View ─────────────────────────────────────────
const ProfileCardList = ({ profile }: { profile: Profile }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex gap-3 p-3">
        {/* Photo */}
        <div className="shrink-0">
          <div className="w-16 h-20 rounded-md overflow-hidden border-2 border-[#f5d0d7]">
            {imgError ? (
              <div className="w-full h-full bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-xl">
                {profile.gender === "bride" ? "👰" : "🤵"}
              </div>
            ) : (
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-800 truncate">
              {profile.name}
            </h3>
            <p className="text-[9px] text-gray-400 font-mono truncate">
              {profile.id}
            </p>
            {/* Pills */}
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[10px] bg-[#fdf2f3] text-[#b22234] font-semibold px-1.5 py-0.5 rounded-full">
                {profile.age} Yrs
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {profile.height}
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                {profile.religion}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 truncate">
              📍 {profile.location}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              🎓 {profile.education}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              💼 {profile.profession}
            </p>
          </div>
          <div className="flex gap-1.5 mt-2">
            <button className="flex-1 bg-[#b22234] text-white text-[10px] font-bold py-1.5 rounded transition-colors">
              Login
            </button>
            <button className="flex-1 border border-[#b22234] text-[#b22234] text-[10px] font-bold py-1.5 rounded transition-colors">
              Register
            </button>
            <button className="px-2.5 text-[10px] text-[#b22234] font-bold border border-[#b22234] rounded transition-colors">
              📞
            </button>
          </div>
        </div>
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
  const [activeTab, setActiveTab] = useState<"bride" | "groom">("bride");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState("Your Matches");
  const [mobileViewMode, setMobileViewMode] = useState<"grid" | "list">("grid");

  const filtered = ALL_PROFILES.filter((p) => p.gender === activeTab);
  const totalPages = Math.ceil(filtered.length / PROFILES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PROFILES_PER_PAGE,
    currentPage * PROFILES_PER_PAGE,
  );

  const handleTabChange = (tab: "bride" | "groom") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <CoastHeaderBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <LeftSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-1 justify-center items-center">
              {/* Mobile Dropdown (replaces sidebar scroll) */}
              <MobileMenuDropdown
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />

              {/* FilterBar + View Toggle row */}
              <div className="flex items-center gap-2  ">
                {/* View toggle — mobile only */}
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

            <div className="flex-1 min-w-0 pb-2 mt-2">
              <FilterBar />
            </div>

            {/* ── Desktop: always 2-col grid ── */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {paginated.map((profile, i) => (
                <ProfileCardGrid key={`${profile.id}-${i}`} profile={profile} />
              ))}
            </div>

            {/* ── Mobile: grid toggle ── */}
            <div className="md:hidden">
              {mobileViewMode === "grid" ? (
                // 2-column grid — cards have fixed photo, truncated text, no overflow
                <div className="grid grid-cols-2 gap-2">
                  {paginated.map((profile, i) => (
                    <ProfileCardGrid
                      key={`${profile.id}-${i}`}
                      profile={profile}
                    />
                  ))}
                </div>
              ) : (
                // Full-width list
                <div className="flex flex-col gap-2">
                  {paginated.map((profile, i) => (
                    <ProfileCardList
                      key={`${profile.id}-${i}`}
                      profile={profile}
                    />
                  ))}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
