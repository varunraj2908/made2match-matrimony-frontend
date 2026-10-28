"use client";

import Image from "next/image";
import { useState } from "react";

type Tab = "bride" | "groom";

const profiles = {
  bride: [
    { name: "Sandra Benny", age: 27, height: "5'4\"", city: "Kochi", image: "/sandra-profile.jpg" },
    { name: "Sushama", age: 27, height: "5'3\"", city: "Palakkad", image: "/sushama-profile.jpg" },
    { name: "Varsha", age: 29, height: "5'5\"", city: "Thiruvananthapuram", image: "/varsha-profile.jpg" },
    { name: "Lakshmi", age: 29, height: "5'4\"", city: "Malappuram", image: "/lakshmi-profile.jpg" },
    { name: "Anjana", age: 27, height: "5'4\"", city: "Malappuram", image: "/anjana-profile.jpg" },
  ],
  groom: [
    { name: "Varun", age: 33, height: "5'6\"", city: "Palakkad", image: "/varun-groom.jpg" },
    { name: "Shijo", age: 30, height: "6'0\"", city: "Palakkad", image: "/shijo-groom.jpg" },
    { name: "Sabin", age: 31, height: "5'9\"", city: "Palakkad", image: "/sabin-groom.jpg" },
    { name: "Shehin", age: 28, height: "5'9\"", city: "Kochi", image: "/shehin.jpeg" },
    { name: "Nithin", age: 30, height: "5'10\"", city: "Kannur", image: "/profile6.png" },
  ],
};

export default function FeaturedProfiles() {
  const [tab, setTab] = useState<Tab>("bride");
  const [activeIdx, setActiveIdx] = useState(2);

  const selectTab = (nextTab: Tab) => {
    setTab(nextTab);
    setActiveIdx(2);
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8" style={{ background: "#fde8ef" }}>
      <div className="mx-auto max-w-7xl lg:px-6">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl" style={{ fontFamily: "Georgia, serif" }}>
            Featured Profiles
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-xs text-gray-500 sm:text-sm">
            Find Thousands of Personal Members Looking for Partner
          </p>
          <div className="mt-3 flex items-center justify-center gap-2" aria-hidden>
            <span className="h-px w-6 bg-gray-300" />
            <span className="text-[#c0174c]">♥</span>
            <span className="h-px w-6 bg-gray-300" />
          </div>
        </div>

        <div className="mb-10 flex items-center justify-center gap-3">
          {(["bride", "groom"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectTab(item)}
              aria-pressed={tab === item}
              className={`cursor-pointer rounded-full px-7 py-2 text-sm font-bold capitalize transition-all ${
                tab === item
                  ? "btn-primary"
                  : "border-2 border-[#c0174c] bg-white text-[#c0174c] hover:bg-[#fdeef4]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="mx-auto flex w-max items-end gap-3 px-1 sm:gap-6">
          {profiles[tab].map((profile, index) => {
            const isActive = index === activeIdx;

            return (
              <button
                key={`${tab}-${profile.name}`}
                type="button"
                onClick={() => setActiveIdx(index)}
                className="group flex shrink-0 cursor-pointer flex-col items-center"
              >
                <div
                  className={`relative mb-3 overflow-hidden rounded-full transition-all duration-300 ${
                    isActive ? "h-36 w-36 sm:h-44 sm:w-44" : "h-24 w-24 sm:h-32 sm:w-32"
                  }`}
                  style={{
                    border: isActive ? "4px solid #c0174c" : "3px solid #f5d0d7",
                    boxShadow: isActive ? "0 10px 30px rgba(192,23,76,0.30)" : "none",
                  }}
                >
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    sizes={isActive ? "176px" : "128px"}
                    className="object-cover object-top transition-transform group-hover:scale-105"
                  />
                </div>
                <div
                  className={`min-w-[130px] rounded-2xl px-4 py-2.5 text-center transition-all ${
                    isActive
                      ? "-translate-y-0.5 border-2 border-[#c0174c] bg-gradient-to-b from-[#fff0f5] to-white shadow-[0_10px_25px_rgba(192,23,76,0.22)]"
                      : "border border-gray-200 bg-white shadow-md hover:shadow-lg"
                  }`}
                >
                  <p className="truncate text-sm font-extrabold leading-tight text-gray-900">{profile.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                    {profile.age} yrs • {profile.height}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#fde4ec] px-2.5 py-0.5 text-[10px] font-bold text-[#c0174c]">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {profile.city}
                  </span>
                </div>
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
