// app/(auth)/onboarding/location-professional-details/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../OnboardingContext";
import { ActionBtn, BackBtn, Divider, educationList, FieldGroup, incomeList, PlainInput, professionList, SectionHeading, StyledSelect } from "../shared-components";
import {
  incomeLabelToAnnual,
  saveProfessionalDetails,
} from "@/services/profileService";


const countries = ["India","UAE","USA","UK","Canada","Australia","Singapore","Other"];
const statesByCountry: Record<string, string[]> = {
  India:   ["Kerala","Tamil Nadu","Karnataka","Andhra Pradesh","Maharashtra","Delhi","Gujarat","Punjab","Rajasthan","Other"],
  UAE:     ["Dubai","Abu Dhabi","Sharjah","Other"],
  USA:     ["California","New York","Texas","Florida","Other"],
  UK:      ["England","Scotland","Wales","Northern Ireland","Other"],
  default: ["Other"],
};

export default function LocationProfessionalPage() {
  const router = useRouter();
  const { formData, setFormData } = useOnboarding();
  const [err, setErr] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string) => (v: any) =>
    setFormData(d => ({ ...d, [k]: v }));

  const states = statesByCountry[formData.country] ?? statesByCountry.default;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.country)    e.country    = "Required";
    if (!formData.state)      e.state      = "Required";
    if (!formData.education)  e.education  = "Required";
    if (!formData.profession) e.profession = "Required";
    return e;
  };

  const handleContinue = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({});
    setSubmitting(true);
    try {
      await saveProfessionalDetails({
        country: formData.country,
        state: formData.state,
        city: formData.city || undefined,
        highestQualification: formData.education,
        occupation: formData.profession,
        annualIncome: formData.income
          ? incomeLabelToAnnual(formData.income)
          : undefined,
      });
      router.push("/onboarding/additional-details");
    } catch (ex: any) {
      const msg =
        ex?.response?.data?.message ||
        ex?.message ||
        "Could not save professional details. Please try again.";
      setErr({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 h-145 overflow-scroll px-2">
      <SectionHeading
        title="Location & Professional Details"
        subtitle="Where you live and what you do for work."
      />

      {/* Location */}
      <FieldGroup label="Country of residence" error={err.country}>
        <StyledSelect
          label="Country" value={formData.country}
          onChange={v => { set("country")(v); set("state")(""); }}
          options={countries} placeholder="Select country"
        />
      </FieldGroup>

      <FieldGroup label="State / Emirate / Province" error={err.state}>
        <StyledSelect
          label="State" value={formData.state} onChange={set("state")}
          options={states} placeholder="Select state"
        />
      </FieldGroup>

      <FieldGroup label="City / District" optional>
        <PlainInput placeholder="Enter your city" value={formData.city} onChange={set("city")} />
      </FieldGroup>

      {/* Professional */}
      <Divider label="Professional Information" />

      <FieldGroup label="Highest education" error={err.education}>
        <StyledSelect
          label="Education" value={formData.education} onChange={set("education")}
          options={educationList} placeholder="Select education"
        />
      </FieldGroup>

      <FieldGroup label="Profession / Employment" error={err.profession}>
        <StyledSelect
          label="Profession" value={formData.profession} onChange={set("profession")}
          options={professionList} placeholder="Select profession"
        />
      </FieldGroup>

      <FieldGroup label="Annual income" optional>
        <StyledSelect
          label="Income" value={formData.income} onChange={set("income")}
          options={incomeList} placeholder="Select income range"
        />
      </FieldGroup>

      {err.submit && (
        <p className="text-sm text-red-500">{err.submit}</p>
      )}

      {/* Nav */}
      <div className="flex gap-3 pt-2">
        <BackBtn onClick={() => router.push("/onboarding/personal-religious-details")} />
        <div className="flex-2">
          <ActionBtn
            onClick={handleContinue}
            label={submitting ? "Saving..." : "Continue →"}
            disabled={submitting}
          />
        </div>
      </div>
    </div>
  );
}