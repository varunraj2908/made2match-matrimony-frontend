"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type PaymentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  profileName?: string;
};

const BENEFITS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Unlimited contacts",
    color: "#c0174c",
    bg: "#fdeef2",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    label: "Connect on WhatsApp",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "Unlimited chat",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    label: "Horoscope access",
    color: "#9333ea",
    bg: "#faf5ff",
  },
];

export default function PaymentPopup({ isOpen, onClose, profileName }: PaymentPopupProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleUpgrade = () => {
    onClose();
    router.push("/specialoffer");
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      style={{ zIndex: 2147483647 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-popup-title"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow hover:text-[#c0174c] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div
          className="px-8 pt-8 pb-6 text-white text-center"
          style={{ background: "linear-gradient(135deg, #c0174c 0%, #8b102c 100%)" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <Image
              src="/golden-hearts.png"
              alt="Made2Match"
              width={56}
              height={56}
              className="object-contain drop-shadow-lg"
            /> */}
            <div className="text-center">
              <p className="font-black text-2xl leading-none">Made2Match</p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase mt-1">Find your forever</p>
            </div>
          </div>

          {/* Lock icon */}
          <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-white/15 flex items-center justify-center text-3xl shadow-inner">
            🔒
          </div>
          <h2 id="payment-popup-title" className="text-xl font-extrabold leading-tight">
            Unlock Contact Details
          </h2>
          <p className="mt-1.5 text-sm text-white/85 leading-snug">
            Upgrade to call or WhatsApp
            {profileName ? <> <span className="font-bold">{profileName}</span></> : " matches"} directly
          </p>

          {/* Price section */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="rounded-2xl border border-white/30 bg-white/15 px-6 py-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">One month at</p>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-white/50 text-sm line-through">₹3,996</span>
                <span className="font-black text-[#ffe477] leading-none" style={{ fontSize: "48px" }}>₹999</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/70">Limited offer</span>
                <span className="text-[10px] font-black text-[#ffe477] bg-white/15 px-2 py-0.5 rounded-full">75% OFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-8 py-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What you get</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {BENEFITS.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: b.bg }}
              >
                <span style={{ color: b.color }} className="shrink-0">{b.icon}</span>
                <span className="text-xs font-semibold text-gray-700 leading-tight">{b.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleUpgrade}
            className="w-full rounded-xl py-3.5 text-sm font-black text-white shadow-lg transition hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#c0174c,#e8305e)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            View Membership Plans
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
