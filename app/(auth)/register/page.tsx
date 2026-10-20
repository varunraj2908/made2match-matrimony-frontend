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
    <div
      className="h-full overflow-y-auto"
      style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}
    >
      <div
        className="relative w-full mx-auto min-h-full px-5 py-10 sm:px-[73px] flex flex-col justify-center"
        style={{ maxWidth: "612px" }}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl" style={{ background: "rgba(232,197,71,0.2)" }} />
        <div className="pointer-events-none absolute bottom-10 -left-16 w-60 h-60 rounded-full blur-3xl" style={{ background: "rgba(255,106,156,0.22)" }} />

        <div className="relative z-10">
          <AuthBrandHeader />

          <div
            className="mt-6 rounded-3xl p-6 sm:p-10 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
          >
            <div className="flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "#E8C547", color: "#5e0a24" }}>
                Free Registration
              </span>
            </div>

            <h2 className="mt-3 text-center text-2xl font-black text-white">Create your free account</h2>
            <p className="mt-1 text-center text-sm text-white/70">Join lakhs of happy members</p>

            {/* Full name */}
            <label className="block text-sm font-bold text-white/90 mt-4 mb-1">Full name</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Enter your full name" className={FIELD} />
            </div>
            {errors.fullName && <p className="text-amber-200 text-xs mt-1">{errors.fullName}</p>}

            {/* Mobile */}
            <label className="block text-sm font-bold text-white/90 mt-3 mb-1">Mobile number</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <input
                value={form.mobileNumber}
                onChange={(e) => set("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                className={FIELD}
              />
            </div>
            {errors.mobileNumber && <p className="text-amber-200 text-xs mt-1">{errors.mobileNumber}</p>}

            {/* Email */}
            <label className="block text-sm font-bold text-white/90 mt-3 mb-1">Email address</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Enter email address" className={FIELD} />
            </div>
            {errors.email && <p className="text-amber-200 text-xs mt-1">{errors.email}</p>}

            {/* Password */}
            <label className="block text-sm font-bold text-white/90 mt-3 mb-1">Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min 6 characters"
                className={FIELD + " pr-14"}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/70 hover:text-white"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-amber-200 text-xs mt-1">{errors.password}</p>}

            <div className="mt-3">
              <RegistrationConsent
                checked={acceptedPolicies}
                onChange={(checked) => {
                  setAcceptedPolicies(checked);
                  setErrors((current) => ({ ...current, consent: "" }));
                }}
                error={errors.consent}
                dark
              />
            </div>

            {apiError && (
              <div className="flex items-start gap-2 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-red-200 text-sm font-medium">{apiError}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full mt-5 py-2.5 rounded-full text-[#5e0a24] font-extrabold active:scale-[0.98] transition-transform disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)", boxShadow: "0 8px 22px rgba(232,197,71,0.4)" }}
            >
              {isPending ? "Creating account…" : "Register Free →"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/75">
            Already a member?{" "}
            <button onClick={() => router.push("/login")} className="font-bold text-[#E8C547]">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
