"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import SpecialOfferSideBanner from "@/components/ui/SpecialOfferSideBanner";
import { getSubscriptionPlans, type SubscriptionPlan } from "@/services/paymentService";
import { getMyProfileFull } from "@/services/profileService";
import PaymentConfirmPopup from "@/components/modals/PaymentConfirmPopup";

// ─── Data ───────────────────────────────────────────────────────────────────

const specialPlans = [
  {
    id: "silver",
    name: "Silver",
    subBadges: [
      {
        label: "Silver",
        description: "Everything you need to start your search.",
        discountPct: "40% OFF",
        badgeLabel: "Best Value",
        originalPrice: "₹2,499",
        price: "₹1,499",
        duration: "1 month",
        features: [
          { icon: "📞", text: "View up to 20 contact numbers", available: true },
          { icon: "👁️", text: "Browse unlimited profiles", available: true },
          { icon: "💌", text: "Send unlimited interests/day", available: true },
          { icon: "🔍", text: "AI-powered compatibility score for every match", available: false },
        ],
      },
    ],
    highlight: false,
    popular: false,
    tierColor: "#6b7280",
    tierBg: "#f3f4f6",
    badgeColor: "#16a34a",
    btnLabel: "Choose Silver",
  },
  {
    id: "gold",
    name: "Gold",
    subBadges: [
      {
        label: "Gold",
        description: "Perfect for serious seekers — maximum visibility.",
        discountPct: "45% OFF",
        badgeLabel: "Best Offer",
        originalPrice: "₹4,540",
        price: "₹2,499",
        duration: "3 months",
        features: [
          { icon: "📞", text: "View up to 80 contact numbers", available: true },
          { icon: "🔍", text: "AI-powered compatibility score for every match", available: true },
          { icon: "👁️", text: "Unlimited profile views", available: true },
          { icon: "💬", text: "Direct messaging", available: true },
        ],
      },
      {
        label: "Gold Plus",
        description: "Everything in Gold, plus boosted reach and priority listing.",
        discountPct: "50% OFF",
        badgeLabel: "Best Offer",
        originalPrice: "₹5,800",
        price: "₹2,899",
        duration: "3 months",
        features: [
          { icon: "📞", text: "View up to 120 contact numbers", available: true },
          { icon: "🔍", text: "AI-powered compatibility score for every match", available: true },
          { icon: "👁️", text: "Unlimited profile views", available: true },
          { icon: "💬", text: "Direct messaging", available: true },
          { icon: "🚀", text: "Priority profile listing", available: true },
        ],
      },
    ],
    highlight: true,
    popular: true,
    tierColor: "#92400e",
    tierBg: "#fef3c7",
    badgeColor: "#c0174c",
    btnLabel: "Choose Gold",
  },
  {
    id: "platinum",
    name: "Platinum",
    subBadges: [
      {
        label: "Platinum",
        description: "Complete package with dedicated matchmaker support.",
        discountPct: "60% OFF",
        badgeLabel: "Best Offer",
        originalPrice: "₹8,750",
        price: "₹3,499",
        duration: "6 months",
        features: [
          { icon: "📞", text: "View up to 200 contact numbers", available: true },
          { icon: "🔍", text: "AI-powered compatibility score for every match", available: true },
          { icon: "👑", text: "Personal matchmaker", available: true },
          { icon: "⭐", text: "Weekly profile boost", available: true },
        ],
      },
      {
        label: "Platinum Plus",
        description: "Our most exclusive plan with VIP matchmaking and full support.",
        discountPct: "60% OFF",
        badgeLabel: "Best Offer",
        originalPrice: "₹11,500",
        price: "₹4,599",
        duration: "6 months",
        features: [
          { icon: "📞", text: "Unlimited contact numbers", available: true },
          { icon: "🔍", text: "AI-powered compatibility score for every match", available: true },
          { icon: "👑", text: "Dedicated VIP matchmaker", available: true },
          { icon: "⭐", text: "Daily profile boost", available: true },
          { icon: "📸", text: "Professional profile review", available: true },
        ],
      },
    ],
    highlight: false,
    popular: false,
    tierColor: "#374151",
    tierBg: "#f1f5f9",
    badgeColor: "#c0174c",
    btnLabel: "Choose Platinum",
  },
];

