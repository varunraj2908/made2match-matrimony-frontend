// app/(auth)/onboarding/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markWelcomeCelebration } from "@/lib/celebrate";

const steps = [
  "Basic details",
  "Personal & religious",
  "Location & profession",
  "Additional details",
];

export default function OnboardingSuccessPage() {
  const router = useRouter();

  // Arm the one-time welcome celebration shown on the first home visit.
  useEffect(() => {
    markWelcomeCelebration();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center "
      style={{ background: "#fdf2f5" }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ border: "0.5px solid #f0c0d0", background: "white" }}
      >
        {/* ── Hero ── */}
        <div
          className="relative h-56 flex flex-col items-center justify-end pb-6 px-6 overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(192,23,76,0.20) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.15) 0%, transparent 50%),
              linear-gradient(135deg, #c0174c 0%, #8b0f38 45%, #5c0a26 100%)
            `,
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 160, height: 160,
              top: 0, right: 0,
              background: "rgba(255,255,255,0.07)",
              transform: "translate(35%,-35%)",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 120, height: 120,
              bottom: 0, left: 0,
              background: "rgba(255,255,255,0.07)",
              transform: "translate(-35%,35%)",
            }}
          />

          {/* Brand pill */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-1.5 flex items-center gap-2"
            style={{ border: "0.5px solid rgba(192,23,76,0.2)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#c0174c">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#c0174c" }}>
              Made2Match Matrimony
            </span>
          </div>

          {/* Floating hearts */}
          <div className="absolute top-4 right-5 flex flex-col gap-1.5 items-end">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#fcd34d">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>

          {/* Heart icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white text-center">Profile Created!</h1>
          <p className="text-xs mt-1 text-center" style={{ color: "rgba(255,255,255,0.82)" }}>
            Find Your Life Partner Today
          </p>
        </div>

        {/* ── Body ── */}
        <div className="p-6">

          {/* Confirmation row */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#c0174c" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-snug">
                You're all set, welcome aboard!
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Your profile is live and visible to matches
              </p>
            </div>
          </div>

          {/* Completed steps grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {steps.map((step) => (
              <div
                key={step}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: "#fdf2f5" }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#c0174c" }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-gray-700 leading-tight">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => router.push("/home")}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-black tracking-wide transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #c0174c, #8b0f38)",
              boxShadow: "0 4px 16px rgba(192,23,76,0.35)",
            }}
          >
            View My Matches →
          </button>

          {/* Secondary */}
          <button
            onClick={() => router.push("/upload-image")}
            className="w-full text-center text-xs mt-3 hover:opacity-70 transition-opacity"
            style={{
              color: "#c0174c",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Complete your profile for better matches
          </button>

        </div>
      </div>
    </div>
  );
}