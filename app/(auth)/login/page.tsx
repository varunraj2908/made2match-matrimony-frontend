
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="h-full min-h-full flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{ background: "#f5e0e5" }}
    >
      <div
        className="w-full max-w-125 bg-white rounded-3xl px-8 py-8 relative"
        style={{ boxShadow: "0 20px 60px rgba(192,23,76,0.15)" }}
      >
        <div className="flex flex-col items-center mb-7">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md"
            style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1 text-center">
            Sign in to find your perfect match
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#c0174c" }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 outline-none transition-all"
            style={{ border: "1.5px solid #f0d2d7", background: "#fdf8f9" }}
            onFocus={e => { e.target.style.border = "1.5px solid #c0174c"; e.target.style.background = "#fff"; }}
            onBlur={e =>  { e.target.style.border = "1.5px solid #f0d2d7"; e.target.style.background = "#fdf8f9"; }}
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold" style={{ color: "#c0174c" }}>
              Password
            </label>
            <button className="text-sm font-medium hover:underline transition" style={{ color: "#c0174c" }}>
              I forgot
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-gray-800 outline-none transition-all"
              style={{ border: "1.5px solid #f0d2d7", background: "#fdf8f9" }}
              onFocus={e => { e.target.style.border = "1.5px solid #c0174c"; e.target.style.background = "#fff"; }}
              onBlur={e =>  { e.target.style.border = "1.5px solid #f0d2d7"; e.target.style.background = "#fdf8f9"; }}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPass ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Login Button only */}
        <button
          onClick={() => router.push("/home")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-black tracking-widest uppercase transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 mb-5"
          style={{
            background: "linear-gradient(135deg, #c0174c, #8b0f38)",
            boxShadow: "0 6px 20px rgba(192,23,76,0.35)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Sign In
        </button>

        {/* Bottom links */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            No account?{" "}
            <a
              href="/"
              className="font-bold underline underline-offset-2 transition hover:opacity-75"
              style={{ color: "#c0174c" }}
            >
              Register free
            </a>
          </p>
          <a
            href="#"
            className="text-gray-400 text-xs hover:text-gray-600 transition underline underline-offset-2"
          >
            Stay signed in
          </a>
        </div>
      </div>
    </div>
  );
}