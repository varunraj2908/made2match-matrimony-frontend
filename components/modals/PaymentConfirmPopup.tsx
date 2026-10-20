"use client";

import { createPortal } from "react-dom";

interface PaymentConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  basePrice: number;   // in INR
  loading?: boolean;
}

export default function PaymentConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  planName,
  basePrice,
  loading = false,
}: PaymentConfirmPopupProps) {
  if (!isOpen || typeof document === "undefined") return null;

  const gst = Math.round(basePrice * 0.18 * 100) / 100;
  const total = Math.round((basePrice + gst) * 100) / 100;

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-payment-title"
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#c0174c,#e8305e)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="text-white font-black text-sm tracking-wide">Made2Match</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <h2 id="confirm-payment-title" className="text-base font-black text-gray-900 mb-1">
            Order Summary
          </h2>
          <p className="text-xs text-gray-500 mb-4">{planName}</p>

          {/* Price breakdown */}
          <div className="rounded-xl overflow-hidden border border-gray-100 mb-5">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <span className="text-sm text-gray-600">Offer Price</span>
              <span className="text-sm font-bold text-gray-900">{fmt(basePrice)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-sm text-gray-600">GST (18%)</span>
              <span className="text-sm font-bold text-gray-900">+{fmt(gst)}</span>
            </div>
            <div
              className="flex items-center justify-between px-4 py-3.5 border-t"
              style={{ background: "#c0174c", borderColor: "#a01040" }}
            >
              <span className="text-sm font-black text-white uppercase tracking-wide">Total Payable</span>
              <span className="text-xl font-black text-white">{fmt(total)}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-xs text-amber-700 font-medium">
              Your payment is protected with secure checkout via Razorpay.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black text-sm text-white tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#c0174c,#e8305e)", boxShadow: "0 8px 20px rgba(192,23,76,0.35)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                🔒 Pay {fmt(total)}
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full mt-2 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
