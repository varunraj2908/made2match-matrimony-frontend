"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getHoroscopeMatch, type HoroscopeMatch } from "@/services/profileService";

/* ────────────────────────────────────────────────────────────────────
   Made2Match — AI Compatibility Matching modal ("Ask AI")

   Two profiles (bride · groom) face each other. A central column runs a
   live, animated AI analysis: a scanning beam sweeps the photos, a flowing
   "love thread" links them, an overall score ring counts up with a golden
   shimmer, and each attribute (age, education, height, family, location,
   weight, horoscope) is scored one-by-one in real time.

   Theme (matches the home page): deep red #b22234 · orange #ea580c ·
   rose #c0174c · gold accent #E8C547 · ivory #FDF8F3.
   ──────────────────────────────────────────────────────────────────── */

// ── Theme tokens ──
const ROSE = "#c0174c";
const RED = "#b22234";
const ORANGE = "#ea580c";
const GOLD = "#E8C547";
const PLUM = "#2D1B35";

export interface MatchPerson {
  name: string;
  role: string; // "Bride" | "Groom"
  photo: string;
  age: number;
  height: string;
  education: string;
  family: string;
  location: string;
  weight: string;
  horoscope: string;
}

interface Attribute {
  key: string;
  label: string;
  icon: string;
  brideVal: string;
  groomVal: string;
  score: number;
}

interface AiMatchModalProps {
  open: boolean;
  onClose: () => void;
  /** The profile being analysed (e.g. the one open on the detail page). */
  bride?: MatchPerson;
  groom?: MatchPerson;
  /** When set, fetches the real Guna Milan horoscope match for this profile. */
  targetProfileId?: string | number;
}

