"use client";
"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import { registerSchema, RegisterRequest } from "@/schemas/authSchema";
import RegistrationConsent from "@/components/ui/RegistrationConsent";

type Props = {
  open: boolean;
  onClose: () => void;
  belowHeader?: boolean;
};

type RegistrationResponse = {
  data?: { accessToken?: string; refreshToken?: string };
};

type RegistrationError = {
  response?: { data?: { message?: string } };
};

export default function RegisterModal({ open, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { mutate, isPending, error, reset: resetRegistration } = useRegister();

  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  if (!open) return null;

  const closeModal = () => {
    setValidationErrors({});
    setAcceptedPolicies(false);
    resetRegistration();
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.name === "mobileNumber"
        ? e.target.value.replace(/\D/g, "").slice(0, 10)
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    resetRegistration();
  };

  const handleSubmit = () => {
    if (!acceptedPolicies) {
      setValidationErrors((current) => ({
        ...current,
        consent: "Please accept the Terms and Conditions and Privacy Policy.",
      }));
      return;
    }
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errs[issue.path[0] as string] = issue.message;
      });
      setValidationErrors(errs);
      return;
    }
    mutate(
      { ...formData, acceptedTerms: true, acceptedPrivacyPolicy: true },
      {
        onSuccess: (res: RegistrationResponse) => {
          const tokens = res?.data;
          if (tokens?.accessToken) {
            localStorage.setItem("token", tokens.accessToken);
            if (tokens.refreshToken) {
              localStorage.setItem("refreshToken", tokens.refreshToken);
            }
          }
          localStorage.setItem("userMobile", formData.mobileNumber);
          localStorage.setItem("completionStep", "0");
          // Navigate immediately — don't closeModal() first as it causes
          // the landing page to flash before navigation completes
          window.location.href = "/onboarding/basic-details";
        },
      }
    );
  };

  /* ── field style ── white bg with dark text */
  const fieldCls =
    "w-full pl-11 pr-4 py-3 rounded-xl text-base text-gray-800 placeholder-gray-400 outline-none transition-all border border-gray-200 bg-white focus:border-[#c0174c] focus:ring-1 focus:ring-[#c0174c]/30";
  const fieldBg = "#ffffff";

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: "rgba(60,0,20,0.7)", backdropFilter: "blur(6px)" }}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full relative"
        style={{
          maxWidth: "652px",
          maxHeight: "95dvh",
          borderRadius: "20px",
          background: "#ffffff",
          boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
          padding: "20px 45px 24px",
        }}
      >
        {/* ── Made2Match Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 mb-5"
          style={{
            background: "linear-gradient(135deg, #c0174c 0%, #e8305e 100%)",
            borderRadius: "20px 20px 0 0",
            margin: "-20px -45px 20px -45px",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Heart icon */}
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            {/* Brand text */}
            <div>
              <p className="text-white font-black text-lg leading-tight tracking-wide">
                Made<span className="text-yellow-300">2</span>Match
              </p>
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Find Your Forever
              </p>
            </div>
          </div>

          {/* Close × */}
          <button
            onClick={closeModal}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="text-gray-900 text-2xl font-extrabold leading-tight">
            Create your free account
          </h2>
          <p className="text-gray-500 text-sm mt-1.5">
            Join lakhs of happy members
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">

          {/* Full name */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Full name</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={fieldCls}
                style={{ background: fieldBg }}
              />
            </div>
            {validationErrors.fullName && <p className="text-red-400 text-xs mt-1">{validationErrors.fullName}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Mobile number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </span>
              <input
                name="mobileNumber"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={fieldCls}
                style={{ background: fieldBg }}
              />
            </div>
            {validationErrors.mobileNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.mobileNumber}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Email address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className={fieldCls}
                style={{ background: fieldBg }}
              />
            </div>
            {validationErrors.email && <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                className={fieldCls}
                style={{ background: fieldBg }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c0174c] text-xs font-semibold transition"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {validationErrors.password && <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>}
          </div>

          {/* Consent */}
          <div>
            <RegistrationConsent
              checked={acceptedPolicies}
              onChange={(checked) => {
                setAcceptedPolicies(checked);
                setValidationErrors((current) => ({ ...current, consent: "" }));
              }}
              error={validationErrors.consent}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3.5 rounded-xl font-black text-base tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #c0174c, #e8305e)",
              color: "#ffffff",
              boxShadow: "0 6px 18px rgba(192,23,76,0.35)",
            }}
          >
            {isPending ? "Creating account..." : "Register Free →"}
          </button>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div className="text-red-600 text-sm font-medium">
                {(error as RegistrationError).response?.data?.message || (error as any)?.message || "Registration failed. Please try again."}
                {/* Show field-level validation errors if present */}
                {(error as any)?.response?.data?.data && typeof (error as any).response.data.data === "object" && (
                  <ul className="mt-1 list-disc list-inside text-xs text-red-500 space-y-0.5">
                    {Object.entries((error as any).response.data.data).map(([field, msg]) => (
                      <li key={field}><span className="capitalize">{field.replace(/([A-Z])/g, " $1")}</span>: {msg as string}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <p className="text-center text-gray-500 text-sm">
            Already a member?{" "}
            <a href="/login" className="font-bold text-sm hover:underline transition" style={{ color: "#c0174c" }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
