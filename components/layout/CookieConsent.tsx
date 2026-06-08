"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_NAME = "m2m_cookie_consent";

const getConsent = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setConsent = (value: "accepted" | "declined") => {
  // 1 year, site-wide.
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`;
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't chosen yet.
    if (!getConsent()) setVisible(true);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    setConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[1600] w-[calc(100vw-2.5rem)] max-w-[20rem] animate-modal-pop">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#c0174c]/10 overflow-hidden">
        {/* Decorative gradient glow at the top */}
        <div
          className="absolute -top-16 -right-10 w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #c0174c, transparent 70%)" }}
        />

        {/* Close */}
        <button
          onClick={() => choose("declined")}
          aria-label="Dismiss"
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="relative p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">🍪</span>
            <h3 className="text-sm font-extrabold text-gray-800">We value your privacy</h3>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug mb-3 pr-4">
            We use cookies to improve your experience.{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#c0174c] hover:underline">
              Learn more
            </Link>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => choose("declined")}
              className="flex-1 py-2 rounded-full text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => choose("accepted")}
              className="flex-1 py-2 rounded-full text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 4px 12px rgba(192,23,76,0.3)" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
