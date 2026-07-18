// app/(auth)/onboarding/hobbies/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mapInterestCategory, saveAllInterests } from "@/services/profileService";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "hobbies", label: "Hobbies & Interests" },
  { key: "music", label: "Music" },
  { key: "reading", label: "Reading" },
  { key: "movies", label: "Movies & TV Shows" },
  { key: "sports", label: "Sports & Fitness" },
  { key: "food", label: "Food" },
  { key: "languages", label: "Spoken Languages" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TAB_SHORT: Record<TabKey, string> = {
  hobbies: "Hobbies",
  music: "Music",
  reading: "Reading",
  movies: "Movies",
  sports: "Sports",
  food: "Food",
  languages: "Languages",
};

const DATA: Record<TabKey, { sectionLabel: string; items: string[]; defaultShow: number }> = {
  hobbies: {
    sectionLabel: "Choose Hobbies & Interests",
    defaultShow: 12,
    items: ["Acting","Adventure Sports","Alternative Healing / Medicine","Art / Handicraft","Astrology","Baking","Bike / Car Enthusiast","Bird Watching","Blogging / Video Blogging","Board Games","Book Clubs","Calligraphy","Clubbing","Collectibles","Cooking","Dancing","DIY / Home Improvement","Drawing / Painting","Fishing","Gardening","Gaming","Hiking","Horse Riding","Knitting / Crocheting","Martial Arts","Meditation","Nature Walks","Photography","Pottery","Puzzles","Singing","Sketching","Socialising","Swimming","Theatre","Travelling","Yoga"],
  },
  languages: {
  sectionLabel: "Choose spoken languages",
  defaultShow: 999,
  items: [
    "Malayalam",
    "English",
    "Hindi",
    "Tamil",
    "Kannada",
    "Telugu",
    "Arabic",
    "Urdu",
    "French",
    "German",
    "Spanish",
  ],
},
food: {
  sectionLabel: "Choose favourite food types",
  defaultShow: 999,
  items: [
    "Kerala Food",
    "South Indian",
    "North Indian",
    "Vegetarian",
    "Seafood",
    "Chinese",
    "Italian",
    "Arabic",
    "Fast Food",
    "Biryani",
    "Street Food",
    "Healthy Food",
    "Desserts",
    "BBQ",
    "Homemade Food",
  ],
},
  music: {
    sectionLabel: "Choose the music genre",
    defaultShow: 12,
    items: ["Bhangra","Bluegrass","Blues","Christian / Gospel","Classical","Classical - Carnatic","Country","Death Metal","Devotional","Disco","EDM (Electronic Dance Music)","Film Songs","Folk Music","Fusion","Ghazals","Heavy Metal","Hip-Hop","Indie","Jazz","K-Pop","Opera","Pop","R&B / Soul","Rap","Reggae","Rock","Sufi","World Music"],
  },
  reading: {
    sectionLabel: "Choose the type of books you read",
    defaultShow: 999,
    items: ["Autobiographies / Biographies","Business / Professional","Children's Books","Comics / Graphic Novels","Crime / Thriller","Fantasy","Fiction","Health & Wellness","History","Horror","Humour","Motivational / Self-Help","Mystery","Non-Fiction","Philosophy","Poetry","Romance","Science Fiction","Spirituality","Travel"],
  },
  movies: {
    sectionLabel: "Choose favourite movie genres",
    defaultShow: 999,
    items: ["Action","Adventure","Animation","Bollywood","Comedy","Crime","Documentary","Drama","Fantasy","Horror","Independent","International Cinema","Malayalam Cinema","Musical","Mystery","Romance","Sci-Fi","Sports","Tamil Cinema","Telugu Cinema","Thriller"],
  },
  sports: {
    sectionLabel: "Choose Sports & Fitness activities",
    defaultShow: 999,
    items: ["Aerobics","Badminton","Basketball","Boxing","Cricket","Crossfit","Cycling","Football","Golf","Gym / Fitness","Hockey","Kabaddi","Martial Arts","Pilates","Running / Jogging","Skating","Squash","Swimming","Table Tennis","Tennis","Volleyball","Yoga","Zumba"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ChevronIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="#c0174c" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: rotated ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HobbiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("hobbies");
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active tab into view (reveals the next tab too).
  useEffect(() => {
    const el = tabBarRef.current?.querySelector(
      `[data-tab="${activeTab}"]`,
    ) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);
  const [selected, setSelected] = useState<Record<TabKey, Set<string>>>(
    () => Object.fromEntries(TABS.map(t => [t.key, new Set<string>()])) as Record<TabKey, Set<string>>
  );
  const [expanded, setExpanded] = useState<Record<TabKey, boolean>>(
    () => Object.fromEntries(TABS.map(t => [t.key, false])) as Record<TabKey, boolean>
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSaveContinue = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const payload: Record<string, string[]> = {};
      TABS.forEach(({ key }) => {
        const items = Array.from(selected[key]);
        if (items.length === 0) return;
        const backendCategory = mapInterestCategory(key);
        if (backendCategory) payload[backendCategory] = items;
      });
      await saveAllInterests(payload);
      router.push("/horoscope");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not save interests. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = (tab: TabKey, item: string) => {
    setSelected(prev => {
      const next = new Set(prev[tab]);
      next.has(item) ? next.delete(item) : next.add(item);
      return { ...prev, [tab]: next };
    });
  };

  const removeSelected = (tab: TabKey, item: string) => toggle(tab, item);

  const toggleExpand = (tab: TabKey) =>
    setExpanded(prev => ({ ...prev, [tab]: !prev[tab] }));

  // All selected across tabs as a flat list
  const allSelected: { tab: TabKey; item: string }[] = [];
  TABS.forEach(({ key }) => {
    selected[key].forEach(item => allSelected.push({ tab: key, item }));
  });

  const totalSelected = allSelected.length;

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-5" style={{ background: "#fdf2f5" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-5 max-w-4xl mx-auto w-full">
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
          <h1 className="text-lg font-black text-gray-900">Hobbies &amp; Interests</h1>
        </div>
        <button
          onClick={() => router.push("/horoscope")}
          className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition-colors"
          style={{ color: "#c0174c", border: "1.5px solid #f0c0d0", background: "white" }}
        >
          Skip for now ›
        </button>
      </div>

      {/* ── Card ── */}
      <div className="flex-1 px-2 sm:px-6 pb-10 max-w-4xl mx-auto w-full ">
        <div className="bg-white rounded-2xl overflow-hidden shadow-md" style={{ border: "0.5px solid #f0c0d0" }}>

          {/* ── Tabs ── */}
          <div
            ref={tabBarRef}
            className="flex overflow-x-auto h-18"
            style={{ borderBottom: "1px solid #f0c0d0", scrollbarWidth: "none" }}
          >
            {TABS.map(tab => (
              <button
                key={tab.key}
                data-tab={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="shrink-0 px-4 py-3.5 text-md cursor-pointer font-semibold whitespace-nowrap transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.key ? "2px solid #c0174c" : "2px solid transparent",
                  color: activeTab === tab.key ? "#c0174c" : "black",
                  cursor: "pointer",
                }}
              >
                {tab.label}
                {selected[tab.key].size > 0 && (
                  <span
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black"
                    style={{ background: "#c0174c", color: "white" }}
                  >
                    {selected[tab.key].size}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Pill grid ── */}
          <div className="p-5" style={{ maxHeight: 300, overflowY: "auto" }}>
            {TABS.map(({ key }) => {
              const { sectionLabel, items, defaultShow } = DATA[key];
              const isExp   = expanded[key];
              const visible = isExp ? items : items.slice(0, defaultShow);
              const hasMore = items.length > defaultShow;

              return (
                <div key={key} style={{ display: activeTab === key ? "block" : "none" }}>
                  <p className="text-md font-black text-gray-900 mb-3">{sectionLabel}</p>

                  <div className="flex flex-wrap gap-3 mb-2">
                    {visible.map(item => {
                      const isSel = selected[key].has(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggle(key, item)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                          style={{
                            border:     `1.5px solid ${isSel ? "#c0174c" : "#e5e7eb"}`,
                            background: isSel ? "#c0174c" : "white",
                            color:      isSel ? "white"   : "#374151",
                          }}
                        >
                          {item}
                          {isSel && (
                            <span
                              className="inline-flex items-center justify-center w-3.5 h-3.5 ml-1 rounded-full"
                              style={{ background: "rgba(255,255,255,0.25)" }}
                            >
                              <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {hasMore && (
                    <button
                      onClick={() => toggleExpand(key)}
                      className="flex items-center gap-1.5 mt-1 text-xs font-bold hover:opacity-75 transition-opacity"
                      style={{ color: "#c0174c", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {isExp ? "Show less" : "Show more"}
                      <ChevronIcon rotated={isExp} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Selected summary strip ── */}
          <div
            className="px-5 py-3"
            style={{ borderTop: "0.5px solid #f0c0d0", background: "#fdf2f5", minHeight: 64 }}
          >
            <p
              className="text-[12px] font-bold tracking-widest uppercase mb-2"
              style={{ color: "#c0174c" }}
            >
              Your selections
            </p>

            {allSelected.length === 0 ? (
              <p className="text-xs text-gray-300 italic">Nothing selected yet — tap interests above</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto pr-1">
                {allSelected.map(({ tab, item }) => (
                  <div
                    key={`${tab}-${item}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: "white", border: "1.5px solid #c0174c" }}
                  >
                    <span className="text-[10px] font-semibold" style={{ color: "#c0174c" }}>{item}</span>
                    <span
                      className="text-[8px] font-medium px-1 rounded"
                      style={{ background: "#fdf2f5", color: "#c0174c" }}
                    >
                      {TAB_SHORT[tab]}
                    </span>
                    <button
                      onClick={() => removeSelected(tab, item)}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#c0174c", border: "none", cursor: "pointer" }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between px-5 py-4 bg-white"
            style={{ borderTop: "0.5px solid #f0c0d0" }}
          >
            <p className="text-md text-gray-500">
              Selected:{" "}
              <span className="font-black" style={{ color: "#c0174c" }}>
                {totalSelected}
              </span>{" "}
              interests
            </p>
            <button
              onClick={handleSaveContinue}
              disabled={totalSelected === 0 || submitting}
              className="px-6 py-2.5 rounded-xl text-md font-black transition-all active:scale-95"
              style={{
                background: totalSelected > 0
                  ? "linear-gradient(135deg,#c0174c,#8b0f38)"
                  : "#e5e7eb",
                color:  totalSelected > 0 ? "white" : "#9ca3af",
                cursor: totalSelected > 0 && !submitting ? "pointer" : "default",
                boxShadow: totalSelected > 0 ? "0 3px 10px rgba(192,23,76,0.25)" : "none",
                border: "none",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Saving..." : "Save & Continue →"}
            </button>
          </div>
          {errorMsg && (
            <p className="px-5 pb-3 text-xs text-red-500">{errorMsg}</p>
          )}

        </div>
      </div>
    </div>
  );
}