"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AuthBrandHeader from "@/components/sections/AuthBrandHeader";
import { useLogin } from "@/hooks/useLogin";

const FIELD =
  "w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-white/55 outline-none transition-all bg-white/10 border border-white/25 focus:border-[#E8C547] focus:bg-white/15";

type LoginResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

type LoginError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function LoginPage() {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        onSuccess: (res: LoginResponse) => {
          const tokens = res.data;
          if (tokens?.accessToken) {
            localStorage.setItem("token", tokens.accessToken);
            if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
          }
          router.push("/home");
        },
        onError: (e: Error) => {
          const loginError = e as Error & LoginError;
          setError(loginError.response?.data?.message || "Invalid email or password.");
        },
      },
    );
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
              <label className="block text-sm font-bold text-white/90 mt-7 mb-1.5">Email address</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={FIELD} />
              </div>
              <label className="block text-sm font-bold text-white/90 mt-4 mb-1.5">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter your password" className={FIELD} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-white/65 hover:text-[#E8C547] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link href="/forgot-password" className="text-sm font-semibold text-[#E8C547] hover:underline">Forgot password?</Link>
              </div>
              {error && <p className="mt-3 text-center text-sm text-amber-200 bg-red-500/20 border border-red-400/30 rounded-lg py-2">{error}</p>}
              <button onClick={handleLogin} disabled={isPending} className="cursor-pointer w-full mt-5 py-3.5 rounded-full font-extrabold text-[#5e0a24] active:scale-[0.98] transition-transform disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg,#ffe08a,#E8C547 55%,#d4a017)", boxShadow: "0 8px 22px rgba(232,197,71,0.4)" }}>
                {isPending ? "Signing in…" : "Login"}
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-white/75">
              New here?{" "}<button onClick={() => router.push("/register")} className="cursor-pointer font-bold text-[#E8C547]">Register free</button>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop — split layout like screenshot */}
      <div
        className="hidden lg:flex h-full min-h-screen"
        style={{ background: "#fde8ef" }}
      >
        {/* LEFT — decorative panel */}
        <div
          className="flex-1 relative overflow-hidden flex flex-col items-center justify-center px-12"
          style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: "#ff6a9c", transform: "translate(-30%,-30%)" }} />
          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: "#E8C547", transform: "translate(30%,30%)" }} />

          {/* Lady image */}
          <div className="relative w-80 h-96 mb-8">
            <img src="/001 transparent.png" alt="Made2Match" className="w-full h-full object-contain object-bottom" />
          </div>

          {/* Text */}
          <div className="text-center relative z-10">
            <h2 className="text-3xl font-black text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Find Your Perfect<br /><span className="italic">Life Partner</span>
            </h2>
            <p className="mt-3 text-white/80 text-sm max-w-xs mx-auto leading-relaxed">
              Join thousands of happy couples who found their match on Made2Match Matrimony.
            </p>
            {/* Stats pills */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-sm">10,000+ Marriages</span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 backdrop-blur-sm">100% Verified</span>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div
          className="w-[45%] shrink-0 flex flex-col items-center justify-center px-12 py-10"
          style={{ background: "#fde8ef" }}
        >
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <img src="/golden-hearts.png" alt="Made2Match" className="object-contain" style={{ width: 120, height: 120 }} />
              <div>
                <p className="text-[#c0174c] font-extrabold text-3xl" style={{ fontFamily: "Georgia, serif" }}>Made2Match</p>
                <p className="text-[11px] font-bold tracking-widest text-[#c0174c]/60 uppercase">Matrimony</p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mb-1">Welcome back 👋</h2>
            <p className="text-sm text-gray-500 mb-7">Sign in to continue your journey</p>

            {/* Form card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(192,23,76,0.12)] border border-[#f0d9e0]">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative mb-2">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-colors bg-[#f9fafb] border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#c0174c] focus:bg-white" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c0174c] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right mb-4">
                <Link href="/forgot-password" className="text-xs font-semibold text-[#c0174c] hover:underline">Forgot password?</Link>
              </div>

              {error && <p className="mb-3 text-center text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg py-2">{error}</p>}

              <button onClick={handleLogin} disabled={isPending}
                className="w-full py-3.5 rounded-xl font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)", boxShadow: "0 8px 22px rgba(192,23,76,0.35)" }}>
                {isPending ? "Signing in…" : "Login →"}
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
              New here?{" "}
              <button onClick={() => router.push("/register")} className="font-bold text-[#c0174c] hover:underline cursor-pointer">Register free</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