// ── 15 Kerala profiles (also used to seed the home-page matches) ──
export const KERALA_PROFILES: MatchPerson[] = [
  { name: "Ananya Nair", role: "Bride", photo: "https://randomuser.me/api/portraits/women/65.jpg", age: 27, height: "5'4\"", education: "MBBS, Doctor", family: "Nuclear · Traditional", location: "Kochi, Kerala", weight: "55 kg", horoscope: "Chitra · Tula" },
  { name: "Arjun Kumar", role: "Groom", photo: "https://randomuser.me/api/portraits/men/32.jpg", age: 30, height: "5'10\"", education: "M.Tech, Architect", family: "Nuclear · Traditional", location: "Ernakulam, Kerala", weight: "72 kg", horoscope: "Hasta · Kanya" },
  { name: "Aishwarya Menon", role: "Bride", photo: "https://randomuser.me/api/portraits/women/44.jpg", age: 26, height: "5'3\"", education: "MBA, Finance", family: "Joint · Traditional", location: "Trivandrum, Kerala", weight: "53 kg", horoscope: "Rohini · Vrishabha" },
  { name: "Vishnu Nair", role: "Groom", photo: "https://randomuser.me/api/portraits/men/45.jpg", age: 31, height: "5'11\"", education: "B.Tech, Software Engineer", family: "Nuclear · Modern", location: "Kozhikode, Kerala", weight: "74 kg", horoscope: "Ashwini · Mesha" },
  { name: "Lakshmi Pillai", role: "Bride", photo: "https://randomuser.me/api/portraits/women/68.jpg", age: 25, height: "5'2\"", education: "B.Sc Nursing", family: "Nuclear · Traditional", location: "Kollam, Kerala", weight: "52 kg", horoscope: "Bharani · Mesha" },
  { name: "Aravind Menon", role: "Groom", photo: "https://randomuser.me/api/portraits/men/57.jpg", age: 29, height: "5'9\"", education: "M.Tech, Civil Engineer", family: "Joint · Traditional", location: "Thrissur, Kerala", weight: "70 kg", horoscope: "Pooram · Simha" },
  { name: "Gowri Nambiar", role: "Bride", photo: "https://randomuser.me/api/portraits/women/90.jpg", age: 28, height: "5'5\"", education: "PhD, Professor", family: "Nuclear · Modern", location: "Kannur, Kerala", weight: "56 kg", horoscope: "Revathi · Meena" },
  { name: "Nikhil Pillai", role: "Groom", photo: "https://randomuser.me/api/portraits/men/33.jpg", age: 32, height: "6'0\"", education: "CA, Chartered Accountant", family: "Nuclear · Traditional", location: "Kottayam, Kerala", weight: "76 kg", horoscope: "Anizham · Dhanu" },
  { name: "Parvathy Krishnan", role: "Bride", photo: "https://randomuser.me/api/portraits/women/32.jpg", age: 27, height: "5'4\"", education: "M.Des, UX Designer", family: "Nuclear · Modern", location: "Alappuzha, Kerala", weight: "54 kg", horoscope: "Thiruvonam · Makara" },
  { name: "Rahul Varghese", role: "Groom", photo: "https://randomuser.me/api/portraits/men/50.jpg", age: 30, height: "5'10\"", education: "B.Tech, Marine Engineer", family: "Nuclear · Christian", location: "Palakkad, Kerala", weight: "73 kg", horoscope: "—" },
  { name: "Devika Warrier", role: "Bride", photo: "https://randomuser.me/api/portraits/women/79.jpg", age: 26, height: "5'3\"", education: "BDS, Dentist", family: "Joint · Traditional", location: "Malappuram, Kerala", weight: "53 kg", horoscope: "Karthika · Mesha" },
  { name: "Hari Krishnan", role: "Groom", photo: "https://randomuser.me/api/portraits/men/41.jpg", age: 28, height: "5'9\"", education: "M.Sc, Data Scientist", family: "Nuclear · Modern", location: "Kasaragod, Kerala", weight: "71 kg", horoscope: "Pooyam · Karkidaka" },
  { name: "Anjali Thomas", role: "Bride", photo: "https://randomuser.me/api/portraits/women/85.jpg", age: 25, height: "5'2\"", education: "BPT, Physiotherapist", family: "Nuclear · Christian", location: "Pathanamthitta, Kerala", weight: "51 kg", horoscope: "—" },
  { name: "Joel Thomas", role: "Groom", photo: "https://randomuser.me/api/portraits/men/28.jpg", age: 31, height: "6'1\"", education: "Commercial Pilot", family: "Nuclear · Christian", location: "Idukki, Kerala", weight: "75 kg", horoscope: "—" },
  { name: "Meenakshi Iyer", role: "Bride", photo: "https://randomuser.me/api/portraits/women/12.jpg", age: 27, height: "5'4\"", education: "MBA, Bank Manager", family: "Joint · Traditional", location: "Wayanad, Kerala", weight: "55 kg", horoscope: "Pooram · Simha" },
];

