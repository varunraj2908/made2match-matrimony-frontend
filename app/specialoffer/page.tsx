"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const specialPlans = [
  {
    id: "gold",
    name: "Gold",
    discount: "31% OFF!",
    originalPrice: "₹5,500",
    price: "₹3,800",
    perMonth: "₹1267 per month",
    features: [
      { text: "Valid for 3 months", ok: true },
      { text: "View 40 Phone Nos", ok: true },
      { text: "Send unlimited messages", ok: true },
      { text: "Unlimited horoscope views", ok: true },
      { text: "View verified profiles with photos", ok: false },
    ],
    highlight: false,
    badge: null,
  },
  {
    id: "prime-gold",
    name: "Prime Gold",
    discount: "42% OFF!",
    originalPrice: "₹7,900",
    price: "₹4,600",
    perMonth: "₹1533 per month",
    features: [
      { text: "Valid for 3 months", ok: true },
      { text: "View unlimited Phone Nos*", ok: true },
      { text: "Send unlimited messages", ok: true },
      { text: "Unlimited horoscope views", ok: true },
      { text: "View verified profiles with photos", ok: true },
    ],
    highlight: false,
    badge: null,
  },
  {
    id: "prime-tum",
    name: "Prime - Till U Marry",
    discount: "58% OFF!",
    originalPrice: "₹23,700",
    price: "₹9,900",
    perMonth: "₹825 per month",
    features: [
      { text: "Longest validity plan", ok: true },
      { text: "View unlimited Phone Nos*", ok: true },
      { text: "Send unlimited messages", ok: true },
      { text: "Unlimited horoscope views", ok: true },
      { text: "View verified profiles with photos", ok: true },
    ],
    highlight: true,
    badge: "Best Seller",
    knowMore: true,
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
  "We offer a wider choice of matches from both KeralaMatrimony and EzhavaMatrimony",
  "Increased profile visibility in both KeralaMatrimony and EzhavaMatrimony along with profile enhancements to get more responses",
  "Dedicated Relationship Manager from your region, who understands your cultural nuances & speaks the language you are comfortable with",
  "Relationship Manager shortlists and contacts prospects, schedules and facilitates video calls/direct meetings with them",
  "First level of horoscope matching with prospective matches while shortlisting their profiles",
  "Service Guarantee! — We are quite confident of bringing the right matches to you. However, if you are not happy with our service, we will give your money back. No questions asked!",
];

// ─── Shared Components ───────────────────────────────────────────────────────

