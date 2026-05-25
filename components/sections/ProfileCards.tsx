"use client";

import { useState } from "react";
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
      location: "Bangalore, Karnataka",
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
      id: "GM002346",
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

const SIDEBAR_SECTIONS = [
  {
    heading: null,
    items: [
      {
        icon: (
          <svg
            width="18"
            height="18"
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
            width="18"
            height="18"
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
            width="18"
            height="18"
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
            width="18"
            height="18"
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
            width="18"
            height="18"
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
    heading: "Recently joined & nearby matches",
    items: [
      {
        icon: (
          <svg
            width="18"
            height="18"
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
            width="18"
            height="18"
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
            width="18"
            height="18"
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
        label: "Matches with photos",
        desc: "Matches that have added photos",
      },
      {
        icon: (
          <svg
            width="18"
            height="18"
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
        label: "Matches with horoscope",
        desc: "Matches that have added horoscope",
      },
      {
        icon: (
          <svg
            width="18"
            height="18"
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
        label: "Matches with similar hobbies",
        desc: "Matches who have hobbies similar to you",
      },
    ],
  },
  {
    heading: "Based on astrological compatibility",
    items: [
      {
        icon: (
          <svg
            width="18"
            height="18"
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
            width="18"
            height="18"
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
    heading: "Members who are looking for someone like you",
    items: [
      {
        icon: (
          <svg
            width="18"
            height="18"
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
        desc: "Matches whose profile match your preferences and vice versa",
      },
      {
        icon: (
          <svg
            width="18"
            height="18"
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
    heading: "Matches based on preferences",
    items: [
      {
        icon: (
          <svg
            width="18"
            height="18"
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
            width="18"
            height="18"
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
            width="18"
            height="18"
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
        label: "City/location preference",
        desc: "Matches based on your preferred city/location",
      },
      {
        icon: (
          <svg
            width="18"
            height="18"
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

const ChevronRight = () => (
  <svg
    width="15"
    height="15"
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
const ChevronRightSm = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const FilterIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="13"
    height="13"
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
const VerifiedBadge = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      fill="#3b82f6"
      stroke="none"
    />
  </svg>
);
const HeartFilled = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const XIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const BookmarkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ImgIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const PhoneCallIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Left Sidebar ─────────────────────────────────────────────────────────────
const LeftSidebar = ({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: (s: string) => void;
}) => (
  <aside
    className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl hidden lg:block  shadow-sm overflow-y-auto"
    style={{ maxHeight: "calc(113vh - 3rem)" }}
  >
    {SIDEBAR_SECTIONS.map((section, si) => (
      <div key={si} className={si > 0 ? "border-y border-gray-100 py-3 rounded-xl" : ""}>
        <p className="text-sm font-semibold text-gray-700 px-4 ">
          {section?.heading}
        </p>
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
                  <p className="text-[10px] text-gray-400 leading-snug mt-0.5 whitespace-normal line-clamp-2">
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

// // ─── Profile Card ─────────────────────────────────────────────────────────────
const ProfileCard = ({ profile }: { profile: Profile }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex gap-3 p-3">
        {/* Photo */}
        <div className="shrink-0">
          <div className="w-24 h-28 rounded-md overflow-hidden border-2 border-[#f5d0d7] relative">
            {imgError ? (
              <div className="w-full h-full bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-3xl">
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

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] text-gray-400 font-mono">
                PROFILE ID: {profile.id}
              </p>
              <h3 className="text-sm font-bold text-gray-800 truncate">
                {profile.name}
              </h3>
            </div>
          </div>

          <div className="text-[11px] text-gray-600 space-y-0.5 mb-2">
            <p>
              <span className="text-[#b22234] font-semibold">
                {profile.age} Yrs
              </span>{" "}
              • {profile.height} • {profile.religion}
            </p>
            <p className="truncate">
              📍 {profile.location} • {profile.income}
            </p>
            <p className="truncate">🎓 {profile.education}</p>
            <p className="truncate">💼 {profile.profession}</p>
          </div>

          <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 leading-relaxed">
            {profile.about}{" "}
            <button className="text-[#b22234] font-medium hover:underline">
              read...
            </button>
          </p>

          {/* Buttons */}
          <div className="flex gap-1.5">
            <button className="flex-1 bg-[#b22234] hover:bg-[#9a1d2b] text-white text-[10px] font-bold py-1.5 px-2 rounded transition-colors">
              Login
            </button>
            <button className="flex-1 border border-[#b22234] text-[#b22234] hover:bg-[#b22234] hover:text-white text-[10px] font-bold py-1.5 px-2 rounded transition-colors">
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Contact Now Strip */}
      <div className="border-t border-gray-100 px-3 py-1.5 bg-gray-50">
        <button className="text-[10px] text-[#b22234] font-bold hover:underline flex items-center gap-1 w-full justify-center">
          📞 CONTACT NOW!
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
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-[#b22234] hover:text-white hover:border-[#b22234] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>

      {pages.map((page) => (
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
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileCards() {
  const [activeTab, setActiveTab] = useState<"bride" | "groom">("bride");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeMenu, setActiveMenu] = useState("Your Matches");

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
      {/* Top Banner */}
      <CoastHeaderBar/>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          

          <LeftSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            {/* <div className="flex mb-4 rounded-lg overflow-hidden border border-[#b22234] w-fit">
              <button
                onClick={() => handleTabChange("bride")}
                className={`px-8 py-2.5 text-sm font-bold tracking-wider transition-colors ${
                  activeTab === "bride"
                    ? "bg-[#b22234] text-white"
                    : "bg-white text-[#b22234] hover:bg-[#fce4ec]"
                }`}
              >
                👰 BRIDES
              </button>
              <button
                onClick={() => handleTabChange("groom")}
                className={`px-8 py-2.5 text-sm font-bold tracking-wider transition-colors ${
                  activeTab === "groom"
                    ? "bg-[#b22234] text-white"
                    : "bg-white text-[#b22234] hover:bg-[#fce4ec]"
                }`}
              >
                🤵 GROOMS
              </button>
            </div> */}

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              {/* <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-[#b22234]">
                  {(currentPage - 1) * PROFILES_PER_PAGE + 1}–
                  {Math.min(currentPage * PROFILES_PER_PAGE, filtered.length)}
                </span>{" "}
                of <span className="font-semibold">{filtered.length}</span>{" "}
                profiles
              </p> */}
             <FilterBar/>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginated.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Pagination */}
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

