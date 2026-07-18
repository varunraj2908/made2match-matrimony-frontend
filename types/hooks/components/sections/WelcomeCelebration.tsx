"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfettiCanvas from "./ConfettiCanvas";
import { useScrollLock } from "@/lib/useScrollLock";
import { consumeWelcomeCelebration } from "@/lib/celebrate";

const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

/**
 * One-time welcome celebration shown the first time a freshly-registered
 * member lands on the home page. Mounted in the (main) layout.
 */
export default function WelcomeCelebration() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Fire once if the welcome flag was armed during onboarding.
  useEffect(() => {
    if (consumeWelcomeCelebration()) setOpen(true);
  }, []);

  // Lock background scroll (no page jump) while celebrating.
  useScrollLock(open);

  if (!open) return null;

  const close = () => setOpen(false);
  const explore = () => {
    close();
    router.push("/search");
  };

  return (
    <div
      className="fixed inset-0 z-[1800] flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "rgba(60,8,28,0.72)", backdropFilter: "blur(3px)" }}
      onClick={close}
    >
      <ConfettiCanvas />

      <div
        className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden text-center"
        style={{ animation: `m2m-welcome-slideUp 0.5s ${SPRING} both` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full text-white/80 hover:bg-white/20 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Hero */}
        <div
          className="pt-9 pb-7 px-6"
          style={{ background: "linear-gradient(135deg,#c0174c 0%,#8b0f38 55%,#5c0a26 100%)" }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-3 shadow-lg"
            style={{ background: "rgba(255,255,255,0.16)", animation: `m2m-welcome-pop 0.6s 0.25s ${SPRING} both` }}
          >
            🎉
          </div>
          <h2 className="text-2xl font-black text-white" style={{ animation: "m2m-welcome-fade 0.4s 0.55s both" }}>
            Welcome to Made2Match!
          </h2>
          <p className="text-sm text-white/85 mt-1.5" style={{ animation: "m2m-welcome-fade 0.4s 0.7s both" }}>
            Your profile is live ✨ — let&apos;s find your perfect life partner.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-4 flex flex-col gap-2.5" style={{ animation: "m2m-welcome-fade 0.4s 0.85s both" }}>
          <button
            onClick={explore}
            className="w-full py-3 rounded-full text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 8px 20px rgba(192,23,76,0.35)" }}
          >
            💞 Find Your Matches
          </button>
          <button
            onClick={close}
            className="w-full py-3 rounded-full text-sm font-semibold text-[#c0174c] border border-[#c0174c]/30 hover:bg-[#fde4ec] transition-colors"
          >
            Explore the dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes m2m-welcome-slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes m2m-welcome-pop {
          0%   { transform: scale(0) rotate(-20deg); }
          60%  { transform: scale(1.25) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes m2m-welcome-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
