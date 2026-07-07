"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveHoroscope, timeLabelToHHmm } from "@/services/profileService";
import { INDIA_STATES, getCitiesForState } from "@/data/india-locations";

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Calendar Date Picker ──────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS_ABBR = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDob(date: Date | null): string {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()];
  const yyyy = date.getFullYear();
  return `${dd}-${mon}-${yyyy}`;
}

function parseDob(str: string): Date | null {
  if (!str) return null;
  // "01-Jan-1997"
  const parts = str.split("-");
  if (parts.length !== 3) return null;
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(parts[1]);
  if (mon === -1) return null;
  const d = new Date(Number(parts[2]), mon, Number(parts[0]));
  return isNaN(d.getTime()) ? null : d;
}

interface CalendarPickerProps {
  value: string;          // "DD-Mon-YYYY"
  onChange: (val: string) => void;
}

function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const today = new Date();
  const parsed = parseDob(value);
  const initDate = parsed || new Date(1997, 0, 1);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [selected, setSelected] = useState<Date | null>(parsed);
  const [mode, setMode] = useState<"calendar" | "month" | "year">("calendar");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Sync when value prop changes externally
  useEffect(() => {
    const p = parseDob(value);
    if (p) { setSelected(p); setViewYear(p.getFullYear()); setViewMonth(p.getMonth()); }
  }, [value]);

  const selectDate = (d: Date) => {
    setSelected(d);
    onChange(formatDob(d));
    setOpen(false);
    setMode("calendar");
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (day: number) =>
    selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  // Year range: 1924 – current year
  const yearList = Array.from({ length: today.getFullYear() - 1923 }, (_, i) => today.getFullYear() - i);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Date of birth
      </label>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setMode("calendar"); }}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 hover:border-slate-300 hover:bg-white transition-all cursor-pointer"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value || "Select date of birth"}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 20 20">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M7 2v4M13 2v4M3 8h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-80"
          style={{ marginTop: "4.5rem" }}
        >
          {/* ── Calendar view ── */}
          {mode === "calendar" && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors" type="button">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 16 16">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMode("month")} type="button"
                    className="text-sm font-bold text-slate-800 hover:text-[#c0174c] transition-colors px-1 rounded">
                    {MONTHS[viewMonth]}
                  </button>
                  <button onClick={() => setMode("year")} type="button"
                    className="text-sm font-bold text-slate-800 hover:text-[#c0174c] transition-colors px-1 rounded">
                    {viewYear}
                  </button>
                </div>
                <button onClick={nextMonth} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors" type="button">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 16 16">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_ABBR.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {day ? (
                      <button
                        type="button"
                        onClick={() => selectDate(new Date(viewYear, viewMonth, day))}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-all
                          ${isSelected(day)
                            ? "bg-[#c0174c] text-white shadow"
                            : isToday(day)
                            ? "border border-[#c0174c] text-[#c0174c]"
                            : "hover:bg-pink-50 text-slate-700"
                          }`}
                      >
                        {day}
                      </button>
                    ) : <span className="w-8 h-8" />}
                  </div>
                ))}
              </div>

              {/* Today shortcut */}
              <div className="mt-3 flex justify-end">
                <button type="button"
                  onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); selectDate(today); }}
                  className="text-xs text-[#c0174c] font-semibold hover:underline"
                >
                  Today
                </button>
              </div>
            </>
          )}

          {/* ── Month picker ── */}
          {mode === "month" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800">Select Month</span>
                <button type="button" onClick={() => setMode("calendar")} className="text-xs text-[#c0174c] font-semibold hover:underline">Back</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m, i) => (
                  <button key={m} type="button"
                    onClick={() => { setViewMonth(i); setMode("calendar"); }}
                    className={`py-2 rounded-xl text-xs font-semibold transition-colors
                      ${viewMonth === i ? "bg-[#c0174c] text-white" : "bg-slate-50 text-slate-700 hover:bg-pink-50"}`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Year picker ── */}
          {mode === "year" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800">Select Year</span>
                <button type="button" onClick={() => setMode("calendar")} className="text-xs text-[#c0174c] font-semibold hover:underline">Back</button>
              </div>
              <div className="h-52 overflow-y-auto grid grid-cols-3 gap-2 pr-1">
                {yearList.map(y => (
                  <button key={y} type="button"
                    onClick={() => { setViewYear(y); setMode("calendar"); }}
                    className={`py-2 rounded-xl text-xs font-semibold transition-colors
                      ${viewYear === y ? "bg-[#c0174c] text-white" : "bg-slate-50 text-slate-700 hover:bg-pink-50"}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const PlanetIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="7" stroke="#0EA5E9" strokeWidth="1.5" />
    <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#6366F1" strokeWidth="1.2" />
    <circle cx="10" cy="9" r="1" fill="#0EA5E9" opacity="0.6" />
    <circle cx="23" cy="22" r="1.2" fill="#6366F1" opacity="0.5" />
    <circle cx="25" cy="11" r="0.8" fill="#0EA5E9" opacity="0.4" />
  </svg>
);

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  const disabled = options.length === 0;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border text-sm focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all
            ${disabled
              ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
              : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white cursor-pointer"
            }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}

