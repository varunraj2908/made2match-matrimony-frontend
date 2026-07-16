"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const STATS = [
  { value: "50L+", label: "Profiles", highlight: false },
  { value: "15Yr+", label: "Trusted", highlight: true },
  { value: "10K+", label: "Matches", highlight: false },
];

const GOLD = "#E8C547";
const ROSE = "#c0174c";

// Floating hearts in the backdrop.
function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: (i * 41) % 100,
        delay: (i % 6) * 0.9,
        dur: 7 + (i % 5),
        size: 10 + (i % 4) * 7,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-ai-float text-white/15"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.dur}s`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}

/** Made2Match — modern mobile splash / intro screen. */
export default function MobileSplash() {
  const router = useRouter();

  // PWA install prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    setInstalling(true);
    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex justify-center overflow-hidden"
      style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}
    >
      {/* Aurora glows */}
      <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(232,197,71,0.22)" }} />
      <div className="pointer-events-none absolute top-1/3 -left-24 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(255,106,156,0.25)" }} />
      <div className="pointer-events-none absolute -bottom-24 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(192,23,76,0.35)" }} />

      <FloatingHearts />

      <div className="relative z-10 w-full max-w-sm min-h-screen px-7 py-10 flex flex-col items-center text-center">
        {/* Emblem with rotating gradient ring + halo */}
        <div className="mt-12 relative w-48 h-48 flex items-center justify-center">
          {/* halo */}
          <div className="absolute w-48 h-48 rounded-full animate-ai-halo" style={{ background: `radial-gradient(circle, ${GOLD}55, transparent 70%)` }} />
          {/* rotating conic ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{ animationDuration: "9s", background: `conic-gradient(from 0deg, ${GOLD}, #ff7aa8, ${ROSE}, #7a0e2e, ${GOLD})` }}
          />
          {/* inner fill (makes the ring thin) */}
          <div className="absolute inset-[5px] rounded-full" style={{ background: "linear-gradient(160deg,#7d0e33,#4a0820)" }} />
          {/* glass core */}
          <div className="relative w-40 h-40 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/15" style={{ background: "rgba(255,255,255,0.06)" }}>
            <Image
              src="/golden-hearts.png"
              alt="Made2Match"
              width={140}
              height={140}
              priority
              className="w-[158px] h-auto object-contain drop-shadow-lg"
            />
            <span className="absolute top-9 left-10 text-amber-300 text-lg">✦</span>
            <span className="absolute top-12 right-10 text-amber-200 text-xs">✦</span>
          </div>
          {/* M2M badge */}
          <div className="absolute top-1 right-1 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg ring-2 ring-amber-300/60">
            <span className="text-[10px] font-black tracking-wide text-[#c0174c]">M2M</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-9 text-[45px] font-black leading-none drop-shadow" style={{ fontFamily: "Georgia, serif" }}>
          <span className="text-white">Made</span>
          <span style={{ color: GOLD }}>2</span>
          <span className="text-white">Match</span>
        </h1>
        {/* shimmer underline */}
        <div className="relative mt-2 h-1 w-44 rounded-full overflow-hidden" style={{ background: "rgba(232,197,71,0.4)" }}>
          <div className="absolute inset-0 animate-ai-shimmer" />
        </div>

        <p className="mt-3 text-[11px] font-bold tracking-[0.34em] text-amber-200/90">
          INDIA&apos;S NO.1 MATRIMONY
        </p>
        <p className="mt-2 text-sm text-white/90">Find your perfect life partner</p>

        {/* Indian flag pill */}
        <div className="mt-3 inline-flex h-3.5 w-16 rounded-full overflow-hidden shadow-sm ring-1 ring-white/30">
          <span className="flex-1" style={{ background: "#FF9933" }} />
          <span className="flex-1 bg-white flex items-center justify-center">
            <span className="text-[7px] leading-none text-blue-800">☸</span>
          </span>
          <span className="flex-1" style={{ background: "#138808" }} />
        </div>

        {/* Glass stat cards */}
        <div className="mt-8 grid grid-cols-3 gap-3 w-full">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl px-2 py-3.5 text-center backdrop-blur-md transition-transform active:scale-95"
              style={{
                background: s.highlight ? "rgba(232,197,71,0.16)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${s.highlight ? "rgba(232,197,71,0.6)" : "rgba(255,255,255,0.16)"}`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              <p className="text-xl font-black leading-none" style={{ color: GOLD }}>{s.value}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/75 mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button
          onClick={() => router.push("/register")}
          className="w-full mt-9 py-3.5 rounded-full text-[#5e0a24] font-extrabold text-base active:scale-[0.98] transition-transform"
          style={{
            background: `linear-gradient(135deg,#ffe08a,${GOLD} 55%,#d4a017)`,
            boxShadow: "0 10px 26px rgba(232,197,71,0.45), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          Register Free →
        </button>

        <button
          onClick={() => router.push("/login")}
          className="w-full mt-3 py-3.5 rounded-full text-white font-bold text-base backdrop-blur-sm active:scale-[0.98] transition-transform"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.45)" }}
        >
          Login
        </button>

        {/* PWA Install button — only when prompt is available and not yet installed */}
        {!isInstalled && installPrompt && (
          <button
            onClick={handleInstall}
            disabled={installing}
            className="w-full mt-3 py-3.5 rounded-full font-bold text-base active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(232,197,71,0.5)",
              color: GOLD,
            }}
          >
            {installing ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Installing…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Install App
              </>
            )}
          </button>
        )}

        {/* Already installed indicator */}
        {isInstalled && (
          <div className="mt-3 flex items-center justify-center gap-2 text-green-300 text-sm font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            App Installed
          </div>
        )}

        <p className="mt-auto pt-8 text-[10px] tracking-[0.28em] text-white/45">
          MADE WITH ❤ IN INDIA
        </p>
      </div>
    </div>
  );
}
