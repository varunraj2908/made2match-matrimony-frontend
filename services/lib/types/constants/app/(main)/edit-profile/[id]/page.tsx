"use client";

import { useEffect, useState } from "react";
import { getMyProfileFull, type FullProfile } from "@/services/profileService";

const NOT_SET = "Not Specified";

type InfoRow = {
  label: string;
  value: string;
  action?: string;
};

const friendly = (value?: string | number | null) => {
  if (value == null || value === "") return NOT_SET;
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const fullNameOf = (p: FullProfile | null) =>
  [p?.firstName, p?.lastName].filter(Boolean).join(" ") || NOT_SET;

const fmtHeight = (cm?: number) => {
  if (!cm) return NOT_SET;
  const totalInches = Math.round(cm / 2.54);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
};

const fmtIncome = (income?: number) => {
  if (income == null) return NOT_SET;
  if (income <= 0) return "No Income";
  const lakhs = income / 100000;
  return `Rs. ${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)} Lakhs`;
};

const fmtDate = (date?: string) => {
  if (!date) return NOT_SET;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? friendly(date)
    : parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

const fmtAgeRange = (min?: number, max?: number) =>
  min && max ? `${min}-${max} yrs` : min ? `${min}+ yrs` : max ? `Up to ${max} yrs` : NOT_SET;

const fmtHeightRange = (min?: number, max?: number) =>
  min && max ? `${fmtHeight(min)} - ${fmtHeight(max)}` : min ? `${fmtHeight(min)}+` : max ? `Up to ${fmtHeight(max)}` : NOT_SET;

function SectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-[#fff1f4] px-4 py-3">
      <span className="grid h-7 w-7 place-items-center rounded-full border border-[#d8a8b7] text-[#6b293c]">
        {icon}
      </span>
      <h2 className="text-xl font-bold text-black">{title}</h2>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3">
        <h3 className="font-serif text-lg font-bold text-black">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11.5 12 4l9 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10.5V21h13V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function DetailRows({ rows }: { rows: InfoRow[] }) {
  return (
    <div className="space-y-3 px-2 sm:px-4">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[180px_12px_minmax(0,1fr)] items-start gap-2 text-[15px] leading-6">
          <span className="text-black">{row.label}</span>
          <span className="text-black">:</span>
          {row.action ? (
            <button className="inline-flex w-fit items-center gap-2 font-semibold text-[#c0174c] hover:text-[#8f123a]">
              {row.action}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <strong className="font-bold text-black">{row.value}</strong>
          )}
        </div>
      ))}
    </div>
  );
}

function PreferenceGroup({ title, rows }: { title: string; rows: InfoRow[] }) {
  return (
    <section className="mb-7">
      <h3 className="mb-4 rounded-lg bg-[#fff1f4] px-4 py-3 text-lg font-bold text-black">{title}</h3>
      <DetailRows rows={rows} />
    </section>
  );
}

function AssistedBanner() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#efbfd0] bg-[#fff5f8] shadow-sm">
      <div className="grid gap-5 p-6 md:grid-cols-[1fr_210px] md:items-center">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d0054f] text-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="m12 3 2.2 4.5L19 8.2l-3.5 3.4.8 4.8L12 14.1l-4.3 2.3.8-4.8L5 8.2l4.8-.7L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#d0054f]">Made2Match Assisted Service</h2>
          </div>
          <p className="mb-5 text-lg font-semibold text-[#1f2a44]">
            Find your match <span className="text-[#d0054f]">3X Faster</span> with guided relationship support.
          </p>
          <div className="rounded-xl border border-[#f0c6d4] bg-white p-5">
            {[
              "Handpicked compatible matches",
              "Regular follow-ups with prospects",
              "Priority support from a relationship manager",
            ].map((item) => (
              <p key={item} className="mb-3 flex items-center gap-3 text-base font-semibold text-[#1f2a44] last:mb-0">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ffe8f0] text-[#d0054f]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </p>
            ))}
            <button className="mt-4 rounded-full bg-[#d0054f] px-6 py-2 text-base font-bold text-white shadow-sm hover:bg-[#b90444]">
              Get Relationship Manager
            </button>
          </div>
        </div>
        <div className="hidden rounded-2xl border border-[#f0c6d4] bg-white p-5 text-center md:block">
          <p className="font-serif text-4xl font-bold text-[#d0054f]">3X</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-[#1f2a44]">
            faster shortlisting with personal assistance
          </p>
          <div className="mx-auto mt-5 h-2 w-28 rounded-full bg-[#ffd6e3]" />
          <div className="mx-auto mt-2 h-2 w-20 rounded-full bg-[#d0054f]" />
        </div>
      </div>
    </section>
  );
}

