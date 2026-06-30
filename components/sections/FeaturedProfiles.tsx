"use client";

import { profiles } from "@/constants/profiles";
import Image from "next/image";
import { useState } from "react";

type Tab = "bride" | "groom";

export default function FeaturedProfiles() {
  const [tab, setTab] = useState<Tab>("bride");

  // Real featured brides (images live in /public).
  const brides = [
    { name: "Sandra Benny", age: 27, height: "5'4\"", city: "Kochi", image: "/sandra-profile.jpg" },
    { name: "Sushama", age: 27, height: "5'3\"", city: "Palakkad", image: "/sushama-profile.jpg" },
    { name: "Varsha", age: 29, height: "5'5\"", city: "Trivandrum", image: "/varsha-profile.jpg" },
    { name: "Lakshmi", age: 29, height: "5'4\"", city: "Malappuram", image: "/lakshmi-profile.jpg" },
    { name: "Anjana", age: 27, height: "5'4\"", city: "Malappuram", image: "/anjana-profile.jpg" },
  ];
  const grooms = [
    { name: "Varun", age: 33, height: "5'6\"", city: "Palakkad", image: "/varun-groom.jpg" },
    { name: "Shijo", age: 30, height: "6'0\"", city: "Palakkad", image: "/shijo-groom.jpg" },
    { name: "Sabin", age: 31, height: "5'9\"", city: "Palakkad", image: "/sabin-groom.jpg" },
    { name: "Arjun Nair", age: 29, height: "5'8\"", city: "Kozhikode", image: "https://randomuser.me/api/portraits/men/45.jpg" },
    ...profiles.slice(5, 6),
  ];
  const list = tab === "bride" ? brides : grooms;
  const [activeIdx, setActiveIdx] = useState(2); // center one is highlighted

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-800"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Featured Profiles
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
            Find Thousands of Personal Members Looking for Partner
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-px w-6 bg-gray-300" />
            <span className="text-[#c0174c]">♥</span>
            <span className="h-px w-6 bg-gray-300" />
          </div>
        </div>

        {/* Bride / Groom toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {([
            { key: "bride", label: "Bride" },
            { key: "groom", label: "Groom" },
          ] as { key: Tab; label: string }[]).map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setActiveIdx(2);
                }}
                className={`px-7 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${
                  active
                    ? "btn-primary"
                    : "border-2 border-[#c0174c] text-[#c0174c] bg-white hover:bg-[#fdeef4]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Profiles row */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 overflow-x-auto pb-2">
          {list.map((p, i) => {
            const isActive = i === activeIdx;
            const size = isActive ? "w-36 h-36 sm:w-44 sm:h-44" : "w-24 h-24 sm:w-32 sm:h-32";
            return (
              <button
                key={`${tab}-${i}`}
                onClick={() => setActiveIdx(i)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                <div
                  className={`relative rounded-full overflow-hidden ${size} transition-all duration-300 mb-3`}
                  style={{
                    border: isActive ? "4px solid #c0174c" : "3px solid #f5d0d7",
                    boxShadow: isActive ? "0 10px 30px rgba(192,23,76,0.30)" : "none",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform"
                  />
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-center min-w-[130px] transition-all ${
                    isActive
                      ? "bg-gradient-to-b from-[#fff0f5] to-white border-2 border-[#c0174c] shadow-[0_10px_25px_rgba(192,23,76,0.22)] -translate-y-0.5"
                      : "bg-white border border-gray-200 shadow-md hover:shadow-lg"
                  }`}
                >
                  <p className="text-sm font-extrabold text-gray-900 truncate leading-tight">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {p.age} yrs • {p.height}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-[#c0174c] bg-[#fde4ec] px-2.5 py-0.5 rounded-full">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {p.city}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <button className="btn-primary px-10 py-3 rounded-md text-sm cursor-pointer">
            LEARN MORE ABOUT US
          </button>
        </div>
      </div>
    </section>
  );
}