const allPackagesData = {
  prime: {
    "3months": {
      gold: { total: "₹5,500", disc: "₹1,700 (31%)", pay: "₹3,800" },
      assisted: { total: "₹22,000", disc: "₹2,600 (12%)", pay: "₹19,400" },
    },
    "6months": {
      gold: { total: "₹9,900", disc: "₹4,000 (40%)", pay: "₹5,900" },
      assisted: { total: "₹44,800", disc: "₹5,400 (12%)", pay: "₹39,400" },
    },
    "12months": {
      gold: { total: "₹17,500", disc: "₹6,500 (37%)", pay: "₹11,000" },
      assisted: { total: "₹82,000", disc: "₹9,840 (12%)", pay: "₹72,160" },
    },
    tillumarry: {
      gold: { total: "₹23,700", disc: "₹13,800 (58%)", pay: "₹9,900" },
      assisted: { total: "₹1,10,000", disc: "₹13,200 (12%)", pay: "₹96,800" },
    },
  },
  regular: {
    "3months": {
      gold: { total: "₹3,500", disc: "₹700 (20%)", pay: "₹2,800" },
      assisted: { total: "₹18,000", disc: "₹2,160 (12%)", pay: "₹15,840" },
    },
    "6months": {
      gold: { total: "₹6,500", disc: "₹1,950 (30%)", pay: "₹4,550" },
      assisted: { total: "₹34,000", disc: "₹4,080 (12%)", pay: "₹29,920" },
    },
    "12months": {
      gold: { total: "₹12,000", disc: "₹4,200 (35%)", pay: "₹7,800" },
      assisted: { total: "₹64,000", disc: "₹7,680 (12%)", pay: "₹56,320" },
    },
    tillumarry: {
      gold: { total: "₹20,000", disc: "₹10,000 (50%)", pay: "₹10,000" },
      assisted: { total: "₹90,000", disc: "₹10,800 (12%)", pay: "₹79,200" },
    },
  },
};

const successStories = [
  {
    names: "Abhilash & Parvathy",
    img: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=300&h=200&fit=crop",
  },
  {
    names: "Akhil & Sushma",
    img: "https://images.unsplash.com/photo-1537832816519-689ad163238b?w=300&h=200&fit=crop",
  },
  {
    names: "Amit & Haritha",
    img: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=300&h=200&fit=crop",
  },
];

const whyBenefits = [
  { icon: "📞", label: "Talk to matches directly" },
  { icon: "📋", label: "Get complete profile details" },
  { icon: "👁️", label: "Enhanced profile visibility" },
  { icon: "💬", label: "Get more responses" },
];

const assistedBenefits = [
  "We offer a wider choice of matches from across Made2Match's extensive member network",
  "Increased profile visibility on Made2Match along with profile enhancements to get more responses",
  "Dedicated Relationship Manager from your region, who understands your cultural nuances & speaks the language you are comfortable with",
  "Relationship Manager shortlists and contacts prospects, schedules and facilitates video calls/direct meetings with them",
  "First level of horoscope matching with prospective matches while shortlisting their profiles",
  "Service Guarantee! — We are quite confident of bringing the right matches to you. However, if you are not happy with our service, we will give your money back. No questions asked!",
];

// ─── Plan Card (sub-badge tabs) ──────────────────────────────────────────────

type SubBadge = {
  label: string;
  description: string;
  discountPct: string;
  badgeLabel: string;
  originalPrice: string;
  price: string;
  duration: string;
  features: { icon: string; text: string; available: boolean }[];
  planId?: number; // matched from backend
};

type PlanData = {
  id: string;
  name: string;
  subBadges: SubBadge[];
  highlight: boolean;
  popular: boolean;
  tierColor: string;
  tierBg: string;
  badgeColor: string;
  btnLabel: string;
};

// Helper — parse "₹1,499" → 1499, compute GST, return formatted strings
function gstBreakdown(priceStr: string): { base: string; gst: string; total: string } {
  const num = parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
  const gst = Math.round(num * 0.18 * 100) / 100;
  const total = Math.round((num + gst) * 100) / 100;
  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return { base: fmt(num), gst: fmt(gst), total: fmt(total) };
}

