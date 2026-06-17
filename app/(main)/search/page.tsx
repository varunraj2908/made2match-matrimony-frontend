"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchProfiles,
  heightToCm,
  MARITAL_STATUS_MAP,
  PROFILE_CREATED_BY_MAP,
  parseProfileId,
  type SearchCriteria,
  type SearchResult,
} from "@/services/searchService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}

function Select({ value, onChange, options, disabled = false }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c0174c] appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

interface RangeSelectProps {
  fromVal: string;
  toVal: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  options: string[];
}

function RangeSelect({ fromVal, toVal, onFromChange, onToChange, options }: RangeSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <select value={fromVal} onChange={e => onFromChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none appearance-none cursor-pointer">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>
      <span className="text-sm text-gray-500 shrink-0">to</span>
      <div className="relative flex-1">
        <select value={toVal} onChange={e => onToChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none appearance-none cursor-pointer">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-5 py-3 rounded-t-xl font-semibold text-sm text-white" style={{ background: "#c0174c" }}>
      {title}
    </div>
  );
}

function ViewToggle({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="flex items-center gap-1 text-sm font-semibold mt-3 hover:opacity-75 transition"
      style={{ color: "#c0174c" }}>
      {expanded ? "View less" : "View more"}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function PremiumLock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="relative rounded-xl border border-gray-200 overflow-hidden my-4">
      {/* Lock icon top center */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2" className="w-4 h-4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
      </div>
      {/* Blurred fields */}
      <div className="blur-sm pointer-events-none px-5 pt-8 pb-4 space-y-3">
        <div className="grid grid-cols-[180px_1fr] items-center gap-4">
          <span className="text-sm text-gray-400">Star</span>
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
        <div className="grid grid-cols-[180px_1fr] items-center gap-4">
          <span className="text-sm text-gray-400">Profiles with Horoscope</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-gray-300 rounded" />
            <span className="text-sm text-gray-400">Matches who have added horoscope</span>
          </div>
        </div>
      </div>
      {/* Overlay CTA */}
      <div className="flex items-center justify-center gap-4 px-5 py-4 border-t border-gray-100" style={{ background: "#fafafa" }}>
        <span className="text-sm text-gray-600">To access these premium filters</span>
        <button onClick={onUpgrade}
          className="px-5 py-2 rounded-full text-white text-sm font-bold hover:opacity-90 transition hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}>
          Become a paid member
        </button>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div onClick={() => onChange(!checked)}
        className="w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 transition-colors"
        style={{ borderColor: checked ? "#c0174c" : "#d1d5db", background: checked ? "#c0174c" : "white" }}>
        {checked && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><path d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}

// ─── Main Search Page ─────────────────────────────────────────────────────────

export default function SearchPage() {
  const [tab, setTab] = useState("criteria");
  const [profileIdInput, setProfileIdInput] = useState("");

  // Basic
  const [ageFrom, setAgeFrom] = useState("20");
  const [ageTo, setAgeTo] = useState("33");
  const [heightFrom, setHeightFrom] = useState("4'6\"");
  const [heightTo, setHeightTo] = useState("5'6\"");
  const [profileCreatedBy, setProfileCreatedBy] = useState("Any");
  const [maritalStatus, setMaritalStatus] = useState("Never Married");
  const [motherTongue, setMotherTongue] = useState("Any");
  const [physicalStatus, setPhysicalStatus] = useState("Normal");
  const [basicExpanded, setBasicExpanded] = useState(true);

  // Religious
  const [religion, setReligion] = useState("Hindu");
  const [caste, setCaste] = useState("Ezhava, Caste no bar");
  const [subcaste, setSubcaste] = useState("Any");
  const [dosha, setDosha] = useState("Doesn't Matter");

  // Professional
  const [occupation, setOccupation] = useState("Any");
  const [incomeFrom, setIncomeFrom] = useState("Any");
  const [incomeTo, setIncomeTo] = useState("Any");
  const [employment, setEmployment] = useState("Any");
  const [education, setEducation] = useState("Any");
  const [profExpanded, setProfExpanded] = useState(true);

  // Location
  const [nearbyProfiles, setNearbyProfiles] = useState(false);
  const [country, setCountry] = useState("Any");
  const [citizenship, setCitizenship] = useState("Any");
  const [locationExpanded, setLocationExpanded] = useState(true);

  // Lifestyle
  const [mutualHobbies, setMutualHobbies] = useState(false);
  const [eatingHabits, setEatingHabits] = useState("Vegetarian, Eggetarian");
  const [smokingHabits, setSmokingHabits] = useState("Doesn't Matter");
  const [drinkingHabits, setDrinkingHabits] = useState("Doesn't Matter");
  const [lifestyleExpanded, setLifestyleExpanded] = useState(true);

  // Family
  const [familyStatus, setFamilyStatus] = useState("Any");
  const [familyValue, setFamilyValue] = useState("Any");
  const [familyType, setFamilyType] = useState("Any");
  const [familyExpanded, setFamilyExpanded] = useState(true);

  // Recently active
  const [profileCreated, setProfileCreated] = useState("All");

  // Profile type
  const [profilesWithPhoto, setProfilesWithPhoto] = useState(false);
  const [dontShow, setDontShow] = useState("Ignored, Shortlisted");

  const ages = Array.from({ length: 30 }, (_, i) => String(18 + i));
  const heights = ["4'0\"","4'6\"","4'8\"","4'10\"","5'0\"","5'2\"","5'4\"","5'6\"","5'8\"","5'10\"","6'0\"","6'2\""];
  const incomeOptions = ["Any","1L","2L","3L","5L","7L","10L","15L","20L","25L+"];

  // ─── Search API wiring ──────────────────────────────────────────
  const router = useRouter();
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const buildCriteria = (): SearchCriteria => {
    const c: SearchCriteria = {};
    const minA = parseInt(ageFrom, 10);
    const maxA = parseInt(ageTo, 10);
    if (!Number.isNaN(minA)) c.minAge = minA;
    if (!Number.isNaN(maxA)) c.maxAge = maxA;
    const minH = heightToCm(heightFrom);
    const maxH = heightToCm(heightTo);
    if (minH) c.minHeightCm = minH;
    if (maxH) c.maxHeightCm = maxH;
    if (religion && religion !== "Any") c.religion = religion;
    if (MARITAL_STATUS_MAP[maritalStatus]) c.maritalStatus = MARITAL_STATUS_MAP[maritalStatus];
    if (education && education !== "Any") c.education = education;
    if (PROFILE_CREATED_BY_MAP[profileCreatedBy]) c.profileCreatedBy = PROFILE_CREATED_BY_MAP[profileCreatedBy];
    if (profilesWithPhoto) c.withPhotos = true;
    return c;
  };

  const runSearch = async (p = 0) => {
    setSearching(true);
    setSearchErr(null);
    try {
      const r = await searchProfiles(buildCriteria(), p, 12);
      setResults((prev) =>
        p > 0 && prev ? { ...r, items: [...prev.items, ...r.items] } : r,
      );
      setPageNum(p);
      setTotalCount(r.totalElements);
    } catch (e) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Search failed. Please try again.";
      setSearchErr(msg);
      if (p === 0) setResults({ items: [], totalElements: 0, totalPages: 0, page: 0 });
    } finally {
      setSearching(false);
    }
  };

  const resetFilters = () => {
    setAgeFrom("20"); setAgeTo("33");
    setHeightFrom("4'6\""); setHeightTo("5'6\"");
    setProfileCreatedBy("Any"); setMaritalStatus("Never Married");
    setReligion("Hindu"); setEducation("Any");
    setProfilesWithPhoto(false);
    setResults(null);
    setSearchErr(null);
  };

  const searchByProfileId = () => {
    const id = parseProfileId(profileIdInput);
    if (id) router.push(`/profiles/${id}`);
    else setSearchErr("Please enter a valid Profile ID (e.g. GM002341).");
  };

  // Initial match count for the bottom bar (no filters).
  useEffect(() => {
    searchProfiles({}, 0, 1)
      .then((r) => setTotalCount(r.totalElements))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
     

      <div className="max-w-5xl mx-auto px-4 py-6 pb-6 lg:pb-28">

        {/* Tabs */}
        <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          <div className="flex border-b border-white bg-[#9c0736]">
            {[["criteria","By Criteria"],["profile","By Profile ID"],["saved","Saved Search"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className="relative px-6 py-4 text-sm font-semibold transition-colors"
                style={{ color: tab === key ? "white" : "#cdcfd4" }}>
                {label}
                {key === "saved" && (
                  <span className="ml-1 text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "#fff0f4", color: "#c0174c" }}>0</span>
                )}
                {tab === key && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "white" }} />}
              </button>
            ))}
          </div>

          {tab === "profile" && (
            <div className="px-6 py-6">
              <p className="text-sm text-gray-600 mb-4">Enter a Matrimony ID to search for a specific profile.</p>
              <div className="flex gap-3">
                <input value={profileIdInput} onChange={e => setProfileIdInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") searchByProfileId(); }}
                  placeholder="Enter Profile ID e.g. GM002341"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
                <button onClick={searchByProfileId}
                  className="px-6 py-2.5 rounded-lg text-white text-sm font-bold hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}>
                  Search
                </button>
              </div>
              {searchErr && tab === "profile" && (
                <p className="text-sm text-red-500 mt-3">{searchErr}</p>
              )}
            </div>
          )}

          {tab === "saved" && (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">No saved searches yet.</div>
          )}

          {tab === "criteria" && (
            <div className="px-6 py-4">
              <p className="text-sm font-semibold text-gray-700 mb-4">Search profiles using the below criteria</p>
            </div>
          )}
        </div>

        {tab === "criteria" && (
          <div className="space-y-4">

            {/* ── Basic Details ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Basic Details" />
              <div className="px-5 py-2">
                <FieldRow label="Age">
                  <RangeSelect fromVal={ageFrom} toVal={ageTo} onFromChange={setAgeFrom} onToChange={setAgeTo} options={ages} />
                </FieldRow>
                <FieldRow label="Height">
                  <RangeSelect fromVal={heightFrom} toVal={heightTo} onFromChange={setHeightFrom} onToChange={setHeightTo} options={heights} />
                </FieldRow>
                <FieldRow label="Profile Created By">
                  <div className="relative">
                    <Select value={profileCreatedBy} onChange={setProfileCreatedBy} options={["Any","Self","Parents","Siblings","Friends"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                <FieldRow label="Marital Status">
                  <div className="relative">
                    <Select value={maritalStatus} onChange={setMaritalStatus} options={["Never Married","Divorced","Widowed","Separated","Awaiting Divorce"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                {basicExpanded && (
                  <>
                    <FieldRow label="Mother Tongue">
                      <div className="relative">
                        <Select value={motherTongue} onChange={setMotherTongue} options={["Any","Malayalam","Tamil","Telugu","Kannada","Hindi"]} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                      </div>
                    </FieldRow>
                    <FieldRow label="Physical Status">
                      <div className="relative">
                        <Select value={physicalStatus} onChange={setPhysicalStatus} options={["Normal","Differently Abled"]} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                      </div>
                    </FieldRow>
                  </>
                )}
                <ViewToggle expanded={basicExpanded} onToggle={() => setBasicExpanded(p => !p)} />
              </div>
            </div>

            {/* ── Religious Details ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Religious Details" />
              <div className="px-5 py-2">
                <FieldRow label="Religion">
                  <div className="relative">
                    <Select value={religion} onChange={setReligion} options={["Hindu","Muslim","Christian","Sikh","Buddhist","Jain","Other"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                <FieldRow label="Caste">
                  <div className="relative">
                    <Select value={caste} onChange={setCaste} options={["Ezhava, Caste no bar","Nair","Brahmin","Any","Caste no bar"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                <FieldRow label="Subcaste">
                  <div className="relative">
                    <Select value={subcaste} onChange={setSubcaste} options={["Any"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                {/* Premium Lock */}
                <PremiumLock onUpgrade={() => {}} />
                <FieldRow label="Dosha(m)">
                  <div className="relative">
                    <Select value={dosha} onChange={setDosha} options={["Doesn't Matter","Yes","No"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
              </div>
            </div>

            {/* ── Professional Details ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Professional Details" />
              <div className="px-5 py-2">
                <FieldRow label="Occupation">
                  <div className="relative">
                    <Select value={occupation} onChange={setOccupation} options={["Any","Engineer","Doctor","Teacher","Business","Government","IT Professional","Other"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                <FieldRow label="Annual Income">
                  <RangeSelect fromVal={incomeFrom} toVal={incomeTo} onFromChange={setIncomeFrom} onToChange={setIncomeTo} options={incomeOptions} />
                </FieldRow>
                <FieldRow label="Employment Type">
                  <div className="relative">
                    <Select value={employment} onChange={setEmployment} options={["Any","Private","Government","Business","Self Employed","Not Working"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                {profExpanded && (
                  <FieldRow label="Education">
                    <div className="relative">
                      <Select value={education} onChange={setEducation} options={["Any","Graduate","Post Graduate","Doctorate","Diploma","Other"]} />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </FieldRow>
                )}
                {/* Premium Lock */}
                <div className="relative rounded-xl border border-gray-200 overflow-hidden my-4">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2" className="w-4 h-4">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                  </div>
                  <div className="blur-sm pointer-events-none px-5 pt-8 pb-4 space-y-3">
                    <div className="grid grid-cols-[180px_1fr] gap-4">
                      <span className="text-sm text-gray-400">Institution Details</span>
                      <div className="h-10 bg-gray-100 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-4">
                      <span className="text-sm text-gray-400">Organisation Details</span>
                      <div className="h-10 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 px-5 py-4 border-t border-gray-100" style={{ background: "#fafafa" }}>
                    <span className="text-sm text-gray-600">To access these premium filters</span>
                    <button className="px-5 py-2 rounded-full text-white text-sm font-bold hover:opacity-90 transition"
                      style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}>
                      Become a paid member
                    </button>
                  </div>
                </div>
                <ViewToggle expanded={profExpanded} onToggle={() => setProfExpanded(p => !p)} />
              </div>
            </div>

            {/* ── Location Details ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Location Details" />
              <div className="px-5 py-2">
                <FieldRow label="Nearby Profiles">
                  <Checkbox checked={nearbyProfiles} onChange={setNearbyProfiles} label="Matches near your location" />
                </FieldRow>
                <FieldRow label="Country">
                  <div className="relative">
                    <Select value={country} onChange={setCountry} options={["Any","India","USA","UAE","UK","Canada","Australia","Other"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                {locationExpanded && (
                  <FieldRow label="Citizenship">
                    <div className="relative">
                      <Select value={citizenship} onChange={setCitizenship} options={["Any","Indian","NRI","PIO"]} />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </FieldRow>
                )}
                <ViewToggle expanded={locationExpanded} onToggle={() => setLocationExpanded(p => !p)} />
              </div>
            </div>

            {/* ── Lifestyle ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Lifestyle" />
              <div className="px-5 py-2">
                <FieldRow label="Mutual Hobbies">
                  <Checkbox checked={mutualHobbies} onChange={setMutualHobbies} label="Matches who have similar hobbies as you" />
                </FieldRow>
                <FieldRow label="Eating Habits">
                  <div className="relative">
                    <Select value={eatingHabits} onChange={setEatingHabits} options={["Any","Vegetarian","Non Vegetarian","Eggetarian","Vegetarian, Eggetarian"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                {lifestyleExpanded && (
                  <>
                    <FieldRow label="Smoking Habits">
                      <div className="relative">
                        <Select value={smokingHabits} onChange={setSmokingHabits} options={["Doesn't Matter","Does not smoke","Smokes occasionally","Smokes regularly"]} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                      </div>
                    </FieldRow>
                    <FieldRow label="Drinking Habits">
                      <div className="relative">
                        <Select value={drinkingHabits} onChange={setDrinkingHabits} options={["Doesn't Matter","Does not drink","Drinks occasionally","Drinks regularly"]} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                      </div>
                    </FieldRow>
                  </>
                )}
                <ViewToggle expanded={lifestyleExpanded} onToggle={() => setLifestyleExpanded(p => !p)} />
              </div>
            </div>

            {/* ── Family Details ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Family Details" />
              <div className="px-5 py-2">
                <FieldRow label="Family Status">
                  <div className="relative">
                    <Select value={familyStatus} onChange={setFamilyStatus} options={["Any","Middle Class","Upper Middle Class","Rich","Affluent"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                <FieldRow label="Family Value">
                  <div className="relative">
                    <Select value={familyValue} onChange={setFamilyValue} options={["Any","Orthodox","Traditional","Moderate","Liberal"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
                {familyExpanded && (
                  <FieldRow label="Family Type">
                    <div className="relative">
                      <Select value={familyType} onChange={setFamilyType} options={["Any","Joint Family","Nuclear Family"]} />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </FieldRow>
                )}
                <ViewToggle expanded={familyExpanded} onToggle={() => setFamilyExpanded(p => !p)} />
              </div>
            </div>

            {/* ── Recently Active Profiles ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Recently active profiles" />
              <div className="px-5 py-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Profile Created</p>
                <p className="text-xs text-gray-400 mb-3">Profiles based on created date</p>
                <div className="flex flex-wrap gap-2">
                  {["All","Today","Last 3 days","One week","One month"].map(d => (
                    <button key={d} onClick={() => setProfileCreated(d)}
                      className="px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:scale-105"
                      style={{
                        background: profileCreated === d ? "linear-gradient(135deg, #c0174c, #8b0f38)" : "white",
                        borderColor: profileCreated === d ? "#c0174c" : "#d1d5db",
                        color: profileCreated === d ? "white" : "#374151",
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Profile Type ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <SectionHeader title="Profile Type" />
              <div className="px-5 py-2">
                <FieldRow label="Profiles with Photo">
                  <Checkbox checked={profilesWithPhoto} onChange={setProfilesWithPhoto} label="Matches who have added photos" />
                </FieldRow>
                <FieldRow label="Don't show profiles">
                  <div className="relative">
                    <Select value={dontShow} onChange={setDontShow} options={["Ignored, Shortlisted","Ignored","Shortlisted","None"]} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </FieldRow>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Sticky Bottom Bar ── */}
      {tab === "criteria" && (
        <div className="static lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-40 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-4 border-t border-gray-100 lg:shadow-xl"
          style={{ background: "white" }}>
          <p className="text-sm font-semibold text-gray-700">
            <span className="font-black text-base" style={{ color: "#c0174c" }}>
              {totalCount != null ? totalCount.toLocaleString() : "—"}
            </span>
            <span className="text-gray-500 ml-1">matches based on your preferences</span>
          </p>
          <div className="flex gap-3">
            <button onClick={resetFilters}
              className="px-6 py-2.5 rounded-full border text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              style={{ borderColor: "#d1d5db" }}>
              Reset
            </button>
            <button onClick={() => runSearch(0)} disabled={searching}
              className="px-8 py-2.5 rounded-full text-white text-sm font-bold hover:opacity-90 transition hover:scale-105 active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)", boxShadow: "0 4px 14px rgba(192,23,76,0.4)" }}>
              {searching ? "Searching…" : "Search"}
            </button>
          </div>
        </div>
      )}

      {/* ── Results overlay ── */}
      {results && (
        <div className="fixed inset-0 z-[1500] bg-gray-50 overflow-y-auto">
          {/* Results header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-100 bg-white shadow-sm">
            <button onClick={() => setResults(null)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#c0174c] transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Modify search
            </button>
            <p className="text-sm font-semibold text-gray-700">
              <span className="font-black text-base" style={{ color: "#c0174c" }}>
                {results.totalElements.toLocaleString()}
              </span>
              <span className="text-gray-500 ml-1">profiles found</span>
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-6">
            {searchErr && (
              <p className="text-sm text-red-500 mb-4">{searchErr}</p>
            )}

            {results.items.length === 0 && !searching ? (
              <div className="text-center text-gray-400 py-20">
                No profiles match your criteria. Try widening your filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.items.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/profiles/${p.id}`)}
                    className="text-left bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-[#c0174c]/30 transition group"
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {p.isPremium && (
                        <span className="absolute top-2 left-2 bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          PRIME
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {[p.age ? `${p.age} yrs` : null, p.height].filter(Boolean).join(", ") || "—"}
                      </p>
                      {p.location && (
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{p.location}</p>
                      )}
                      {p.profession && (
                        <p className="text-[11px] text-[#c0174c] truncate mt-0.5">{p.profession}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Load more */}
            {results.items.length > 0 && results.items.length < results.totalElements && (
              <div className="flex justify-center mt-8">
                <button onClick={() => runSearch(pageNum + 1)} disabled={searching}
                  className="px-8 py-2.5 rounded-full text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}>
                  {searching ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}