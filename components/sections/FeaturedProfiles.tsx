"use client";

import { profiles } from "@/constants/profiles";
import Image from "next/image";
import { useState } from "react";

type Tab = "bride" | "groom";

export default function FeaturedProfiles() {
  const [tab, setTab] = useState<Tab>("bride");

  const brides = profiles.slice(0, 5);
  const grooms = profiles.slice(5, 10);
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
                <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-center min-w-[110px] shadow-sm">
                  <p className="text-[11px] font-bold text-gray-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5">
                    {p.age} yrs • {p.height}
                  </p>
                  <p className="text-[9px] text-[#c0174c] font-semibold mt-0.5 truncate">
                    {p.city}
                  </p>
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