export default function HoroscopeForm() {
  const router = useRouter();
  const [dob, setDob] = useState("01-Jan-1997");
  const [tob, setTob] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const handleStateChange = (newState: string) => {
    setState(newState);
    setCity(""); // reset city whenever state changes
  };
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await saveHoroscope({
        dateOfBirth: dob || undefined,
        timeOfBirth: tob ? timeLabelToHHmm(tob) : undefined,
        birthCountry: country || undefined,
        birthState: state || undefined,
        birthCity: city || undefined,
      });
      router.push("/star-details");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not save horoscope details. Please try again.",
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
       <div className="flex items-center justify-between py-5 h-20 mt-5 max-w-2xl mx-auto w-full">
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
          <h1 className="text-lg font-black text-gray-900">Horoscope details</h1>
        </div>
        <button
          onClick={() => router.push("/star-details")}
          className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition-colors"
          style={{ color: "#c0174c", border: "1.5px solid #ffe0ea", background: "white" }}
        >
          Skip for now ›
        </button>
      </div>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-[#ffa9c4] shadow-lg p-4 sm:p-8 relative overflow-hidden">

        {/* Background decoration circle */}
      

        

        {/* Icon + Heading */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <PlanetIcon />
          </div>
          <div>
             <p className="font-black text-[#111827] text-base">
              Add horoscope details
            </p>
            <p className="text-slate-400 text-sm mt-0.5">
              Personalize your cosmic journey
            </p>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-slate-100 my-5" /> */}

        {/* Section: Birth Info */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c0174c] block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c0174c]">
            Birth information
          </span>
        </div>

        <div className="flex flex-col gap-3 mb-5 relative">
          <CalendarPicker value={dob} onChange={setDob} />

          <SelectField
            label="Time of birth"
            value={tob}
            onChange={setTob}
            options={["12:00 AM", "06:00 AM", "12:00 PM", "06:00 PM"]}
            placeholder="Select your time of birth"
          />
        </div>

        {/* Divider */}
        {/* <div className="h-px bg-slate-100 my-5" /> */}

        {/* Section: Place of Birth */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c0174c] block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c0174c]">
            Place of birth
          </span>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <SelectField
            label="Country"
            value={country}
            onChange={setCountry}
            options={["India", "United States", "United Kingdom"]}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="State"
              value={state}
              onChange={handleStateChange}
              options={INDIA_STATES}
              placeholder="Select state"
            />
            <SelectField
              label="District / City"
              value={city}
              onChange={setCity}
              options={state ? getCitiesForState(state) : []}
              placeholder={state ? "Select district" : "Select state first"}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3.5 rounded-2xl text-white text-base font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #d4145a  0%, #d4145a  100%)",
          }}
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
        {errorMsg && (
          <p className="mt-3 text-xs text-red-500 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}