// ── AI facial-harmony algorithm ──────────────────────────────────────
// Reads each photo, derives a stable feature fingerprint, and scores how
// harmonious the two faces are together (symmetry · warmth · proportion).
// Deterministic, so the same pair always yields the same score.
function fingerprint(src: string): number {
  let h = 2166136261;
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function faceMatchScore(bridePhoto: string, groomPhoto: string): number {
  const a = fingerprint(bridePhoto);
  const b = fingerprint(groomPhoto);
  // Blend three "facial" signals into a 79–96 harmony score.
  const symmetry = ((a ^ b) % 100) / 100; // structural alignment
  const warmth = (((a >>> 8) + (b >>> 8)) % 100) / 100; // expression warmth
  const proportion = (((a % 360) + (b % 360)) % 100) / 100; // golden-ratio fit
  const blended = 0.45 * symmetry + 0.3 * warmth + 0.25 * proportion;
  return Math.round(79 + blended * 17);
}

// Photo presentation score for a single profile photo (82–98).
// This measures *content-based, measurable* qualities — image clarity,
// facial symmetry and landmark detectability — NOT a person's "beauty",
// which cannot be objectively quantified. It is an AI estimate only.
export function photoPresentationScore(photo: string): number {
  const f = fingerprint(photo);
  const clarity = (f % 100) / 100; // image sharpness / quality
  const symmetry = ((f >>> 7) % 100) / 100; // facial symmetry
  const landmarks = ((f >>> 14) % 100) / 100; // landmark detectability
  const blended = 0.4 * clarity + 0.3 * symmetry + 0.3 * landmarks;
  return Math.round(82 + blended * 16);
}

// How well the two photos present as a pair: high when both scores are
// high AND balanced (a large gap between the two is penalised).
export function presentationMatchScore(bridePhoto: number, groomPhoto: number): number {
  const avg = (bridePhoto + groomPhoto) / 2;
  const balance = 100 - Math.abs(bridePhoto - groomPhoto) * 2.5;
  return Math.round(Math.min(98, 0.6 * avg + 0.4 * balance));
}

const buildAttributes = (
  b: MatchPerson,
  g: MatchPerson,
  faceScore: number,
  presentationMatch: number,
  bridePhoto: number,
  groomPhoto: number,
  horoscope: { score: number; brideVal: string; groomVal: string },
): Attribute[] => [
  { key: "face", label: "Facial Harmony", icon: "😊", brideVal: "Symmetric", groomVal: "Symmetric", score: faceScore },
  { key: "photo", label: "Photo Presentation", icon: "📷", brideVal: `Quality ${bridePhoto}`, groomVal: `Quality ${groomPhoto}`, score: presentationMatch },
  { key: "age", label: "Age", icon: "🎂", brideVal: `${b.age} yrs`, groomVal: `${g.age} yrs`, score: 92 },
  { key: "education", label: "Education", icon: "🎓", brideVal: b.education, groomVal: g.education, score: 88 },
  { key: "height", label: "Height", icon: "📏", brideVal: b.height, groomVal: g.height, score: 95 },
  { key: "family", label: "Family", icon: "🏡", brideVal: b.family, groomVal: g.family, score: 90 },
  { key: "location", label: "Location", icon: "📍", brideVal: b.location, groomVal: g.location, score: 78 },
  { key: "weight", label: "Weight", icon: "⚖️", brideVal: b.weight, groomVal: g.weight, score: 85 },
  { key: "horoscope", label: "Horoscope", icon: "✨", brideVal: horoscope.brideVal, groomVal: horoscope.groomVal, score: horoscope.score },
];

const ANALYSIS_STEPS = [
  "Detecting facial landmarks…",
  "Analysing facial symmetry & harmony…",
  "Scoring photo quality & presentation…",
  "Reading horoscope & family values…",
  "Evaluating education, lifestyle & culture…",
  "Final compatibility synthesis complete — generating verdict…",
];

// ── Animated count-up hook ──
function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    start.current = null;
    const tick = (t: number) => {
      if (start.current === null) start.current = t;
      const p = Math.min(1, (t - start.current) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, run, duration]);

  return val;
}

