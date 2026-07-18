"use client";
import { usePathname } from "next/navigation";
import { OnboardingProvider } from "./OnboardingContext";
import { ReactNode } from "react";

const STEPS = [
  {
    label: "Basic Details",
    subtitle: "DOB, email & account info",
    href: "/onboarding/basic-details",
  },
  {
    label: "Personal & Religious",
    subtitle: "Height, marital status, religion & caste",
    href: "/onboarding/personal-religious-details",
  },
  {
    label: "Location & Professional",
    subtitle: "Country, state, education & profession",
    href: "/onboarding/location-professional-details",
  },
  {
    label: "Additional Details",
    subtitle: "Lifestyle habits & partner preferences",
    href: "/onboarding/additional-details",
  },
];

function VerticalStepper({ currentStep }: { currentStep: number }) {
  const total = STEPS.length;
  const pct = Math.round(((currentStep - 1) / total) * 100);

  return (
    <aside className="w-full md:w-60 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5 md:sticky md:top-6 self-start overflow-hidden">
      <div className="hidden md:block">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#c0174c,#8b0f38)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className="w-4 h-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          <div>
            <p className="text-xs font-black text-gray-800 leading-tight">
              Made2Match
            </p>

            <p className="text-[10px] text-gray-400 leading-tight">
              Matrimony
            </p>
          </div>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Registration Progress
        </p>
        <div className="flex flex-col">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const completed = num < currentStep;
            const active = num === currentStep;
            const upcoming = num > currentStep;
            const isLast = i === STEPS.length - 1;

            return (
              <div key={s.href} className="flex gap-3">
                {/* Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300"
                    style={{
                      background: completed
                        ? "linear-gradient(135deg,#c0174c,#8b0f38)"
                        : active
                        ? "white"
                        : "#f1f5f9",
                      border: active
                        ? "2px solid #c0174c"
                        : upcoming
                        ? "2px solid #e5e7eb"
                        : "none",
                      color: completed
                        ? "white"
                        : active
                        ? "#c0174c"
                        : "#9ca3af",
                      boxShadow: active
                        ? "0 0 0 4px rgba(192,23,76,0.12)"
                        : "none",
                    }}
                  >
                    {completed ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        className="w-4 h-4"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{num}</span>
                    )}
                  </div>

                  {!isLast && (
                    <div className="w-0.5 flex-1 my-1 rounded-full overflow-hidden min-h-8 bg-gray-100">
                      <div
                        className="w-full rounded-full transition-all duration-500"
                        style={{
                          height: completed ? "100%" : "0%",
                          background:
                            "linear-gradient(180deg,#c0174c,#e8305e)",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className={`${isLast ? "pb-0" : "pb-5"} min-w-0`}>
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{
                      color: upcoming
                        ? "#9ca3af"
                        : active
                        ? "#c0174c"
                        : "#111827",
                    }}
                  >
                    {s.label}
                  </p>

                  <p
                    className="text-[11px] mt-0.5 leading-relaxed"
                    style={{
                      color: upcoming ? "#d1d5db" : "#6b7280",
                    }}
                  >
                    {s.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
            <span>Completed</span>

            <span style={{ color: "#c0174c" }}>{pct}%</span>
          </div>

          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(90deg,#c0174c,#e8305e)",
              }}
            />
          </div>

          <p className="text-[10px] text-gray-400 mt-1.5">
            Step {currentStep} of {total}
          </p>
        </div>
      </div>
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#c0174c]">
            Step {currentStep} of {total}
          </p>

          <p className="text-xs font-semibold text-gray-500">
            {pct}% Complete
          </p>
        </div>
        <div className="flex items-start justify-between gap-1">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const completed = num < currentStep;
            const active = num === currentStep;

            return (
              <div
                key={s.href}
                className="flex flex-col items-center flex-1 min-w-0 relative"
              >
                {/* Line */}
                {i !== STEPS.length - 1 && (
                  <div
                    className="absolute top-4 left-[55%] w-full h-0.5 z-0"
                    style={{
                      background: completed
                        ? "linear-gradient(90deg,#c0174c,#e8305e)"
                        : "#e5e7eb",
                    }}
                  />
                )}

                {/* Circle */}
                <div
                  className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-white"
                  style={{
                    background: completed
                      ? "linear-gradient(135deg,#c0174c,#8b0f38)"
                      : active
                      ? "#fff"
                      : "#f3f4f6",
                    border: active
                      ? "2px solid #c0174c"
                      : "2px solid #e5e7eb",
                    color: completed
                      ? "#fff"
                      : active
                      ? "#c0174c"
                      : "#9ca3af",
                  }}
                >
                  {completed ? "✓" : num}
                </div>

                {/* Label */}
                <p
                  className="text-[9px] text-center mt-1 leading-tight px-1"
                  style={{
                    color: active ? "#c0174c" : "#6b7280",
                  }}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// ─── Layout Shell ─────────────────────────────────────────────────────────────
function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const currentStep = Math.max(
    STEPS.findIndex((s) => pathname.startsWith(s.href)) + 1,
    1
  );

  return (
    <div className="min-h-screen bg-[#f5e6e8] flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-20 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#c0174c,#8b0f38)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className="w-3.5 h-3.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          <span className="text-sm font-black text-gray-800">
            Made2MatchMatrimony
          </span>
        </div>

        <p className="hidden md:block text-xs text-white">
          Already registered?{" "}
          <a
            href="/login"
            className="font-bold"
            style={{ color: "#ffffff" }}
          >
            Sign in
          </a>
        </p>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center px-3 md:px-6 py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-4xl items-start">

          <VerticalStepper currentStep={currentStep} />

          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <OnboardingProvider>
      <LayoutShell>{children}</LayoutShell>
    </OnboardingProvider>
  );
}