export default function ProfilePreviewPage() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyProfileFull()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const name = fullNameOf(profile);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MM";
  const photo = profile?.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c0174c&color=fff&size=512`;
  const location = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(", ") || NOT_SET;
  const caste = profile?.caste
    ? `${profile.caste}${profile.willingToMarryAnyCaste ? " (Caste No Bar)" : ""}`
    : NOT_SET;
  const preference = profile?.partnerPreference;
  const partnerNoun = (profile?.gender || "").toUpperCase().startsWith("M") ? "Bride" : "Groom";
  const possessive = (profile?.gender || "").toUpperCase().startsWith("M") ? "His" : "Her";

  const profileCreatedFor = friendly(profile?.profileCreatedBy);
  const ageHeightLine = [
    profile?.age != null ? `${profile.age} Yrs` : "",
    profile?.heightCm ? `${fmtHeight(profile.heightCm)} / ${profile.heightCm} Cms` : "",
  ].filter(Boolean).join(", ") || NOT_SET;
  const religionLine = [
    friendly(profile?.religion) !== NOT_SET ? friendly(profile?.religion) : "",
    caste !== NOT_SET ? caste : "",
  ].filter(Boolean).join(", ") || NOT_SET;
  const educationJobLine = [
    friendly(profile?.highestQualification) !== NOT_SET ? friendly(profile?.highestQualification) : "",
    friendly(profile?.employedIn) !== NOT_SET ? friendly(profile?.employedIn) : friendly(profile?.occupation),
  ].filter(Boolean).join(", ") || NOT_SET;

  const personalInfo: InfoRow[] = [
    { label: "Age", value: profile?.age != null ? `${profile.age} Years` : NOT_SET },
    { label: "Height", value: fmtHeight(profile?.heightCm) },
    { label: "Mother Tongue", value: friendly(profile?.motherTongue) },
    { label: "Profile Created By", value: friendly(profile?.profileCreatedBy) },
    { label: "Marital Status", value: friendly(profile?.maritalStatus) },
    { label: "Lives In", value: location },
    { label: "Religion", value: friendly(profile?.religion) },
    { label: "Caste", value: caste },
    { label: "Subcaste", value: friendly(profile?.subcaste) },
    { label: "Date Of Birth", value: fmtDate(profile?.dateOfBirth) },
    { label: "Horoscope", value: "", action: "Send request" },
    { label: "Employment", value: friendly(profile?.employedIn) },
    { label: "Income", value: fmtIncome(profile?.annualIncome) },
    { label: "Education", value: friendly(profile?.highestQualification) },
    { label: "Occupation", value: friendly(profile?.occupation) },
  ];

  const familyInfo: InfoRow[] = [
    { label: "Family Type", value: friendly(profile?.familyType) },
    { label: "Family Status", value: friendly(profile?.familyStatus) },
    { label: "Father's Occupation", value: friendly(profile?.fatherOccupation) },
    { label: "Mother's Occupation", value: friendly(profile?.motherOccupation) },
    { label: "Brothers", value: profile?.noOfBrothers != null ? String(profile.noOfBrothers) : NOT_SET },
    { label: "Sisters", value: profile?.noOfSisters != null ? String(profile.noOfSisters) : NOT_SET },
  ];

  const lifestyleInfo: InfoRow[] = [
    { label: "Diet", value: friendly(profile?.diet) },
    { label: "Physical Status", value: friendly(profile?.physicalStatus) },
    { label: "Smoking Habits", value: friendly(profile?.smoking) },
    { label: "Drinking Habits", value: friendly(profile?.drinking) },
  ];

  const partnerPrefs = {
    basic: [
      { label: `Preferred ${partnerNoun}'s Age`, value: fmtAgeRange(preference?.minAge, preference?.maxAge) },
      { label: "Preferred Height", value: fmtHeightRange(preference?.minHeightCm, preference?.maxHeightCm) },
      { label: "Preferred Marital Status", value: friendly(preference?.preferredMaritalStatus) },
      { label: "Preferred Eating Habits", value: friendly(preference?.preferredDiet) },
      { label: "Preferred Smoking Habits", value: friendly(preference?.smokingAcceptable) },
      { label: "Preferred Drinking Habits", value: friendly(preference?.drinkingAcceptable) },
    ],
    religious: [
      { label: "Preferred Religion", value: friendly(preference?.preferredReligion) },
      { label: "Preferred Caste", value: preference?.casteNoBar ? "Any" : friendly(preference?.preferredCaste) },
      { label: "Preferred Star", value: "Any" },
      { label: "Preferred Dosham", value: "Doesn't Matter" },
    ],
    professional: [
      { label: "Preferred Education", value: friendly(preference?.preferredEducation) },
      { label: "Preferred Employment Type", value: "Any" },
      { label: "Preferred Occupation", value: friendly(preference?.preferredOccupation) },
      { label: "Preferred Annual Income", value: fmtIncome(preference?.minAnnualIncome) },
    ],
    location: [
      { label: "Preferred Country", value: friendly(preference?.preferredCountry) },
      { label: "Preferred Residing State", value: friendly(preference?.preferredState) },
      { label: "Preferred Residing City", value: "Any" },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {loading && (
          <div className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-[#c0174c] shadow-sm">
            Loading profile preview...
          </div>
        )}

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-[170px_minmax(0,1fr)]">
            <div>
              <div className="relative overflow-hidden rounded-xl border-2 border-[#d0054f] bg-[#c9c9c9]">
                {photoError ? (
                  <div className="grid aspect-square place-items-center bg-[#c0174c] text-5xl font-light text-white">{initials}</div>
                ) : (
                  <img
                    src={photo}
                    alt={name}
                    className="aspect-square w-full object-cover object-top"
                    onError={() => setPhotoError(true)}
                  />
                )}
              <div className="absolute bottom-2 right-2 rounded-full bg-[#d0054f] px-2 py-0.5 text-[10px] font-bold text-white">
                1
              </div>
            </div>
            </div>

            <div className="text-[15px] leading-7 text-[#1f2a44]">
              <h1 className="font-serif text-xl font-bold leading-tight text-black">{name}</h1>
              <p className="text-sm text-gray-600">Profile created for {profileCreatedFor}</p>
              <div className="mt-3 space-y-0.5">
                <p>{ageHeightLine}</p>
                <p>{religionLine}</p>
                <p>{location}</p>
                <p>{educationJobLine}</p>
              </div>
            </div>
          </div>
        </section>

        <h2 className="font-serif text-2xl font-bold text-[#d0054f]">Personal Information</h2>

        <SectionCard title="In my own words">
          <p className="text-sm leading-7 text-[#1f2a44]">{profile?.bio || NOT_SET}</p>
        </SectionCard>

        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <section>
              <SectionTitle title="Basic Details" icon={<UserIcon />} />
              <DetailRows rows={personalInfo} />
            </section>

            <section className="mt-7">
              <SectionTitle title="Family Information" icon={<HomeIcon />} />
              <DetailRows rows={familyInfo} />
            </section>

            <section className="mt-7">
              <SectionTitle title="About Myself" icon={<UserIcon />} />
              <p className="px-2 text-base leading-7 text-black sm:px-0">
                {profile?.bio || NOT_SET}
              </p>
            </section>

            <section className="mt-7">
              <SectionTitle title="Lifestyle" icon={<SparkIcon />} />
              <DetailRows rows={lifestyleInfo} />
            </section>

            <section className="mt-12">
              <div className="mb-7 flex items-center justify-center gap-4">
                <span className="text-2xl text-[#d677d5]">*</span>
                <h2 className="text-xl font-bold text-black">{possessive} Partner Preferences</h2>
                <span className="text-2xl text-[#d677d5]">*</span>
              </div>
              <PreferenceGroup title="Basic Preferences" rows={partnerPrefs.basic} />
              <PreferenceGroup title="Religious Preferences" rows={partnerPrefs.religious} />
              <PreferenceGroup title="Professional Preferences" rows={partnerPrefs.professional} />
              <PreferenceGroup title="Location Preferences" rows={partnerPrefs.location} />
            </section>

            <div className="mx-auto my-12 h-16 max-w-xl opacity-40">
              <svg viewBox="0 0 600 80" className="h-full w-full" fill="none">
                <path d="M20 40c70 35 130-20 230-10 80 8 90 44 130 16 26-18-2-53-28-24-22 24 14 60 64 30 54-32 100-34 164-12" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round" />
                <path d="M300 12c18 20 19 38 0 56-19-18-18-36 0-56Z" stroke="#9ca3af" strokeWidth="6" strokeLinejoin="round" />
              </svg>
            </div>

            <AssistedBanner />
        </div>
      </div>
    </main>
  );
}
