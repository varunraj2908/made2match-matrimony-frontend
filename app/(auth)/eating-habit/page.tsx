"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { mapDiet, saveEatingHabit } from "@/services/profileService";

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DiningIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
    {/* Fork */}
    <path
      d="M9 4v5c0 1.5 1 2.5 2.5 3V28"
      stroke="#0EA5E9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 4v4M11.5 4v4"
      stroke="#0EA5E9"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Knife */}
    <path
      d="M23 4c0 0 2 3 2 7s-2 5-2 5v12"
      stroke="#6366F1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Spoon */}
    <ellipse cx="16" cy="7" rx="2" ry="3" stroke="#0EA5E9" strokeWidth="1.5" />
    <path
      d="M16 10v18"
      stroke="#0EA5E9"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

type Habit = "Vegetarian" | "Non-Vegetarian" | "Eggetarian";

const habits: {
  label: Habit;
  emoji: string;
  description: string;
  color: string;
  ring: string;
}[] = [
  {
    label: "Vegetarian",
    emoji: "🥦",
    description: "Plant-based foods only",
    color: "from-emerald-50 to-green-50 border-emerald-200",
    ring: "ring-emerald-400",
  },
  {
    label: "Non-Vegetarian",
    emoji: "🍗",
    description: "Includes meat & seafood",
    color: "from-rose-50 to-orange-50 border-rose-200",
    ring: "ring-rose-400",
  },
  {
    label: "Eggetarian",
    emoji: "🥚",
    description: "Vegetarian + eggs",
    color: "from-amber-50 to-yellow-50 border-amber-200",
    ring: "ring-amber-400",
  },
];

export default function EatingHabitForm() {
  const router = useRouter();
  const [selected, setSelected] = useState<Habit | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    const diet = mapDiet(selected);
    if (!diet) {
      setErrorMsg("Invalid selection.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await saveEatingHabit(diet);
      router.push("/education-details");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not save eating habit. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" flex h-full items-center  font-sans flex-col" style={{
          background:
            "linear-gradient(160deg, #fff8f0 0%, #fff0f5 40%, #fdf4ff 100%)",
        }}>
      <div className="flex items-center justify-between px-12 py-5 h-20 max-w-2xl mt-5 mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center hover:bg-pink-50 transition-colors"
            style={{ border: "1.5px solid #f0c0d0", background: "white" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c0174c"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-lg font-black text-gray-900">
            Eating Habit
          </h1>
        </div>
        <button
          onClick={() => router.push("/education-details")}
          className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition-colors"
          style={{
            color: "#c0174c",
            border: "1.5px solid #ffe0ea",
            background: "white",
          }}
        >
          Skip for now ›
        </button>
      </div>
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#eeb5c6] shadow-lg p-8 relative overflow-hidden">
        {/* Background decoration */}
       
        <div className="absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-indigo-50 pointer-events-none z-30" />

        {/* Icon + Heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <DiningIcon />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">
              Select eating habit
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Help us personalize your experience
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 block" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Choose one
          </span>
        </div>

        {/* Habit Cards */}
        <div className="flex flex-col gap-3 mb-8">
          {habits.map(({ label, emoji, description, color, ring }) => {
            const isSelected = selected === label;
            return (
              <button
                key={label}
                onClick={() => setSelected(label)}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl border bg-linear-to-r
                  transition-all duration-200 text-left
                  ${color}
                  ${
                    isSelected
                      ? `ring-2 ${ring} shadow-sm scale-[1.01]`
                      : "hover:scale-[1.01] hover:shadow-sm"
                  }
                `}
              >
                {/* Emoji badge */}
                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                  {emoji}
                </span>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                    ${isSelected ? "border-sky-500 bg-sky-500" : "border-slate-300 bg-white"}`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className={`
            w-full py-3.5 rounded-2xl z-50 text-base font-medium tracking-wide
            transition-all duration-200
            ${
              selected
                ? "text-white hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
                : "text-slate-400 bg-slate-100 cursor-not-allowed"
            }
            ${submitting ? "opacity-60" : ""}
          `}
          style={
            selected
              ? {
                  background:
                    "linear-gradient(135deg, #ff5088 0%, #c0174c 100%)",
                }
              : {}
          }
        >
          {submitting
            ? "Saving..."
            : selected
              ? `Continue with ${selected}`
              : "Select an option"}
        </button>
        {errorMsg && (
          <p className="mt-3 text-xs text-red-500 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
