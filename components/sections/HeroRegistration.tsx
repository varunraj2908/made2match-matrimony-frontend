"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { registerSchema, RegisterRequest } from "@/schemas/authSchema";
import RegistrationConsent from "@/components/ui/RegistrationConsent";

type LookingFor = "bride" | "groom";
const AGE_OPTIONS = ["18 - 22","22 - 26","26 - 30","30 - 35","35 - 40","40 - 45","45+"];
const LOCATION_OPTIONS = ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kochi","Kolkata","Pune"];
const RELIGION_OPTIONS = ["Hindu","Muslim","Christian","Sikh","Buddhist","Jain","Other"];

interface Slide {
  image: string;
  eyebrow: string;
  headline: React.ReactNode;
  subtitle: string;
  bullets: string[];
}

const SLIDES: Slide[] = [
  {
    image: "/001 transparent.png",
    eyebrow: "Made2Match",
    headline: (<>Find your perfect <span className="block">life partner</span></>),
    subtitle: "Trusted by lakhs of families. Verified profiles, curated matches, and meaningful connections — all in one place.",
    bullets: ["100% verified profiles","Privacy-first matchmaking","Free to register, free to browse"],
  },
  {
    image: "/002 transparent.png",
    eyebrow: "Tradition meets technology",
    headline: (<>Where love finds <span className="block">tradition</span></>),
    subtitle: "From Kerala to Karnataka — celebrate heritage while finding the partner who shares your values and dreams.",
    bullets: ["Caste, religion & community filters","Star and horoscope compatibility","Family-friendly conversations"],
  },
];

export default function HeroRegistration() {
  return <HeroForm />;
}

