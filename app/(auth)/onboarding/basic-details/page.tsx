// app/(auth)/onboarding/basic-details/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../OnboardingContext";
import { ActionBtn, days, FieldGroup, months, motherTongues, PlainInput, SectionHeading, StyledSelect, years } from "../shared-components";


export default function BasicDetailsPage() {
  const router = useRouter();
  const { formData, setFormData } = useOnboarding();
  const [err, setErr] = useState<Record<string, string>>({});

  const set = (k: string) => (v: any) =>
    setFormData(d => ({ ...d, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.day || !formData.month || !formData.year)
      e.dob = "Please select your date of birth";
    if (!formData.motherTongue) e.motherTongue = "Required";
    if (!formData.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email address";
    if (!formData.password.trim()) e.password = "Required";
    else if (formData.password.length < 8 || formData.password.length > 20)
      e.password = "Must be 8–20 characters";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    router.push("/onboarding/personal-religious-details");
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Basic Details"
        subtitle="Let's start with some basic information about you."
      />

      {/* Date of birth */}
      <FieldGroup label="Date of birth" error={err.dob}>
        <div className="grid grid-cols-3 gap-3">
          {([
            { key: "day",   placeholder: "Day",   opts: days   },
            { key: "month", placeholder: "Month", opts: months },
            { key: "year",  placeholder: "Year",  opts: years  },
          ] as const).map(({ key, placeholder, opts }) => (
            <div key={key} className="relative rounded-xl border-2 transition-all"
              style={{ borderColor: (formData as any)[key] ? "#c0174c" : "#e5e7eb" }}>
              <select
                value={(formData as any)[key]}
                onChange={e => set(key)(e.target.value)}
                className="w-full px-3 py-3.5 text-sm bg-transparent outline-none appearance-none cursor-pointer rounded-xl"
                style={{ color: (formData as any)[key] ? "#1f2937" : "#9ca3af" }}>
                <option value="">{placeholder}</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ))}
        </div>
      </FieldGroup>

      {/* Mother tongue */}
      <FieldGroup label="Mother tongue" error={err.motherTongue} isHeight='h-22'>
        <StyledSelect
          label="Mother tongue"
          value={formData.motherTongue}
          onChange={set("motherTongue")}
          options={motherTongues}
          placeholder="Select mother tongue"
        />
      </FieldGroup>

     

      <ActionBtn onClick={handleContinue} label="Continue →" />
    </div>
  );
}