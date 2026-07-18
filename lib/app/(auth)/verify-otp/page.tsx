"use client"

import { useState, useRef } from "react";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    pasted.forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setResent(true);
    inputs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  };

  const isFilled = otp.every(d => d !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6e8]">
      <div className="w-157 flex rounded-2xl overflow-hidden shadow-2xl">

        {verified ? (
          <>
            {/* Left panel — success */}
            <div className="w-55 shrink-0 flex items-center justify-center py-12"
              style={{ background: "#c0174c" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-8 h-8">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Right panel — success message */}
            <div className="flex-1 bg-white px-8 py-10">
              <h2 className="text-xl font-black text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Your email address has been successfully verified. You're all set.
              </p>
              <button
                onClick={() => { setVerified(false); setOtp(["", "", "", "", "", ""]); }}
                className="text-xs font-semibold border rounded-xl px-5 py-2 transition hover:bg-pink-50"
                style={{ color: "#c0174c", borderColor: "#c0174c" }}
              >
                Verify another
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Left brand panel */}
            <div className="w-55 shrink-0 flex flex-col items-center justify-center px-6 py-8"
              style={{ background: "#c0174c" }}>

              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(255,255,255,0.15)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="M2 8l10 6 10-6" />
                </svg>
              </div>

              <p className="text-white text-sm font-bold text-center mb-2">Check your inbox</p>
              <p className="text-white/60 text-xs text-center leading-relaxed mb-6">
                We sent a 6-digit code to your email address
              </p>

              <div className="w-full border-t border-white/20 pt-5 flex flex-col gap-3">
                {[
                  { label: "Secure verification", icon: "shield" },
                  { label: "Expires in 10 minutes", icon: "clock" },
                  { label: "Missed call option", icon: "phone" },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.15)" }}>
                      {icon === "shield" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                          strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      )}
                      {icon === "clock" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                          strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                      )}
                      {icon === "phone" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                          strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.76a16 16 0 0 0 6.29 6.29l1.14-1.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/75 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 bg-white px-7 py-7 flex flex-col justify-center">

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-base font-black text-gray-900 mb-0.5">Verify Your Email</h2>
                  <p className="text-xs text-gray-400">Enter the 6-digit code sent to your email</p>
                </div>
              </div>

              {/* OTP inputs */}
              <div className="flex gap-2 mb-3" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-10 h-11 text-center text-lg font-black rounded-xl border-2 outline-none transition-all"
                    style={{
                      borderColor: digit !== "" ? "#c0174c" : "#e5e7eb",
                      color: digit !== "" ? "#c0174c" : "#374151",
                      background: digit !== "" ? "#fff0f4" : "white",
                      boxShadow: digit !== "" ? "0 0 0 3px rgba(192,23,76,0.1)" : "none",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#c0174c")}
                    onBlur={e => (e.target.style.borderColor = otp[i] ? "#c0174c" : "#e5e7eb")}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-500">
                  Wrong email?{" "}
                  <a href="#" className="font-bold" style={{ color: "#c0174c" }}>Change here</a>
                </p>
                <div>
                  {resent ? (
                    <span className="text-xs font-semibold" style={{ color: "#c0174c" }}>Resent!</span>
                  ) : (
                    <button onClick={handleResend}
                      className="text-xs text-gray-500 underline hover:opacity-70 transition">
                      Resend code
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => isFilled && setVerified(true)}
                disabled={!isFilled}
                className="w-full py-3 rounded-xl text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 active:scale-95 mb-4"
                style={{
                  background: "#c0174c",
                  opacity: isFilled ? 1 : 0.45,
                  cursor: isFilled ? "pointer" : "default",
                }}
              >
                Verify Email
              </button>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 whitespace-nowrap">or verify with missed call</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-pink-50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#ffe0ea" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.76a16 16 0 0 0 6.29 6.29l1.14-1.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    <path d="M14 2a6 6 0 0 1 6 6" />
                    <path d="M14 6a2 2 0 0 1 2 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 mb-0.5">Give a missed call to auto-verify</p>
                  <p className="text-xs text-gray-500">Call from your registered number</p>
                </div>
                <a href="tel:+917449077077"
                  className="text-sm font-black whitespace-nowrap"
                  style={{ color: "#c0174c" }}>
                  +91 74490 77077
                </a>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}