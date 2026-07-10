"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type DropdownOption = { label: string; value: string };
type FilterItem =
  | { type: "toggle"; key: string; label: string }
  | { type: "dropdown"; key: string; label: string; options: DropdownOption[] };

/* ─────────────────────────────────────────────
   SORT OPTIONS (with descriptions)
───────────────────────────────────────────── */
const SORT_OPTIONS: { label: string; desc: string; value: string }[] = [
  { label: "Last active",   desc: "Members who recently logged-in will be shown first",          value: "last_active"   },
  { label: "Date created",  desc: "Profiles created recently will be shown first",                value: "newly_joined"  },
  { label: "Profile score", desc: "Profiles with higher completion will be shown first",          value: "profile_score" },
  { label: "Age: Low to High", desc: "Younger profiles will be shown first",                      value: "age_asc"       },
  { label: "Age: High to Low", desc: "Older profiles will be shown first",                        value: "age_desc"      },
];

/* ─────────────────────────────────────────────
   SORT BY MODAL PILL
───────────────────────────────────────────── */
function SortByPill({
  selected,
  onApply,
}: {
  selected: string | null;
  onApply: (value: string | null) => void;
}) {
  const [open, setOpen]         = useState(false);
  const [pending, setPending]   = useState<string | null>(selected);

  // Sync pending when modal opens
  const handleOpen  = () => { setPending(selected); setOpen(true); };
  const handleClose = () => setOpen(false);
  const handleReset = () => setPending(null);
  const handleApply = () => { onApply(pending); setOpen(false); };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [open]);

  const selectedLabel = SORT_OPTIONS.find((o) => o.value === selected)?.label;
  const isActive = selected !== null;

  return (
    <>
      {/* Pill button */}
      <button
        onClick={handleOpen}
        className={`flex-shrink-0 flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
          isActive
            ? "border-[#c0174c] bg-[#b22234] text-white shadow-sm"
            : "border-gray-300 bg-white text-gray-700 hover:border-[#c0174c] hover:text-[#c0174c]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
        </svg>
        {selectedLabel ?? "Sort by"}
        <svg
          className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Modal overlay - rendered at document.body */}
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0" style={{ display: 'grid', placeItems: 'center', padding: '1rem', minHeight: '100dvh', zIndex: 2147483647, width: '100vw', height: '100dvh', position: 'fixed', top: 0, left: 0 }}>
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0 }} onClick={handleClose} />
          
          {/* Modal container */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl" style={{ background: "white", maxHeight: 'calc(100dvh - 2rem)', maxWidth: '442px', margin: 'auto', zIndex: 1 }}>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 2rem)' }}>

            {/* Gradient header strip */}
            <div className="relative px-6 pt-5 pb-4" style={{ background: "linear-gradient(135deg,#c0174c 0%,#8b0f38 100%)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Matches</p>
                  <h2 className="text-white text-xl font-black mt-0.5">Sort by</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {/* Decorative dots */}
              <div className="absolute -bottom-2 right-6 flex gap-1.5 opacity-20">
                {[12,8,5].map((s,i) => <div key={i} className="rounded-full bg-white" style={{width:s,height:s}}/>)}
              </div>
            </div>

            {/* Options grid */}
            <div className="px-5 py-4 space-y-2">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = pending === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setPending(opt.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all"
                    style={{
                      borderColor: isSelected ? "#c0174c" : "#f0f0f0",
                      background: isSelected ? "linear-gradient(135deg,#fff0f4,#fff8f9)" : "#fafafa",
                    }}
                  >
                    {/* Radio indicator */}
                    <div
                      className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: isSelected ? "#c0174c" : "#d1d5db" }}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#c0174c" }} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-tight ${isSelected ? "text-[#b22234]" : "text-gray-800"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug truncate">{opt.desc}</p>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#c0174c" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all hover:bg-red-50 active:scale-95"
                style={{ borderColor: "#c0174c", color: "#c0174c" }}
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-[2] py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 4px 14px rgba(192,23,76,0.4)" }}
              >
                Apply
              </button>
            </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   LOCATION MODAL PILL
───────────────────────────────────────────── */
const KERALA_DISTRICTS = [
  "Kochi","Thrissur","Kozhikode","Kollam","Trivandrum",
  "Kottayam","Palakkad","Malappuram","Kannur","Alappuzha",
  "Idukki","Kasaragod","Pathanamthitta","Wayanad",
];

function LocationPill({
  selected,
  onApply,
}: {
  selected: string | null;
  onApply: (value: string | null) => void;
}) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState<string | null>(selected);

  const handleOpen  = () => { setPending(selected); setOpen(true); };
  const handleClose = () => setOpen(false);
  const handleClear = () => setPending(null);
  const handleApply = () => { onApply(pending); setOpen(false); };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [open]);

  const isActive = selected !== null;

  return (
    <>
      {/* Pill button */}
      <button
        onClick={handleOpen}
        className={`flex-shrink-0 flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
          isActive
            ? "border-[#c0174c] bg-[#b22234] text-white shadow-sm"
            : "border-gray-300 bg-white text-gray-700 hover:border-[#c0174c] hover:text-[#c0174c]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {selected ?? "Location"}
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Modal - rendered at document.body */}
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0" style={{ display: 'grid', placeItems: 'center', padding: '1rem', minHeight: '100dvh', zIndex: 2147483647, width: '100vw', height: '100dvh', position: 'fixed', top: 0, left: 0 }}>
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0 }} onClick={handleClose} />
          
          {/* Modal container */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-white" style={{ maxHeight: 'calc(100dvh - 2rem)', maxWidth: '442px', margin: 'auto', zIndex: 1 }}>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 2rem)' }}>
            {/* Gradient header */}
            <div className="relative px-6 pt-5 pb-4" style={{ background: "linear-gradient(135deg,#c0174c 0%,#8b0f38 100%)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Filter</p>
                  <h2 className="text-white text-xl font-black mt-0.5">Location</h2>
                </div>
                <button onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="absolute -bottom-2 right-6 flex gap-1.5 opacity-20">
                {[12,8,5].map((s,i) => <div key={i} className="rounded-full bg-white" style={{width:s,height:s}}/>)}
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Country — disabled */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Country</label>
                <div className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-semibold text-gray-400 flex items-center gap-2 cursor-not-allowed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  India
                  <span className="ml-auto text-[10px] bg-gray-200 text-gray-400 px-2 py-0.5 rounded-full">Fixed</span>
                </div>
              </div>

              {/* State — disabled */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">State</label>
                <div className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#fce4ec] bg-[#fff5f7] text-sm font-semibold text-[#c0174c] flex items-center gap-2 cursor-not-allowed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Kerala
                  <span className="ml-auto text-[10px] bg-[#fce4ec] text-[#c0174c] px-2 py-0.5 rounded-full">Default</span>
                </div>
              </div>

              {/* District grid */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">District</label>
                <div className="grid grid-cols-3 gap-2">
                  {KERALA_DISTRICTS.map((d) => {
                    const sel = pending === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setPending(sel ? null : d)}
                        className="px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95"
                        style={{
                          borderColor: sel ? "#c0174c" : "#e5e7eb",
                          background: sel ? "linear-gradient(135deg,#fff0f4,#fff8f9)" : "#fafafa",
                          color: sel ? "#c0174c" : "#374151",
                        }}
                      >
                        {sel && (
                          <span className="mr-1">✓</span>
                        )}
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={handleClear}
                className="flex-1 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all hover:bg-red-50 active:scale-95"
                style={{ borderColor: "#c0174c", color: "#c0174c" }}>
                Clear filter
              </button>
              <button onClick={handleApply}
                className="flex-[2] py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 4px 14px rgba(192,23,76,0.4)" }}>
                Apply
              </button>
            </div>
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   PROFILE CREATED BY MODAL PILL
───────────────────────────────────────────── */
const PROFILE_CREATED_BY_OPTIONS = [
  { label: "Self",      value: "SELF"      },
  { label: "Son",       value: "SON"       },
  { label: "Daughter",  value: "DAUGHTER"  },
  { label: "Brother",   value: "BROTHER"   },
  { label: "Sister",    value: "SISTER"    },
  { label: "Relative",  value: "RELATIVE"  },
  { label: "Friend",    value: "FRIEND"    },
];

function ProfileCreatedByPill({
  selected,
  onApply,
}: {
  selected: string | null;
  onApply: (value: string | null) => void;
}) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState<string | null>(selected);

  const handleOpen  = () => { setPending(selected); setOpen(true); };
  const handleClose = () => setOpen(false);
  const handleClear = () => setPending(null);
  const handleApply = () => { onApply(pending); setOpen(false); };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [open]);

  const selectedLabel = PROFILE_CREATED_BY_OPTIONS.find(o => o.value === selected)?.label;
  const isActive = selected !== null;

  return (
    <>
      {/* Pill button */}
      <button
        onClick={handleOpen}
        className={`flex-shrink-0 flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
          isActive
            ? "border-[#c0174c] bg-[#b22234] text-white shadow-sm"
            : "border-gray-300 bg-white text-gray-700 hover:border-[#c0174c] hover:text-[#c0174c]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        {selectedLabel ?? "Profile Created By"}
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Modal - rendered at document.body */}
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0" style={{ display: 'grid', placeItems: 'center', padding: '1rem', minHeight: '100dvh', zIndex: 2147483647, width: '100vw', height: '100dvh', position: 'fixed', top: 0, left: 0 }}>
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0 }} onClick={handleClose} />
          
          {/* Modal container */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-white" style={{ maxHeight: 'calc(100dvh - 2rem)', maxWidth: '442px', margin: 'auto', zIndex: 1 }}>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 2rem)' }}>
            {/* Gradient header */}
            <div className="relative px-6 pt-5 pb-4" style={{ background: "linear-gradient(135deg,#c0174c 0%,#8b0f38 100%)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Filter</p>
                  <h2 className="text-white text-xl font-black mt-0.5">Profile Created By</h2>
                </div>
                <button onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="absolute -bottom-2 right-6 flex gap-1.5 opacity-20">
                {[12,8,5].map((s,i) => <div key={i} className="rounded-full bg-white" style={{width:s,height:s}}/>)}
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Select Relationship</label>
              <div className="grid grid-cols-2 gap-2">
                {PROFILE_CREATED_BY_OPTIONS.map((opt) => {
                  const sel = pending === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPending(sel ? null : opt.value)}
                      className="px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all active:scale-95"
                      style={{
                        borderColor: sel ? "#c0174c" : "#e5e7eb",
                        background: sel ? "linear-gradient(135deg,#fff0f4,#fff8f9)" : "#fafafa",
                        color: sel ? "#c0174c" : "#374151",
                      }}
                    >
                      {sel && <span className="mr-1">✓</span>}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={handleClear}
                className="flex-1 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all hover:bg-red-50 active:scale-95"
                style={{ borderColor: "#c0174c", color: "#c0174c" }}>
                Clear filter
              </button>
              <button onClick={handleApply}
                className="flex-[2] py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 4px 14px rgba(192,23,76,0.4)" }}>
                Apply
              </button>
            </div>
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   MUTUAL HOBBIES MODAL PILL
───────────────────────────────────────────── */
const MUTUAL_HOBBIES_OPTIONS = [
  { label: "Reading",     value: "reading"     },
  { label: "Cooking",     value: "cooking"     },
  { label: "Travelling",  value: "travelling"  },
  { label: "Music",       value: "music"       },
  { label: "Sports",      value: "sports"      },
  { label: "Movies",      value: "movies"      },
  { label: "Photography", value: "photography" },
];

function MutualHobbiesPill({
  selected,
  onApply,
}: {
  selected: string | null;
  onApply: (value: string | null) => void;
}) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState<string | null>(selected);

  const handleOpen  = () => { setPending(selected); setOpen(true); };
  const handleClose = () => setOpen(false);
  const handleClear = () => setPending(null);
  const handleApply = () => { onApply(pending); setOpen(false); };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [open]);

  const selectedLabel = MUTUAL_HOBBIES_OPTIONS.find(o => o.value === selected)?.label;
  const isActive = selected !== null;

  return (
    <>
      {/* Pill button */}
      <button
        onClick={handleOpen}
        className={`flex-shrink-0 flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
          isActive
            ? "border-[#c0174c] bg-[#b22234] text-white shadow-sm"
            : "border-gray-300 bg-white text-gray-700 hover:border-[#c0174c] hover:text-[#c0174c]"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {selectedLabel ?? "Mutual Hobbies"}
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Modal - rendered at document.body */}
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0" style={{ display: 'grid', placeItems: 'center', padding: '1rem', minHeight: '100dvh', zIndex: 2147483647, width: '100vw', height: '100dvh', position: 'fixed', top: 0, left: 0 }}>
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0 }} onClick={handleClose} />
          
          {/* Modal container */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-white" style={{ maxHeight: 'calc(100dvh - 2rem)', maxWidth: '442px', margin: 'auto', zIndex: 1 }}>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 2rem)' }}>
            {/* Gradient header */}
            <div className="relative px-6 pt-5 pb-4" style={{ background: "linear-gradient(135deg,#c0174c 0%,#8b0f38 100%)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Filter</p>
                  <h2 className="text-white text-xl font-black mt-0.5">Mutual Hobbies</h2>
                </div>
                <button onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="absolute -bottom-2 right-6 flex gap-1.5 opacity-20">
                {[12,8,5].map((s,i) => <div key={i} className="rounded-full bg-white" style={{width:s,height:s}}/>)}
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Select Hobby</label>
              <div className="grid grid-cols-2 gap-2">
                {MUTUAL_HOBBIES_OPTIONS.map((opt) => {
                  const sel = pending === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPending(sel ? null : opt.value)}
                      className="px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all active:scale-95"
                      style={{
                        borderColor: sel ? "#c0174c" : "#e5e7eb",
                        background: sel ? "linear-gradient(135deg,#fff0f4,#fff8f9)" : "#fafafa",
                        color: sel ? "#c0174c" : "#374151",
                      }}
                    >
                      {sel && <span className="mr-1">✓</span>}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={handleClear}
                className="flex-1 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all hover:bg-red-50 active:scale-95"
                style={{ borderColor: "#c0174c", color: "#c0174c" }}>
                Clear filter
              </button>
              <button onClick={handleApply}
                className="flex-[2] py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 4px 14px rgba(192,23,76,0.4)" }}>
                Apply
              </button>
            </div>
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   FILTER CONFIG  (sort removed — handled by SortByPill)
───────────────────────────────────────────── */
const FILTERS: FilterItem[] = [
  { type: "toggle", key: "newly_joined",            label: "Newly joined"            },
  { type: "toggle", key: "not_seen",                label: "Not seen"                },
  { type: "toggle", key: "profiles_with_photo",     label: "Profiles with photo"     },
  { type: "toggle", key: "profiles_with_horoscope", label: "Profiles with horoscope" },
  { type: "toggle", key: "mutual_matches",          label: "Mutual matches"          },
  {
    type: "dropdown",
    key: "profile_created_by",
    label: "Profile Created By",
    options: [
      { label: "Self",      value: "SELF"      },
      { label: "Son",       value: "SON"       },
      { label: "Daughter",  value: "DAUGHTER"  },
      { label: "Brother",   value: "BROTHER"   },
      { label: "Sister",    value: "SISTER"    },
      { label: "Relative",  value: "RELATIVE"  },
      { label: "Friend",    value: "FRIEND"    },
    ],
  },
  {
    type: "dropdown",
    key: "mutual_hobbies",
    label: "Mutual Hobbies",
    options: [
      { label: "Reading",     value: "reading"     },
      { label: "Cooking",     value: "cooking"     },
      { label: "Travelling",  value: "travelling"  },
      { label: "Music",       value: "music"       },
      { label: "Sports",      value: "sports"      },
      { label: "Movies",      value: "movies"      },
      { label: "Photography", value: "photography" },
    ],
  },
];

/* ─────────────────────────────────────────────
   DROPDOWN PILL
───────────────────────────────────────────── */
function DropdownPill({
  item,
  selected,
  onSelect,
}: {
  item: Extract<FilterItem, { type: "dropdown" }>;
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = item.options.find((o) => o.value === selected)?.label;

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 cursor-pointer  px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
          selected
            ? "border-gray-800 bg-[#b22234] text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
        }`}
      >
        {selectedLabel ?? item.label}
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[160px]">
          {selected && (
            <button
              onClick={() => { onSelect(null); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
          {item.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                selected === opt.value
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOGGLE PILL
───────────────────────────────────────────── */
function TogglePill({
  item,
  active,
  onToggle,
}: {
  item: Extract<FilterItem, { type: "toggle" }>;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex-shrink-0 px-4 cursor-pointer py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? " bg-[#b22234] text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
      }`}
    >
      {item.label}
    </button>
  );
}

/* ─────────────────────────────────────────────
   ARROW BUTTON
───────────────────────────────────────────── */
function ArrowBtn({
  direction,
  onClick,
  visible,
}: {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#b22234] bg-white shadow-sm flex items-center justify-center text-[#b22234] hover:bg-[#b22234] hover:text-white cursor-pointer transition-all ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────
   FILTER BAR
───────────────────────────────────────────── */
export interface FilterState {
  toggles: Record<string, boolean>;
  dropdowns: Record<string, string | null>;
}

interface FilterBarProps {
  value?: FilterState;
  onChange?: (next: FilterState) => void;
}

export default function FilterBar({ value, onChange }: FilterBarProps = {}) {
  const [internalToggles,   setInternalToggles]   = useState<Record<string, boolean>>({});
  const [internalDropdowns, setInternalDropdowns] = useState<Record<string, string | null>>({});

  const isControlled = value !== undefined;
  const toggles   = isControlled ? value.toggles   : internalToggles;
  const dropdowns = isControlled ? value.dropdowns : internalDropdowns;

  // Combined setter — writes both halves of the filter state atomically so
  // single-select updates don't see stale neighbours.
  // ENFORCES ONLY ONE FILTER ACTIVE AT A TIME - STRICT MODE
  const setFilterState = (
    nextToggles: Record<string, boolean>,
    nextDropdowns: Record<string, string | null>,
  ) => {
    // Count active filters
    const activeToggles = Object.keys(nextToggles).filter(k => nextToggles[k]);
    const activeDropdowns = Object.keys(nextDropdowns).filter(k => nextDropdowns[k] !== null && nextDropdowns[k] !== undefined);
    
    const totalActive = activeToggles.length + activeDropdowns.length;
    
    // STRICT ENFORCEMENT: Only ONE filter can be active total
    const cleanedToggles: Record<string, boolean> = {};
    const cleanedDropdowns: Record<string, string | null> = {};
    
    if (totalActive === 0) {
      // No filters active - clear everything
      if (isControlled) {
        onChange?.({ toggles: {}, dropdowns: {} });
      } else {
        setInternalToggles({});
        setInternalDropdowns({});
      }
      return;
    }
    
    // If there's exactly ONE filter, use it
    // If there's more than one (shouldn't happen), prioritize dropdown over toggle
    if (activeDropdowns.length > 0) {
      // Use first active dropdown only
      const firstDropdownKey = activeDropdowns[0];
      cleanedDropdowns[firstDropdownKey] = nextDropdowns[firstDropdownKey];
    } else if (activeToggles.length > 0) {
      // Use first active toggle only
      const firstToggleKey = activeToggles[0];
      cleanedToggles[firstToggleKey] = true;
    }
    
    if (isControlled) {
      onChange?.({ toggles: cleanedToggles, dropdowns: cleanedDropdowns });
    } else {
      setInternalToggles(cleanedToggles);
      setInternalDropdowns(cleanedDropdowns);
    }
  };

  // Picking a dropdown option: clear every other filter, keep only this one.
  const onSelectDropdown = (key: string, val: string | null) => {
    if (val === null) {
      // Clearing this dropdown clears all filters.
      setFilterState({}, {});
      return;
    }
    // Clear ALL toggles and ALL dropdowns (including other dropdowns), keep ONLY this one dropdown
    const singleDropdown: Record<string, string | null> = {};
    singleDropdown[key] = val;
    setFilterState({}, singleDropdown);
  };

  // Clicking a toggle: clear every other filter; toggle this one on/off.
  const onToggleToggle = (key: string) => {
    const wasActive = !!toggles[key];
    // If it was active, clear everything. Otherwise, clear everything and set only this toggle.
    // Clear ALL dropdowns and ALL other toggles
    setFilterState(wasActive ? {} : { [key]: true }, {});
  };
  const [canLeft,   setCanLeft]   = useState(false);
  const [canRight,  setCanRight]  = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const SCROLL_AMOUNT = 200;

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  SCROLL_AMOUNT, behavior: "smooth" });

  const hasAnyActive =
    Object.values(toggles).some(Boolean) ||
    Object.values(dropdowns).some((v) => v !== null);

  return (
    <div className="flex items-center gap-2 w-full">

      {/* Left arrow */}
      <ArrowBtn direction="left" onClick={scrollLeft} visible={canLeft} />

      {/* Scrollable pills — Sort by modal pill is first, then the rest */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={updateArrows}
      >
        {/* Sort by — opens a modal popup */}
        <SortByPill
          selected={dropdowns["sort"] ?? null}
          onApply={(val) => onSelectDropdown("sort", val)}
        />

        {/* Location — opens a district picker modal */}
        <LocationPill
          selected={dropdowns["location"] ?? null}
          onApply={(val) => onSelectDropdown("location", val)}
        />

        {/* Profile Created By — opens a modal popup */}
        <ProfileCreatedByPill
          selected={dropdowns["profile_created_by"] ?? null}
          onApply={(val) => onSelectDropdown("profile_created_by", val)}
        />

        {/* Mutual Hobbies — opens a modal popup */}
        <MutualHobbiesPill
          selected={dropdowns["mutual_hobbies"] ?? null}
          onApply={(val) => onSelectDropdown("mutual_hobbies", val)}
        />

        {/* Render remaining filters (toggles only, dropdowns handled above) */}
        {FILTERS.filter(item => item.type === "toggle").map((item) => (
          <TogglePill
            key={item.key}
            item={item as Extract<FilterItem, { type: "toggle" }>}
            active={!!toggles[item.key]}
            onToggle={() => onToggleToggle(item.key)}
          />
        ))}

        {hasAnyActive && (
          <button
            onClick={() => setFilterState({}, {})}
            className="flex-shrink-0 px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Right arrow */}
      <ArrowBtn direction="right" onClick={scrollRight} visible={canRight} />

    </div>
  );
}
