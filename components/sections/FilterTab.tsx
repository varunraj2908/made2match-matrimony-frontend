"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type DropdownOption = { label: string; value: string };
type FilterItem =
  | { type: "toggle"; key: string; label: string }
  | { type: "dropdown"; key: string; label: string; options: DropdownOption[] };

/* ─────────────────────────────────────────────
   FILTER CONFIG
───────────────────────────────────────────── */
const FILTERS: FilterItem[] = [
  {
    type: "dropdown",
    key: "sort",
    label: "Sort by",
    options: [
      { label: "Newly joined",     value: "newly_joined"   },
      { label: "Last active",      value: "last_active"    },
      { label: "Profile score",    value: "profile_score"  },
      { label: "Age: Low to High", value: "age_asc"        },
      { label: "Age: High to Low", value: "age_desc"       },
    ],
  },
  { type: "toggle",   key: "newly_joined",            label: "Newly joined"            },
  { type: "toggle",   key: "not_seen",                label: "Not seen"                },
  { type: "toggle",   key: "profiles_with_photo",     label: "Profiles with photo"     },
  { type: "toggle",   key: "profiles_with_horoscope", label: "Profiles with horoscope" },
  {
    type: "dropdown",
    key: "location",
    label: "Location",
    options: [
      { label: "Ernakulam",          value: "ernakulam" },
      { label: "Thrissur",           value: "thrissur"  },
      { label: "Kozhikode",          value: "kozhikode" },
      { label: "Kollam",             value: "kollam"    },
      { label: "Thiruvananthapuram", value: "tvm"       },
    ],
  },
  { type: "toggle", key: "mutual_matches", label: "Mutual matches" },
  {
    type: "dropdown",
    key: "profile_created_by",
    label: "Profile Created By",
    options: [
      { label: "Self",    value: "self"    },
      { label: "Parents", value: "parents" },
      { label: "Sibling", value: "sibling" },
      { label: "Friends", value: "friends" },
    ],
  },
  {
    type: "dropdown",
    key: "mutual_hobbies",
    label: "Mutual Hobbies",
    options: [
      { label: "Reading",    value: "reading"    },
      { label: "Cooking",    value: "cooking"    },
      { label: "Travelling", value: "travelling" },
      { label: "Music",      value: "music"      },
      { label: "Sports",     value: "sports"     },
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
  const setFilterState = (
    nextToggles: Record<string, boolean>,
    nextDropdowns: Record<string, string | null>,
  ) => {
    if (isControlled) onChange?.({ toggles: nextToggles, dropdowns: nextDropdowns });
    else {
      setInternalToggles(nextToggles);
      setInternalDropdowns(nextDropdowns);
    }
  };

  // Picking a dropdown option: clear every other filter, keep only this one.
  const onSelectDropdown = (key: string, val: string | null) => {
    if (val === null) {
      // Clearing this dropdown clears all filters.
      setFilterState({}, {});
      return;
    }
    setFilterState({}, { [key]: val });
  };

  // Clicking a toggle: clear every other filter; toggle this one on/off.
  const onToggleToggle = (key: string) => {
    const wasActive = !!toggles[key];
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
    <div className="bg-white border border-gray-200 rounded-xl w-[100%] px-3 py-3">
      <div className="flex items-center gap-2">

        {/* Left arrow */}
        <ArrowBtn direction="left" onClick={scrollLeft} visible={canLeft} />

        {/* Scrollable pills — hide native scrollbar */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={updateArrows}
        >
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>

          {FILTERS.map((item) =>
            item.type === "dropdown" ? (
              <DropdownPill
                key={item.key}
                item={item}
                selected={dropdowns[item.key] ?? null}
                onSelect={(val) => onSelectDropdown(item.key, val)}
              />
            ) : (
              <TogglePill
                key={item.key}
                item={item}
                active={!!toggles[item.key]}
                onToggle={() => onToggleToggle(item.key)}
              />
            )
          )}

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
    </div>
  );
}