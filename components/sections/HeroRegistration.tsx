"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useRegister } from "@/hooks/useRegister";
import { registerSchema, RegisterRequest } from "@/schemas/authSchema";

/* ============================================================
   SEARCH-BAR DATA
============================================================ */
type LookingFor = "bride" | "groom";

const AGE_OPTIONS = [
  "18 - 22", "22 - 26", "26 - 30",
  "30 - 35", "35 - 40", "40 - 45", "45+",
];
const LOCATION_OPTIONS = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad",
  "Chennai", "Kochi", "Kolkata", "Pune",
];
const RELIGION_OPTIONS = [
  "Hindu", "Muslim", "Christian", "Sikh",
  "Buddhist", "Jain", "Other",
];

/* ============================================================
   HERO CAROUSEL DATA
============================================================ */
interface Slide {
  image: string;
  eyebrow: string;
  headline: React.ReactNode;
  subtitle: string;
  bullets: string[];
}

const SLIDES: Slide[] = [
  {
    image: "/matrimony1.webp",
    eyebrow: "Made2Match",
    headline: (
      <>
        Find your perfect <span className="block">life partner</span>
      </>
    ),
    subtitle:
      "Trusted by lakhs of families. Verified profiles, curated matches, and meaningful connections — all in one place.",
    bullets: [
      "100% verified profiles",
      "Privacy-first matchmaking",
      "Free to register, free to browse",
    ],
  },
  {
    image: "/matrimony7.jpg",
    eyebrow: "Tradition meets technology",
    headline: (
      <>
        Where love finds <span className="block">tradition</span>
      </>
    ),
    subtitle:
      "From Kerala to Karnataka — celebrate heritage while finding the partner who shares your values and dreams.",
    bullets: [
      "Caste, religion & community filters",
      "Star and horoscope compatibility",
      "Family-friendly conversations",
    ],
  },
  {
    image: "/matrimony8.jpg",
    eyebrow: "Real stories, real weddings",
    headline: (
      <>
        Lakhs of happy <span className="block">marriages</span>
      </>
    ),
    subtitle:
      "Featured in the Limca Book of Records — the most documented marriages online. Your story could be next.",
    bullets: [
      "Verified success stories",
      "Personalised match recommendations",
      "Premium assistance available",
    ],
  },
];

/* ============================================================
   COMPONENT
============================================================ */
export default function HeroRegistration() {
  return <HeroForm />;
}

