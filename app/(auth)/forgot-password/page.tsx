"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Mail } from "lucide-react";
import AuthBrandHeader from "@/components/sections/AuthBrandHeader";
import { useForgotPassword } from "@/hooks/useForgotPassword";

const FIELD =
  "w-full rounded-xl border border-white/25 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/55 focus:border-[#E8C547] focus:bg-white/15";

export default function ForgotPasswordPage() {
  const { mutate, isPending } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    mutate(
      { email: email.trim() },
      {
        onSuccess: () => setSubmitted(true),
        onError: (requestError: unknown) => {
          const apiError = requestError as {
            response?: { data?: { message?: string } };
          };
          setError(
            apiError.response?.data?.message ||
              "We couldn't send the reset link. Please try again.",
          );
        },
      },
    );
  };

  return (
    <>
      {/* Mobile — unchanged */}
      <div className="h-full overflow-y-auto overflow-x-hidden lg:hidden"
        style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}>
        <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-8 lg:max-w-xl overflow-x-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full blur-3xl opacity-0" style={{ background: "rgba(232,197,71,0.2)" }} />
          <div className="pointer-events-none absolute -left-16 bottom-10 h-60 w-60 rounded-full blur-3xl opacity-0" style={{ background: "rgba(255,106,156,0.22)" }} />
          <div className="relative z-10">
            <AuthBrandHeader />
            <div className="mt-6 rounded-3xl p-6 backdrop-blur-md lg:p-11"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
              {submitted ? (
                <div className="text-center" role="status">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8C547] text-[#5e0a24] shadow-[0_8px_22px_rgba(232,197,71,0.35)]"><Check size={30} strokeWidth={3} /></div>
                  <h1 className="mt-5 text-2xl font-black text-white">Check your email</h1>
                  <p className="mt-2 text-sm leading-6 text-white/70">If an account exists for <span className="font-bold text-white">{email.trim()}</span>, you&apos;ll receive a password reset link shortly.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-6 cursor-pointer text-sm font-bold text-[#E8C547] hover:underline">Try another email</button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center"><span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "#E8C547", color: "#5e0a24" }}>Account Recovery</span></div>
                  <h1 className="mt-4 text-center text-2xl font-black text-white">Forgot your password?</h1>
                  <p className="mt-1 text-center text-sm leading-5 text-white/70">Enter your registered email and we&apos;ll send you a reset link.</p>
                  <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="reset-email-m" className="mb-1.5 mt-7 block text-sm font-bold text-white/90">Email address</label>
                    <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E8C547]" aria-hidden />
                      <input id="reset-email-m" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={FIELD} aria-invalid={Boolean(error)} /></div>
                    {error && <p className="mt-3 rounded-lg border border-red-400/30 bg-red-500/20 py-2 text-center text-sm text-amber-200">{error}</p>}
                    <button type="submit" disabled={isPending} className="mt-5 w-full cursor-pointer rounded-full py-3.5 font-extrabold text-[#5e0a24] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)", boxShadow: "0 8px 22px rgba(232,197,71,0.4)" }}>
                      {isPending ? "Sending…" : "Send reset link"}
                    </button>
                  </form>
                </>
              )}
            </div>
            <div className="mt-6 text-center"><Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition-colors hover:text-[#E8C547]"><ArrowLeft size={16} aria-hidden />Back to login</Link></div>
          </div>
        </div>
      </div>

      {/* Desktop — split layout */}
      <div className="hidden lg:flex h-full min-h-screen" style={{ background: "#fde8ef" }}>

        {/* LEFT — decorative panel */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center px-12"
          style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)" }}>
          <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: "#ff6a9c", transform: "translate(-30%,-30%)" }} />
          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: "#E8C547", transform: "translate(30%,30%)" }} />
          <div className="relative w-80 h-96 mb-8">
            <img src="/001 transparent.png" alt="Made2Match" className="w-full h-full object-contain object-bottom" />
          </div>
          <div className="text-center relative z-10">
            <h2 className="text-3xl font-black text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Don&apos;t Worry<br /><span className="italic">We&apos;ve Got You</span>
            </h2>
            <p className="mt-3 text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
              Reset your password and get back to finding your perfect match on Made2Match.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-sm">Secure Reset</span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-sm">Quick & Easy</span>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="w-[45%] shrink-0 flex flex-col items-center justify-center px-12 py-10" style={{ background: "#fde8ef" }}>
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <img src="/golden-hearts.png" alt="Made2Match" className="object-contain" style={{ width: 120, height: 120 }} />
              <div>
                <p className="text-[#c0174c] font-extrabold text-3xl" style={{ fontFamily: "Georgia, serif" }}>Made2Match</p>
                <p className="text-[11px] font-bold tracking-widest text-[#c0174c]/60 uppercase">Matrimony</p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(192,23,76,0.12)] border border-[#f0d9e0] text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4" style={{ background: "linear-gradient(135deg, #981a3d, #c0174c)" }}>
                  <Check size={30} strokeWidth={3} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-gray-800">Check your email</h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  If an account exists for <span className="font-bold text-[#c0174c]">{email.trim()}</span>, you&apos;ll receive a password reset link shortly.
                </p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-5 text-sm font-bold text-[#c0174c] hover:underline cursor-pointer">Try another email</button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-800 mb-1">Forgot password? 🔑</h2>
                <p className="text-sm text-gray-500 mb-7">Enter your email and we&apos;ll send a reset link</p>

                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(192,23,76,0.12)] border border-[#f0d9e0]">
                  <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="reset-email" className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                    <div className="relative mb-2">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                      <input id="reset-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white"
                        aria-invalid={Boolean(error)} aria-describedby={error ? "reset-email-error" : undefined} />
                    </div>
                    {error && <p id="reset-email-error" className="mb-3 text-center text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg py-2">{error}</p>}
                    <button type="submit" disabled={isPending}
                      className="w-full mt-2 py-3.5 rounded-xl font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)", boxShadow: "0 8px 22px rgba(192,23,76,0.35)" }}>
                      {isPending ? "Sending…" : "Send reset link →"}
                    </button>
                  </form>
                </div>

                <div className="mt-5 text-center">
                  <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#c0174c] hover:underline">
                    <ArrowLeft size={16} aria-hidden />Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
