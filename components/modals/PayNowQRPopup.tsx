"use client";
import { useEffect } from "react";

export default function PayNowQRPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-full overflow-hidden" style={{ maxWidth: 860 }}>

        {/* Close button */}
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition text-xl font-bold">
          ×
        </button>

        <div className="flex flex-col lg:flex-row">

          {/* LEFT — hidden on mobile */}
          <div className="hidden lg:flex flex-1 flex-col justify-center px-8 py-10 lg:px-12 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #fde8ef 0%, #fff0f5 100%)" }}>

            <div className="flex justify-center mb-6">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="88" fill="white" stroke="#f0d9e0" strokeWidth="2"/>
                <rect x="30" y="30" width="40" height="40" rx="4" fill="#c0174c" opacity="0.15"/>
                <rect x="35" y="35" width="14" height="14" rx="2" fill="#c0174c" opacity="0.8"/>
                <rect x="51" y="35" width="6" height="6" fill="#c0174c" opacity="0.5"/>
                <rect x="35" y="51" width="6" height="6" fill="#c0174c" opacity="0.5"/>
                <rect x="43" y="51" width="10" height="6" fill="#c0174c" opacity="0.4"/>
                <rect x="110" y="30" width="40" height="40" rx="4" fill="#c0174c" opacity="0.15"/>
                <rect x="115" y="35" width="14" height="14" rx="2" fill="#c0174c" opacity="0.8"/>
                <rect x="131" y="35" width="6" height="6" fill="#c0174c" opacity="0.5"/>
                <rect x="115" y="51" width="6" height="6" fill="#c0174c" opacity="0.5"/>
                <rect x="123" y="43" width="10" height="10" fill="#c0174c" opacity="0.4"/>
                <rect x="30" y="110" width="40" height="40" rx="4" fill="#c0174c" opacity="0.15"/>
                <rect x="35" y="115" width="14" height="14" rx="2" fill="#c0174c" opacity="0.8"/>
                <rect x="51" y="115" width="6" height="6" fill="#c0174c" opacity="0.5"/>
                <rect x="43" y="123" width="10" height="6" fill="#c0174c" opacity="0.4"/>
                <rect x="35" y="131" width="6" height="6" fill="#c0174c" opacity="0.5"/>
                <rect x="76" y="76" width="28" height="28" rx="3" fill="#c0174c" opacity="0.1"/>
                <rect x="80" y="80" width="8" height="8" rx="1" fill="#c0174c" opacity="0.7"/>
                <rect x="92" y="80" width="8" height="8" rx="1" fill="#c0174c" opacity="0.5"/>
                <rect x="80" y="92" width="8" height="8" rx="1" fill="#c0174c" opacity="0.5"/>
                <rect x="92" y="92" width="8" height="8" rx="1" fill="#c0174c" opacity="0.7"/>
                <rect x="76" y="60" width="28" height="4" rx="2" fill="#c0174c" opacity="0.2"/>
                <rect x="76" y="116" width="28" height="4" rx="2" fill="#c0174c" opacity="0.2"/>
                <rect x="60" y="76" width="4" height="28" rx="2" fill="#c0174c" opacity="0.2"/>
                <rect x="116" y="76" width="4" height="28" rx="2" fill="#c0174c" opacity="0.2"/>
                <text x="90" y="95" textAnchor="middle" fontSize="14" fill="#c0174c">💍</text>
              </svg>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-[#c0174c]/60 mb-1">Made2Match</p>
            <h2 className="text-2xl font-black text-gray-800 leading-tight mb-3">
              Pay &amp; Unlock<br /><span className="text-[#c0174c]">Premium Access</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Scan the QR code using any UPI app to complete your payment and instantly unlock premium features.
            </p>

            <ol className="space-y-2">
              {[
                "Open GPay, PhonePe or Paytm",
                "Scan the QR code on the right",
                "Pay ₹1,500 and confirm",
                "Share screenshot to activate",
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{ background: "linear-gradient(135deg, #981a3d, #c0174c)" }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            {/* Lady image — absolute bottom */}
            <img
              src="/001 transparent.png"
              alt="Made2Match Lady"
              className="absolute bottom-0 right-0 pointer-events-none select-none"
              style={{ height: 380, objectFit: "contain", objectPosition: "bottom", opacity: 0.7 }}
            />
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-80 flex flex-col items-center justify-center px-6 py-8 lg:px-8 lg:py-10 bg-white gap-5">

            <div className="px-5 py-2 rounded-full text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg, #981a3d 0%, #c0174c 60%, #d4185a 100%)" }}>
              ₹1,500 — Special Offer
            </div>

            {/* QR with corner markers */}
            <div className="relative" style={{ padding: 12 }}>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#f0a0b8]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#f0a0b8]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#f0a0b8]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#f0a0b8]" />
              <div className="bg-white overflow-hidden relative lg:w-[200px] lg:h-[200px] w-[300px] h-[300px]" style={{ border: "15px solid #fde8ef" }}>
                <img
                  src="/QR_code.jpeg"
                  alt="UPI QR Code"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="scan-line" />
                </div>
              </div>
            </div>

            <div className="w-full bg-[#fde8ef] rounded-xl px-4 py-3 text-center border border-[#f0d9e0]">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">UPI ID</p>
              <p className="text-[#c0174c] font-bold text-sm">made2match@upi</p>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Need help?{" "}
              <a href="tel:+917909227177" className="text-[#c0174c] font-semibold">+91 7909227177</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