function Header({ onUpgrade }: { onUpgrade: () => void }) {
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
          <span className="font-bold text-base sm:text-lg tracking-wide truncate">MatriMatch</span>
        </div>

        <button
          className="px-3 sm:px-5 py-1 border rounded-full cursor-pointer hover:bg-white hover:text-[#c0174c] font-extrabold text-xs sm:text-sm whitespace-nowrap"
          onClick={onUpgrade}
        >
          Upgrade Now
        </button>
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

function PayNowBtn({ label = "PAY NOW" }: { label?: string }) {
  return (
    <button
      className="w-full py-3 rounded-lg text-white font-bold text-sm tracking-widest transition-all hover:opacity-90 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      style={{ background: "linear-gradient(135deg, #c0174c, #c0174c)" }}
    >
      {label}
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
  );
}

// ─── Page 1: Home (header only) ──────────────────────────────────────────────

function HomePage({ onUpgrade }: { onUpgrade: () => void }) {
   const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onUpgrade={onUpgrade} />
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-gray-400 text-base">Welcome to MatriMatch</p>
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
}: {
  onViewAll: () => void;
  onUpgrade: () => void;
}) {
   const router = useRouter();
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      <Header onUpgrade={onUpgrade} />
      <main
        className="flex-1 py-6 sm:py-12 px-3 sm:px-4"
        style={{
          background:
            "linear-gradient(160deg, #fff8f0 0%, #fff0f5 40%, #fdf4ff 100%)",
        }}
      >
        {/* Back nav */}
        <div className="max-w-5xl mx-auto w-full mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition cursor-pointer"
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
            Back
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <svg viewBox="0 0 20 20" fill="#bbb" className="w-4 h-4 sm:w-5 sm:h-5 opacity-40">
              <path d="M10 0l1.5 6.5L18 10l-6.5 1.5L10 18l-1.5-6.5L2 10l6.5-1.5z" />
            </svg>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
              Special{" "}
              <span
                className="text-white px-3 sm:px-4 py-1 rounded-xl inline-block"
                style={{
                  background: "linear-gradient(135deg,#7c1d6f,#c0174c)",
                }}
              >
                Offer
              </span>
            </h1>
            <svg viewBox="0 0 20 20" fill="#bbb" className="w-4 h-4 sm:w-5 sm:h-5 opacity-40">
              <path d="M10 0l1.5 6.5L18 10l-6.5 1.5L10 18l-1.5-6.5L2 10l6.5-1.5z" />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 flex-wrap text-sm sm:text-base">
            <span className="text-gray-800 font-semibold">Save upto 58%</span>
            <span className="text-gray-400 text-lg">+</span>
            <span className="font-bold" style={{ color: "#c0174c" }}>
              21 Days Money Back Guarantee!
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Offer ends today</p>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {specialPlans.map((plan) => (
            <div
              key={plan.id}
              className="relative bg-white rounded-2xl flex flex-col"
              style={{
                border: plan.highlight
                  ? "2px solid #c0174c"
                  : "1px solid #e5e7eb",
                boxShadow: plan.highlight
                  ? "0 8px 32px rgba(192,23,76,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow"
                  style={{ background: "#c0174c" }}
                >
                  {plan.badge}
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-center font-bold text-gray-900 text-lg mb-4 pb-4 border-b border-gray-100">
                  {plan.name}
                </h2>
                <div className="text-center mb-4">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#c0174c" }}
                  >
                    {plan.discount}{" "}
                    <span className="text-gray-400 font-normal">
                      Valid for today
                    </span>
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      {plan.originalPrice}
                    </span>
                    <span className="text-3xl font-black text-gray-900">
                      {plan.price}
                    </span>
                  </div>
                  <div
                    className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium text-gray-500"
                    style={{ background: "#f3f4f6" }}
                  >
                    {plan.perMonth}
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: f.ok ? "#c0174c" : "#ccc" }}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="w-4 h-4 mt-0.5"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span
                        className="text-sm"
                        style={{
                          color: f.ok ? "#374151" : "#9ca3af",
                          textDecoration: f.ok ? "none" : "line-through",
                        }}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {plan.knowMore && (
                  <button
                    className="flex items-center justify-center gap-1 text-sm font-semibold mb-4 hover:opacity-75 transition"
                    style={{ color: "#f97316" }}
                  >
                    Know More{" "}
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
                )}
                <PayNowBtn />
              </div>
            </div>
          ))}
        </div>

        {/* View All Packages */}
        <div className="flex justify-between items-center mb-10 w-full max-w-5xl mx-auto">
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
            onClick={()=>router.push('/home')}
            className="text-sm font-bold hover:underline cursor-pointer transition inline-flex items-center gap-1"
            style={{ color: "#c0174c" }}
          >
            Skip now
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
                stroke="#c0174c"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Chat with us
            </button>
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
              9597337974
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
    </div>
  );
}

// ─── Page 3: All Packages ────────────────────────────────────────────────────

type Tab = keyof typeof allPackagesData;
type Duration = keyof (typeof allPackagesData)["prime"];

function AllPackagesPage({
  onBack,
  onUpgrade,
}: {
  onBack: () => void;
  onUpgrade: () => void;
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
            Get a flat Rs.13800 on TUM Prime
            <span className="text-gray-500 font-normal ml-2">
              - Valid till 05-Apr-2026
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
            <PayNowBtn />
            <p className="text-center text-xs text-gray-400 mt-2">
              Offer valid till 05-Apr-2026
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
                    Get <strong>more matches</strong> across Matrimony.com group
                    of sites
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
              Offer valid till 05-Apr-2026
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
              A personalised matchmaking service Powered by KeralaMatrimony
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Only KeralaMatrimony offers these{" "}
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
            Featured in Limca Book of World Records for highest number of
            documented marriages online
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
  const [page, setPage] = useState("special");

  return (
    <>
      {page === "home" && <HomePage onUpgrade={() => setPage("special")} />}
      {page === "special" && (
        <SpecialOfferPage
          onViewAll={() => setPage("all")}
          onUpgrade={() => setPage("special")}
        />
      )}
      {page === "all" && (
        <AllPackagesPage
          onBack={() => setPage("special")}
          onUpgrade={() => setPage("special")}
        />
      )}
    </>
  );
}