/* ─── Search bar ────────────────────────────────────────────── */
export function SearchBar() {
  const router = useRouter();
  const [lookingFor, setLookingFor] = useState<LookingFor>("bride");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [religion, setReligion] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (lookingFor) params.set("for", lookingFor);
    if (age) params.set("age", age);
    if (location) params.set("location", location);
    if (religion) params.set("religion", religion);
    router.push(`/profiles?${params.toString()}`);
  };

  return (
    <section
      className="relative py-3 w-full px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #fc8bab 0%, #c0174c 60%, #d4185a 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative max-w-6xl mx-auto py-3 lg:py-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 gap-3">
          {/* Brand */}
          <div className="flex flex-col leading-tight shrink-0">
            <span
              className="text-white text-[27px] tracking-wide font-bold"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              Find Your Match
            </span>
            <span className="text-white/75 text-[10px] tracking-wide">
              Your perfect match is just a click away
            </span>
          </div>

          {/* Filters */}
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-xs font-semibold">Looking</span>
              {/* Segmented pill toggle (Bride / Groom) */}
              <div className="inline-flex items-center rounded-full bg-white p-1 shadow-sm">
                {(["bride", "groom"] as LookingFor[]).map((opt) => {
                  const isActive = lookingFor === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setLookingFor(opt)}
                      aria-label={`Looking for ${opt}`}
                      className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                        isActive ? "text-white" : "text-gray-500 hover:text-[#c0174c]"
                      }`}
                      style={{
                        background: isActive ? "#c0174c" : "transparent",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <FilterSelect value={age}      onChange={setAge}      placeholder="Age"             options={AGE_OPTIONS} />
            <FilterSelect value={location} onChange={setLocation} placeholder="Select Location" options={LOCATION_OPTIONS} />
            <FilterSelect value={religion} onChange={setReligion} placeholder="Select Religion" options={RELIGION_OPTIONS} />

            <button
              onClick={handleSearch}
              className="btn-primary text-xs tracking-widest px-6 py-3 rounded-md cursor-pointer shrink-0"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Compact filter select ─────────────────────────────────── */
function FilterSelect({
  value, onChange, placeholder, options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative flex-1 sm:flex-initial w-full sm:w-50">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full appearance-none bg-[white] text-black text-xs font-semibold pl-3 pr-8 py-3 rounded-md outline-none  cursor-pointer transition-colors"
      >
        <option value="" className="text-gray-800">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-gray-800">{o}</option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

/* ─── Full hero registration form with background carousel ─── */
function HeroForm() {
  const router = useRouter();
  const { mutate, isPending, isError, error, isSuccess } = useRegister();

  const [bgIdx, setBgIdx] = useState(0);
  useEffect(() => {
    const t = window.setInterval(
      () => setBgIdx((i) => (i + 1) % SLIDES.length),
      5000,
    );
    return () => window.clearInterval(t);
  }, []);

  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setValidationErrors(errors);
      return;
    }
    mutate(formData, {
      onSuccess: (res: any) => {
        const tokens = res?.data;
        if (tokens?.accessToken) {
          localStorage.setItem("token", tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem("refreshToken", tokens.refreshToken);
          }
        }
        router.push("/onboarding/basic-details");
      },
    });
  };

  return (
    <section className="relative bg-white lg:bg-transparent ">
      {/* Mobile white background */}
      <div className="absolute inset-0 bg-white lg:hidden" />

      {/* Desktop background carousel */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        {SLIDES.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out"
            style={{ opacity: i === bgIdx ? 1 : 0 }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* 80%-max content wrapper */}
      <div className="relative z-10 w-full lg:max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch">

        {/* MOBILE COUPLE IMAGE */}
        <div className="lg:hidden relative w-full overflow-hidden flex justify-center items-end pt-6">
          <Image
            src="/Newlywed South Asian couple in traditional attire.png"
            alt="Couple"
            width={500}
            height={500}
            className="object-contain w-65 sm:w-85"
          />
          <div
            className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 100%)",
            }}
          />
        </div>

        {/* LEFT — rotating content (lg+) */}
        <div className="hidden lg:flex relative z-10 lg:w-1/2 flex-col justify-center px-6 py-12 text-white">
          {SLIDES.map((s, i) => (
            <div
              key={s.image}
              className="absolute inset-0 px-6 py-12 flex flex-col justify-center transition-opacity duration-700 ease-out"
              style={{
                opacity: i === bgIdx ? 1 : 0,
                pointerEvents: i === bgIdx ? "auto" : "none",
                textShadow: "0 2px 12px rgba(0,0,0,0.45)",
              }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/90 mb-3">
                {s.eyebrow}
              </span>
              <h1 className="text-5xl font-black leading-[1.05] mb-4">
                {s.headline}
              </h1>
              <p className="text-base text-white/90 max-w-md mb-7 leading-relaxed">
                {s.subtitle}
              </p>
              <ul className="space-y-2.5">
                {s.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/95">
                    <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Slide indicator dots */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setBgIdx(i)}
                aria-label={`Show slide ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === bgIdx ? 28 : 8,
                  background: i === bgIdx ? "white" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — registration form */}
        <div className="relative z-10 flex-1 lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 lg:px-6 lg:py-12">
          <div
            className="
              w-full max-w-sm lg:max-w-md rounded-2xl overflow-hidden flex flex-col
              bg-white border border-[#f0d9e0]
              shadow-[0_12px_34px_rgba(192,23,76,0.15)]
              lg:backdrop-blur-md
            "
          >
            {/* Header — content above the form */}
            <div
              className="px-6 pt-4 pb-3 text-center border-b border-[#f6e3ea]"
              style={{ background: "linear-gradient(135deg, #fff0f5, #fde7ef)" }}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-xl mb-1.5">
                💍
              </div>
              <h3 className="text-[#c0174c] text-lg font-bold tracking-wide">
                Create Your Free Profile
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                Join lakhs of happy members &amp; find your perfect match on Made2Match
              </p>
            </div>

            {/* Body */}
            <div className="px-6 lg:px-7 py-4 flex flex-col gap-3">
            {/* FULL NAME */}
            <FormField
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              error={validationErrors.fullName}
            />

            {/* EMAIL */}
            <FormField
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={validationErrors.email}
            />

            {/* MOBILE NUMBER */}
            <FormField
              name="mobileNumber"
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              error={validationErrors.mobileNumber}
            />

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full px-4 pr-14 py-3 rounded-xl text-sm outline-none transition-colors
                    bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400
                    focus:border-[#c0174c] focus:bg-white
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c0174c] text-xs font-semibold px-1"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="btn-primary w-full py-3 rounded-xl text-sm tracking-wide mt-1"
            >
              {isPending ? "Registering..." : "Join Now For Free 🎉"}
            </button>

            {isSuccess && (
              <p className="text-green-500 text-sm text-center">
                Registration successful!
              </p>
            )}
            {isError && (
              <p className="text-red-500 text-sm text-center">
                {(error as any)?.response?.data?.message || "Registration failed"}
              </p>
            )}

            <p className="text-center text-gray-500 text-xs">
              Already registered?{" "}
              <a
                href="/login"
                className="text-[#c0174c] underline font-medium hover:text-[#a01040] transition"
              >
                Sign in
              </a>
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Form field ────────────────────────────────────────────── */
function FormField({
  name, type, placeholder, value, onChange, error,
}: {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors
          bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400
          focus:border-[#c0174c] focus:bg-white
        "
      />
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