function PlanCard({
  plan,
  onPay,
  paying,
}: {
  plan: PlanData;
  onPay: (planName: string, planId?: number) => void;
  paying: boolean;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = plan.subBadges[activeIdx];

  return (
    <div
      className="relative bg-white rounded-2xl flex flex-col"
      style={{
        border: plan.highlight ? "2px solid #c0174c" : "1.5px solid #e5e7eb",
        boxShadow: plan.highlight
          ? "0 8px 32px rgba(192,23,76,0.18)"
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow"
          style={{ background: "#c0174c" }}
        >
          Popular
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1">

        {/* ── Tier name badge ── */}
        <div className="mb-3">
          <span
            className="inline-block px-4 py-1 rounded-lg text-base font-black tracking-wide"
            style={{
              background: plan.tierBg,
              color: plan.tierColor,
              border: `1.5px solid ${plan.tierColor}22`,
            }}
          >
            {plan.name}
          </span>
        </div>

        {/* ── Sub-badge tabs (clickable) ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {plan.subBadges.map((b, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => setActiveIdx(i)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer hover:opacity-80"
                style={{
                  background: isActive
                    ? (plan.highlight ? "#c0174c" : plan.tierColor)
                    : plan.tierBg,
                  color: isActive ? "white" : plan.tierColor,
                  border: `1.5px solid ${isActive
                    ? (plan.highlight ? "#c0174c" : plan.tierColor)
                    : plan.tierColor + "55"}`,
                  boxShadow: isActive ? "0 1px 6px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* ── Description ── */}
        <p className="text-sm text-gray-500 mb-4 leading-relaxed min-h-[2.5rem]">
          {active.description}
        </p>

        {/* ── Price row ── */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-gray-400 line-through text-sm">{active.originalPrice}</span>
          <span className="text-2xl sm:text-3xl font-black text-gray-900">{active.price}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "#fce7f3", color: "#c0174c" }}
          >
            {active.duration}
          </span>
        </div>

        {/* ── Discount + badge row ── */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "#fee2e2", color: "#dc2626" }}
          >
            {active.discountPct}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: plan.badgeColor + "18", color: plan.badgeColor }}
          >
            {active.badgeLabel}
          </span>
        </div>

        {/* ── Choose button ── */}
        <button
          onClick={() => onPay(active.label, active.planId)}
          disabled={paying}
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95 mb-5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={
            plan.highlight
              ? { background: "linear-gradient(135deg,#c0174c,#e8305e)", color: "white" }
              : { background: "white", color: "#c0174c", border: "2px solid #c0174c" }
          }
        >
          {paying ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Processing…
            </>
          ) : (
            activeIdx === 0 ? plan.btnLabel : `Choose ${active.label}`
          )}
        </button>

        {/* ── Feature list ── */}
        <ul className="space-y-2.5 flex-1">
          {active.features.map((f, fi) => (
            <li
              key={fi}
              className="flex items-center gap-2.5"
              style={{ opacity: f.available ? 1 : 0.45 }}
            >
              <span className="text-base leading-none shrink-0">{f.icon}</span>
              <span
                className="text-sm"
                style={{
                  color: f.available ? "#374151" : "#9ca3af",
                  textDecoration: f.available ? "none" : "line-through",
                }}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function Header({ onUpgrade, showSkip, onSkip }: { onUpgrade: () => void; showSkip?: boolean; onSkip?: () => void }) {
  return (
    <header
      className="text-white shadow-lg  "
      style={{
        background: "linear-gradient(135deg, #c0174c 0%, #a01040 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="font-bold text-base sm:text-lg tracking-wide truncate">Made2Match</span>
        </div>

        {showSkip ? (
          <button
            className="px-3 sm:px-5 py-1 border rounded-full cursor-pointer hover:bg-white hover:text-[#c0174c] font-extrabold text-xs sm:text-sm whitespace-nowrap"
            onClick={onSkip}
          >
            Skip
          </button>
        ) : (
          <button
            className="px-3 sm:px-5 py-1 border rounded-full cursor-pointer hover:bg-white hover:text-[#c0174c] font-extrabold text-xs sm:text-sm whitespace-nowrap"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>
        )}
      </div>
    </header>
  );
}

function CheckMark({ color = "#c0174c" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      className="w-4 h-4 shrink-0 mt-0.5"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PayNowBtn({
  label = "PAY NOW",
  onClick,
  loading,
}: {
  label?: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 rounded-lg text-white font-bold text-sm tracking-widest transition-all hover:opacity-90 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Processing…
        </>
      ) : (
        <>
          {label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </>
      )}
    </button>
  );
}

// ─── Page 1: Home (header only) ──────────────────────────────────────────────

function HomePage({ onUpgrade }: { onUpgrade: () => void }) {
   const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onUpgrade={onUpgrade} />
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-gray-400 text-base">Welcome to Made2Match</p>
        <button
          onClick={onUpgrade}
          className="px-8 py-3 rounded-full text-white font-bold text-sm shadow-lg transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}
        >
          View Special Offer →
        </button>
      </div>
    </div>
  );
}

// ─── Page 2: Special Offer ───────────────────────────────────────────────────

function SpecialOfferPage({
  onViewAll,
  onUpgrade,
  onPay,
  paying,
  registrationPlanId,
  testPlanId,
}: {
  onViewAll: () => void;
  onUpgrade: () => void;
  onPay: (label: string, planId?: number) => void;
  paying: boolean;
  registrationPlanId?: number;
  testPlanId?: number;
}) {
  const router = useRouter();
  const [showMegaOffer, setShowMegaOffer] = useState(false);
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      <Header onUpgrade={onUpgrade} showSkip={false} />
      <main
        className="flex-1 py-6 sm:py-12 px-3 sm:px-4"
        style={{
          background:
            "linear-gradient(160deg, #fff8f0 0%, #fff0f5 40%, #fdf4ff 100%)",
        }}
      >
        {/* Back nav and Skip button row */}
        <div className="max-w-5xl mx-auto w-full mb-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <button
            onClick={() => router.push('/home')}
            className="text-sm font-bold hover:underline cursor-pointer transition inline-flex items-center gap-1"
            style={{ color: "#c0174c" }}
          >
            Skip now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Special Offer Banner — REMOVED, now inline with title */}

        {/* Title */}
        <div className="relative mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-5 flex-wrap">

            {/* Banner — same level as title, left */}
            <div
              className="relative w-full max-w-[420px] overflow-hidden rounded-xl shrink-0"
              style={{
                background: "linear-gradient(135deg, #ffd700 0%, #ffc331 40%, #ffaa00 100%)",
                height: "72px",
                boxShadow: "4px 5px 0px rgba(0,0,0,0.3)",
              }}
            >
              {/* Halftone */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "7px 7px" }} />
              {/* Dark diagonal — right 48% */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(115deg, transparent 0%, transparent 52%, #1a1a2e 52%, #1a1a2e 100%)" }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(115deg, transparent 48%, rgba(0,0,0,0.25) 52%, transparent 56%)" }} />

              {/* LEFT — 75% OFF badge + Click Here button */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2.5">
                <div className="rounded-lg px-3 py-2 text-center"
                  style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)", boxShadow: "2px 2px 0 #8b102c", transform: "rotate(-3deg)" }}>
                  <span className="font-black text-white leading-none block" style={{ fontSize: "20px" }}>75%</span>
                  <span className="font-black text-white/90 leading-none uppercase tracking-wider block" style={{ fontSize: "10px" }}>OFF</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMegaOffer(true)}
                  className="rounded-full px-4 py-1.5 text-center cursor-pointer animate-[offer-button-zoom_1.2s_ease-in-out_infinite] hover:[animation-play-state:paused]"
                  style={{ background: "linear-gradient(135deg, #fff, #ffe87a)", boxShadow: "2px 3px 0 #e8a800" }}>
                  <span className="font-black text-[#6b0f2e] uppercase leading-none" style={{ fontSize: "13px" }}>Click Here</span>
                </button>
              </div>

              {/* MIDDLE — MEGA OFFER — centered in dark area */}
              <div className="absolute z-10 flex items-center justify-center"
                style={{ left: "52%", right: "22%", top: 0, bottom: "16px" }}>
                <div className="text-center">
                  <p className="font-black text-white uppercase leading-none" style={{ fontSize: "24px", textShadow: "2px 3px 0 rgba(0,0,0,0.6)", letterSpacing: "0.04em" }}>MEGA</p>
                  <p className="font-black text-white uppercase leading-none" style={{ fontSize: "24px", textShadow: "2px 3px 0 rgba(0,0,0,0.6)", letterSpacing: "0.04em" }}>OFFER</p>
                </div>
              </div>

              {/* RIGHT — ₹999 only */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <span className="font-black text-white leading-none" style={{ fontSize: "34px", textShadow: "1px 2px 0 rgba(0,0,0,0.75)" }}>₹999</span>
              </div>

              {/* Bottom strip */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-0.5 flex items-center justify-center gap-1"
                style={{ background: "rgba(0,0,0,0.3)" }}>
                <svg width="6" height="6" viewBox="0 0 24 24" fill="#ffc331"><path d="M5 3l14 9-14 9V3z"/></svg>
                <span className="text-[7px] font-bold text-white/80 uppercase tracking-widest">Limited Time Offer</span>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <svg viewBox="0 0 20 20" fill="#bbb" className="w-4 h-4 sm:w-5 sm:h-5 opacity-40">
                <path d="M10 0l1.5 6.5L18 10l-6.5 1.5L10 18l-1.5-6.5L2 10l6.5-1.5z" />
              </svg>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
                Special{" "}
                <span className="text-white px-3 sm:px-4 py-1 rounded-xl inline-block"
                  style={{ background: "linear-gradient(135deg,#7c1d6f,#c0174c)" }}>
                  Offer
                </span>
              </h1>
              <svg viewBox="0 0 20 20" fill="#bbb" className="w-4 h-4 sm:w-5 sm:h-5 opacity-40">
                <path d="M10 0l1.5 6.5L18 10l-6.5 1.5L10 18l-1.5-6.5L2 10l6.5-1.5z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 flex-wrap text-sm sm:text-base text-center">
            <span className="text-gray-800 font-semibold">Save upto 60%</span>
            <span className="text-gray-400 text-lg">+</span>
            <span className="font-bold" style={{ color: "#c0174c" }}>21 Days Money Back Guarantee!</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm text-center">Offer ends today</p>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 items-start">
          {specialPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onPay={onPay} paying={paying} />
          ))}
        </div>

        {/* View All Packages */}
        <div className="flex justify-start items-center mb-10 w-full max-w-5xl mx-auto">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <button
              onClick={onViewAll}
              className="text-sm font-bold hover:underline transition inline-flex items-center gap-1"
              style={{ color: "#c0174c" }}
            >
              View All Packages
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-3.5 h-3.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onPay("Production Payment Test", testPlanId)}
              disabled={paying}
              className="hidden rounded-full border border-dashed border-amber-500 bg-amber-50 px-5 py-2.5 text-sm font-black text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying ? "Processing…" : "Test ₹10 Payment"}
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="text-center px-2">
          <p className="text-gray-800 font-semibold text-sm sm:text-base mb-4">
            Need any help in making payment?
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 flex-wrap">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              style={{ borderColor: "#d1d5db" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              7909227177
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Note : 21 Days money back guarantee{" "}
            <a href="#" className="underline" style={{ color: "#c0174c" }}>
              Terms &amp; Conditions
            </a>{" "}
            applied
          </p>
        </div>
      </main>

      {showMegaOffer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mega-offer-title"
        >
          <button
            type="button"
            aria-label="Close mega offer"
            className="absolute inset-0 bg-[#141126]/70 backdrop-blur-sm cursor-default"
            onClick={() => setShowMegaOffer(false)}
          />
          <div className="relative w-full max-w-[562px] overflow-hidden rounded-[28px] border border-white/30 bg-white shadow-2xl">
            <div
              className="relative px-7 pb-8 pt-7 text-center text-white"
              style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #52206d 58%, #c0174c 100%)" }}
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
              <div className="absolute -left-10 -top-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />
              <div className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-pink-300/20 blur-2xl" />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowMegaOffer(false)}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xl leading-none transition hover:bg-white/25"
              >
                ×
              </button>
              <div className="relative mx-auto mb-3 w-fit rounded-full border border-yellow-200/50 bg-yellow-300 px-3 py-1 text-xs font-black tracking-[0.18em] text-[#5b1739]">
                LIMITED TIME OFFER
              </div>
              <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-white/70">Exclusive member upgrade</p>
              <p className="relative text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">Mega Offer</p>
              <h2 id="mega-offer-title" className="relative mt-1 flex items-center justify-center gap-3 font-black tracking-tight">
                <span className="text-2xl text-white/60 line-through">₹3,996</span>
                <span className="text-5xl">₹999</span>
              </h2>
              <p className="relative mt-2 text-base font-semibold text-white">Registration Offer <span className="mx-1 text-yellow-300">•</span> 1 Month Duration</p>
              <div className="relative mt-4 flex justify-center gap-2">
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
                  <p className="text-base font-black text-yellow-300">75%</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/75">Savings</p>
                  <p className="mt-0.5 text-[9px] font-semibold text-white/60 line-through">₹3,996</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center">
                  <p className="text-base font-black text-yellow-300">24/7</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/75">Support</p>
                </div>
              </div>
            </div>

            <div className="px-7 py-5">
              <div className="mb-4 overflow-hidden rounded-2xl border border-[#f3d5df]">
                <div className="flex items-center justify-between bg-[#fff7fa] px-4 py-2.5 text-sm font-medium text-gray-600">
                  <span>Registration Offer</span>
                  <span className="font-bold text-gray-900">₹999.00</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#f8e5eb] px-4 py-2.5 text-sm font-medium text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-bold text-gray-900">₹179.82</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#f3d5df] bg-[#c0174c] px-4 py-3 text-white">
                  <span className="text-sm font-black uppercase tracking-wide">Total payable</span>
                  <span className="text-xl font-black">₹1,178.82</span>
                </div>
              </div>
              <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.14em] text-[#52206d]">Everything you need to connect</p>
              <div className="space-y-2 text-sm font-medium text-gray-700">
                <p className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fce8ef] text-xs font-black text-[#c0174c]">✓</span> Unlimited contacts</p>
                <p className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fce8ef] text-xs font-black text-[#c0174c]">✓</span> Unlimited chats</p>
                <p className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fce8ef] text-xs font-black text-[#c0174c]">✓</span> Secure payment and instant activation</p>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#fff7ed] px-3 py-2 text-xs font-semibold text-[#7c3e14]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 shrink-0"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                Your payment is protected with secure checkout.
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMegaOffer(false);
                  window.setTimeout(() => onPay("Registration Offer", registrationPlanId), 150);
                }}
                disabled={paying}
                className="mt-5 w-full cursor-pointer rounded-2xl py-3 text-sm font-black uppercase tracking-wider text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)", boxShadow: "0 7px 18px rgba(192, 23, 76, 0.28)" }}
              >
                <span className="inline-flex items-center gap-2">{paying ? "Processing…" : "Pay Now ₹1,178.82"}{!paying && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}</span>
              </button>
              <p className="mt-2 text-center text-[11px] font-medium text-gray-400">Instant access after successful payment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page 3: All Packages ────────────────────────────────────────────────────

type Tab = keyof typeof allPackagesData;
type Duration = keyof (typeof allPackagesData)["prime"];

function AllPackagesPage({
  onBack,
  onUpgrade,
  onPay,
  paying,
}: {
  onBack: () => void;
  onUpgrade: () => void;
  onPay: (label: string, planId?: number) => void;
  paying: boolean;
}) {
  const [tab, setTab] = useState<Tab>("prime");
  const [duration, setDuration] = useState<Duration>("6months");
  const [assistedDuration, setAssistedDuration] = useState("3months");

  const durations: {
    key: Duration;
    label: string;
    saveBadge?: boolean;
    valueBadge?: boolean;
  }[] = [
    { key: "3months", label: "3 Months" },
    { key: "6months", label: "6 Months", saveBadge: true },
    { key: "12months", label: "12 Months" },
    { key: "tillumarry", label: "Till U Marry", valueBadge: true },
  ];

  const prices = allPackagesData[tab][duration];

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      <Header onUpgrade={onUpgrade} />

      {/* Back nav */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-4 h-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Special Offer
        </button>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        {/* Top Banner */}
        <div className="text-center mb-4">
          <p className="text-sm font-semibold" style={{ color: "#c0174c" }}>
            Get up to 60% OFF on Made2Match Premium plans
            <span className="text-gray-500 font-normal ml-2">
              — Limited time offer
            </span>
          </p>
        </div>

        {/* Money Back Banner */}
        <div
          className="flex items-center justify-center gap-3 mb-6 rounded-xl px-6 py-3 max-w-sm mx-auto"
          style={{
            background: "linear-gradient(135deg,#f24078,#c0174c)",
            color: "white",
          }}
        >
          <div className="text-2xl">👍</div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80 block">
              Money Back
            </span>
            <span className="font-bold text-sm">
              21 Days Money Back Guarantee
            </span>
          </div>
          <div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center text-xs cursor-pointer">
            ⓘ
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {([
            ["prime", "PRIME Packages"],
            ["regular", "Regular Packages"],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm transition-all relative"
              style={{
                color:
                  tab === key
                    ? key === "prime"
                      ? "#7c1d6f"
                      : "#374151"
                    : "#9ca3af",
              }}
            >
              {key === "prime" ? (
                <>
                  <span style={{ color: "#7c1d6f", fontWeight: 900 }}>
                    PRIME
                  </span>{" "}
                  <span className="text-gray-700">Packages</span>
                </>
              ) : (
                label
              )}
              {tab === key && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                  style={{
                    background: tab === "prime" ? "#7c1d6f" : "#374151",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Duration Pills */}
        <div className="flex items-center gap-2 sm:gap-3 mb-10 sm:mb-8 justify-center flex-wrap">
          <div className="hidden sm:block w-12 h-px bg-gray-200" />
          {durations.map((d) => (
            <button
              key={d.key}
              onClick={() => setDuration(d.key)}
              className="relative flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all hover:scale-105"
              style={{
                background:
                  duration === d.key
                    ? "linear-gradient(135deg,#c0174c,#c0174c)"
                    : "white",
                borderColor: duration === d.key ? "#c0174c" : "#d1d5db",
                color: duration === d.key ? "white" : "#374151",
              }}
            >
              {d.label}
              {d.saveBadge && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-bold"
                  style={{
                    background:
                      duration === d.key ? "rgba(255,255,255,0.25)" : "#ef4444",
                    color: "white",
                    fontSize: "0.6rem",
                  }}
                >
                  SAVE MORE
                </span>
              )}
              {d.valueBadge && (
                <span
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                  style={{ color: "#374151" }}
                >
                  Best Value
                </span>
              )}
            </button>
          ))}
          <div className="hidden sm:block w-12 h-px bg-gray-200" />
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {/* Gold */}
          <div
            className="rounded-2xl border border-gray-200 p-4 sm:p-6"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-800">Gold</span>
              <span className="font-bold text-gray-800">
                {prices.gold.total}
              </span>
            </div>
            <ul className="space-y-3 mb-6 min-h-40">
              {[
                [
                  "💬",
                  <span>
                    Initiate conversations with matches, send{" "}
                    <strong>unlimited messages</strong> &amp;{" "}
                    <strong>chat*</strong>
                  </span>,
                ],
                [
                  "📞",
                  <span>
                    Connect with your preferred matches, view{" "}
                    <strong>80 verified mobile numbers*</strong>
                  </span>,
                ],
                [
                  "🔮",
                  <span>
                    Check <strong>compatibility</strong> with matches by viewing{" "}
                    <strong>unlimited horoscopes</strong>
                  </span>,
                ],
              ].map(([icon, text], i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-base mt-0.5">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-4 space-y-1 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total</span>
                <span>{prices.gold.total}</span>
              </div>
              <div
                className="flex justify-between text-sm font-semibold"
                style={{ color: "#c0174c" }}
              >
                <span>
                  Discount (
                  {prices.gold.disc.split("(")[1]?.replace(")", "") || ""})
                </span>
                <span>-{prices.gold.disc.split(" ")[0]}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                <span>You pay</span>
                <span className="text-xl">{prices.gold.pay}</span>
              </div>
            </div>
            <PayNowBtn onClick={() => onPay("Gold")} loading={paying} />
            <p className="text-center text-xs text-gray-400 mt-2">
              Limited time offer
            </p>
          </div>

          {/* Assisted Gold */}
          <div
            className="rounded-2xl border-2 p-4 sm:p-6"
            style={{
              borderColor: "#c0174c",
              boxShadow: "0 4px 20px rgba(34,197,94,0.15)",
            }}
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-800">Assisted Gold</span>
              <span className="font-bold text-gray-800">
                {prices.assisted.total}
              </span>
            </div>
            <ul className="space-y-3 mb-6 min-h-40">
              {[
                [
                  "🤝",
                  <span>
                    Dedicated <strong>Relationship manager</strong> shortlists,
                    connects with relevant matches and arranges meetings
                  </span>,
                ],
                [
                  "🌐",
                  <span>
                    Get <strong>more matches</strong> across Made2Match's
                    full member network
                  </span>,
                ],
                [
                  "💌",
                  <span>
                    Get more responses as even{" "}
                    <strong>Free members can send you messages</strong>
                  </span>,
                ],
                ["⭐", <span>All benefits of Gold Package</span>],
              ].map(([icon, text], i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-base mt-0.5">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-4 space-y-1 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total</span>
                <span>{prices.assisted.total}</span>
              </div>
              <div
                className="flex justify-between text-sm font-semibold"
                style={{ color: "#c0174c" }}
              >
                <span>
                  Discount (
                  {prices.assisted.disc.split("(")[1]?.replace(")", "") || ""})
                </span>
                <span>-{prices.assisted.disc.split(" ")[0]}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                <span>You pay</span>
                <span className="text-xl">{prices.assisted.pay}</span>
              </div>
            </div>
            <PayNowBtn />
            <p className="text-center text-xs text-gray-400 mt-2">
              Limited time offer
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mb-12">
          * Terms &amp; Conditions apply
        </p>

        {/* Why paid membership */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">👑</div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Why paid membership?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
            {whyBenefits.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-20 sm:w-auto">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl shadow-md"
                  style={{
                    background: "linear-gradient(135deg,#c0174c,#c0174c)",
                  }}
                >
                  {b.icon}
                </div>
                <span className="text-xs text-gray-600 text-center max-w-20 font-medium leading-tight">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
          <button
            className="px-4 sm:px-8 py-3 rounded-lg text-white font-bold text-xs sm:text-sm tracking-widest transition hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#c0174c,#c0174c)",
              boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
            }}
          >
            CHOOSE OUR BEST SELLING PACKAGE
          </button>
        </div>

        {/* Assisted Service */}
        <div className="border-t border-gray-100 pt-10 mb-10">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🧑‍💼</div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Assisted Service
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              A personalised matchmaking service Powered by Made2Match
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Only Made2Match offers these{" "}
              <span style={{ color: "#c0174c" }} className="font-black">
                EXCLUSIVE
              </span>{" "}
              Assisted Service benefits
            </p>
          </div>
          <ul className="space-y-3 max-w-2xl mx-auto mb-8">
            {assistedBenefits.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <CheckMark color="#c0174c" />
                <span
                  dangerouslySetInnerHTML={{
                    __html: b.replace(
                      "Service Guarantee!",
                      "<strong>Service Guarantee!</strong>",
                    ),
                  }}
                />
              </li>
            ))}
          </ul>

          {/* Select Assisted Package */}
          <div className="text-center">
            <p className="font-semibold text-gray-800 mb-4 text-sm">
              Select an Assisted Package
            </p>
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              {["3 Months", "6 Months", "12 Months"].map((d, i) => {
                const key = ["3months", "6months", "12months"][i];
                return (
                  <button
                    key={key}
                    onClick={() => setAssistedDuration(key)}
                    className="px-4 sm:px-6 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                    style={{
                      borderColor:
                        assistedDuration === key ? "#c0174c" : "#d1d5db",
                      color: assistedDuration === key ? "#c0174c" : "#374151",
                      background:
                        assistedDuration === key ? "#fff7ed" : "white",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="rounded-2xl p-4 sm:p-8 mb-6" style={{ background: "#f9fafb" }}>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Trusted by thousands of families across India
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Some of our recent success stories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {successStories.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-5xl">
                  {["💑", "👫", "💏"][i]}
                </div>
                <p className="text-xs font-semibold text-gray-700 px-3 py-2">
                  {s.names}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 rounded-full text-white font-bold text-xs sm:text-sm transition hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#c0174c,#c0174c)" }}
            >
              <span>👑</span> BECOME A PAID MEMBER
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  const router = useRouter();
  const [page, setPage] = useState("special");
  const { openCheckout, loading: paying } = useRazorpay();
  const [backendPlans, setBackendPlans] = useState<SubscriptionPlan[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [me, setMe] = useState<{ firstName?: string; email?: string; phoneNumber?: string } | null>(null);
  const [confirmPopup, setConfirmPopup] = useState<{
    planLabel: string;
    planId: number;
    basePrice: number;
  } | null>(null);

  useEffect(() => {
    getSubscriptionPlans().then(setBackendPlans).catch(() => {});
    getMyProfileFull().then((p) => setMe({ firstName: p.firstName, email: p.email, phoneNumber: p.phoneNumber })).catch(() => {});
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /** Match a UI plan label to a backend plan by planType name */
  const findPlanId = (label: string): number | undefined => {
    const normalized = label.toUpperCase().replace(/\s+/g, "_").replace(/-/g, "_");
    const plan = backendPlans.find(
      (p) =>
        p.planType === normalized ||
        p.name.toUpperCase().replace(/\s+/g, "_") === normalized
    );
    return plan?.id;
  };

  // Helper — find the Registration Offer plan id (₹999)
  const registrationPlanId = backendPlans.find(
    (p) => p.planType === "REGISTRATION"
  )?.id;
  const testPlanId = backendPlans.find((p) => p.planType === "TEST")?.id;

  const handlePay = (planLabel: string, planId?: number) => {
    const id = planId ?? findPlanId(planLabel);
    if (!id) {
      showToast("Plan not available. Please contact support.", "error");
      return;
    }
    // Find base price from backendPlans
    const plan = backendPlans.find((p) => p.id === id);
    if (plan?.planType === "TEST") {
      proceedToRazorpay(plan.name, id);
      return;
    }
    const basePrice = plan?.price ?? 0;
    // Show GST confirmation popup before opening Razorpay
    setConfirmPopup({ planLabel, planId: id, basePrice });
  };

  const proceedToRazorpay = (planLabel: string, planId: number) => {
    setConfirmPopup(null);
    openCheckout({
      planId,
      planName: planLabel,
      userName: me?.firstName || "Member",
      userEmail: me?.email || "",
      userPhone: me?.phoneNumber || "",
      onSuccess: (paymentId) => {
        showToast(`Payment successful! ID: ${paymentId}`, "success");
        setTimeout(() => router.push("/home"), 2500);
      },
      onError: (msg) => {
        if (msg !== "Payment cancelled.") showToast(msg, "error");
      },
    });
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl flex items-center gap-2 transition-all`}
          style={{ background: toast.type === "success" ? "#16a34a" : "#c0174c" }}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}

      {/* Payment confirmation popup with GST breakdown */}
      {confirmPopup && (
        <PaymentConfirmPopup
          isOpen={true}
          onClose={() => setConfirmPopup(null)}
          onConfirm={() => proceedToRazorpay(confirmPopup.planLabel, confirmPopup.planId)}
          planName={confirmPopup.planLabel}
          basePrice={confirmPopup.basePrice}
          loading={paying}
        />
      )}

      {page === "home" && <HomePage onUpgrade={() => setPage("special")} />}
      {page === "special" && (
        <SpecialOfferPage
          onViewAll={() => setPage("all")}
          onUpgrade={() => setPage("special")}
          onPay={handlePay}
          paying={paying}
          registrationPlanId={registrationPlanId}
          testPlanId={testPlanId}
        />
      )}
      {page === "all" && (
        <AllPackagesPage
          onBack={() => setPage("special")}
          onUpgrade={() => setPage("special")}
          onPay={handlePay}
          paying={paying}
        />
      )}
    </>
  );
}
