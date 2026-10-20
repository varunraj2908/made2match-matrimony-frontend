"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type LandingOfferPopupProps = {
  onClaim: () => void;
  forceOpen?: boolean;
  onForceClose?: () => void;
};

const benefits = ["Unlimited contacts", "Horoscope access", "Unlimited chat"];

export default function LandingOfferPopup({ onClaim, forceOpen, onForceClose }: LandingOfferPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      // Don't open if user just registered or is logged in
      const token = localStorage.getItem("token");
      if (token) return;
      setOpen(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  // Allow external trigger (side banner click)
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    onForceClose?.();
  };

  const claimOffer = () => {
    setOpen(false);
    onClaim();
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#3b0719]/55 p-3 sm:p-5"
      style={{ zIndex: 2147483647 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-offer-title"
        className="relative w-full max-w-[900px] overflow-hidden rounded-[32px] border border-gray-100 bg-white text-gray-900 shadow-[0_35px_100px_rgba(0,0,0,0.25)]"
        style={{
          width: "min(900px, calc(100vw - 24px))",
          height: "70vh",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_5%,rgba(192,23,76,.06),transparent_32%)]" />
        <div className="absolute -bottom-24 -left-16 h-44 w-[125%] -rotate-3 rounded-[50%] bg-gradient-to-r from-[#fdeef2] via-[#fce4ec] to-[#fdeef2]" />
        <div className="absolute -bottom-16 -left-12 h-28 w-[120%] rotate-2 rounded-[50%] bg-[#fce4ec]/75" />

        <div className="absolute inset-0 overflow-hidden bg-white">
          <Image
            src="/images/offers/made2match-bride-offer.png"
            alt="AI-generated bride for Made2Match matrimonial special offer"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 900px"
            className="object-cover brightness-110 contrast-105"
            style={{ objectPosition: "65% 25%", opacity: 1 }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 8%, rgba(255,203,64,.10), transparent 27%), radial-gradient(circle at 48% 95%, rgba(192,23,76,.08), transparent 34%), linear-gradient(90deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.88) 38%, rgba(255,255,255,.15) 58%, rgba(255,255,255,0) 72%)",
          }}
        />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl leading-none text-gray-500 shadow-md transition hover:rotate-90 hover:bg-[#fdeef2] hover:text-[#c0174c]"
        >
          &times;
        </button>

        <div
          className="offer-content relative z-10 px-8 pb-10 pt-8 sm:px-14 sm:pb-14 sm:pt-12 flex flex-col"
          style={{ height: "100%" }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div>
              <p
                className="font-black tracking-tight text-[#c0174c]"
                style={{ fontSize: "28px", lineHeight: 1 }}
              >
                Made2Match
              </p>
              <p
                className="mt-1 font-bold uppercase tracking-[0.28em] text-gray-400"
                style={{ fontSize: "10px" }}
              >
                Find your forever
              </p>
            </div>
          </div>

          <span className="self-start inline-flex items-center gap-2 rounded-full border border-[#c0174c]/20 bg-[#fdeef2] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#c0174c] shadow-sm whitespace-nowrap">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#c0174c]" />
            Exclusive registration offer
          </span>

          <h2
            id="registration-offer-title"
            className="mt-3 text-[32px] font-black uppercase leading-none tracking-tight text-gray-900 sm:text-[42px]"
          >
            <span className="block">Start your</span>
            <span className="block text-[#c0174c]">perfect story</span>
          </h2>

          <div className="mt-6 flex items-center gap-5">
            <div className="rounded-2xl border border-[#ffd451]/60 bg-gradient-to-br from-[#ffe77b] via-[#ffd451] to-[#ffac32] px-6 py-4 text-[#790d30] shadow-[0_14px_35px_rgba(255,179,35,.35)]">
              <p className="text-xs font-black uppercase leading-none">One month at</p>
              <p
                className="mt-1 font-black leading-none tracking-tight"
                style={{ fontSize: "64px" }}
              >
                &#8377;999
              </p>
            </div>
            <div>
              <p className="text-base font-bold text-gray-400 line-through">&#8377;3,996</p>
              <p className="mt-1 text-sm font-black uppercase text-[#c0174c]">
                Limited offer
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-black text-white" style={{ background: "linear-gradient(135deg,#c0174c,#e8305e)" }}>
                75% OFF
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-0.5 text-sm font-bold text-gray-700">
            {benefits.map((benefit) => (
              <span
                key={benefit}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 w-fit shadow-sm"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#c0174c] text-[10px] text-white">
                  &#10003;
                </span>
                {benefit}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={claimOffer}
            className="mt-4 w-fit rounded-full border border-[#c0174c]/30 px-8 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_35px_rgba(192,23,76,.35)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(192,23,76,.45)]"
            style={{ background: "linear-gradient(135deg,#c0174c,#e8305e)" }}
          >
            Register now &rarr;
          </button>
        </div>

        <style>{`
          .offer-content {
            width: 100%;
          }

          @media (min-width: 640px) {
            .offer-content {
              width: 58%;
            }
          }
        `}</style>
      </section>
    </div>,
    document.body,
  );
}