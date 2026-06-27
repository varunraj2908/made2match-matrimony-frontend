"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBrandHeader from "@/components/sections/AuthBrandHeader";
import { useLogin } from "@/hooks/useLogin";

const FIELD =
  "w-full pl-10 pr-3 py-3 rounded-xl text-sm text-white placeholder-white/55 outline-none transition-all bg-white/10 border border-white/25 focus:border-[#E8C547] focus:bg-white/15";

export default function LoginPage() {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    mutate(
      { email: email.trim(), password },
      {
        onSuccess: (res: any) => {
          const tokens = res?.data;
          if (tokens?.accessToken) {
            localStorage.setItem("token", tokens.accessToken);
            if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
          }
          router.push("/home");
        },
        onError: (e: any) => {
          setError(e?.response?.data?.message || "Invalid email or password.");
        },
      },
    );
  };

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "linear-gradient(165deg,#2d1b35 0%,#8f0e39 45%,#c0174c 100%)" }}
    >
      <div className="relative w-full max-w-md mx-auto min-h-full px-6 py-8 flex flex-col justify-center">
        <div className="pointer-events-none absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl" style={{ background: "rgba(232,197,71,0.2)" }} />
        <div className="pointer-events-none absolute bottom-10 -left-16 w-60 h-60 rounded-full blur-3xl" style={{ background: "rgba(255,106,156,0.22)" }} />

        <div className="relative z-10">
          <AuthBrandHeader />

          <div
            className="mt-6 rounded-3xl p-6 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
          >
            <div className="flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "#E8C547", color: "#5e0a24" }}>
                Welcome Back
              </span>
            </div>

            <h2 className="mt-4 text-center text-2xl font-black text-white">Sign in to your account</h2>
            <p className="mt-1 text-center text-sm text-white/70">Find your perfect match today</p>

            {/* Email */}
            <label className="block text-sm font-bold text-white/90 mt-7 mb-1.5">Email address</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={FIELD}
              />
            </div>

            {/* Password */}
            <label className="block text-sm font-bold text-white/90 mt-4 mb-1.5">Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                className={FIELD}
              />
            </div>

            <div className="text-right mt-2">
              <button className="text-sm font-semibold text-[#E8C547] hover:underline">Forgot password?</button>
            </div>

            {error && (
              <p className="mt-3 text-center text-sm text-amber-200 bg-red-500/20 border border-red-400/30 rounded-lg py-2">
                {error}
              </p>
            )}

            {/* Login */}
            <button
              onClick={handleLogin}
              disabled={isPending}
              className="w-full mt-5 py-3.5 rounded-full font-extrabold text-[#5e0a24] active:scale-[0.98] transition-transform disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)", boxShadow: "0 8px 22px rgba(232,197,71,0.4)" }}
            >
              {isPending ? "Signing in…" : "Login"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center my-7">
              <div className="flex-1 h-px bg-white/20" />
              <span className="px-3 text-xs text-white/60">or continue with</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/25 bg-white/10 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4285F4" }} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/25 bg-white/10 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1877F2" }} /> Facebook
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white/75">
            New here?{" "}
            <button onClick={() => router.push("/register")} className="font-bold text-[#E8C547]">
              Register free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
