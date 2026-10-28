"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBrandHeader from "@/components/sections/AuthBrandHeader";
import { useRegister } from "@/hooks/useRegister";
import { registerSchema, RegisterRequest } from "@/schemas/authSchema";
import RegistrationConsent from "@/components/ui/RegistrationConsent";

const FIELD =
  "w-full pl-10 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-white/55 outline-none transition-all bg-white/10 border border-white/25 focus:border-[#E8C547] focus:bg-white/15";

export default function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegister();

  const [form, setForm] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const set = (k: keyof RegisterRequest, v: string) => {
    setForm((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleSubmit = () => {
    setApiError("");
    if (!acceptedPolicies) {
      setErrors((current) => ({
        ...current,
        consent: "Please accept the Terms and Conditions and Privacy Policy.",
      }));
      return;
    }
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    mutate({
      ...form,
      acceptedTerms: true,
      acceptedPrivacyPolicy: true,
    }, {
      onSuccess: (res: any) => {
        const tokens = res?.data;
        if (tokens?.accessToken) {
          localStorage.setItem("token", tokens.accessToken);
          if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
        }
        // Store mobile number for later use
        localStorage.setItem("userMobile", form.mobileNumber);
        router.push("/onboarding/basic-details");
      },
      onError: (e: any) => {
        setApiError(
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Registration failed. Please try again."
        );
      },
    });
  };

  return (
    <>
      {/* Mobile — unchanged */}
      <div
        className="h-full overflow-y-auto overflow-x-hidden lg:hidden"
        style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}
      >
        <div
          className="relative w-full mx-auto min-h-full px-5 py-10 sm:px-[73px] flex flex-col justify-center overflow-x-hidden"
          style={{ maxWidth: "612px" }}
        >
          <div className="pointer-events-none absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl opacity-0" style={{ background: "rgba(232,197,71,0.2)" }} />
          <div className="pointer-events-none absolute bottom-10 -left-16 w-60 h-60 rounded-full blur-3xl opacity-0" style={{ background: "rgba(255,106,156,0.22)" }} />
          <div className="relative z-10">
            <AuthBrandHeader />
            <div className="mt-6 rounded-3xl p-6 sm:p-10 backdrop-blur-md"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
              <div className="flex justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "#E8C547", color: "#5e0a24" }}>Free Registration</span>
              </div>
              <h2 className="mt-3 text-center text-2xl font-black text-white">Create your free account</h2>
              <p className="mt-1 text-center text-sm text-white/70">Join lakhs of happy members</p>
              <label className="block text-sm font-bold text-white/90 mt-4 mb-1">Full name</label>
              <div className="relative"><svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Enter your full name" className={FIELD} /></div>
              {errors.fullName && <p className="text-amber-200 text-xs mt-1">{errors.fullName}</p>}
              <label className="block text-sm font-bold text-white/90 mt-3 mb-1">Mobile number</label>
              <div className="relative"><svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                <input value={form.mobileNumber} onChange={(e) => set("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter 10-digit mobile number" className={FIELD} /></div>
              {errors.mobileNumber && <p className="text-amber-200 text-xs mt-1">{errors.mobileNumber}</p>}
              <label className="block text-sm font-bold text-white/90 mt-3 mb-1">Email address</label>
              <div className="relative"><svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Enter email address" className={FIELD} /></div>
              {errors.email && <p className="text-amber-200 text-xs mt-1">{errors.email}</p>}
              <label className="block text-sm font-bold text-white/90 mt-3 mb-1">Password</label>
              <div className="relative"><svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 6 characters" className={FIELD + " pr-14"} />
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/70 hover:text-white">{showPwd ? "Hide" : "Show"}</button></div>
              {errors.password && <p className="text-amber-200 text-xs mt-1">{errors.password}</p>}
              <div className="mt-3"><RegistrationConsent checked={acceptedPolicies} onChange={(checked) => { setAcceptedPolicies(checked); setErrors((c) => ({ ...c, consent: "" })); }} error={errors.consent} dark /></div>
              {apiError && <div className="flex items-start gap-2 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p className="text-red-200 text-sm font-medium">{apiError}</p></div>}
              <button onClick={handleSubmit} disabled={isPending} className="w-full mt-5 py-2.5 rounded-full text-[#5e0a24] font-extrabold active:scale-[0.98] transition-transform disabled:opacity-60" style={{ background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)", boxShadow: "0 8px 22px rgba(232,197,71,0.4)" }}>
                {isPending ? "Creating account…" : "Register Free →"}
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-white/75">Already a member?{" "}<button onClick={() => router.push("/login")} className="font-bold text-[#E8C547]">Login</button></p>
          </div>
        </div>
      </div>

      {/* Desktop — split layout like login page */}
      <div className="hidden lg:flex h-full min-h-screen" style={{ background: "#fde8ef" }}>

        {/* LEFT — decorative panel */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center px-12"
          style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)" }}>
          <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: "#ff6a9c", transform: "translate(-30%,-30%)" }} />
          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: "#E8C547", transform: "translate(30%,30%)" }} />
          <div className="relative w-80 h-96 mb-8">
            <img src="/002 transparent.png" alt="Made2Match" className="w-full h-full object-contain object-bottom" />
          </div>
          <div className="text-center relative z-10">
            <h2 className="text-3xl font-black text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Begin Your<br /><span className="italic">Love Story</span>
            </h2>
            <p className="mt-3 text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
              Create your free profile and start connecting with compatible verified matches today.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-sm">Free to Register</span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-sm">100% Verified</span>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="w-[45%] shrink-0 flex flex-col items-center justify-center px-12 py-10" style={{ background: "#fde8ef" }}>
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-6">
              <img src="/golden-hearts.png" alt="Made2Match" className="object-contain" style={{ width: 120, height: 120 }} />
              <div>
                <p className="text-[#c0174c] font-extrabold text-3xl" style={{ fontFamily: "Georgia, serif" }}>Made2Match</p>
                <p className="text-[11px] font-bold tracking-widest text-[#c0174c]/60 uppercase">Matrimony</p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mb-1">Create your account ✨</h2>
            <p className="text-sm text-gray-500 mb-5">Join thousands of happy members today</p>

            {/* Form card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(192,23,76,0.12)] border border-[#f0d9e0]">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number</label>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                <input value={form.mobileNumber} onChange={(e) => set("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter 10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
                {errors.mobileNumber && <p className="text-red-400 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 6 characters"
                  className="w-full pl-10 pr-14 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c0174c] text-xs font-semibold">{showPwd ? "Hide" : "Show"}</button>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <RegistrationConsent checked={acceptedPolicies} onChange={(checked) => { setAcceptedPolicies(checked); setErrors((c) => ({ ...c, consent: "" })); }} error={errors.consent} />

              {apiError && <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3"><p className="text-red-500 text-sm">{apiError}</p></div>}

              <button onClick={handleSubmit} disabled={isPending}
                className="w-full mt-4 py-3.5 rounded-xl font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)", boxShadow: "0 8px 22px rgba(192,23,76,0.35)" }}>
                {isPending ? "Creating account…" : "Register Free →"}
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already a member?{" "}
              <button onClick={() => router.push("/login")} className="font-bold text-[#c0174c] hover:underline cursor-pointer">Login</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