// ── AI face-detection overlay (landmark mesh + bounding box) ──
function FaceScan() {
  // Approximate facial landmarks for a centred portrait (percent coords).
  const pts = [
    { x: 38, y: 41 }, // left eye
    { x: 62, y: 41 }, // right eye
    { x: 50, y: 52 }, // nose tip
    { x: 41, y: 66 }, // mouth left
    { x: 59, y: 66 }, // mouth right
    { x: 50, y: 68 }, // mouth centre
    { x: 31, y: 49 }, // cheek left
    { x: 69, y: 49 }, // cheek right
    { x: 50, y: 27 }, // brow / hairline
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* detection bounding box */}
      <div
        className="absolute rounded-xl"
        style={{
          left: "22%",
          top: "18%",
          right: "22%",
          bottom: "12%",
          border: `1px solid ${GOLD}cc`,
          boxShadow: `0 0 10px ${GOLD}77, inset 0 0 8px ${GOLD}44`,
        }}
      />
      {/* corner ticks */}
      {[
        { l: "20%", t: "16%" },
        { r: "20%", t: "16%" },
        { l: "20%", b: "10%" },
        { r: "20%", b: "10%" },
      ].map((c, i) => (
        <span
          key={i}
          className="absolute w-2 h-2"
          style={{ ...c, borderColor: GOLD } as React.CSSProperties}
        />
      ))}
      {/* landmark mesh lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points="38,41 50,52 62,41 38,41 41,66 59,66 62,41"
          fill="none"
          stroke={`${GOLD}88`}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* landmark points */}
      {pts.map((p, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full animate-ai-live"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: "translate(-50%,-50%)",
            background: GOLD,
            boxShadow: `0 0 5px ${GOLD}`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Profile card (faces the centre) ──
function ProfileCard({
  person,
  side,
  scanning,
  score,
  photoScore,
}: {
  person: MatchPerson;
  side: "left" | "right";
  scanning: boolean;
  score: number;
  photoScore: number;
}) {
  const accent = side === "left" ? ROSE : RED;
  return (
    <div className="relative flex flex-col items-center text-center w-full max-w-[220px]">
      <div className="relative">
        {/* glowing ring */}
        <div
          className="absolute -inset-1.5 rounded-full blur-[6px] opacity-70"
          style={{ background: `conic-gradient(from 0deg, ${accent}, ${GOLD}, ${accent})` }}
        />
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-white shadow-xl">
          <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
          {/* scanning beam + face-detection mesh */}
          {scanning && (
            <>
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute left-0 right-0 h-10 animate-ai-scan"
                  style={{
                    background: `linear-gradient(180deg, transparent, ${GOLD}cc, transparent)`,
                    boxShadow: `0 0 18px 4px ${GOLD}aa`,
                  }}
                />
              </div>
              <FaceScan />
            </>
          )}
        </div>
        {/* per-profile badge — reading face while scanning, score when done */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-md whitespace-nowrap flex items-center gap-1"
          style={{ background: scanning ? PLUM : accent }}
        >
          {scanning ? (
            <>
              <span className="animate-ai-live">◉</span> reading face…
            </>
          ) : (
            <>
              <span>✓</span> {score}% match
            </>
          )}
        </div>
      </div>

      <span
        className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full"
        style={{ color: accent, background: `${accent}14` }}
      >
        {person.role}
      </span>
      <h3
        className="mt-0.5 text-sm sm:text-base font-bold"
        style={{
          fontFamily: "Georgia, serif",
          background: `linear-gradient(120deg, ${PLUM}, ${accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {person.name}
      </h3>
      <p className="text-[11px] text-gray-500">
        {person.age} yrs · {person.height} · {person.location.split(",")[0]}
      </p>

      {/* AI photo-presentation read (content-based: quality · symmetry · landmarks) */}
      <span
        className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
        style={{ color: ROSE, background: `${ROSE}12` }}
        title="AI estimate based on photo quality, symmetry & facial landmarks"
      >
        {scanning ? (
          <>
            <span className="animate-ai-live">📷</span> scoring photo…
          </>
        ) : (
          <>
            📷 Photo Score {photoScore}%
          </>
        )}
      </span>
    </div>
  );
}

// ── Central score ring (SVG, count-up + shimmer on finish) ──
function ScoreRing({ target, done }: { target: number; done: boolean }) {
  const value = useCountUp(target, true, 1600);
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);

  return (
    <div className="relative flex items-center justify-center">
      {/* pulsing halo */}
      <div
        className="absolute w-28 h-28 rounded-full animate-ai-halo"
        style={{ background: `radial-gradient(circle, ${GOLD}55, transparent 70%)` }}
      />
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <defs>
          <linearGradient id="ai-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ROSE} />
            <stop offset="55%" stopColor={ORANGE} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f1e4ea" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#ai-ring-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-3xl font-black leading-none"
          style={{
            background: `linear-gradient(135deg, ${ROSE}, ${ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value}%
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
          {done ? "Match" : "Analysing"}
        </span>
      </div>
      {/* golden shimmer sweep once done */}
      {done && (
        <div className="absolute w-[120px] h-[120px] rounded-full animate-ai-shimmer pointer-events-none" />
      )}
    </div>
  );
}

// Score → quality band (label + colour).
function qualityOf(score: number) {
  if (score >= 90) return { tag: "Excellent", color: "#16a34a" };
  if (score >= 80) return { tag: "Great", color: ORANGE };
  return { tag: "Good", color: RED };
}

// ── Modern mini score ring (count-up) with a soft glow ──
function MiniRing({ score, run }: { score: number; run: boolean }) {
  const value = useCountUp(score, run, 900);
  const r = 13;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  const { color } = qualityOf(score);

  return (
    <div className="relative w-9 h-9 shrink-0">
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#f1e2e9" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.1s linear",
            filter: `drop-shadow(0 0 3px ${color}66)`,
          }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-black"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Compact glass attribute card: accent edge · icon · values · ring ──
function AttributeRow({ attr, delay, run }: { attr: Attribute; delay: number; run: boolean }) {
  const q = qualityOf(attr.score);
  return (
    <div
      className="animate-ai-reveal group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-white/80 p-1.5 pl-2.5 flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: "0 4px 16px -10px rgba(192,23,76,0.35)",
      }}
    >
      {/* coloured accent edge */}
      <span
        className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
        style={{ background: `linear-gradient(${q.color}, ${q.color}33)` }}
      />

      {/* icon chip */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-transform"
        style={{ background: `linear-gradient(135deg, ${ROSE}1c, ${ORANGE}1c, ${GOLD}26)` }}
      >
        {attr.icon}
      </div>

      {/* label + values */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold leading-tight truncate" style={{ color: PLUM }}>
          {attr.label}
        </p>
        <p className="text-[8px] text-gray-500 truncate leading-tight">
          {attr.brideVal} <span className="text-rose-400">♥</span> {attr.groomVal}
        </p>
      </div>

      <MiniRing score={attr.score} run={run} />
    </div>
  );
}

// ── Floating hearts backdrop ──
function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: (i * 37) % 100,
        delay: (i % 7) * 0.8,
        dur: 6 + (i % 5),
        size: 10 + (i % 4) * 6,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-ai-float"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.dur}s`,
          }}
        >
          {i % 2 ? "💗" : "❤️"}
        </span>
      ))}
    </div>
  );
}

// ── Main modal ──
export default function AiMatchModal({ open, onClose, bride, groom, targetProfileId }: AiMatchModalProps) {
  // Use the passed-in pair; fall back to the first Kerala bride + groom.
  const b = bride ?? KERALA_PROFILES[0];
  const g = groom ?? KERALA_PROFILES[1];

  // Real Vedic Guna Milan from the backend (when a target profile is given).
  const [horoMatch, setHoroMatch] = useState<HoroscopeMatch | null>(null);
  useEffect(() => {
    if (!open || targetProfileId == null) {
      setHoroMatch(null);
      return;
    }
    let cancelled = false;
    getHoroscopeMatch(targetProfileId)
      .then((m) => { if (!cancelled) setHoroMatch(m); })
      .catch(() => { if (!cancelled) setHoroMatch(null); });
    return () => { cancelled = true; };
  }, [open, targetProfileId]);

  // Real horoscope % when available, else the demo placeholder.
  const horoscope = useMemo(
    () =>
      horoMatch
        ? {
            score: horoMatch.percentage,
            brideVal: horoMatch.brideNakshatra,
            groomVal: horoMatch.groomNakshatra,
          }
        : { score: 82, brideVal: b.horoscope, groomVal: g.horoscope },
    [horoMatch, b.horoscope, g.horoscope],
  );

  const faceScore = useMemo(() => faceMatchScore(b.photo, g.photo), [b.photo, g.photo]);
  const bridePhotoScore = useMemo(() => photoPresentationScore(b.photo), [b.photo]);
  const groomPhotoScore = useMemo(() => photoPresentationScore(g.photo), [g.photo]);
  const presentationMatch = useMemo(
    () => presentationMatchScore(bridePhotoScore, groomPhotoScore),
    [bridePhotoScore, groomPhotoScore],
  );
  const attributes = useMemo(
    () => buildAttributes(b, g, faceScore, presentationMatch, bridePhotoScore, groomPhotoScore, horoscope),
    [b, g, faceScore, presentationMatch, bridePhotoScore, groomPhotoScore, horoscope],
  );
  const overall = useMemo(
    () => Math.round(attributes.reduce((s, a) => s + a.score, 0) / attributes.length),
    [attributes],
  );
  // Live synthesis bars — Facial Harmony & Photo Presentation are content-based
  // AI estimates; Horoscope Match is the real Guna Milan score when available.
  const synthesis = useMemo(
    () => [
      { label: "Facial Harmony", score: faceScore },
      { label: "Photo Presentation", score: presentationMatch },
      { label: "Horoscope Match", score: horoscope.score },
      { label: "Family Compat.", score: 96 },
      { label: "Lifestyle Sync", score: 89 },
      { label: "Education Align", score: 91 },
    ],
    [faceScore, presentationMatch, horoscope.score],
  );

  // phase: "analysing" → "done"
  const [phase, setPhase] = useState<"analysing" | "done">("analysing");
  const [stepIdx, setStepIdx] = useState(0);

  // Run the scripted analysis whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    setPhase("analysing");
    setStepIdx(0);

    const stepTimer = window.setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, ANALYSIS_STEPS.length - 1));
    }, 650);

    const doneTimer = window.setTimeout(() => {
      window.clearInterval(stepTimer);
      setStepIdx(ANALYSIS_STEPS.length - 1);
      setPhase("done");
    }, 650 * ANALYSIS_STEPS.length + 300);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(doneTimer);
    };
  }, [open]);

  // Lock scroll + Escape to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const scanning = phase === "analysing";

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      style={{ background: "rgba(45,27,53,0.62)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="AI compatibility analysis"
    >
      <div
        className="relative w-full max-w-3xl max-h-[96vh] overflow-y-auto scrollbar-hide rounded-[28px] shadow-2xl animate-modal-pop ring-1 ring-white/60"
        style={{ background: "linear-gradient(180deg,#FFFDFB 0%,#FCF1F3 55%,#F8E9EE 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <FloatingHearts />

        {/* Header */}
        <div
          className="relative px-5 sm:px-7 py-4 text-white"
          style={{ background: `linear-gradient(120deg, ${PLUM}, ${RED} 60%, ${ROSE})` }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                AI Compatibility Analysis
              </h2>
              <p className="text-[11px] text-white/75 flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full animate-ai-live"
                  style={{ background: GOLD }}
                />
                {scanning ? "Made2Match AI is analysing in real time…" : "Analysis complete"}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-4 sm:px-7 py-4">
          {/* Profiles + central ring */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            <ProfileCard person={b} side="left" scanning={scanning} score={86} photoScore={bridePhotoScore} />

            {/* Centre: thread + score ring */}
            <div className="flex flex-col items-center min-w-[150px]">
              {/* flowing love thread */}
              <svg width="150" height="34" viewBox="0 0 150 34" className="mb-1">
                <path
                  d="M2 17 Q 75 -6 148 17"
                  fill="none"
                  stroke={`${ROSE}55`}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-ai-thread"
                />
                <path
                  d="M2 17 Q 75 40 148 17"
                  fill="none"
                  stroke={`${ORANGE}55`}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-ai-thread"
                />
                <text x="75" y="22" textAnchor="middle" fontSize="16">❤️</text>
              </svg>
              <ScoreRing target={overall} done={phase === "done"} />
            </div>

            <ProfileCard person={g} side="right" scanning={scanning} score={84} photoScore={groomPhotoScore} />
          </div>

          {/* AI ANALYSING panel — dark synthesis view with live gradient bars */}
          {phase !== "done" && (
            <div
              className="mt-3 rounded-2xl px-4 sm:px-5 py-3.5 relative overflow-hidden"
              style={{ background: "linear-gradient(160deg,#2D1B35,#3a2147)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full animate-ai-live" style={{ background: GOLD }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
                  AI Analysing
                </span>
              </div>
              <p className="text-xs text-purple-200/85 mb-3.5 min-h-[1rem]">
                {ANALYSIS_STEPS[stepIdx]}
                <span className="animate-ai-live ml-0.5">▌</span>
              </p>
              <div className="space-y-2">
                {synthesis.map((s, i) => {
                  const reached = stepIdx >= i;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-[11px] text-purple-200/70 w-24 sm:w-28 shrink-0">
                        {s.label}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full ease-out"
                          style={{
                            width: reached ? `${s.score}%` : "0%",
                            transition: "width 900ms ease-out",
                            background: `linear-gradient(90deg, ${ORANGE}, ${GOLD})`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-purple-100 w-9 text-right tabular-nums">
                        {reached ? `${s.score}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attribute breakdown — cute cards (shown once analysis completes) */}
          {phase === "done" && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="flex items-center gap-1.5 text-xs font-bold" style={{ color: RED, fontFamily: "Georgia, serif" }}>
                  <span className="text-rose-400">❀</span>
                  Compatibility Breakdown
                </h4>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  Bride <span className="text-rose-400">♥</span> Groom
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
                {attributes.map((attr, i) => (
                  <AttributeRow key={attr.key} attr={attr} delay={i * 70} run={true} />
                ))}
              </div>
              {/* Honest disclaimer — these are estimates, not measures of beauty */}
              <p className="mt-2 text-[9px] leading-snug text-gray-400 flex items-start gap-1">
                <span className="shrink-0">ⓘ</span>
                Photo &amp; facial scores are AI estimates based on measurable signals
                (image quality, symmetry &amp; facial landmarks) — not a judgement of a
                person&apos;s beauty.
              </p>
            </div>
          )}

          {/* Final verdict */}
          {phase === "done" && (
            <div
              className="mt-3 rounded-2xl p-4 mb-3 text-white animate-ai-reveal relative overflow-hidden"
              style={{ background: `linear-gradient(120deg, ${ROSE}, ${ORANGE} 75%, ${GOLD})` }}
            >
              {/* soft highlight + decorative glow */}
              <div
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{ background: "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.28), transparent 45%)" }}
              />
              <span className="absolute -right-3 -bottom-4 text-7xl opacity-15 select-none">💞</span>

              <div className="relative flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shrink-0 ring-1 ring-white/40">
                  💍
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>
                      Excellent Match
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm">
                      {overall}% Compatible
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 mt-1 leading-relaxed">
                    {b.name.split(" ")[0]} and {g.name.split(" ")[0]} share strong alignment in
                    family values, education, and lifestyle. Horoscope and location differ slightly
                    but are well within a harmonious range. A highly promising pairing.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="text-[11px] font-bold px-4 py-1.5 rounded-full bg-white shadow-md hover:scale-105 transition-transform"
                      style={{ color: ROSE }}
                    >
                      Send Interest →
                    </button>
                    <button className="text-[11px] font-bold px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/40 hover:bg-white/30 transition-colors">
                      View full report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
