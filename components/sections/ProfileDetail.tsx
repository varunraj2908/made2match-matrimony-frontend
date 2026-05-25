

"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileData {
  id: string;
  name: string;
  age: number;
  height: string;
  weight: string;
  religion: string;
  caste: string;
  subCaste: string;
  location: string;
  education: string;
  profession: string;
  annualIncome: string;
  lastLogin: string;
  photo: string;
  photos: string[];
  about: string;
  bodyType: string;
  complexion: string;
  physicalStatus: string;
  eatingHabits: string;
  drinkingHabits: string;
  smokingHabits: string;
  motherTongue: string;
  maritalStatus: string;
  chatStatus: string;
  callStatus: string;
  sendMail: string;
  country: string;
  state: string;
  citizenship: string;
  city: string;
  educationDetail: string;
  employedIn: string;
  occupationType: string;
  occupationDetail: string;
  dob: string;
  birthPlace: string;
  timeOfBirth: string;
  manglik: string;
  star: string;
  raasi: string;
  gothram: string;
  dosh: string;
  socialLinks: { icon: string; color: string }[];
  partnerPreferences: {
    ageFrom: number;
    ageTo: number;
    heightFrom: string;
    heightTo: string;
    maritalStatus: string;
    physicalStatus: string;
    eatingHabits: string;
    drinkingHabits: string;
    smokingHabits: string;
    education: string;
    occupation: string;
    annualIncome: string;
    country: string;
    state: string;
    citizenship: string;
    city: string;
    religion: string;
    caste: string;
    subCaste: string;
    star: string;
    raasi: string;
    gothram: string;
    dosh: string;
    motherTongue: string;
    aboutPartner: string;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROFILE: ProfileData = {
  id: "GM001247",
  name: "Lorem Ipsum",
  age: 20,
  height: "5'1 In",
  weight: "45 Kgs / 99 lbs",
  religion: "Hindu – Brahmin",
  caste: "Sharma",
  subCaste: "Brahmin Pundait / Brahmin",
  location: "India / Up / Lucknow",
  education: "Accounts / Finance",
  profession: "Accounts / Finance",
  annualIncome: "2 – 3 Lakhs",
  lastLogin: "1 hour ago",
  photo: "https://randomuser.me/api/portraits/women/44.jpg",
  photos: [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/women/45.jpg",
    "https://randomuser.me/api/portraits/women/46.jpg",
    "https://randomuser.me/api/portraits/women/47.jpg",
    "https://randomuser.me/api/portraits/women/48.jpg",
    "https://randomuser.me/api/portraits/women/49.jpg",
    "https://randomuser.me/api/portraits/women/50.jpg",
    "https://randomuser.me/api/portraits/women/51.jpg",
  ],
  about:
    "My daughter is a Manager with a Master's degree currently working in Private sector in Gurgaon. We come from a Middle class, Nuclear family background with traditional values.",
  bodyType: "Slim",
  complexion: "Fair",
  physicalStatus: "Normal",
  eatingHabits: "Vegetarian",
  drinkingHabits: "Never drinks",
  smokingHabits: "Never smokes",
  motherTongue: "Hindi",
  maritalStatus: "Never married",
  chatStatus: "Online",
  callStatus: "Online",
  sendMail: "Online",
  country: "India",
  state: "Uttar Pradesh",
  citizenship: "Indian",
  city: "Lucknow",
  educationDetail: "MBA (Sales/b)",
  employedIn: "Private Sector",
  occupationType: "Manager",
  occupationDetail: "Asst.Manager (HR)",
  dob: "2007/90",
  birthPlace: "India",
  timeOfBirth: "22:33 hrs",
  manglik: "No",
  star: "Hasta / Hastya / Kanya (Virgo)",
  raasi: "Hastya / Kanya (Virgo)",
  gothram: "Not Specified",
  dosh: "Not Specified",
  socialLinks: [
    { icon: "f", color: "#1877F2" },
    { icon: "in", color: "#0A66C2" },
    { icon: "t", color: "#1DA1F2" },
    { icon: "y", color: "#FF0000" },
    { icon: "g", color: "#34A853" },
  ],
  partnerPreferences: {
    ageFrom: 27,
    ageTo: 32,
    heightFrom: "5'4 In",
    heightTo: "6'2 In",
    maritalStatus: "Never married",
    physicalStatus: "Normal",
    eatingHabits: "Doesn't matter",
    drinkingHabits: "Prefer someone who never drinks",
    smokingHabits: "Prefer someone who never smokes",
    education: "Any Engineering / Computers...",
    occupation: "Any Occupation",
    annualIncome: "Any Annual Income",
    country: "India",
    state: "Uttar Pradesh, Bhojpur, Bihar...",
    citizenship: "Indian",
    city: "Lucknow",
    religion: "Hindu",
    caste: "Nai / nai/Brahmin, bhoi...",
    subCaste: "Nai / (Nai/Brahmin/bhoi/gotthu)",
    star: "Hasta / Hastya / Kanya (Virgo)",
    raasi: "Hastya / Kanya (Virgo)",
    gothram: "Not Specified",
    dosh: "Not Specified",
    motherTongue: "Hindi",
    aboutPartner:
      "My groom is a Manager with a Master's degree currently working in Private sector in Gurgaon. We come from a Middle class, Nuclear family background with traditional values.",
  },
};

// ─── Photo Slider ─────────────────────────────────────────────────────────────
const PhotoSlider = ({ photos, name }: { photos: string[]; name: string }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [thumbStart, setThumbStart] = useState(0);
  const THUMB_VISIBLE = 5;

  const prev = useCallback(() => setActive((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  useEffect(() => {
    if (active < thumbStart) setThumbStart(active);
    if (active >= thumbStart + THUMB_VISIBLE) setThumbStart(active - THUMB_VISIBLE + 1);
  }, [active, thumbStart]);

  const visibleThumbs = photos.slice(thumbStart, thumbStart + THUMB_VISIBLE);

  return (
    <>
      <div className="shrink-0 w-full sm:w-48">
        {/* Main Image */}
        <div
          className="relative w-full sm:w-48 h-56 rounded-lg overflow-hidden border-2 border-[#f5d0d7] shadow-md group cursor-pointer"
          onClick={() => setLightbox(true)}
        >
          <img
            src={photos[active]}
            alt={`${name} photo ${active + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/192x224?text=No+Photo"; }}
          />
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#b22234] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#b22234] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          >›</button>
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">
            {active + 1}/{photos.length}
          </div>
          <div className="absolute top-1.5 right-1.5 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            🔍 View
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
              disabled={thumbStart === 0}
              className="text-gray-400 hover:text-[#b22234] disabled:opacity-20 text-sm font-bold leading-none"
            >‹</button>
            <div className="flex gap-1 flex-1 justify-center">
              {visibleThumbs.map((photo, idx) => {
                const realIdx = thumbStart + idx;
                return (
                  <button
                    key={realIdx}
                    onClick={() => setActive(realIdx)}
                    className={`w-8 h-8 rounded overflow-hidden border-2 transition-all shrink-0 ${
                      active === realIdx
                        ? "border-[#b22234] scale-110 shadow-md"
                        : "border-gray-200 hover:border-[#b22234] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`thumb ${realIdx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/32?text=?"; }}
                    />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setThumbStart((s) => Math.min(photos.length - THUMB_VISIBLE, s + 1))}
              disabled={thumbStart + THUMB_VISIBLE >= photos.length}
              className="text-gray-400 hover:text-[#b22234] disabled:opacity-20 text-sm font-bold leading-none"
            >›</button>
          </div>
          <div className="flex justify-center gap-1 mt-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all ${
                  active === i ? "w-3 h-1.5 bg-[#b22234]" : "w-1.5 h-1.5 bg-gray-300 hover:bg-[#b22234]"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-1.5">📸 {photos.length} Photos</p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-[#b22234] transition-colors z-10"
            onClick={() => setLightbox(false)}
          >✕</button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#b22234] text-white w-10 h-10 rounded-full text-xl flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >‹</button>
          <div className="relative max-w-2xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[active]}
              alt={`${name} photo ${active + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500?text=No+Photo"; }}
            />
            <div className="text-white text-center text-xs mt-3 opacity-70">
              {active + 1} / {photos.length} — Press ← → to navigate, Esc to close
            </div>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#b22234] text-white w-10 h-10 rounded-full text-xl flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >›</button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className={`w-10 h-10 rounded overflow-hidden border-2 transition-all ${
                  active === i ? "border-[#b22234] scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={photo} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#b22234]">
    <span className="text-base">{icon}</span>
    <h3 className="text-base font-bold text-[#b22234] tracking-wide">{title}</h3>
  </div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 w-36 shrink-0 font-medium">{label}</span>
    <span className="text-xs text-gray-800 flex-1">{value || "Not Specified"}</span>
  </div>
);

// ─── Two-Column Details ───────────────────────────────────────────────────────
const TwoColDetails = ({
  left,
  right,
}: {
  left: { label: string; value: string }[];
  right: { label: string; value: string }[];
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
    <div>{left.map((r) => <DetailRow key={r.label} {...r} />)}</div>
    <div>{right.map((r) => <DetailRow key={r.label} {...r} />)}</div>
  </div>
);

// ─── Sidebar (desktop only) ───────────────────────────────────────────────────
const Sidebar = () => (
  <aside className="hidden lg:block w-56 shrink-0 space-y-3">
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#b22234] text-white px-4 py-3 font-semibold text-sm">Filter Profiles</div>

      {/* Country */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 bg-orange-50">
          <span className="flex items-center gap-1.5"><span>🌍</span> Country</span>
          <span className="text-gray-400 text-base leading-none">−</span>
        </div>
        <div className="px-4 py-2 space-y-1">
          {["India Matrimony","China Matrimony","Nepal Matrimony","Germany Matrimony","Pakistan Matrimony","Bangladesh Matrimony"].map((c) => (
            <label key={c} className="flex items-center gap-2 text-[10px] text-gray-600 cursor-pointer hover:text-[#b22234] py-0.5">
              <input type="checkbox" className="accent-[#b22234] w-3 h-3" defaultChecked={c === "India Matrimony"} />
              {c}
            </label>
          ))}
          <button className="mt-2 text-[10px] text-white bg-[#b22234] px-3 py-1 rounded w-full">More Countries →</button>
        </div>
      </div>

      {/* Marital Status */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span>💍 Marital Status</span><span className="text-gray-400">+</span>
        </div>
      </div>

      {/* Religion */}
      <div className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
          <span>🕌 Religion</span><span className="text-gray-400">+</span>
        </div>
      </div>

      {/* Horoscope */}
      <div className="border-b border-gray-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50">🔮 Horoscope</div>
        <div className="px-4 py-2 space-y-0.5">
          {["Kundli Matching","Tamil Kundli","Telugu Kundli","Maharashtra Kundli","Marathi Kundli","Gujarati Kundli","Kannada Kundli","Bihari Kundli","Bengali Kundli"].map((k) => (
            <div key={k} className="text-[10px] text-blue-600 hover:text-[#b22234] cursor-pointer py-0.5 flex items-center gap-1">
              <span className="text-gray-300">▶</span>{k}
            </div>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <div className="border-b border-gray-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50">⭐ Our Services</div>
        <div className="px-4 py-2 space-y-1">
          {[["Marathi Shaadi","ON"],["Assamese Shaadi","ON"],["Bengali Shaadi","ON"],["Hindi Shaadi","ON"],["Jain Shaadi","ON"],["Kannada Shaadi","ON"],["Telugu Shaadi","ON"]].map(([label, badge]) => (
            <div key={label} className="flex items-center justify-between text-[10px]">
              <span className="text-pink-600 cursor-pointer flex items-center gap-1"><span className="text-[#b22234]">★</span>{label}</span>
              <span className="bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="border-b border-gray-100">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50">🏷️ Tags</div>
        <div className="px-4 py-2 flex flex-wrap gap-1">
          {["Wedding","Matrimony","Client","Hindu","Event","London","Fonts","Bengali","Liger","India","Marathi","Oats","Popular","Tamil"].map((tag) => (
            <span key={tag} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded cursor-pointer hover:bg-[#b22234] hover:text-white transition-colors">{tag}</span>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="text-[10px] font-bold text-gray-700 mb-1">SUBSCRIBE NOW!</div>
        <p className="text-[9px] text-gray-500 mb-2">Stay updated with the latest profiles and matches.</p>
        <div className="flex gap-1">
          <input type="email" placeholder="Your Email address..." className="flex-1 text-[9px] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#b22234]" />
          <button className="bg-[#b22234] text-white text-[9px] px-2 py-1 rounded hover:bg-[#9a1d2b]">SEND</button>
        </div>
      </div>
    </div>
  </aside>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileDetail() {
  const p = PROFILE;
  const pp = p.partnerPreferences;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Banner */}
      <div className="bg-[#b22234] text-white text-center py-2 text-xs font-medium tracking-wider">
        💕 Find Your Perfect Match — Browse Thousands of Verified Profiles 💕
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-4 lg:gap-6">

        {/* ── Left Sidebar — hidden on mobile & tablet, visible lg+ ── */}
        <Sidebar />

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── Hero Card ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5">

              {/* Photo Slider — full width on mobile, fixed on sm+ */}
              <div className="w-full sm:w-48 shrink-0">
                <PhotoSlider photos={p.photos} name={p.name} />
                <p className="text-[10px] text-gray-400 text-center mt-1">Last Login: {p.lastLogin}</p>
              </div>

              {/* Middle Info + Right Panel stack on mobile */}
              <div className="flex flex-col sm:flex-row flex-1 min-w-0 gap-4">

                {/* Middle Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-300 text-lg">♡</span>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">{p.name}</h1>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Age:</span> {p.age} Yrs | Height: {p.height}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Religion:</span> {p.religion}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Caste:</span> {p.caste}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Location:</span> {p.location}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Education:</span> {p.education}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Profession:</span> {p.profession}</p>
                    <p><span className="font-semibold text-gray-500 w-24 inline-block">Annual Income:</span> {p.annualIncome}</p>
                  </div>
                  <button className="mt-4 flex items-center gap-2 bg-[#b22234] hover:bg-[#9a1d2b] text-white text-xs font-bold px-5 py-2 rounded transition-colors shadow-sm">
                    💬 CHAT NOW
                  </button>
                </div>

                {/* Right Panel */}
                <div className="sm:w-52 shrink-0">
                  <p className="text-[10px] text-gray-600 leading-relaxed mb-3">
                    Integer non nisl elit in ac tempor amet, eget iaculis augue. Nunc orci lorem, iaculis quis lorem id, eleifend accumsen purin eros, consectetur tur eleifend eros.
                  </p>
                  {/* Social Icons */}
                  <div className="flex gap-1.5 mb-3">
                    {[
                      { label: "f", bg: "#1877F2" },
                      { label: "g+", bg: "#34A853" },
                      { label: "in", bg: "#0A66C2" },
                      { label: "t", bg: "#1DA1F2" },
                      { label: "yt", bg: "#FF0000" },
                    ].map((s) => (
                      <button key={s.label} style={{ backgroundColor: s.bg }} className="w-7 h-7 rounded text-white text-[9px] font-bold hover:opacity-80 transition-opacity">
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-[#b22234] text-[#b22234] hover:bg-[#b22234] hover:text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                    💌 SEND INTEREST
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5">
            <SectionHeader icon="👤" title="Personal Information" />

            {/* About */}
            <div className="mb-5 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <span>📍</span>
                <span className="text-xs font-bold text-gray-700">About my daughter</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{p.about}</p>
            </div>

            {/* Basic Details */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📋</span>
                <span className="text-sm font-bold text-gray-700">Basic Details</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Name", value: p.name },
                  { label: "Age", value: `${p.age} Yrs` },
                  { label: "Height", value: p.height },
                  { label: "Weight", value: p.weight },
                  { label: "Mother Tongue", value: p.motherTongue },
                  { label: "Marital Status", value: p.maritalStatus },
                ]}
                right={[
                  { label: "Body Type", value: p.bodyType },
                  { label: "Complexion", value: p.complexion },
                  { label: "Physical Status", value: p.physicalStatus },
                  { label: "Eating Habits", value: p.eatingHabits },
                  { label: "Drinking Habits", value: p.drinkingHabits },
                  { label: "Smoking Habits", value: p.smokingHabits },
                ]}
              />
            </div>

            {/* Contact + Religion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">📞</span>
                  <span className="text-sm font-bold text-gray-700">Contact Details</span>
                </div>
                {[
                  { label: "Contact Number", value: "+1(614) 93-431-7696" },
                  { label: "Chat Status", value: p.chatStatus },
                  { label: "Call Status", value: p.callStatus },
                  { label: "Send Mail", value: p.sendMail },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🕌</span>
                  <span className="text-sm font-bold text-gray-700">Religion Information</span>
                </div>
                {[
                  { label: "Religion", value: "Hindu" },
                  { label: "Caste / Sub Caste", value: p.subCaste },
                  { label: "Star / Raasi", value: p.star },
                  { label: "Dosh", value: p.dosh },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
            </div>

            {/* Location */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📍</span>
                <span className="text-sm font-bold text-gray-700">Bride&apos;s Location</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <div>
                  {[
                    { label: "Country", value: p.country },
                    { label: "State", value: p.state },
                    { label: "Citizenship", value: p.citizenship },
                    { label: "City", value: p.city },
                  ].map((r) => <DetailRow key={r.label} {...r} />)}
                </div>
              </div>
            </div>

            {/* Professional + Astro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">💼</span>
                  <span className="text-sm font-bold text-gray-700">Professional Information</span>
                </div>
                {[
                  { label: "Education", value: p.educationDetail },
                  { label: "Education in Detail", value: "MBA (Sales/b)" },
                  { label: "Employed In", value: p.employedIn },
                  { label: "Occupation Type", value: p.occupationType },
                  { label: "Occupation in Detail", value: p.occupationDetail },
                  { label: "Annual Income", value: "Rs. 6 - 8 Lakhs" },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🔮</span>
                  <span className="text-sm font-bold text-gray-700">Astro Details</span>
                </div>
                {[
                  { label: "Date of Birth", value: p.dob },
                  { label: "Place of Birth", value: p.birthPlace },
                  { label: "Time of Birth", value: p.timeOfBirth },
                  { label: "Manglik", value: p.manglik },
                ].map((r) => <DetailRow key={r.label} {...r} />)}
              </div>
            </div>
          </div>

          {/* ── Partner Preferences ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5">
            <SectionHeader icon="💞" title="Her Partner Preferences" />

            {/* About Partner */}
            <div className="mb-5 p-3 bg-pink-50 rounded-lg border border-pink-100">
              <div className="flex items-center gap-2 mb-2">
                <span>💬</span>
                <span className="text-xs font-bold text-gray-700">About partner</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{pp.aboutPartner}</p>
            </div>

            {/* Basic Preferences */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📋</span>
                <span className="text-sm font-bold text-gray-700">Basic Preferences</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Groom's Age", value: `${pp.ageFrom} – ${pp.ageTo} Yrs` },
                  { label: "Height", value: `${pp.heightFrom} – ${pp.heightTo}` },
                  { label: "Marital Status", value: pp.maritalStatus },
                  { label: "Mother Tongue", value: pp.motherTongue },
                  { label: "Physical Status", value: pp.physicalStatus },
                  { label: "Eating Habits", value: pp.eatingHabits },
                ]}
                right={[
                  { label: "Smoking Habits", value: pp.smokingHabits },
                  { label: "Physical Status", value: pp.physicalStatus },
                  { label: "Eating Habits", value: pp.eatingHabits },
                  { label: "Drinking Habits", value: pp.drinkingHabits },
                  { label: "Drinking Habits", value: pp.drinkingHabits },
                  { label: "Smoking Habits", value: pp.smokingHabits },
                ]}
              />
            </div>

            {/* Professional Preferences */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">💼</span>
                <span className="text-sm font-bold text-gray-700">Professional</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Education", value: pp.education },
                  { label: "Mother Tongue", value: pp.motherTongue },
                  { label: "Occupation", value: pp.occupation },
                  { label: "Annual Income", value: pp.annualIncome },
                ]}
                right={[
                  { label: "Smoking Habits", value: pp.smokingHabits },
                  { label: "Eating Habits", value: pp.eatingHabits },
                  { label: "Occupation", value: pp.occupation },
                  { label: "Smoking Habits", value: pp.smokingHabits },
                ]}
              />
            </div>

            {/* Religious Preferences */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🕌</span>
                <span className="text-sm font-bold text-gray-700">Religious Preferences</span>
              </div>
              <TwoColDetails
                left={[
                  { label: "Religion", value: pp.religion },
                  { label: "Caste / Sub Caste", value: pp.caste },
                  { label: "Star / Raasi", value: pp.star },
                  { label: "Gothram", value: pp.gothram },
                ]}
                right={[
                  { label: "Dosh", value: pp.dosh },
                  { label: "Caste", value: pp.subCaste },
                  { label: "Raasi", value: pp.raasi },
                  { label: "Gothram", value: pp.gothram },
                ]}
              />
            </div>

            {/* Location Preferences */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📍</span>
                <span className="text-sm font-bold text-gray-700">Location Preferences</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <div>
                  {[
                    { label: "Country", value: pp.country },
                    { label: "State", value: pp.state },
                    { label: "Citizenship", value: pp.citizenship },
                    { label: "City", value: pp.city },
                  ].map((r) => <DetailRow key={r.label} {...r} />)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}