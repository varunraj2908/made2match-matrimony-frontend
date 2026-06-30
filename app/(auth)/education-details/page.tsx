"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveCollegeOrg } from "@/services/profileService";

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

const GraduationIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
    {/* Cap board */}
    <polygon
      points="20,8 36,16 20,24 4,16"
      stroke="#0EA5E9"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Left side of gown */}
    <path
      d="M10 18v10c0 4 4 6 10 6s10-2 10-6V18"
      stroke="#6366F1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Tassel string */}
    <line x1="36" y1="16" x2="36" y2="26" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />
    {/* Tassel end */}
    <circle cx="36" cy="28" r="2" fill="#0EA5E9" opacity="0.8" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
    <path
      d="M3 18V6l7-4 7 4v12M3 18h14M10 18v-5M7 9h2M11 9h2M7 13h2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CollegeIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
    <path
      d="M10 3L18 7l-8 4L2 7l8-4z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M5 9v5c0 2 2.5 3 5 3s5-1 5-3V9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="18" y1="7" x2="18" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

interface InputFieldProps {
  label: string;
  highlight: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

function InputField({ label, highlight, placeholder, value, onChange, icon }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-600 font-medium leading-snug">
        {label}{" "}
        <span className="text-sky-500 font-semibold">{highlight}</span>
      </label>
      <div
        className={`relative flex items-center rounded-xl border bg-slate-50 transition-all duration-200
          ${focused
            ? "border-sky-400 bg-white ring-2 ring-sky-100"
            : "border-slate-200 hover:border-slate-300 hover:bg-white"
          }`}
      >
        <span className="pl-4 pr-2.5 shrink-0">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full py-3.5 pr-4 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="pr-3 text-slate-300 hover:text-slate-500 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function EducationDetails() {
const router = useRouter();
  const [institution, setInstitution] = useState("");
  const [organization, setOrganization] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // These would typically come from props or a global state/context
  const educationField = "Aeronautical Engineering";
  const professionField = "Software Professional";

  const isValid = institution.trim().length > 0 || organization.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await saveCollegeOrg({
        collegeUniversity: institution.trim() || undefined,
        companyName: organization.trim() || undefined,
      });
      router.push("/specialoffer");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not save details. Please try again.",
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
        <div className="flex items-center justify-between py-5 max-w-2xl mt-5 mx-auto w-full">
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
          <h1 className="text-lg font-black text-gray-900">College & Organization</h1>
        </div>
        <button
          onClick={() => router.push("/specialoffer")}
          className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition-colors"
          style={{ color: "#c0174c", border: "1.5px solid #f0c0d0", background: "white" }}
        >
          Skip for now ›
        </button>
      </div>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-[#eeb5c6] shadow-lg p-4 sm:p-8 relative overflow-hidden">

        {/* Background decorations */}
       
        <div className="absolute -bottom-20 -left-16 w-44 h-44 rounded-full bg-indigo-50 pointer-events-none" />

       

        {/* Icon + Heading */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <GraduationIcon />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">
              Add college &amp; organization
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Share your education &amp; work details
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* Section label */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Institution &amp; workplace
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 mb-6">
          <InputField
            label="College where you studied"
            highlight={educationField}
            placeholder="Enter institution name"
            value={institution}
            onChange={setInstitution}
            icon={<CollegeIcon />}
          />
          <InputField
            label="Organization where you work"
            highlight={professionField}
            placeholder="Enter organization name"
            value={organization}
            onChange={setOrganization}
            icon={<BuildingIcon />}
          />
        </div>

        {/* Info tip */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-6">
          <span className="text-lg mt-0.5">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            Adding your institution and workplace helps build trust with potential matches and improves your profile visibility.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`w-full py-3.5 rounded-2xl text-base font-medium tracking-wide transition-all duration-200
            ${isValid
              ? "text-white hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
              : "text-slate-400 bg-slate-100 cursor-not-allowed"
            }
            ${submitting ? "opacity-60" : ""}`}
          style={
            isValid
              ? { background: "linear-gradient(135deg, #c0174c 0%, #c0174c 100%)" }
              : {}
          }
        >
          {submitting
            ? "Saving..."
            : isValid
              ? "Continue"
              : "Enter at least one detail"}
        </button>
        {errorMsg && (
          <p className="mt-3 text-xs text-red-500 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}