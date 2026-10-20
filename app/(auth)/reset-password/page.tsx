"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Eye, EyeOff, LockKeyhole } from "lucide-react";
import AuthBrandHeader from "@/components/sections/AuthBrandHeader";
import { useResetPassword } from "@/hooks/useResetPassword";

const FIELD =
  "w-full rounded-xl border border-white/25 bg-white/10 py-3 pl-10 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/55 focus:border-[#E8C547] focus:bg-white/15";

export default function ResetPasswordPage() {
  const { mutate, isPending } = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const token = new URLSearchParams(window.location.search).get("token") || "";

    if (!token) return setError("This password reset link is invalid.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    mutate(
      { token, newPassword: password },
      {
        onSuccess: () => setComplete(true),
        onError: (requestError: unknown) => {
          const apiError = requestError as { response?: { data?: { message?: string } } };
          setError(apiError.response?.data?.message || "Unable to reset password. Please request a new link.");
        },
      },
    );
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}>
      <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-8 lg:max-w-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[#E8C547]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-60 w-60 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative z-10">
          <AuthBrandHeader />
          <div
            className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md lg:p-11"
          >
            {complete ? (
              <div className="text-center" role="status">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8C547] text-[#5e0a24]">
                  <Check size={30} strokeWidth={3} />
                </div>
                <h1 className="mt-5 text-2xl font-black text-white">Password updated</h1>
                <p className="mt-2 text-sm text-white/70">Your new password is ready. You can now sign in.</p>
                <Link href="/login" className="mt-6 inline-block w-full rounded-full bg-[#E8C547] py-3.5 font-extrabold text-[#5e0a24]">
                  Continue to login
                </Link>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: "#E8C547", color: "#5e0a24" }}
                  >
                    Secure account
                  </span>
                </div>
                <h1 className="mt-4 text-center text-2xl font-black text-white">Create new password</h1>
                <p className="mt-1 text-center text-sm text-white/70">Choose a strong password with at least 6 characters.</p>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="new-password" className="mb-1.5 mt-7 block text-sm font-bold text-white/90">New password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E8C547]" aria-hidden />
                    <input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" className={FIELD} />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide new password" : "Show new password"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/65 hover:text-[#E8C547]">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <label htmlFor="confirm-password" className="mb-1.5 mt-4 block text-sm font-bold text-white/90">Confirm password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E8C547]" aria-hidden />
                    <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Minimum 6 characters" className={FIELD} />
                    <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/65 hover:text-[#E8C547]">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {error && <p className="mt-3 rounded-lg border border-red-400/30 bg-red-500/20 py-2 text-center text-sm text-amber-200">{error}</p>}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-5 w-full cursor-pointer rounded-full py-3.5 font-extrabold text-[#5e0a24] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)",
                      boxShadow: "0 8px 22px rgba(232,197,71,0.4)",
                    }}
                  >
                    {isPending ? "Updating…" : "Reset password"}
                  </button>
                </form>
              </>
            )}
          </div>
          <p className="mt-6 text-center text-sm text-white/75">
            Need a new link? <Link href="/forgot-password" className="font-bold text-[#E8C547]">Request again</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
