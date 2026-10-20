"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { mapNakshatra, mapRaasi, saveStarDetails } from "@/services/profileService";

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarMandalaIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
    {/* Outer petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx="20"
        cy="20"
        rx="3"
        ry="8"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="1.2"
        opacity="0.7"
        transform={`rotate(${angle} 20 20)`}
      />
    ))}
    {/* Middle ring */}
    <circle cx="20" cy="20" r="10" stroke="#6366F1" strokeWidth="1.2" fill="none" />
    {/* Inner ring */}
    <circle cx="20" cy="20" r="5" stroke="#0EA5E9" strokeWidth="1.4" fill="none" />
    {/* Center dot */}
    <circle cx="20" cy="20" r="2" fill="#6366F1" />
  </svg>
);

const NAKSHATRAS = [
  "Ashwini / Aswathi",
  "Bharani",
  "Krittika / Karthika",
  "Rohini",
  "Mrigashira / Makayiram",
  "Ardra / Thiruvathira",
  "Punarvasu / Punartham",
  "Pushya / Pooyam",
  "Ashlesha / Ayilyam",
  "Magha / Makam",
  "Purva Phalguni / Pooram",
  "Uttara Phalguni / Uthram",
  "Hasta / Atham",
  "Chitra / Chithira",
  "Swati / Chothi",
  "Vishakha / Vishakam",
  "Anuradha / Anizham",
  "Jyeshtha / Thrikketta",
  "Mula / Moolam",
  "Purva Ashadha / Pooradam",
  "Uttara Ashadha / Uthradam",
  "Shravana / Thiruvonam",
  "Dhanishtha / Avittam",
  "Shatabhisha / Chathayam",
  "Purva Bhadrapada / Pooruruttathi",
  "Uttara Bhadrapada / Uthrattathi",
  "Revati",
];

const RAASIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithunam (Gemini)",
  "Karkata (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrischika (Scorpio)",
  "Dhanus (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
];

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ appearance: "none", WebkitAppearance: "none" }}
          className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 hover:border-slate-300 hover:bg-white transition-all cursor-pointer"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}

// Star / Nakshatra info map
const NAKSHATRA_INFO: Record<string, { raasi: string; pada: string; deity: string }> = {
  "Ardra / Thiruvathira": { raasi: "Mithunam (Gemini)", pada: "1–4", deity: "Rudra" },
  "Ashwini / Aswathi": { raasi: "Mesha (Aries)", pada: "1–4", deity: "Ashwini Kumaras" },
  "Rohini": { raasi: "Vrishabha (Taurus)", pada: "1–4", deity: "Brahma" },
  "Pushya / Pooyam": { raasi: "Karkata (Cancer)", pada: "1–4", deity: "Brihaspati" },
};

export default function AddStarDetails() {
   const router = useRouter();
  const [nakshatra, setNakshatra] = useState("Ardra / Thiruvathira");
  const [raasi, setRaasi] = useState("Mithunam (Gemini)");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-suggest raasi when nakshatra changes
  const handleNakshatraChange = (val: string) => {
    setNakshatra(val);
    const info = NAKSHATRA_INFO[val];
    if (info) setRaasi(info.raasi);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await saveStarDetails({
        nakshatra: mapNakshatra(nakshatra),
        raasi: mapRaasi(raasi),
      });
      router.push("/eating-habit");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not save star details. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const info = NAKSHATRA_INFO[nakshatra];

  return (
    <div className="flex h-full items-center font-sans flex-col px-4 py-2 sm:p-4" style={{
          background:
            "linear-gradient(160deg, #fff8f0 0%, #fff0f5 40%, #fdf4ff 100%)",
        }}>
        <div className="flex items-center justify-between mt-5 py-5 h-20 max-w-2xl mx-auto w-full">
         <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center hover:bg-pink-50 transition-colors"
            style={{ border: "1.5px solid #f0c0d0", background: "white" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-lg font-black text-gray-900">Star details</h1>
        </div>
        <button
          onClick={() => router.push("/eating-habit")}
          className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition-colors"
          style={{ color: "#c0174c", border: "1.5px solid #ffe0ea", background: "white" }}
        >
          Skip for now ›
        </button>
      </div>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-[#eeb5c6] shadow-lg p-4 sm:p-8 relative overflow-hidden">

        {/* Background decorations */}
        
        <div className="absolute -bottom-20 -left-16 w-44 h-44 rounded-full bg-sky-50 pointer-events-none" />
       

        {/* Icon + Heading */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <StarMandalaIcon />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">
              Add star details
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Your Nakshatra &amp; Raasi information
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Astral details
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3 mb-5">
          <SelectField
            label="Star / Nakshatra"
            value={nakshatra}
            onChange={handleNakshatraChange}
            options={NAKSHATRAS}
          />
          <SelectField
            label="Raasi (Zodiac Sign)"
            value={raasi}
            onChange={setRaasi}
            options={RAASIS}
          />
        </div>

        {/* Info pill — shown when nakshatra is known */}
        {info && (
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 mb-6">
            <span className="text-xl">✨</span>
            <div>
              <p className="text-xs font-semibold text-indigo-700">{nakshatra}</p>
              <p className="text-xs text-indigo-400 mt-0.5">
                Deity: {info.deity} &nbsp;·&nbsp; Pada: {info.pada}
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3.5 rounded-2xl text-white text-base font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #c0174c 0%, #c0174c 100%)" }}
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
        {errorMsg && (
          <p className="mt-3 text-xs text-red-500 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}