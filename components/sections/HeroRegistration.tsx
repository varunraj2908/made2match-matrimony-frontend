"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useRegister } from "@/hooks/useRegister";

import { registerSchema, RegisterRequest } from "@/schemas/authSchema";

import { useRouter } from "next/navigation";

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
    eyebrow: "Made2Match Matrimony",
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

export default function HeroRegistration() {
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

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setValidationErrors({
      ...validationErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        errors[fieldName] = issue.message;
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
    <section
      className="
        relative
        bg-white
        lg:bg-transparent
      "
    >
      {/* MOBILE WHITE BACKGROUND */}
      <div className="absolute inset-0 bg-white lg:hidden"></div>

      {/* DESKTOP BACKGROUND CAROUSEL — large screens only */}
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
          // style={{
          //   background:
          //     "linear-gradient(135deg, rgba(139,26,58,0.78) 0%, rgba(192,23,76,0.65) 60%, rgba(212,24,90,0.55) 100%)",
          // }}
        />
      </div>

      {/* 80%-max content wrapper (centered with left/right gutters on lg+) */}
      <div className="relative z-10 w-full lg:max-w-[80%] mx-auto flex flex-col lg:flex-row items-stretch">

      {/* MOBILE COUPLE IMAGE — small screens only */}
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

      {/* LEFT CONTENT — large screens only (rotates with the carousel) */}
      <div className="hidden lg:flex relative z-10 lg:w-1/2 flex-col justify-center px-12 py-16 text-white">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className="absolute inset-0 px-12 py-16 flex flex-col justify-center transition-opacity duration-700 ease-out"
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
        <div className="absolute bottom-6 left-12 flex items-center gap-2">
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

      {/* RIGHT FORM */}
      <div className="relative z-10 flex-1 lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 lg:px-10 lg:py-8">
        {/* TITLE — mobile only (desktop shows left column instead) */}
        <div className="text-center mb-6 lg:hidden">
          <h2 className="text-[#c0174c] text-2xl font-bold tracking-wide">
            Find Your Perfect Match
          </h2>

          <p className="text-gray-500 text-xs mt-1">
            Create your free profile in seconds
          </p>
        </div>

        {/* CARD */}
        <div
          className="
            w-full
            max-w-sm
            lg:max-w-md
            rounded-2xl
            p-6
            lg:p-7
            flex
            flex-col
            gap-4
          "
          style={{
            background:
              typeof window !== "undefined" && window.innerWidth < 1024
                ? "#a01040"
                : "rgba(15, 8, 18, 0.55)",

            backdropFilter:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "blur(22px) saturate(140%)"
                : "none",
            WebkitBackdropFilter:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "blur(22px) saturate(140%)"
                : "none",

            border:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "1px solid rgba(255,255,255,0.28)"
                : "1px solid rgba(255,255,255,0.12)",

            boxShadow:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)"
                : "0 4px 18px rgba(0,0,0,0.15)",
          }}
        >
          {/* FULL NAME */}
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* MOBILE NUMBER */}
          <div>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.mobileNumber && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.mobileNumber}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] active:scale-95 mt-1 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #e05a1a, #cebd05)",
              boxShadow: "0 4px 18px rgba(224,90,26,0.5)",
            }}
          >
            {isPending ? "Registering..." : "Join Now For Free 🎉"}
          </button>

          {/* SUCCESS */}
          {isSuccess && (
            <p className="text-green-500 text-sm text-center">
              Registration successful!
            </p>
          )}

          {/* API ERROR */}
          {isError && (
            <p className="text-red-500 text-sm text-center">
              {(error as any)?.response?.data?.message || "Registration failed"}
            </p>
          )}

          {/* LOGIN */}
          <p className="text-center text-gray-500 lg:text-white/40 text-xs">
            Already registered?{" "}
            <a
              href="/login"
              className="text-[#c0174c] lg:text-white/80 underline font-medium hover:text-[#a01040] lg:hover:text-white transition"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
