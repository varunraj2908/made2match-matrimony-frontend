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
    <div
      className="h-full overflow-y-auto"
      style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}
    >
      <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-8 lg:max-w-xl">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full blur-3xl"
          style={{ background: "rgba(232,197,71,0.2)" }}
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-10 h-60 w-60 rounded-full blur-3xl"
          style={{ background: "rgba(255,106,156,0.22)" }}
        />

        <div className="relative z-10">
          <AuthBrandHeader />

          <div
            className="mt-6 rounded-3xl p-6 backdrop-blur-md lg:p-11"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            {submitted ? (
              <div className="text-center" role="status">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8C547] text-[#5e0a24] shadow-[0_8px_22px_rgba(232,197,71,0.35)]">
                  <Check size={30} strokeWidth={3} />
                </div>
                <h1 className="mt-5 text-2xl font-black text-white">Check your email</h1>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  If an account exists for <span className="font-bold text-white">{email.trim()}</span>, you&apos;ll receive a password reset link shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 cursor-pointer text-sm font-bold text-[#E8C547] hover:underline"
                >
                  Try another email
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: "#E8C547", color: "#5e0a24" }}
                  >
                    Account Recovery
                  </span>
                </div>

                <h1 className="mt-4 text-center text-2xl font-black text-white">Forgot your password?</h1>
                <p className="mt-1 text-center text-sm leading-5 text-white/70">
                  Enter your registered email and we&apos;ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <label htmlFor="reset-email" className="mb-1.5 mt-7 block text-sm font-bold text-white/90">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E8C547]"
                      aria-hidden
                    />
                    <input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className={FIELD}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "reset-email-error" : undefined}
                    />
                  </div>

                  {error && (
                    <p id="reset-email-error" className="mt-3 rounded-lg border border-red-400/30 bg-red-500/20 py-2 text-center text-sm text-amber-200">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-5 w-full cursor-pointer rounded-full py-3.5 font-extrabold text-[#5e0a24] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)",
                      boxShadow: "0 8px 22px rgba(232,197,71,0.4)",
                    }}
                  >
                    {isPending ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition-colors hover:text-[#E8C547]">
              <ArrowLeft size={16} aria-hidden />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
