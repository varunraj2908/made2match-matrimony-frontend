"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/home");
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
     
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-10 text-center relative overflow-hidden">

        {/* Confetti dots decoration */}
        {[
          { top: "8%",  left: "8%",  size: 10, color: "#c0174c" },
          { top: "5%",  left: "78%", size: 7,  color: "#f9a8d4" },
          { top: "14%", left: "90%", size: 12, color: "#fde68a" },
          { top: "82%", left: "5%",  size: 8,  color: "#fde68a" },
          { top: "88%", left: "85%", size: 10, color: "#c0174c" },
          { top: "75%", left: "92%", size: 6,  color: "#f9a8d4" },
          { top: "90%", left: "20%", size: 7,  color: "#c0174c" },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              top: dot.top, left: dot.left,
              width: dot.size, height: dot.size,
              background: dot.color,
            }}
          />
        ))}

        {/* Animated checkmark circle */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
            style={{
              background: "linear-gradient(135deg, #c0174c, #8b0f38)",
              boxShadow: "0 8px 30px rgba(192,23,76,0.4)",
              animation: "pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          🎉 Account Created!
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-2 px-2">
          Your account has been successfully created and your email has been verified.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Welcome to <span className="font-black" style={{ color: "#c0174c" }}>MatriMatch</span>!
        </p>

        {/* Details card */}
        <div
          className="rounded-xl px-5 py-4 mb-6 text-left"
          style={{ background: "#fff0f4", border: "1px solid #f9c8d6" }}
        >
          {[
            { icon: "✅", label: "Email Verified" },
            { icon: "👤", label: "Profile Created" },
            { icon: "🔐", label: "Account Secured" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 ${i < 2 ? "mb-2" : ""}`}>
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Go to Dashboard button */}
        <button
          onClick={() => router.push("/home")}
          className="w-full py-3.5 rounded-xl text-white font-black text-sm tracking-widest uppercase transition-all hover:opacity-90 hover:scale-105 active:scale-95 mb-4"
          style={{
            background: "linear-gradient(135deg, #c0174c, #8b0f38)",
            boxShadow: "0 6px 20px rgba(192,23,76,0.35)",
          }}
        >
          Go to Dashboard
        </button>

        {/* Auto redirect countdown */}
        <p className="text-xs text-gray-400">
          Redirecting automatically in{" "}
          <span className="font-bold" style={{ color: "#c0174c" }}>{count}s</span>
        </p>

      </div>

      <style>{`
        @keyframes pop {
          0%   { transform: scale(0); opacity: 0; }
          80%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}