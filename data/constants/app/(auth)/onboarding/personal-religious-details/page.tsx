// app/(auth)/onboarding/personal-religious-details/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../OnboardingContext";
import { ActionBtn, BackBtn, castesByReligion, Checkbox, Divider, FieldGroup, heights, jathakamOptions, maritalOptions, physicalOptions, PillSelect, religions, SectionHeading, StyledSelect } from "../shared-components";
import {
  heightLabelToCm,
  mapMaritalStatus,
  mapPhysicalStatus,
  mapShudhajathakam,
  savePersonalDetails,
} from "@/services/profileService";


export default function PersonalReligiousPage() {
  const router = useRouter();
  const { formData, setFormData } = useOnboarding();
  const [err, setErr] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string) => (v: any) =>
    setFormData(d => ({ ...d, [k]: v }));

  const castes = castesByReligion[formData.religion] ?? castesByReligion.default;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.height)         e.height         = "Required";
    if (!formData.physicalStatus) e.physicalStatus  = "Required";
    if (!formData.maritalStatus)  e.maritalStatus   = "Required";
    if (!formData.religion)       e.religion        = "Required";
    if (!formData.caste)          e.caste           = "Required";
    if (!formData.jathakam)       e.jathakam        = "Required";
    return e;
  };

  const handleContinue = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({});
    setSubmitting(true);
    try {
      await savePersonalDetails({
        heightCm: heightLabelToCm(formData.height),
        physicalStatus: mapPhysicalStatus(formData.physicalStatus),
        maritalStatus: mapMaritalStatus(formData.maritalStatus),
        religion: formData.religion,
        caste: formData.caste,
        subcaste: formData.subcaste || undefined,
        willingToMarryAnyCaste: !!formData.anycaste,
        shudhajathakam: mapShudhajathakam(formData.jathakam),
      });
      router.push("/onboarding/location-professional-details");
    } catch (ex: any) {
      const msg =
        ex?.response?.data?.message ||
        ex?.message ||
        "Could not save personal details. Please try again.";
      setErr({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 h-145 overflow-scroll px-2">
      <SectionHeading
        title="Personal & Religious Details"
        subtitle="Tell us about your physical attributes and faith background."
      />

      {/* Personal */}
      <FieldGroup label="Your height" error={err.height}>
        <StyledSelect
          value={formData.height} onChange={set("height")}
          options={heights} placeholder="Select your height"
        />
      </FieldGroup>

      <FieldGroup label="Physical status" error={err.physicalStatus}>
        <PillSelect options={physicalOptions} value={formData.physicalStatus} onChange={set("physicalStatus")} />
      </FieldGroup>

      <FieldGroup label="Marital status" error={err.maritalStatus}>
        <PillSelect options={maritalOptions} value={formData.maritalStatus} onChange={set("maritalStatus")} />
      </FieldGroup>

      {/* Religious */}
      <Divider label="Religious Information" />

      <FieldGroup label="Religion" error={err.religion}>
        <StyledSelect
          label="Religion" value={formData.religion}
          onChange={v => { set("religion")(v); set("caste")(""); }}
          options={religions} placeholder="Select religion"
        />
      </FieldGroup>

      <FieldGroup label="Caste" error={err.caste}>
        <StyledSelect
          label="Caste" value={formData.caste} onChange={set("caste")}
          options={castes} placeholder="Select caste"
        />
      </FieldGroup>

      {/* Subcaste */}
       <FieldGroup label="Subcaste" >

      <div className="relative rounded-xl border-2 border-gray-200">
        <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-400">
          Subcaste <span className="text-gray-300 font-normal">(Optional)</span>
        </span>
        <input type="text" value={formData.subcaste}
          onChange={e => set("subcaste")(e.target.value)}
          placeholder="Enter subcaste"
          className="w-full px-4 py-3.5 text-sm outline-none rounded-xl bg-transparent text-gray-800"
        />
      </div>
       </FieldGroup>

      <Checkbox checked={formData.anycaste} onChange={set("anycaste")}
        label="Willing to marry from any caste" />

      <FieldGroup label="Do you have shudha jathakam?" error={err.jathakam}>
        <PillSelect options={jathakamOptions} value={formData.jathakam} onChange={set("jathakam")} />
      </FieldGroup>

      {err.submit && (
        <p className="text-sm text-red-500">{err.submit}</p>
      )}

      {/* Nav */}
      <div className="flex gap-3 pt-2 ">
        <BackBtn onClick={() => router.push("/onboarding/basic-details")} />
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