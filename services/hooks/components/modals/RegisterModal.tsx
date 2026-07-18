"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import { registerSchema, RegisterRequest } from "@/schemas/authSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  /** @deprecated Modal now always covers the full viewport. Kept for backward compat with existing callers. */
  belowHeader?: boolean;
};

export default function RegisterModal({ open, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { mutate, isPending, isError, error, isSuccess } = useRegister();

  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setValidationErrors({});
    }
  }, [open]);

  if (!open) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errs[issue.path[0] as string] = issue.message;
      });
      setValidationErrors(errs);
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
        onClose();
        router.push("/onboarding/basic-details");
      },
    });
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/55 px-4 py-6 overflow-y-auto"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl relative overflow-hidden bg-white shadow-2xl my-auto"
      >
        {/* Accent header strip */}
        <div
          className="h-16"
          style={{ background: "linear-gradient(90deg, #ff6b9d, #c0174c, #8b1a3a)" }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#c0174c] flex items-center justify-center transition cursor-pointer z-10"
        >
          ✕
        </button>

        <div className="px-6 pt-6 pb-3 text-center border-b border-gray-100">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#fdf2f3] text-2xl mb-2">
            💍
          </div> */}
          <h2 className="text-gray-900 text-xl font-bold tracking-wide">
            Create your free account
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Find your perfect match on Made2Match
          </p>
        </div>

        <div className="px-10 pb-6 flex flex-col gap-3 mt-5">
          {/* FULL NAME */}
          <ModalField
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            error={validationErrors.fullName}
            iconPath={
              <>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </>
            }
          />

          {/* EMAIL */}
          <ModalField
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            iconPath={
              <>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </>
            }
          />

          {/* MOBILE */}
          <ModalField
            name="mobileNumber"
            type="tel"
            placeholder="Mobile Number (10 digits)"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={validationErrors.mobileNumber}
            iconPath={
              <>
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </>
            }
          />

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-[#f9fafb] border border-gray-200 focus:bg-white focus:border-[#c0174c] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c0174c] text-xs px-2 py-1"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] active:scale-95 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #c0174c, #8b1a3a)",
              boxShadow: "0 8px 22px rgba(192,23,76,0.35)",
            }}
          >
            {isPending ? "Creating account..." : "Register Now 🎉"}
          </button>

          {isSuccess && (
            <p className="text-green-600 text-xs text-center">
              Registration successful! Redirecting...
            </p>
          )}
          {isError && (
            <p className="text-red-500 text-xs text-center">
              {(error as any)?.response?.data?.message || "Registration failed"}
            </p>
          )}

          <p className="text-center text-gray-500 text-xs mt-1">
            Already registered?{" "}
            <a href="/login" className="text-[#c0174c] font-semibold hover:underline transition">
              Sign in
            </a>
          </p>

          <p className="text-center text-gray-400 text-[10px] mt-1">
            By registering you agree to our{" "}
            <a href="/terms-and-conditions" className="underline hover:text-[#c0174c]">Terms</a> &{" "}
            <a href="/privacy-policy" className="underline hover:text-[#c0174c]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Input field ─────────────────────────────────────── */
function ModalField({
  name, type, placeholder, value, onChange, error, iconPath,
}: {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  iconPath: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            {iconPath}
          </svg>
        </span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-[#f9fafb] border border-gray-200 focus:bg-white focus:border-[#c0174c] outline-none transition-all"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
