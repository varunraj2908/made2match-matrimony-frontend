"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveHoroscope, timeLabelToHHmm } from "@/services/profileService";

const ChevronIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden="true"
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlanetIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="7" stroke="#0EA5E9" strokeWidth="1.5" />
    <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#6366F1" strokeWidth="1.2" />
    <circle cx="10" cy="9" r="1" fill="#0EA5E9" opacity="0.6" />
    <circle cx="23" cy="22" r="1.2" fill="#6366F1" opacity="0.5" />
    <circle cx="25" cy="11" r="0.8" fill="#0EA5E9" opacity="0.4" />
  </svg>
);

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 hover:border-slate-300 hover:bg-white transition-all cursor-pointer"
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

export default function HoroscopeForm() {
  const router = useRouter();
  const [dob, setDob] = useState("01-Jan-1997");
  const [tob, setTob] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Andaman & Nicobar");
  const [city, setCity] = useState("Meroe-i (Nicobar)");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await saveHoroscope({
        dateOfBirth: dob || undefined,
        timeOfBirth: tob ? timeLabelToHHmm(tob) : undefined,
        birthCountry: country || undefined,
        birthState: state || undefined,
        birthCity: city || undefined,
      });
      router.push("/star-details");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not save horoscope details. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full items-center font-sans flex-col px-4 py-2 sm:p-4" style={{
          background:
            "linear-gradient(160deg, #fff8f0 0%, #fff0f5 40%, #fdf4ff 100%)",
        }}>
       <div className="flex items-center justify-between py-5 h-20 mt-5 max-w-2xl mx-auto w-full">
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
          <h1 className="text-lg font-black text-gray-900">Horoscope details</h1>
        </div>
        <button
          onClick={() => router.push("/star-details")}
          className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition-colors"
          style={{ color: "#c0174c", border: "1.5px solid #ffe0ea", background: "white" }}
        >
          Skip for now ›
        </button>
      </div>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-[#ffa9c4] shadow-lg p-4 sm:p-8 relative overflow-hidden">

        {/* Background decoration circle */}
      

        

        {/* Icon + Heading */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <PlanetIcon />
          </div>
          <div>
             <p className="font-black text-[#111827] text-base">
              Add horoscope details
            </p>
            <p className="text-slate-400 text-sm mt-0.5">
              Personalize your cosmic journey
            </p>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-slate-100 my-5" /> */}

        {/* Section: Birth Info */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c0174c] block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c0174c]">
            Birth information
          </span>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <SelectField
            label="Date of birth"
            value={dob}
            onChange={setDob}
            options={["01-Jan-1997", "15-Mar-1990", "22-Aug-2000"]}
          />

          <SelectField
            label="Time of birth"
            value={tob}
            onChange={setTob}
            options={["12:00 AM", "06:00 AM", "12:00 PM", "06:00 PM"]}
            placeholder="Select your time of birth"
          />
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-slate-100 my-5" /> */}

        {/* Section: Place of Birth */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c0174c] block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c0174c]">
            Place of birth
          </span>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <SelectField
            label="Country"
            value={country}
            onChange={setCountry}
            options={["India", "United States", "United Kingdom"]}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="State"
              value={state}
              onChange={setState}
              options={[
                "Andaman & Nicobar",
                "Kerala",
                "Maharashtra",
                "Tamil Nadu",
              ]}
            />
            <SelectField
              label="City"
              value={city}
              onChange={setCity}
              options={[
                "Meroe-i (Nicobar)",
                "Port Blair",
                "Kochi",
                "Mumbai",
              ]}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3.5 rounded-2xl text-white text-base font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #d4145a  0%, #d4145a  100%)",
          }}
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