export function TrustBar({ onClick }: { onClick: () => void }) {
  const benefits = [
    { icon: "✓", title: "Verified Profiles", detail: "Genuine members" },
    { icon: "♥", title: "Smart Matches", detail: "Based on your preferences" },
    { icon: "⌾", title: "Privacy First", detail: "You control your details" },
  ];
  return (
    <section className="relative w-full overflow-hidden px-4 py-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(135deg, #fc8bab 0%, #c0174c 60%, #d4185a 100%)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-15"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative mx-auto max-w-7xl lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="shrink-0 leading-tight">
            <span className="block text-[25px] font-bold tracking-wide text-white" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              Made for Meaningful Matches
            </span>
            <span className="mt-1 block text-[11px] tracking-wide text-white/80">Trust, compatibility and privacy at every step</span>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#c0174c] shadow-sm">{b.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">{b.title}</p>
                  <p className="truncate text-[10px] text-white/70">{b.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={onClick} className="shrink-0 rounded-lg bg-white px-5 py-3 text-xs font-black tracking-wide text-[#c0174c] shadow-md transition-transform hover:-translate-y-0.5">
            CREATE FREE PROFILE
          </button>
        </div>
      </div>
    </section>
  );
}

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
    <section className="relative py-3 w-full px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(135deg, #fc8bab 0%, #c0174c 60%, #d4185a 100%)" }}>
      <div aria-hidden className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative max-w-6xl mx-auto py-3 lg:py-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 gap-3">
          <div className="flex flex-col leading-tight shrink-0">
            <span className="text-white text-[27px] tracking-wide font-bold" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>Find Your Match</span>
            <span className="text-white/75 text-[10px] tracking-wide">Your perfect match is just a click away</span>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-xs font-semibold">Looking</span>
              <div className="inline-flex items-center rounded-full bg-white p-1 shadow-sm">
                {(["bride", "groom"] as LookingFor[]).map((opt) => (
                  <button key={opt} onClick={() => setLookingFor(opt)} aria-label={`Looking for ${opt}`}
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${lookingFor === opt ? "text-white" : "text-gray-500 hover:text-[#c0174c]"}`}
                    style={{ background: lookingFor === opt ? "#c0174c" : "transparent" }}>{opt}</button>
                ))}
              </div>
            </div>
            <FilterSelect value={age}      onChange={setAge}      placeholder="Age"             options={AGE_OPTIONS} />
            <FilterSelect value={location} onChange={setLocation} placeholder="Select Location" options={LOCATION_OPTIONS} />
            <FilterSelect value={religion} onChange={setReligion} placeholder="Select Religion" options={RELIGION_OPTIONS} />
            <button onClick={handleSearch} className="btn-primary text-xs tracking-widest px-6 py-3 rounded-md cursor-pointer shrink-0">SEARCH</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void; placeholder: string; options: string[];
}) {
  return (
    <div className="relative flex-1 sm:flex-initial w-full sm:w-50">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="block w-full appearance-none bg-white text-black text-xs font-semibold pl-3 pr-8 py-3 rounded-md outline-none cursor-pointer transition-colors">
        <option value="" className="text-gray-800">{placeholder}</option>
        {options.map((o) => <option key={o} value={o} className="text-gray-800">{o}</option>)}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function HeroForm() {
  const router = useRouter();
  const { mutate, isPending, isError, error, isSuccess } = useRegister();
  const [bgIdx, setBgIdx] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setBgIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => window.clearInterval(t);
  }, []);
  const [formData, setFormData] = useState<RegisterRequest>({ fullName: "", email: "", password: "", mobileNumber: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };
  const handleSubmit = () => {
    if (!acceptedPolicies) {
      setValidationErrors((c) => ({ ...c, consent: "Please accept the Terms and Conditions and Privacy Policy." }));
      return;
    }
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { errors[issue.path[0] as string] = issue.message; });
      setValidationErrors(errors);
      return;
    }
    mutate({ ...formData, acceptedTerms: true, acceptedPrivacyPolicy: true }, {
      onSuccess: (res: any) => {
        const tokens = res?.data;
        if (tokens?.accessToken) {
          localStorage.setItem("token", tokens.accessToken);
          if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
        }
        router.push("/onboarding/basic-details");
      },
    });
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "#fde8ef" }}>

      {/* Floating hearts — bottom to top */}
      {/* Floating profile bubbles removed */}

      {/* Page left edge cards */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 z-20" style={{ width: 152 }}>
      </div>

      {/* Page right edge cards */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 z-20" style={{ width: 152 }}>
      </div>

      {/* Single floating card — top center, above form */}
      <div className="hidden lg:block absolute z-20 bg-white rounded-2xl p-3 shadow-xl w-44 text-center"
        style={{ top: "8%", left: "calc(42% + 100px)", transform: "translateX(-50%)", opacity: 0.6 }}>
        <div className="relative w-12 h-12 mx-auto mb-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl"
            style={{ background: "linear-gradient(135deg, #f97316, #c0174c)" }}>A</div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
        </div>
        <p className="text-[13px] font-bold text-gray-800">Anjali, 26</p>
        <p className="text-[10px] text-gray-400">Kochi · Software Engineer</p>
        <p className="text-[11px] font-bold text-[#c0174c] my-1">94% match</p>
        <button className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "#c0174c" }}>♥ Send interest</button>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch min-h-[560px]">

        {/* LEFT — carousel */}
        <div className="hidden lg:block relative lg:w-1/2" style={{ minHeight: 560 }}>
          {SLIDES.map((s, i) => (
            <img key={s.image} src={s.image} alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-out"
              style={{ opacity: i === bgIdx ? 1 : 0 }} />
          ))}
        </div>

        {/* MOBILE IMAGE */}
        <div className="lg:hidden relative w-full overflow-hidden" style={{ height: 280 }}>
          <img src={SLIDES[bgIdx].image} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 100%)" }} />
        </div>

        {/* RIGHT — form */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 lg:w-1/2 lg:items-end lg:px-6 lg:py-12">
          <div className="w-full max-w-sm lg:max-w-[498px] rounded-2xl overflow-hidden flex flex-col bg-white border border-[#f0d9e0] shadow-[0_12px_34px_rgba(192,23,76,0.15)] lg:backdrop-blur-md">
            <div className="px-6 pt-4 pb-3 text-center border-b border-[#f6e3ea]"
              style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)" }}>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shadow-sm text-xl mb-1.5">💍</div>
              <h3 className="text-white text-lg font-bold tracking-wide">Create Your Free Profile</h3>
              <p className="text-white/80 text-xs mt-1">Join happy members &amp; find your perfect match on Made2Match</p>
            </div>
            <div className="px-6 lg:px-7 py-4 flex flex-col gap-3">
              <FormField name="fullName"     type="text"  placeholder="Full Name"     value={formData.fullName}     onChange={handleChange} error={validationErrors.fullName} />
              <FormField name="email"        type="email" placeholder="Email Address" value={formData.email}        onChange={handleChange} error={validationErrors.email} />
              <FormField name="mobileNumber" type="tel"   placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} error={validationErrors.mobileNumber} />
              <div>
                <div className="relative">
                  <input name="password" type={showPwd ? "text" : "password"} placeholder="Password"
                    value={formData.password} onChange={handleChange}
                    className="w-full px-4 pr-14 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
                  <button type="button" onClick={() => setShowPwd((s) => !s)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c0174c] text-xs font-semibold px-1">
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                {validationErrors.password && <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>}
              </div>
              <RegistrationConsent
                checked={acceptedPolicies}
                onChange={(checked) => { setAcceptedPolicies(checked); setValidationErrors((c) => ({ ...c, consent: "" })); }}
                error={validationErrors.consent}
              />
              <button onClick={handleSubmit} disabled={isPending} className="btn-primary w-full py-3 rounded-xl text-sm tracking-wide mt-1">
                {isPending ? "Registering..." : "Join Now For Free 🎉"}
              </button>
              {isSuccess && <p className="text-green-500 text-sm text-center">Registration successful!</p>}
              {isError && <p className="text-red-500 text-sm text-center">{(error as any)?.response?.data?.message || "Registration failed"}</p>}
              <p className="text-center text-gray-500 text-xs">
                Already registered?{" "}
                <a href="/login" className="text-[#c0174c] underline font-medium hover:text-[#a01040] transition">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ name, type, placeholder, value, onChange, error }: {
  name: string; type: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string;
}) {
  return (
    <div>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
